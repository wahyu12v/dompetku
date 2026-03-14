import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useData } from './hooks/useData';
import Sidebar  from './components/Sidebar';
import Topbar   from './components/Topbar';
import AuthPage          from './pages/AuthPage';
import DashboardPage     from './pages/DashboardPage';
import TransaksiPage     from './pages/TransaksiPage';
import TagihanPage       from './pages/TagihanPage';
import PiutangHutangPage from './pages/PiutangHutangPage';
import AsetPage          from './pages/AsetPage';
import WifiPage          from './pages/WifiPage';
import LaporanPage       from './pages/LaporanPage';
import PengaturanPage    from './pages/PengaturanPage';

function AppShell({ user, logout, changePassword }) {
  const data = useData(user.username);
  const [page,        setPage]        = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (page) {
      case 'dashboard':  return <DashboardPage     data={data} />;
      case 'transaksi':  return <TransaksiPage     data={data} />;
      case 'tagihan':    return <TagihanPage       data={data} />;
      case 'piutang':    return <PiutangHutangPage data={data} />;
      case 'aset':       return <AsetPage          data={data} />;
      case 'wifi':       return <WifiPage          data={data} />;
      case 'laporan':    return <LaporanPage       data={data} />;
      case 'pengaturan': return <PengaturanPage    data={data} changePassword={changePassword} />;
      default:           return <DashboardPage     data={data} />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        user={user} page={page}
        onNavigate={setPage} onLogout={logout}
        open={sidebarOpen} onClose={() => setSidebarOpen(false)}
      />
      <div className="main">
        <Topbar page={page} onMenuToggle={() => setSidebarOpen(v => !v)} />
        <div className="page">{renderPage()}</div>
      </div>
    </div>
  );
}

export default function App() {
  const { user, login, register, logout, changePassword } = useAuth();
  if (!user) return <AuthPage onLogin={login} onRegister={register} />;
  return <AppShell user={user} logout={logout} changePassword={changePassword} />;
}
