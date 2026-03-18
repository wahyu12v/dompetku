// import { useState } from 'react';
// import { Storage } from '../utils/storage';
// import { genId, today } from '../utils/helpers';
// import { DEFAULT_SUMBER, DEFAULT_TUJUAN,
//   DUMMY_TRANSAKSI, DUMMY_TAGIHAN, DUMMY_PIUTANG, DUMMY_HUTANG,
//   DUMMY_ASET, DUMMY_SALDO_AWAL, DUMMY_WIFI_ISP, DUMMY_WIFI_BAYAR, DUMMY_KATEGORI,
// } from '../utils/constants';

// export function useAuth() {
//   const [user, setUser] = useState(() => Storage.getSession());

//   const login = (username, password) => {
//     const users = Storage.getUsers();
//     const found = users.find(u => u.username === username && u.password === password);
//     if (!found) return 'Username atau password salah';
//     Storage.setSession(found);
//     setUser(found);
//     return null;
//   };

//   const register = (username, name, password) => {
//     if (!username.trim()) return 'Username tidak boleh kosong';
//     if (!name.trim())     return 'Nama tidak boleh kosong';
//     if (password.length < 4) return 'Password minimal 4 karakter';
//     const users = Storage.getUsers();
//     if (users.find(u => u.username === username)) return 'Username sudah dipakai';

//     const newUser = { id: genId(), username: username.trim(), name: name.trim(), password, createdAt: today() };
//     Storage.setUsers([...users, newUser]);

//     // Seed dengan data dummy generik
//     Storage.set(username, 'transaksi',  DUMMY_TRANSAKSI);
//     Storage.set(username, 'tagihan',    DUMMY_TAGIHAN);
//     Storage.set(username, 'piutang',    DUMMY_PIUTANG);
//     Storage.set(username, 'hutang',     DUMMY_HUTANG);
//     Storage.set(username, 'aset',       DUMMY_ASET);
//     Storage.set(username, 'saldoAwal',  DUMMY_SALDO_AWAL);
//     Storage.set(username, 'wifiIsp',    DUMMY_WIFI_ISP);
//     Storage.set(username, 'wifiBayar',  DUMMY_WIFI_BAYAR);
//     Storage.set(username, 'kategori',   DUMMY_KATEGORI);
//     Storage.set(username, 'isDummy',    true);

//     // Tandai bahwa ini login pertama kali (untuk trigger modal)
//     const sessionUser = { ...newUser, isFirstLogin: true };
//     Storage.setSession(sessionUser);
//     setUser(sessionUser);
//     return null;
//   };

//   const logout = () => { Storage.clearSession(); setUser(null); };

//   const changePassword = (oldPassword, newPassword) => {
//     if (oldPassword !== user.password) return 'Password lama salah';
//     if (newPassword.length < 4) return 'Password baru minimal 4 karakter';
//     const users = Storage.getUsers();
//     const updated = { ...user, password: newPassword };
//     Storage.setUsers(users.map(u => u.username === user.username ? updated : u));
//     Storage.setSession(updated);
//     setUser(updated);
//     return null;
//   };

//   const updateName = (newName) => {
//     if (!newName.trim()) return 'Nama tidak boleh kosong';
//     const users = Storage.getUsers();
//     const updated = { ...user, name: newName.trim() };
//     Storage.setUsers(users.map(u => u.username === user.username ? updated : u));
//     Storage.setSession(updated);
//     setUser(updated);
//     return null;
//   };

//   const resetData = (username) => {
//     Storage.set(username, 'transaksi',  []);
//     Storage.set(username, 'tagihan',    []);
//     Storage.set(username, 'piutang',    []);
//     Storage.set(username, 'hutang',     []);
//     Storage.set(username, 'aset',       []);
//     Storage.set(username, 'saldoAwal',  0);
//     Storage.set(username, 'wifiIsp',    []);
//     Storage.set(username, 'wifiBayar',  []);
//     Storage.set(username, 'isDummy',    false);
//   };

//   // Dipanggil setelah user membuat pilihan di modal welcome
//   const clearFirstLogin = () => {
//     const updated = { ...user };
//     delete updated.isFirstLogin;
//     Storage.setSession(updated);
//     setUser(updated);
//   };

//   return { user, login, register, logout, changePassword, updateName, resetData, clearFirstLogin };
// }


import { useState } from 'react';
import { Storage } from '../utils/storage';
import { genId, today } from '../utils/helpers';
import { DEFAULT_SUMBER, DEFAULT_TUJUAN,
  DUMMY_TRANSAKSI, DUMMY_TAGIHAN, DUMMY_PIUTANG, DUMMY_HUTANG,
  DUMMY_ASET, DUMMY_SALDO_AWAL, DUMMY_WIFI_ISP, DUMMY_WIFI_BAYAR,
  DUMMY_KATEGORI, DUMMY_BUDGET,
} from '../utils/constants';

export function useAuth() {
  const [user, setUser] = useState(() => Storage.getSession());

  const login = (username, password) => {
    const users = Storage.getUsers();
    const found = users.find(u => u.username === username && u.password === password);
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
    if (users.find(u => u.username === username)) return 'Username sudah dipakai';

    const newUser = { id: genId(), username: username.trim(), name: name.trim(), password, createdAt: today() };
    Storage.setUsers([...users, newUser]);

    Storage.set(username, 'transaksi',  DUMMY_TRANSAKSI);
    Storage.set(username, 'tagihan',    DUMMY_TAGIHAN);
    Storage.set(username, 'piutang',    DUMMY_PIUTANG);
    Storage.set(username, 'hutang',     DUMMY_HUTANG);
    Storage.set(username, 'aset',       DUMMY_ASET);
    Storage.set(username, 'saldoAwal',  DUMMY_SALDO_AWAL);
    Storage.set(username, 'wifiIsp',    DUMMY_WIFI_ISP);
    Storage.set(username, 'wifiBayar',  DUMMY_WIFI_BAYAR);
    Storage.set(username, 'kategori',   DUMMY_KATEGORI);
    Storage.set(username, 'budget',     DUMMY_BUDGET);
    Storage.set(username, 'isDummy',    true);

    const sessionUser = { ...newUser, isFirstLogin: true };
    Storage.setSession(sessionUser);
    setUser(sessionUser);
    return null;
  };

  const logout = () => { Storage.clearSession(); setUser(null); };

  const changePassword = (oldPassword, newPassword) => {
    if (oldPassword !== user.password) return 'Password lama salah';
    if (newPassword.length < 4) return 'Password baru minimal 4 karakter';
    const users = Storage.getUsers();
    const updated = { ...user, password: newPassword };
    Storage.setUsers(users.map(u => u.username === user.username ? updated : u));
    Storage.setSession(updated);
    setUser(updated);
    return null;
  };

  const updateName = (newName) => {
    if (!newName.trim()) return 'Nama tidak boleh kosong';
    const users = Storage.getUsers();
    const updated = { ...user, name: newName.trim() };
    Storage.setUsers(users.map(u => u.username === user.username ? updated : u));
    Storage.setSession(updated);
    setUser(updated);
    return null;
  };

  const resetData = (username) => {
    Storage.set(username, 'transaksi',  []);
    Storage.set(username, 'tagihan',    []);
    Storage.set(username, 'piutang',    []);
    Storage.set(username, 'hutang',     []);
    Storage.set(username, 'aset',       []);
    Storage.set(username, 'saldoAwal',  0);
    Storage.set(username, 'wifiIsp',    []);
    Storage.set(username, 'wifiBayar',  []);
    Storage.set(username, 'budget',     []);
    Storage.set(username, 'isDummy',    false);
  };

  const clearFirstLogin = () => {
    const updated = { ...user };
    delete updated.isFirstLogin;
    Storage.setSession(updated);
    setUser(updated);
  };

  return { user, login, register, logout, changePassword, updateName, resetData, clearFirstLogin };
}
