import { NavLink } from 'react-router-dom';
import { Home, PenSquare, Lightbulb, FileText, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/create', icon: PenSquare, label: 'Create' },
  { to: '/ideas', icon: Lightbulb, label: 'Ideas' },
  { to: '/drafts', icon: FileText, label: 'Drafts' },
];

export function Sidebar() {
  const { user, profile } = useAuthStore();

  return (
    <aside className="hidden md:flex flex-col w-[260px] fixed h-screen p-6 bg-cream border-r border-border-subtle/40">
      <div className="flex items-center gap-3 mb-12 px-4">
        <div className="w-8 h-8 rounded-xl bg-text-main flex items-center justify-center text-white font-bold text-lg">
          P
        </div>
        <span className="text-xl font-bold tracking-tight">Postly AI</span>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-white shadow-soft text-text-main font-medium'
                  : 'text-text-secondary hover:bg-white/50 hover:text-text-main'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        {/* Profile Link only if logged in */}
        {user && (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-white shadow-soft text-text-main font-medium'
                  : 'text-text-secondary hover:bg-white/50 hover:text-text-main'
              }`
            }
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </NavLink>
        )}
      </nav>

      <div className="mt-auto bg-white rounded-3xl p-5 shadow-soft mb-4">
        <p className="text-sm font-medium mb-1">Tokens remaining</p>
        <p className="text-xs text-text-muted mb-3">{user ? 'Unlimited' : 'Guest mode'}</p>
        <div className="w-full bg-cream rounded-full h-2">
          <div className="bg-pastel-blue w-3/4 h-full rounded-full"></div>
        </div>
      </div>

      {/* User Section or Login Prompt */}
      <div className="pt-4 border-t border-border-subtle shrink-0">
        {user ? (
          <NavLink to="/profile" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/50 transition-all">
            <div className="w-10 h-10 rounded-full bg-text-main text-white font-bold flex items-center justify-center shrink-0 text-lg">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-sm font-bold text-text-main truncate">{profile?.full_name || 'Creator'}</span>
              <span className="text-xs font-medium text-text-muted truncate">{user.email}</span>
            </div>
          </NavLink>
        ) : (
          <NavLink to="/auth" className="flex items-center justify-center gap-2 p-4 w-full bg-text-main text-white rounded-2xl font-semibold hover:bg-black transition-all shadow-soft text-sm">
            <User className="w-4 h-4" /> Sign In to Sync
          </NavLink>
        )}
      </div>
    </aside>
  );
}
