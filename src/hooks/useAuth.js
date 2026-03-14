import { useState } from 'react';
import { Storage } from '../utils/storage';
import { genId, today } from '../utils/helpers';
import { DEFAULT_SUMBER, DEFAULT_TUJUAN } from '../utils/constants';

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

    // Semua data kosong — user input sendiri dari awal
    Storage.set(username, 'transaksi',  []);
    Storage.set(username, 'tagihan',    []);
    Storage.set(username, 'piutang',    []);
    Storage.set(username, 'hutang',     []);
    Storage.set(username, 'aset',       []);
    Storage.set(username, 'saldoAwal',  0);
    Storage.set(username, 'wifiIsp',    []);
    Storage.set(username, 'wifiBayar',  []);
    Storage.set(username, 'kategori',   { sumber: [...DEFAULT_SUMBER], tujuan: [...DEFAULT_TUJUAN] });

    Storage.setSession(newUser);
    setUser(newUser);
    return null;
  };

  const logout = () => { Storage.clearSession(); setUser(null); };

  // Ubah password
  const changePassword = (oldPassword, newPassword) => {
    if (oldPassword !== user.password) return 'Password lama salah';
    if (newPassword.length < 4) return 'Password baru minimal 4 karakter';

    const users = Storage.getUsers();
    const updated = { ...user, password: newPassword };
    Storage.setUsers(users.map((u) => u.username === user.username ? updated : u));
    Storage.setSession(updated);
    setUser(updated);
    return null;
  };

  return { user, login, register, logout, changePassword };
}
