import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiService, type AIGeneratedPost } from '../services/ai/geminiClient';
import { useDataStore } from '../store/useDataStore';
import { Sparkles, Loader2, RefreshCw, Copy, Save, UserPlus, FileText } from 'lucide-react';

export default function Create() {
  const navigate = useNavigate();
  const { addDraft } = useDataStore();
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'Post' | 'Connection'>('Post');
  
  // Post State
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState('Conversational');
  const [postType, setPostType] = useState('Personal lesson');
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [postResult, setPostResult] = useState<AIGeneratedPost | null>(null);
  
  // Connection Note State
  const [target, setTarget] = useState('');
  const [reason, setReason] = useState('');
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [noteResult, setNoteResult] = useState<string | null>(null);
  
  const handleGeneratePost = async () => {
    if (!idea.trim()) return;
    setIsGeneratingPost(true);
    try {
      const post = await aiService.generatePost({
        idea,
        tone,
        length: 'Medium',
        postType
      });
      setPostResult(post);
    } catch (e) {
      console.error(e);
    }
    setIsGeneratingPost(false);
  };

  const handleGenerateNote = async () => {
    if (!target.trim() || !reason.trim()) return;
    setIsGeneratingNote(true);
    try {
      const note = await aiService.generateConnectionNote({ target, reason });
      setNoteResult(note);
    } catch (e) {
      console.error(e);
    }
    setIsGeneratingNote(false);
  };

  const handleSaveDraft = async () => {
    if (!postResult) return;
    await addDraft({
      ...postResult,
      title: postResult.hook || 'Untitled Draft',
      tag: postType,
    });
    navigate('/drafts');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast here
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto h-full flex flex-col pb-24 md:pb-8">
      <header className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-text-main mb-2">Create</h1>
          <p className="text-base md:text-lg text-text-secondary">Turn your ideas into high-converting content.</p>
        </div>
        
        <div className="flex bg-cream p-1 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('Post')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'Post' ? 'bg-white shadow-sm text-text-main' : 'text-text-secondary hover:text-text-main'}`}
          >
            <FileText className="w-4 h-4" /> Post
          </button>
          <button 
            onClick={() => setActiveTab('Connection')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'Connection' ? 'bg-white shadow-sm text-text-main' : 'text-text-secondary hover:text-text-main'}`}
          >
            <UserPlus className="w-4 h-4" /> Connection Note
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 md:gap-8">
        
        {/* Left Column: Input */}
        <div className="flex-1 bg-white rounded-[32px] md:rounded-[36px] shadow-soft p-6 md:p-8 flex flex-col h-full border border-border-subtle">
          
          {activeTab === 'Post' ? (
            <>
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
                onClick={handleGeneratePost}
                disabled={!idea.trim() || isGeneratingPost}
                className="w-full bg-text-main text-white px-8 py-5 rounded-full font-semibold text-lg hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all shadow-large flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isGeneratingPost ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                {isGeneratingPost ? 'Writing your post...' : 'Create post'}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl md:text-2xl font-semibold mb-6">Who are you connecting with?</h2>
              
              <div className="flex flex-col gap-6 flex-1">
                <div>
                  <label className="text-sm font-semibold text-text-secondary mb-2 block">Target Person (Role/Name/Company)</label>
                  <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g. John Doe, VP of Engineering at Acme Corp"
                    className="w-full bg-cream-light border border-border-subtle rounded-2xl py-4 px-5 text-text-main placeholder:text-text-muted focus:ring-4 focus:ring-pastel-blue/30 outline-none transition-all shadow-inner"
                  />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <label className="text-sm font-semibold text-text-secondary mb-2 block">Why do you want to connect?</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="I loved their recent post about AI automation and want to ask how they handle scaling issues..."
                    className="w-full flex-1 bg-cream-light border border-border-subtle rounded-3xl p-5 text-text-main focus:ring-4 focus:ring-pastel-blue/30 transition-all resize-none placeholder:text-text-muted outline-none shadow-inner hide-scrollbar min-h-[150px]"
                  />
                </div>
              </div>

              <button 
                onClick={handleGenerateNote}
                disabled={!target.trim() || !reason.trim() || isGeneratingNote}
                className="w-full bg-pastel-peach text-text-main px-8 py-5 rounded-full font-semibold text-lg hover:brightness-95 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-large flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100 mt-8"
              >
                {isGeneratingNote ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                {isGeneratingNote ? 'Drafting note...' : 'Generate note'}
              </button>
            </>
          )}

        </div>

        {/* Right Column: Result */}
        <div className={`flex-1 flex-col h-full transition-all duration-500 ${(activeTab === 'Post' ? postResult || isGeneratingPost : noteResult || isGeneratingNote) ? 'flex' : 'hidden lg:flex'}`}>
          
          {(activeTab === 'Post' && isGeneratingPost) || (activeTab === 'Connection' && isGeneratingNote) ? (
            <div className="flex-1 bg-pastel-blue/30 rounded-[32px] md:rounded-[36px] shadow-soft p-8 flex flex-col items-center justify-center animate-pulse border border-border-subtle">
              <Sparkles className="w-12 h-12 text-text-main mb-6 animate-bounce" />
              <h3 className="text-2xl font-bold text-text-main mb-2">Analyzing context...</h3>
              <p className="text-text-secondary">Finding the perfect words.</p>
            </div>
          ) : activeTab === 'Post' && postResult ? (
            <div className="flex-1 bg-white rounded-[32px] md:rounded-[36px] shadow-soft flex flex-col overflow-hidden border border-border-subtle">
              <div className="p-6 md:p-8 flex-1 overflow-y-auto hide-scrollbar">
                <div className="mb-6 pb-6 border-b border-border-subtle">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 block">Hook</span>
                  <p className="text-xl md:text-2xl font-bold text-text-main leading-tight">{postResult.hook}</p>
                </div>
                
                <div className="prose prose-lg max-w-none text-text-main whitespace-pre-wrap mb-6">
                  {postResult.post}
                </div>
                
                {postResult.cta && (
                  <div className="bg-cream p-5 rounded-2xl mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1 block">CTA</span>
                    <p className="font-medium">{postResult.cta}</p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {postResult.hashtags.map(tag => (
                    <span key={tag} className="text-pastel-blue font-medium">{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className="bg-cream-light p-4 md:p-6 flex flex-wrap gap-3 border-t border-border-subtle">
                <button onClick={handleGeneratePost} className="flex-1 bg-white border border-border-subtle px-4 py-3 rounded-2xl font-semibold text-text-main hover:bg-cream transition-all shadow-sm flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5" /> Rewrite
                </button>
                <button 
                  onClick={() => copyToClipboard(`${postResult.hook}\n\n${postResult.post}${postResult.cta ? '\n\n' + postResult.cta : ''}`)} 
                  className="flex-1 bg-white border border-border-subtle px-4 py-3 rounded-2xl font-semibold text-text-main hover:bg-cream transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" /> Copy
                </button>
                <button onClick={handleSaveDraft} className="flex-1 bg-text-main text-white px-4 py-3 rounded-2xl font-semibold hover:bg-black transition-all shadow-soft flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" /> Save draft
                </button>
              </div>
            </div>
          ) : activeTab === 'Connection' && noteResult ? (
            <div className="flex-1 bg-white rounded-[32px] md:rounded-[36px] shadow-soft flex flex-col overflow-hidden border border-border-subtle">
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-pastel-peach/30 text-text-main rounded-full text-xs font-bold tracking-wide">Under 300 characters</span>
                </div>
                <div className="bg-cream-light border border-border-subtle p-6 rounded-[24px] text-lg text-text-main whitespace-pre-wrap leading-relaxed shadow-inner">
                  {noteResult}
                </div>
                <div className="mt-4 text-sm text-text-muted flex justify-end">
                  {noteResult.length} / 300
                </div>
              </div>
              
              <div className="bg-cream-light p-4 md:p-6 flex flex-wrap gap-3 border-t border-border-subtle mt-auto">
                <button onClick={handleGenerateNote} className="flex-1 bg-white border border-border-subtle px-4 py-3 rounded-2xl font-semibold text-text-main hover:bg-cream transition-all shadow-sm flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5" /> Rewrite
                </button>
                <button 
                  onClick={() => copyToClipboard(noteResult)}
                  className="flex-1 bg-text-main text-white px-4 py-3 rounded-2xl font-semibold hover:bg-black transition-all shadow-soft flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" /> Copy note
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-cream-light/50 border-2 border-dashed border-border-subtle rounded-[32px] md:rounded-[36px] p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-xl font-bold text-text-muted mb-2">Result will appear here</h3>
              <p className="text-text-muted max-w-[250px]">Fill out the details on the left and click generate to see the magic.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
