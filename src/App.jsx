import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useData } from './hooks/useData';
import Sidebar  from './components/Sidebar';
import Topbar   from './components/Topbar';
import AuthPage          from './pages/AuthPage';
import DashboardPage     from './pages/DashboardPage';
import TransaksiPage     from './pages/TransaksiPage';
import TagihanPage       from './pages/TagihanPage';
import BudgetPage        from './pages/BudgetPage';
import PiutangHutangPage from './pages/PiutangHutangPage';
import AsetPage          from './pages/AsetPage';
import WifiPage          from './pages/WifiPage';
import LaporanPage       from './pages/LaporanPage';
import PengaturanPage    from './pages/PengaturanPage';

function WelcomeModal({ user, onKeep, onClear }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(15, 23, 42, 0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 500, padding: '20px', boxSizing: 'border-box',
      animation: 'fadeOverlay 0.2s ease',
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 400, animation: 'scaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1)', padding: 0, overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--accent2), var(--purple))', padding: '28px 24px 24px', textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 24 }}>👋</div>
          <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Selamat datang, {user.name}!</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', marginTop: 6, lineHeight: 1.5 }}>Akun kamu sudah siap digunakan.</p>
        </div>
        <div style={{ padding: '22px 24px' }}>
          <div className="alert warning" style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 15 }}>📦</span>
            <span>Kami sudah mengisi <strong>data contoh</strong> agar kamu bisa langsung melihat tampilan aplikasi.</span>
          </div>
          <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 14, color: 'var(--text)' }}>Apakah data contoh ingin dihapus?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-danger btn-lg w-full" onClick={onClear}>🗑️ &nbsp;Hapus — mulai dari nol</button>
            <button className="btn btn-ghost btn-lg w-full" onClick={onKeep}>✅ &nbsp;Simpan — lihat dulu contohnya</button>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', padding: '12px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.73rem', color: 'var(--text3)', margin: 0 }}>Data contoh bisa dihapus kapan saja lewat menu <strong>Pengaturan</strong>.</p>
        </div>
      </div>
    </div>
  );
}

function AppShell({ user, logout, changePassword, updateName, resetData, clearFirstLogin }) {
  const data = useData(user.username);
  const [page,        setPage]        = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showWelcomeModal = !!user.isFirstLogin;

  if (data.loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: '2rem' }}>💰</div>
      <div style={{ fontWeight: 700, color: 'var(--text2)' }}>Memuat data...</div>
    </div>
  );

  const handleKeepDummy  = () => clearFirstLogin();
  const handleClearDummy = async () => {
    await resetData(user.username);
    clearFirstLogin();
    window.location.reload();
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':  return <DashboardPage     data={data} />;
      case 'transaksi':  return <TransaksiPage     data={data} />;
      case 'tagihan':    return <TagihanPage       data={data} />;
      case 'budget':     return <BudgetPage        data={data} />;
      case 'piutang':    return <PiutangHutangPage data={data} />;
      case 'aset':       return <AsetPage          data={data} />;
      case 'wifi':       return <WifiPage          data={data} />;
      case 'laporan':    return <LaporanPage       data={data} />;
      case 'pengaturan': return (
        <PengaturanPage data={data} user={user} changePassword={changePassword}
          updateName={updateName} resetData={() => resetData(user.username)} />
      );
      default: return <DashboardPage data={data} />;
    }
  };

  return (
    <div className="app-shell">
      {showWelcomeModal && <WelcomeModal user={user} onKeep={handleKeepDummy} onClear={handleClearDummy} />}
      <Sidebar user={user} page={page} onNavigate={setPage} onLogout={logout}
        open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main">
        <Topbar page={page} onMenuToggle={() => setSidebarOpen(v => !v)} />
        <div className="page">{renderPage()}</div>
      </div>
    </div>
  );
}

export default function App() {
  const { user, login, register, logout, changePassword, updateName, resetData, clearFirstLogin } = useAuth();
  if (!user) return <AuthPage onLogin={login} onRegister={register} />;
  return <AppShell user={user} logout={logout} changePassword={changePassword}
    updateName={updateName} resetData={resetData} clearFirstLogin={clearFirstLogin} />;
}
