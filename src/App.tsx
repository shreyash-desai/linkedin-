import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Create from './pages/Create';
import Ideas from './pages/Ideas';
import Drafts from './pages/Drafts';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="create" element={<Create />} />
          <Route path="ideas" element={<Ideas />} />
          <Route path="drafts" element={<Drafts />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
