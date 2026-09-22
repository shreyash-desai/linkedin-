import { create } from 'zustand';
import type { AIGeneratedPost } from '../services/ai/geminiClient';

export interface Draft extends AIGeneratedPost {
  id: string;
  title: string;
  date: string;
  tag: string;
  color: string;
}

export interface Idea {
  id: string;
  title: string;
  status: string;
  tag: string;
  color: string;
  createdAt: string;
}

interface DataState {
  drafts: Draft[];
  ideas: Idea[];
  addDraft: (draft: Omit<Draft, 'id' | 'date' | 'color'>) => void;
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'color'>) => void;
}

const COLORS = ['bg-pastel-blue', 'bg-pastel-green', 'bg-pastel-peach', 'bg-soft-yellow', 'bg-soft-lavender', 'bg-soft-green'];

export const useDataStore = create<DataState>((set) => ({
  drafts: [
    { 
      id: '1', 
      title: 'Why simplicity wins in product design', 
      post: 'Building products has taught me that the hardest part isn\'t writing code...', 
      hook: 'Most businesses don\'t have an AI problem.', 
      hashtags: [], 
      alternative_hooks: [], 
      date: 'Today', 
      tag: 'Product', 
      color: 'bg-soft-green' 
    },
    { 
      id: '2', 
      title: 'The hidden cost of complex features', 
      post: 'I used to think more features meant a better product...', 
      hook: 'More features do not equal more value.', 
      hashtags: [], 
      alternative_hooks: [], 
      date: 'Yesterday', 
      tag: 'Engineering', 
      color: 'bg-soft-lavender' 
    },
  ],
  ideas: [
    { id: '1', title: 'How I automated a boring business process', status: 'Developing', tag: 'Automation', color: 'bg-pastel-blue', createdAt: '2d ago' },
    { id: '2', title: 'My biggest mistake as a founder', status: 'Inbox', tag: 'Leadership', color: 'bg-pastel-peach', createdAt: '5d ago' }
  ],
  addDraft: (draft) => set((state) => ({
    drafts: [
      {
        ...draft,
        id: Math.random().toString(36).substring(7),
        date: 'Just now',
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      },
      ...state.drafts
    ]
  })),
  addIdea: (idea) => set((state) => ({
    ideas: [
      {
        ...idea,
        id: Math.random().toString(36).substring(7),
        createdAt: 'Just now',
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      },
      ...state.ideas
    ]
  }))
}));
