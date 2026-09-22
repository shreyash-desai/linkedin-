import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Sparkles, Check } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    role: '',
    topics: [] as string[],
    tone: [] as string[],
  });

  const roles = ['Founder', 'Developer', 'Designer', 'Marketer', 'Creator', 'Consultant'];
  const availableTopics = ['Building', 'Business', 'Technology', 'AI', 'Career', 'Leadership'];
  const availableTones = ['Casual', 'Professional', 'Storytelling', 'Bold', 'Educational'];

  useEffect(() => {
    // If not logged in, redirect to auth
    if (!user) {
      navigate('/auth');
    } else {
      // Check if user already has a configured writing profile
      supabase.from('writing_profiles').select('tone').eq('user_id', user.id).single().then(({ data }) => {
        if (data && data.tone) {
          // Profile is already set up
          navigate('/');
        }
      });
    }
  }, [user, navigate]);

  const toggleSelection = (array: string[], item: string, max: number) => {
    if (array.includes(item)) {
      return array.filter((i) => i !== item);
    }
    if (array.length < max) {
      return [...array, item];
    }
    return array;
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    // Update profile role
    await supabase.from('profiles').update({ role: profile.role }).eq('id', user?.id);
    
    // Update writing profile
    await supabase.from('writing_profiles').update({
      tone: profile.tone.join(', '),
      topics: profile.topics,
      audience: profile.role
    }).eq('user_id', user?.id);
    
    setIsLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-[36px] shadow-large p-8 md:p-12">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-2 rounded-full transition-all ${s === step ? 'w-8 bg-text-main' : s < step ? 'w-2 bg-text-main' : 'w-2 bg-border-subtle'}`} />
            ))}
          </div>
          <Sparkles className="w-6 h-6 text-pastel-blue" />
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold mb-2">What do you do?</h1>
            <p className="text-text-secondary mb-8">This helps us tailor your content to your audience.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setProfile({ ...profile, role: r })}
                  className={`p-4 rounded-2xl border text-left transition-all ${profile.role === r ? 'border-text-main bg-cream-light font-bold shadow-soft' : 'border-border-subtle hover:border-text-muted'}`}
                >
                  {r}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setStep(2)}
              disabled={!profile.role}
              className="w-full bg-text-main text-white py-4 rounded-full font-semibold text-lg hover:bg-black transition-all disabled:opacity-50"
            >
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h1 className="text-3xl font-bold mb-2">What do you post about?</h1>
            <p className="text-text-secondary mb-8">Select up to 3 topics.</p>
            
            <div className="flex flex-wrap gap-3 mb-10">
              {availableTopics.map((t) => {
                const isSelected = profile.topics.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => setProfile({ ...profile, topics: toggleSelection(profile.topics, t, 3) })}
                    className={`px-5 py-3 rounded-full border flex items-center gap-2 transition-all ${isSelected ? 'border-text-main bg-text-main text-white font-bold shadow-soft' : 'border-border-subtle hover:border-text-muted'}`}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                    {t}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setStep(3)}
              disabled={profile.topics.length === 0}
              className="w-full bg-text-main text-white py-4 rounded-full font-semibold text-lg hover:bg-black transition-all disabled:opacity-50"
            >
              Next Step
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h1 className="text-3xl font-bold mb-2">How should it sound?</h1>
            <p className="text-text-secondary mb-8">Select your preferred tones (up to 2).</p>
            
            <div className="flex flex-wrap gap-3 mb-10">
              {availableTones.map((t) => {
                const isSelected = profile.tone.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => setProfile({ ...profile, tone: toggleSelection(profile.tone, t, 2) })}
                    className={`px-5 py-3 rounded-full border flex items-center gap-2 transition-all ${isSelected ? 'border-text-main bg-text-main text-white font-bold shadow-soft' : 'border-border-subtle hover:border-text-muted'}`}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                    {t}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={handleComplete}
              disabled={profile.tone.length === 0 || isLoading}
              className="w-full bg-pastel-blue text-text-main py-4 rounded-full font-semibold text-lg hover:bg-light-blue transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              Complete setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
