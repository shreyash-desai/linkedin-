import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { PenSquare, Sparkles, Lightbulb, RefreshCw, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto pb-24">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-[32px] md:text-[44px] font-bold tracking-tight text-text-main leading-tight mb-2">
            Good morning, {user?.name || 'Creator'}
          </h1>
          <p className="text-lg text-text-secondary">Ready to turn an idea into a post?</p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <img src={user?.avatar_url} alt="Profile" className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
        </div>
      </header>
      
      {/* Hero Action Card */}
      <div className="bg-pastel-blue rounded-[32px] p-6 md:p-10 shadow-soft mb-8 relative overflow-hidden group transition-all duration-300 hover:shadow-large cursor-pointer" onClick={() => navigate('/create')}>
        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
          <Sparkles className="w-32 h-32" />
        </div>
        <div className="relative z-10 max-w-md">
          <span className="inline-block px-4 py-2 bg-white/40 backdrop-blur-md rounded-full text-sm font-bold tracking-wide text-text-main mb-6">Create</span>
          <h2 className="text-3xl font-bold mb-4 text-text-main leading-tight">Turn your raw thoughts into polished posts.</h2>
          <button className="bg-text-main text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-black transition-all">
            Start writing <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Quick Actions Grid */}
      <h3 className="text-xl font-bold mb-4 px-2">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { title: 'Write a post', icon: PenSquare, color: 'bg-light-blue', route: '/create' },
          { title: 'Rewrite content', icon: RefreshCw, color: 'bg-pastel-green', route: '/create' },
          { title: 'Generate hooks', icon: Sparkles, color: 'bg-pastel-peach', route: '/create' },
          { title: 'Idea bank', icon: Lightbulb, color: 'bg-soft-yellow', route: '/ideas' }
        ].map((action, i) => (
          <button 
            key={i} 
            onClick={() => navigate(action.route)}
            className={`p-6 rounded-[28px] text-left transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-soft flex flex-col justify-between aspect-square md:aspect-auto md:h-48 ${action.color}`}
          >
            <div className="bg-white/40 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <action.icon className="w-6 h-6 text-text-main" />
            </div>
            <span className="font-bold text-text-main text-lg leading-tight w-3/4">{action.title}</span>
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-xl font-bold">Recent Drafts</h3>
        <button className="text-text-secondary font-medium flex items-center text-sm hover:text-text-main transition-colors">
          View all <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      <div className="space-y-4">
        {[
          { title: 'Why simplicity wins in product design', date: 'Today', tag: 'Product', color: 'bg-soft-green' },
          { title: 'The hidden cost of complex features', date: 'Yesterday', tag: 'Engineering', color: 'bg-soft-lavender' }
        ].map((draft, i) => (
          <div key={i} className="bg-white rounded-[24px] p-5 shadow-soft flex items-center justify-between group cursor-pointer border border-border-subtle hover:border-text-main/10 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${draft.color} flex items-center justify-center`}>
                <FileText className="w-6 h-6 text-text-main opacity-70" />
              </div>
              <div>
                <h4 className="font-bold text-text-main text-base md:text-lg">{draft.title}</h4>
                <p className="text-text-muted text-sm">{draft.date} • {draft.tag}</p>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-cream flex items-center justify-center group-hover:bg-text-main group-hover:text-white transition-all text-text-secondary">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Need to import missing icons
import { ArrowRight, FileText } from 'lucide-react';
