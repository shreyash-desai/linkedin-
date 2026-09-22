import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="min-h-screen bg-cream flex">
      <Sidebar />
      <main className="flex-1 md:ml-[260px] pb-24 md:pb-12 max-w-[1400px] w-full">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
