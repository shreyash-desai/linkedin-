import { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Loader2 } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';

export default function Drafts() {
  const [filter] = useState('All');
  const { drafts, fetchData, isLoading } = useDataStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredDrafts = drafts.filter(d => filter === 'All' || d.tag === filter);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto pb-24 h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-[32px] md:text-[44px] font-bold tracking-tight text-text-main mb-2">Drafts</h1>
        <p className="text-lg text-text-secondary">Your saved posts, ready to be published.</p>
      </header>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-white rounded-2xl flex items-center px-4 py-3 shadow-sm border border-border-subtle focus-within:ring-2 focus-within:ring-pastel-blue/50 transition-all">
          <Search className="w-5 h-5 text-text-muted mr-3" />
          <input 
            type="text" 
            placeholder="Search drafts..." 
            className="w-full bg-transparent border-none outline-none text-text-main placeholder:text-text-muted"
          />
        </div>
        <button className="bg-white px-5 rounded-2xl border border-border-subtle shadow-sm flex items-center justify-center text-text-main hover:bg-cream transition-colors">
          <Filter className="w-5 h-5" />
        </button>
      </div>

        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-text-muted" /></div>
          ) : filteredDrafts.length === 0 ? (
            <div className="bg-cream-light border-2 border-dashed border-border-subtle rounded-[24px] p-12 text-center text-text-muted">
              No drafts found matching this filter.
            </div>
          ) : filteredDrafts.map((draft, i) => (
            <div key={draft.id || i} className="bg-white rounded-[24px] p-5 md:p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between group border border-border-subtle hover:border-text-main/10 transition-all gap-4">
              <div className="flex items-start md:items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-2xl ${draft.color} shrink-0 hidden md:flex items-center justify-center`}>
                  <span className="font-bold text-text-main opacity-70">
                    {draft.title.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="md:hidden px-2.5 py-0.5 rounded-full bg-cream-light text-text-secondary text-xs font-semibold">
                      {draft.tag}
                    </span>
                    <h4 className="font-bold text-text-main text-xl leading-tight group-hover:text-black transition-colors">{draft.title}</h4>
                  </div>
                  <p className="text-text-secondary text-sm md:text-base line-clamp-2 md:line-clamp-1 mb-2 md:mb-0">
                    {draft.post}
                  </p>
                  <div className="md:hidden flex items-center gap-3 text-sm text-text-muted font-medium mt-3">
                    <span>{draft.date}</span>
                    <span>•</span>
                    <span className={draft.status === 'Draft' ? 'text-text-secondary' : 'text-pastel-peach'}>{draft.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-8 text-text-muted font-medium text-sm w-48 shrink-0 justify-end">
                <span>{draft.date}</span>
                <span className="w-20 text-right">{draft.tag}</span>
              </div>
              
              <div className="hidden md:flex flex-row md:flex-col gap-2 shrink-0">
                <button className="w-10 h-10 rounded-full bg-cream flex items-center justify-center hover:bg-text-main hover:text-white transition-all text-text-secondary">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}
