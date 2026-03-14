// ============================================================
// storage.js — localStorage read/write helpers
// ============================================================

const PREFIX = 'dompetku';

export const Storage = {
  /** User-scoped key */
  key: (username, name) => `${PREFIX}_${username}_${name}`,

  /** Get value by user + key */
  get: (username, name, fallback = null) => {
    try {
      const raw = localStorage.getItem(Storage.key(username, name));
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  /** Set value by user + key */
  set: (username, name, value) => {
    try {
      localStorage.setItem(Storage.key(username, name), JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  /** Remove a key */
  remove: (username, name) => {
    try {
      localStorage.removeItem(Storage.key(username, name));
    } catch {}
  },

  // ── Global (not user-scoped) ──────────────────────────────

  /** Get all registered users */
  getUsers: () => {
    try {
      return JSON.parse(localStorage.getItem(`${PREFIX}_users`) || '[]');
    } catch {
      return [];
    }
  },

  /** Save users list */
  setUsers: (users) => {
    localStorage.setItem(`${PREFIX}_users`, JSON.stringify(users));
  },

  /** Get current session */
  getSession: () => {
    try {
      return JSON.parse(localStorage.getItem(`${PREFIX}_session`) || 'null');
    } catch {
      return null;
    }
  },

  /** Save session */
  setSession: (user) => {
    localStorage.setItem(`${PREFIX}_session`, JSON.stringify(user));
  },

  /** Clear session */
  clearSession: () => {
    localStorage.removeItem(`${PREFIX}_session`);
  },
};
