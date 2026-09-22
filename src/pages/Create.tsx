import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiService, type AIGeneratedPost } from '../services/ai/geminiClient';
import { useDataStore } from '../store/useDataStore';
import { Sparkles, Loader2, RefreshCw, Copy, Save } from 'lucide-react';

export default function Create() {
  const navigate = useNavigate();
  const { addDraft } = useDataStore();
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState('Conversational');
  const [postType, setPostType] = useState('Personal lesson');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<AIGeneratedPost | null>(null);
  
  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setIsGenerating(true);
    const post = await aiService.generatePost({
      idea,
      tone,
      length: 'Medium',
      postType
    });
    setResult(post);
    setIsGenerating(false);
  };

  const handleSaveDraft = () => {
    if (!result) return;
    addDraft({
      ...result,
      title: result.hook || 'Untitled Draft',
      tag: postType,
    });
    navigate('/drafts');
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto h-full flex flex-col">
      <header className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-text-main mb-2">Create a post</h1>
        <p className="text-base md:text-lg text-text-secondary">Turn your idea into something worth reading.</p>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 md:gap-8">
        
        {/* Left Column: Input */}
        <div className="flex-1 bg-white rounded-[32px] md:rounded-[36px] shadow-soft p-6 md:p-8 flex flex-col h-full border border-border-subtle">
          <h2 className="text-xl md:text-2xl font-semibold mb-6">What's on your mind?</h2>
          
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="I learned something interesting while building an automation system..."
            className="w-full flex-1 bg-cream-light border border-border-subtle rounded-3xl p-6 text-lg focus:ring-4 focus:ring-pastel-blue/30 transition-all resize-none text-text-main placeholder:text-text-muted outline-none mb-6 shadow-inner hide-scrollbar"
            style={{ minHeight: '200px' }}
          />

          <div className="space-y-4 mb-8">
            <div>
              <label className="text-sm font-semibold text-text-secondary mb-2 block">Post type</label>
              <div className="flex flex-wrap gap-2">
                {['Story', 'Educational', 'Opinion', 'Personal lesson'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setPostType(t)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${postType === t ? 'bg-text-main text-white shadow-soft' : 'bg-cream text-text-secondary hover:bg-border-subtle'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-text-secondary mb-2 block">Tone</label>
              <div className="flex flex-wrap gap-2">
                {['Professional', 'Conversational', 'Bold', 'Thoughtful'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tone === t ? 'bg-text-main text-white shadow-soft' : 'bg-cream text-text-secondary hover:bg-border-subtle'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={!idea.trim() || isGenerating}
            className="w-full bg-text-main text-white px-8 py-5 rounded-full font-semibold text-lg hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all shadow-large flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
            {isGenerating ? 'Writing your post...' : 'Create post'}
          </button>
        </div>

        {/* Right Column: Result */}
        <div className={`flex-1 flex flex-col h-full transition-all duration-500 ${result || isGenerating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none hidden lg:flex'}`}>
          {isGenerating ? (
            <div className="flex-1 bg-pastel-blue/30 rounded-[32px] md:rounded-[36px] shadow-soft p-8 flex flex-col items-center justify-center animate-pulse border border-border-subtle">
              <Sparkles className="w-12 h-12 text-text-main mb-6 animate-bounce" />
              <h3 className="text-2xl font-bold text-text-main mb-2">Thinking about your idea...</h3>
              <p className="text-text-secondary">Finding the strongest angle.</p>
            </div>
          ) : result ? (
            <div className="flex-1 bg-white rounded-[32px] md:rounded-[36px] shadow-soft flex flex-col overflow-hidden border border-border-subtle">
              <div className="p-6 md:p-8 flex-1 overflow-y-auto hide-scrollbar">
                <div className="mb-6 pb-6 border-b border-border-subtle">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 block">Hook</span>
                  <p className="text-xl md:text-2xl font-bold text-text-main leading-tight">{result.hook}</p>
                </div>
                
                <div className="prose prose-lg max-w-none text-text-main whitespace-pre-wrap mb-6">
                  {result.post}
                </div>
                
                {result.cta && (
                  <div className="bg-cream p-5 rounded-2xl mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1 block">CTA</span>
                    <p className="font-medium">{result.cta}</p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {result.hashtags.map(tag => (
                    <span key={tag} className="text-pastel-blue font-medium">{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className="bg-cream-light p-4 md:p-6 flex flex-wrap gap-3 border-t border-border-subtle">
                <button className="flex-1 bg-white border border-border-subtle px-4 py-3 rounded-2xl font-semibold text-text-main hover:bg-cream transition-all shadow-sm flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5" /> Rewrite
                </button>
                <button className="flex-1 bg-white border border-border-subtle px-4 py-3 rounded-2xl font-semibold text-text-main hover:bg-cream transition-all shadow-sm flex items-center justify-center gap-2">
                  <Copy className="w-5 h-5" /> Copy
                </button>
                <button onClick={handleSaveDraft} className="flex-1 bg-text-main text-white px-4 py-3 rounded-2xl font-semibold hover:bg-black transition-all shadow-soft flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" /> Save draft
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-cream-light/50 border-2 border-dashed border-border-subtle rounded-[32px] md:rounded-[36px] p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-xl font-bold text-text-muted mb-2">Your post will appear here</h3>
              <p className="text-text-muted max-w-[250px]">Fill out your idea on the left and click generate to see the magic.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
