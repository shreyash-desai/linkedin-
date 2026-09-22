import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../services/supabaseClient';
import { Settings, Edit3, MessageCircle, Hash, AlignLeft, BarChart2, LogOut } from 'lucide-react';

export default function Profile() {
  const { user, profile, signOut } = useAuthStore();
  const [writingProfile, setWritingProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      supabase.from('writing_profiles').select('*').eq('user_id', user.id).single()
        .then(({ data }) => {
          if (data) setWritingProfile(data);
        });
    }
  }, [user]);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto pb-24 h-full">
      <header className="mb-10 flex justify-between items-start">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-soft bg-text-main flex items-center justify-center text-white text-3xl font-bold">
            {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-text-main mb-1">{profile?.full_name || 'Creator'}</h1>
            <p className="text-lg text-text-secondary font-medium">{profile?.role || 'User'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-soft text-text-main hover:bg-cream transition-all">
            <Settings className="w-5 h-5" />
          </button>
          <button onClick={signOut} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-soft text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <section className="mb-10">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-text-main">Writing Identity</h2>
          <button className="text-text-main font-semibold flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:bg-cream transition-colors text-sm">
            <Edit3 className="w-4 h-4" /> Edit profile
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-pastel-blue/40 rounded-[28px] p-6 flex flex-col gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-text-main mb-2">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-text-secondary">Tone</span>
            <p className="text-xl font-semibold text-text-main">{writingProfile?.tone || 'Not set'}</p>
          </div>
          
          <div className="bg-soft-green/60 rounded-[28px] p-6 flex flex-col gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-text-main mb-2">
              <Hash className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-text-secondary">Topics</span>
            <div className="flex flex-wrap gap-2">
              {writingProfile?.topics?.map((t: string) => (
                <span key={t} className="bg-white px-3 py-1 rounded-full text-sm font-medium">{t}</span>
              )) || <span className="text-sm text-text-muted">Not set</span>}
            </div>
          </div>
          
          <div className="bg-pastel-peach/40 rounded-[28px] p-6 flex flex-col gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-text-main mb-2">
              <AlignLeft className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-text-secondary">Audience</span>
            <p className="text-lg font-medium text-text-main leading-snug">{writingProfile?.audience || 'General'}</p>
          </div>
          
          <div className="bg-soft-yellow/40 rounded-[28px] p-6 flex flex-col gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-text-main mb-2">
              <BarChart2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-text-secondary">Avg. Length</span>
            <p className="text-xl font-semibold text-text-main">Medium</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-text-main mb-6">AI Usage</h2>
        <div className="bg-white rounded-[32px] p-8 shadow-soft border border-border-subtle flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex-1 w-full">
            <div className="flex justify-between mb-2">
              <span className="font-bold">Generations this month</span>
              <span className="font-bold text-text-secondary">24 / 100</span>
            </div>
            <div className="w-full bg-cream rounded-full h-4">
              <div className="bg-text-main w-[24%] h-full rounded-full"></div>
            </div>
          </div>
          <button className="bg-text-main text-white px-6 py-3 rounded-full font-semibold whitespace-nowrap hover:bg-black transition-all">
            Upgrade Plan
          </button>
        </div>
      </section>
    </div>
  );
}
