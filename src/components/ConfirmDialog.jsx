// ============================================================
// ConfirmDialog.jsx — Custom confirm dialog (replaces window.confirm)
// Usage: useConfirm hook returns { confirm, ConfirmUI }
// ============================================================
import { useState, useCallback } from 'react';

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

  const ConfirmUI = state ? (
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
    </div>
  ) : null;

  return { confirm, ConfirmUI };
}
