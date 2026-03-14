// ============================================================
// useAuth.js — Authentication hook
// ============================================================
import { useState } from 'react';
import { Storage } from '../utils/storage';
import { genId, today } from '../utils/helpers';
import {
  SEED_TRANSAKSI, SEED_TAGIHAN, SEED_PIUTANG, SEED_HUTANG,
  SEED_ASET, SEED_SALDO_AWAL, SEED_WIFI_ISP, SEED_WIFI_BAYAR, SEED_KATEGORI,
} from '../utils/constants';

export function useAuth() {
  const [user, setUser] = useState(() => Storage.getSession());

  const login = (username, password) => {
    const users = Storage.getUsers();
    const found = users.find((u) => u.username === username && u.password === password);
    if (!found) return 'Username atau password salah';
    Storage.setSession(found);
    setUser(found);
    return null;
  };

  const register = (username, name, password) => {
    if (!username.trim()) return 'Username tidak boleh kosong';
    if (!name.trim())     return 'Nama tidak boleh kosong';
    if (password.length < 4) return 'Password minimal 4 karakter';

    const users = Storage.getUsers();
    if (users.find((u) => u.username === username)) return 'Username sudah dipakai';

    const newUser = { id: genId(), username: username.trim(), name: name.trim(), password, createdAt: today() };
    Storage.setUsers([...users, newUser]);

    Storage.set(username, 'transaksi',  SEED_TRANSAKSI);
    Storage.set(username, 'tagihan',    SEED_TAGIHAN);
    Storage.set(username, 'piutang',    SEED_PIUTANG);
    Storage.set(username, 'hutang',     SEED_HUTANG);
    Storage.set(username, 'aset',       SEED_ASET);
    Storage.set(username, 'saldoAwal',  SEED_SALDO_AWAL);
    Storage.set(username, 'wifiIsp',    SEED_WIFI_ISP);
    Storage.set(username, 'wifiBayar',  SEED_WIFI_BAYAR);
    Storage.set(username, 'kategori',   SEED_KATEGORI);

    Storage.setSession(newUser);
    setUser(newUser);
    return null;
  };

  const logout = () => { Storage.clearSession(); setUser(null); };

  return { user, login, register, logout };
}
