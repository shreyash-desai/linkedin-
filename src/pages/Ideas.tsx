import { useEffect } from 'react';
import { Plus, Tag, Clock, Loader2 } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';

export default function Ideas() {
  const { ideas, fetchData, isLoading } = useDataStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto pb-24 h-full flex flex-col">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-[32px] md:text-[44px] font-bold tracking-tight text-text-main mb-2">Ideas</h1>
          <p className="text-lg text-text-secondary">Your bank of thoughts and future posts.</p>
        </div>
        <button className="bg-text-main text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-black transition-all shadow-soft hidden md:flex">
          <Plus className="w-5 h-5" /> Add idea
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-text-muted" /></div>
        ) : ideas.map((idea, i) => (
          <div key={idea.id || i} className="bg-white rounded-[32px] p-8 shadow-soft border border-border-subtle group hover:border-text-main/10 transition-all cursor-pointer flex flex-col h-64">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${idea.color} text-text-main`}>
                {idea.status}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-text-main leading-tight mb-auto group-hover:text-black transition-colors line-clamp-3">
              {idea.title}
            </h3>
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border-subtle">
              <div className="flex items-center gap-1.5 text-text-muted text-sm font-medium">
                <Tag className="w-4 h-4" /> {idea.tag}
              </div>
              <div className="flex items-center gap-1.5 text-text-muted text-sm font-medium">
                <Clock className="w-4 h-4" /> {idea.createdAt}
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty State Add Card */}
        <div className="bg-cream-light border-2 border-dashed border-border-subtle rounded-[32px] p-8 flex flex-col items-center justify-center text-center h-64 cursor-pointer hover:bg-white transition-all">
          <div className="w-14 h-14 bg-cream rounded-full flex items-center justify-center mb-4 text-text-muted">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-text-main text-lg mb-1">New Idea</h3>
          <p className="text-sm text-text-secondary">Capture a thought before it's gone</p>
        </div>
      </div>
      
      {/* Mobile Floating Action Button */}
      <button className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-text-main text-white rounded-full flex items-center justify-center shadow-large z-40 hover:bg-black active:scale-95 transition-all">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
