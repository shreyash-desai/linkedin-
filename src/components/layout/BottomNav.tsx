import { NavLink } from 'react-router-dom';
import { Home, PenSquare, Lightbulb, FileText, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/create', icon: PenSquare, label: 'Create' },
  { to: '/ideas', icon: Lightbulb, label: 'Ideas' },
  { to: '/drafts', icon: FileText, label: 'Drafts' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-border-subtle pb-safe pt-2 px-6 z-50">
      <nav className="flex justify-between items-center h-16 pb-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-text-main'
                  : 'text-text-muted hover:text-text-secondary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-2 rounded-full ${isActive ? 'bg-pastel-blue/50' : 'bg-transparent'}`}>
                  <item.icon className={`w-6 h-6 ${isActive ? 'fill-pastel-blue/20' : ''}`} />
                </div>
                <span className="text-[10px] font-medium tracking-wide hidden sm:block">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
