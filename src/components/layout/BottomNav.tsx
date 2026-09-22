import { NavLink } from 'react-router-dom';
import { Home, PenSquare, Lightbulb, FileText, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/create', icon: PenSquare, label: 'Create' },
  { to: '/ideas', icon: Lightbulb, label: 'Ideas' },
  { to: '/drafts', icon: FileText, label: 'Drafts' },
];

export function BottomNav() {
  const { user } = useAuthStore();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-border-subtle pb-safe pt-2 px-6 z-50">
      <nav className="flex justify-between items-center h-16 pb-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-12 h-12 transition-colors relative ${
                isActive ? 'text-text-main' : 'text-text-muted hover:text-text-secondary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} />
                <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                {isActive && <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-text-main" />}
              </>
            )}
          </NavLink>
        ))}
        {/* Auth or Profile Link */}
        <NavLink
          key={user ? '/profile' : '/auth'}
          to={user ? '/profile' : '/auth'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 h-12 transition-colors relative ${
              isActive ? 'text-text-main' : 'text-text-muted hover:text-text-secondary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <User className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} />
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {user ? 'Profile' : 'Sign In'}
              </span>
              {isActive && <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-text-main" />}
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
}
