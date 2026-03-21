// ============================================================
// ConfirmDialog.jsx — Custom confirm dialog (replaces window.confirm)
// Usage: useConfirm hook returns { confirm, ConfirmUI }
// FIX: Pakai createPortal agar position:fixed tidak dipengaruhi
// parent yang punya transform/overflow (penyebab dialog tidak muncul
// di mobile pada halaman Transaksi, WiFi, dll)
// ============================================================
import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

export function useConfirm() {
  const [state, setState] = useState(null);
  // state = { title, message, type, resolve }

  const confirm = useCallback(({ title = 'Konfirmasi', message, type = 'danger' }) => {
    return new Promise((resolve) => {
      setState({ title, message, type, resolve });
    });
  }, []);

  const handleYes = () => {
    state?.resolve(true);
    setState(null);
  };

  const handleNo = () => {
    state?.resolve(false);
    setState(null);
  };

  const ConfirmUI = state ? createPortal(
    <div className="confirm-overlay">
      <div className="confirm-box">
        <div className={`confirm-icon ${state.type}`}>
          {state.type === 'danger' ? '🗑️' : '⚠️'}
        </div>
        <div className="confirm-title">{state.title}</div>
        <div className="confirm-msg">{state.message}</div>
        <div className="confirm-footer">
          <button className="btn btn-ghost btn-sm" onClick={handleNo}>Batal</button>
          <button
            className={`btn btn-sm ${state.type === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleYes}
          >
            {state.type === 'danger' ? 'Ya, Hapus' : 'Ya, Lanjutkan'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return { confirm, ConfirmUI };
}
