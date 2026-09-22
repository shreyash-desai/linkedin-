import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../services/supabaseClient';
import { useAuthStore } from './useAuthStore';
import type { AIGeneratedPost } from '../services/ai/geminiClient';

export interface Draft extends AIGeneratedPost {
  id: string;
  title: string;
  date: string;
  tag: string;
  color: string;
  status: string;
}

export interface Idea {
  id: string;
  title: string;
  content: string;
  status: string;
  tag: string;
  color: string;
  createdAt: string;
}

interface DataState {
  drafts: Draft[];
  ideas: Idea[];
  isLoading: boolean;
  fetchData: () => Promise<void>;
  addDraft: (draft: Omit<Draft, 'id' | 'date' | 'color' | 'status'>) => Promise<void>;
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'color' | 'status' | 'tag'>) => Promise<void>;
  clearLocalData: () => void;
}

const COLORS = ['bg-pastel-blue', 'bg-pastel-green', 'bg-pastel-peach', 'bg-soft-yellow', 'bg-soft-lavender', 'bg-soft-green'];
const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      drafts: [],
      ideas: [],
      isLoading: false,

      clearLocalData: () => set({ drafts: [], ideas: [] }),

      fetchData: async () => {
        const { user } = useAuthStore.getState();
        
        // If guest, do nothing (data is already loaded via persist)
        if (!user) return;

        set({ isLoading: true });

        try {
          const [postsRes, ideasRes] = await Promise.all([
            supabase.from('posts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
            supabase.from('ideas').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
          ]);

          if (postsRes.error) throw postsRes.error;
          if (ideasRes.error) throw ideasRes.error;

          // Map DB posts to store Drafts
          const drafts: Draft[] = (postsRes.data || []).map(p => ({
            id: p.id,
            title: p.title || p.hook || 'Untitled',
            post: p.content,
            hook: p.hook || '',
            cta: p.cta || '',
            hashtags: p.hashtags || [],
            alternative_hooks: [], 
            date: new Date(p.created_at).toLocaleDateString(),
            tag: p.post_type || 'Post',
            color: getRandomColor(),
            status: p.status
          }));

          // Map DB ideas to store Ideas
          const ideas: Idea[] = (ideasRes.data || []).map(i => ({
            id: i.id,
            title: i.title,
            content: i.content || '',
            status: i.status || 'Inbox',
            tag: i.tags?.[0] || 'Idea',
            color: getRandomColor(),
            createdAt: new Date(i.created_at).toLocaleDateString()
          }));

          set({ drafts, ideas, isLoading: false });
        } catch (error) {
          console.error('Error fetching data from Supabase:', error);
          set({ isLoading: false });
        }
      },

      addDraft: async (draft) => {
        const { user } = useAuthStore.getState();
        
        const newDraft: Draft = {
          ...draft,
          id: Math.random().toString(36).substring(7),
          date: 'Just now',
          color: getRandomColor(),
          status: 'Draft'
        };

        if (!user) {
          // Guest mode: save to local store only
          set((state) => ({ drafts: [newDraft, ...state.drafts] }));
          return;
        }

        // Authenticated: save to Supabase
        try {
          const { data, error } = await supabase.from('posts').insert([{
            user_id: user.id,
            title: draft.title,
            content: draft.post,
            hook: draft.hook,
            cta: draft.cta,
            hashtags: draft.hashtags,
            post_type: draft.tag,
            status: 'Draft'
          }]).select().single();

          if (error) throw error;

          if (data) {
            newDraft.id = data.id;
            set((state) => ({ drafts: [newDraft, ...state.drafts] }));
          }
        } catch (error) {
          console.error('Error saving draft:', error);
        }
      },

      addIdea: async (idea) => {
        const { user } = useAuthStore.getState();
        
        const newIdea: Idea = {
          ...idea,
          id: Math.random().toString(36).substring(7),
          status: 'Inbox',
          tag: 'Idea',
          color: getRandomColor(),
          createdAt: 'Just now'
        };

        if (!user) {
          // Guest mode: save to local store only
          set((state) => ({ ideas: [newIdea, ...state.ideas] }));
          return;
        }

        try {
          const { data, error } = await supabase.from('ideas').insert([{
            user_id: user.id,
            title: idea.title,
            content: idea.content,
            status: 'Inbox'
          }]).select().single();

          if (error) throw error;

          if (data) {
            newIdea.id = data.id;
            set((state) => ({ ideas: [newIdea, ...state.ideas] }));
          }
        } catch (error) {
          console.error('Error saving idea:', error);
        }
      }
    }),
    {
      name: 'postly-storage', // name of item in the storage (must be unique)
      partialize: (state) => {
        // Only persist local data if the user is a guest.
        const { user } = useAuthStore.getState();
        if (user) return { drafts: [], ideas: [] }; // Don't persist remote data locally
        return { drafts: state.drafts, ideas: state.ideas };
      },
    }
  )
);
