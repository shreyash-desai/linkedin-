import { NavLink } from 'react-router-dom';
import { Home, PenSquare, Lightbulb, FileText, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/create', icon: PenSquare, label: 'Create' },
  { to: '/ideas', icon: Lightbulb, label: 'Ideas' },
  { to: '/drafts', icon: FileText, label: 'Drafts' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-[260px] fixed h-screen p-6 bg-cream">
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
      </nav>

      <div className="mt-auto bg-white rounded-3xl p-5 shadow-soft">
        <p className="text-sm font-medium mb-1">Tokens remaining</p>
        <p className="text-xs text-text-muted mb-3">Demo mode</p>
        <div className="w-full bg-cream rounded-full h-2">
          <div className="bg-pastel-blue w-3/4 h-full rounded-full"></div>
        </div>
      </div>
    </aside>
  );
}
