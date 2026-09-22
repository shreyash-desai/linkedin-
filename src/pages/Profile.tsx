import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useDataStore } from '../store/useDataStore';
import { supabase } from '../services/supabaseClient';
import { aiService } from '../services/ai/geminiClient';
import { Settings, Edit3, MessageCircle, Hash, AlignLeft, BarChart2, LogOut, Loader2, Sparkles, Check, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthStore();
  const { guestProfile, setGuestProfile } = useDataStore();
  const [writingProfile, setWritingProfile] = useState<any>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editable fields
  const [tone, setTone] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [audience, setAudience] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (user) {
      supabase.from('writing_profiles').select('*').eq('user_id', user.id).single()
        .then(({ data }) => {
          if (data) {
            setWritingProfile(data);
            setTone(data.tone || '');
            setTopics(data.topics || []);
            setAudience(data.audience || '');
            setRole(profile?.role || '');
          }
        });
    } else if (guestProfile) {
      // Load from guest local storage
      setWritingProfile({
        tone: guestProfile.tone,
        topics: guestProfile.topics,
        audience: guestProfile.audience,
      });
      setTone(guestProfile.tone || '');
      setTopics(guestProfile.topics || []);
      setAudience(guestProfile.audience || '');
      setRole(guestProfile.role || '');
    }
  }, [user, profile, guestProfile]);

  const handleAnalyze = async () => {
    if (!bioText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeProfile(bioText);
      setTone(result.tone);
      setTopics(result.topics);
      setAudience(result.audience);
      setRole(result.role);
    } catch (e) {
      console.error(e);
    }
    setIsAnalyzing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!user) {
        // Guest mode: save to local store
        setGuestProfile({ role, tone, topics, audience });
        setWritingProfile({ tone, topics, audience });
        setIsEditing(false);
      } else {
        // Auth mode: save to DB
        await supabase.from('writing_profiles').upsert({
          user_id: user.id,
          tone,
          topics,
          audience,
        });
        
        await supabase.from('profiles').update({
          role
        }).eq('id', user.id);
        
        setWritingProfile({ ...writingProfile, tone, topics, audience });
        setIsEditing(false);
      }
    } catch (e) {
      console.error(e);
    }
    setIsSaving(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto pb-24 h-full">
      <header className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-soft bg-text-main flex items-center justify-center text-white text-3xl font-bold shrink-0">
            {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'G'}
          </div>
          <div>
            <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-text-main mb-1 truncate">{profile?.full_name || 'Guest'}</h1>
            <p className="text-lg text-text-secondary font-medium">{role || profile?.role || 'Creator'}</p>
          </div>
        </div>
        <div className="flex gap-2 self-end sm:self-auto">
          {!user && (
            <button onClick={() => navigate('/auth')} className="h-12 px-6 bg-text-main rounded-full flex items-center justify-center shadow-soft text-white font-semibold hover:bg-black transition-all gap-2 text-sm">
              <UserPlus className="w-4 h-4" /> Sign Up to Sync
            </button>
          )}
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-soft text-text-main hover:bg-cream transition-all">
            <Settings className="w-5 h-5" />
          </button>
          {user && (
            <button onClick={signOut} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-soft text-red-500 hover:bg-red-50 transition-all">
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {isEditing ? (
        <section className="mb-10 bg-white rounded-[32px] shadow-soft p-6 md:p-8 border border-border-subtle">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-text-main">AI Profile Setup</h2>
            <button onClick={() => setIsEditing(false)} className="text-text-muted font-semibold hover:text-text-main text-sm transition-colors">
              Cancel
            </button>
          </div>
          
          <div className="bg-pastel-blue/20 p-6 rounded-3xl mb-8 border border-pastel-blue/30">
            <h3 className="font-bold text-text-main flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-pastel-blue" />
              Auto-Extract from your Bio
            </h3>
            <p className="text-sm text-text-secondary mb-4">Paste your LinkedIn About section, Resume, or Website bio below. Our AI will automatically deduce your tone, topics, and audience.</p>
            <div className="flex flex-col gap-3">
              <textarea 
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                placeholder="Paste your bio here..."
                className="w-full bg-white border border-border-subtle rounded-2xl p-4 text-sm text-text-main focus:ring-2 focus:ring-pastel-blue/50 outline-none resize-none min-h-[100px]"
              />
              <button 
                onClick={handleAnalyze}
                disabled={!bioText.trim() || isAnalyzing}
                className="self-end bg-text-main text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isAnalyzing ? 'Analyzing...' : 'Analyze Bio'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-sm font-semibold text-text-secondary mb-2 block">Your Role</label>
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-cream-light border border-border-subtle rounded-xl py-3 px-4 outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-text-secondary mb-2 block">Tone</label>
              <input type="text" value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-cream-light border border-border-subtle rounded-xl py-3 px-4 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-text-secondary mb-2 block">Topics (comma separated)</label>
              <input type="text" value={topics.join(', ')} onChange={(e) => setTopics(e.target.value.split(',').map(t => t.trim()))} className="w-full bg-cream-light border border-border-subtle rounded-xl py-3 px-4 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-text-secondary mb-2 block">Target Audience</label>
              <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full bg-cream-light border border-border-subtle rounded-xl py-3 px-4 outline-none" />
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-pastel-green text-text-main px-8 py-4 rounded-2xl font-bold text-lg hover:brightness-95 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </section>
      ) : (
        <section className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-text-main">Writing Identity</h2>
            <button onClick={() => setIsEditing(true)} className="text-text-main font-semibold flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:bg-cream transition-colors text-sm">
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
                {writingProfile?.topics?.length ? writingProfile.topics.map((t: string) => (
                  <span key={t} className="bg-white px-3 py-1 rounded-full text-sm font-medium">{t}</span>
                )) : <span className="text-sm text-text-muted">Not set</span>}
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
      )}

      <section>
        <h2 className="text-2xl font-bold text-text-main mb-6">AI Usage</h2>
        <div className="bg-white rounded-[32px] p-8 shadow-soft border border-border-subtle flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex-1 w-full">
            <div className="flex justify-between mb-2">
              <span className="font-bold">Generations this month</span>
              <span className="font-bold text-text-secondary">{user ? 'Unlimited' : 'Guest'}</span>
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
