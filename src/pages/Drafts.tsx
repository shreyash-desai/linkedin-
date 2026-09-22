import { FileText, MoreVertical, Search, Filter } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';

export default function Drafts() {
  const { drafts } = useDataStore();

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
        {drafts.map((draft, i) => (
          <div key={i} className="bg-white rounded-[28px] p-6 shadow-soft border border-border-subtle group hover:border-text-main/20 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start md:items-center gap-5 flex-1">
              <div className={`w-14 h-14 shrink-0 rounded-[20px] ${draft.color} flex items-center justify-center mt-1 md:mt-0`}>
                <FileText className="w-7 h-7 text-text-main opacity-70" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-text-main text-xl leading-tight group-hover:text-black transition-colors">{draft.title}</h4>
                </div>
                <p className="text-text-secondary text-sm md:text-base line-clamp-2 md:line-clamp-1 mb-2 md:mb-0">
                  {draft.post}
                </p>
                <div className="md:hidden flex items-center gap-3 text-sm text-text-muted font-medium mt-3">
                  <span>{draft.date}</span>
                  <span className="w-1 h-1 rounded-full bg-text-muted"></span>
                  <span>{draft.tag}</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6 shrink-0 text-text-muted font-medium text-sm">
              <span className="w-24 text-right">{draft.date}</span>
              <span className="px-3 py-1 bg-cream rounded-full text-xs text-text-secondary">{draft.tag}</span>
              <button className="p-2 hover:bg-cream rounded-full transition-colors text-text-muted hover:text-text-main">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
