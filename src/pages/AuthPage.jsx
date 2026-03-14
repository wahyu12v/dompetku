// ============================================================
// AuthPage.jsx — Login & Register page
// ============================================================
import { useState } from 'react';

export default function AuthPage({ onLogin, onRegister }) {
  const [mode,    setMode]    = useState('login');
  const [form,    setForm]    = useState({ username: '', name: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 250));

    if (mode === 'login') {
      const err = onLogin(form.username.trim(), form.password);
      if (err) setError(err);
    } else {
      const err = onRegister(form.username.trim(), form.name.trim(), form.password);
      if (err) setError(err);
    }

    setLoading(false);
  };

  const switchMode = (m) => {
    setMode(m);
    setError('');
    setForm({ username: '', name: '', password: '' });
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        {/* Logo */}
        <div className="auth-logo">
          <h1>💰 Dompetku</h1>
          <p>Sistem Keuangan Pribadi</p>
        </div>

        {/* Mode tabs */}
        <div className="tabs" style={{ marginBottom: 24 }}>
          <div
            className={`tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Masuk
          </div>
          <div
            className={`tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Daftar Akun
          </div>
        </div>

        {/* Error alert */}
        {error && <div className="alert error">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input
                className="form-input"
                placeholder="Nama kamu"
                value={form.name}
                onChange={set('name')}
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              placeholder="username"
              value={form.username}
              onChange={set('username')}
              required
              autoComplete="username"
              autoCapitalize="none"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder={mode === 'register' ? 'Minimal 4 karakter' : '••••••••'}
              value={form.password}
              onChange={set('password')}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            style={{ marginTop: 8 }}
            disabled={loading}
          >
            {loading
              ? 'Loading...'
              : mode === 'login' ? 'Masuk' : 'Buat Akun'
            }
          </button>
        </form>

        {/* Footer */}
        {mode === 'login' ? (
          <p className="auth-footer">
            Belum punya akun?{' '}
            <span onClick={() => switchMode('register')}>Daftar sekarang</span>
          </p>
        ) : (
          <p className="auth-footer">
            Sudah punya akun?{' '}
            <span onClick={() => switchMode('login')}>Masuk di sini</span>
          </p>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--text3)', marginTop: 20 }}>
          💾 Data tersimpan di browser — tidak dikirim ke server manapun
        </p>
      </div>
    </div>
  );
}
