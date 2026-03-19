import { useState } from 'react';
import { supabase } from './supabase';
import { genId, today } from '../utils/helpers';
import {
  DUMMY_TRANSAKSI, DUMMY_TAGIHAN, DUMMY_PIUTANG, DUMMY_HUTANG,
  DUMMY_ASET, DUMMY_SALDO_AWAL, DUMMY_WIFI_ISP, DUMMY_WIFI_BAYAR,
  DUMMY_KATEGORI, DUMMY_BUDGET, DEFAULT_SUMBER, DEFAULT_TUJUAN,
} from '../utils/constants';

const SESSION_KEY = 'dompetku_session';
function getSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } }
function setSession(user) { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); }
function clearSession() { localStorage.removeItem(SESSION_KEY); }

export function useAuth() {
  const [user, setUser] = useState(() => getSession());

  const login = async (username, password) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password);

    if (error || !data || data.length === 0) return 'Username atau password salah';
    const found = data[0];
    setSession(found);
    setUser(found);
    return null;
  };

  const register = async (username, name, password) => {
    if (!username.trim()) return 'Username tidak boleh kosong';
    if (!name.trim())     return 'Nama tidak boleh kosong';
    if (password.length < 4) return 'Password minimal 4 karakter';

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', username.trim());

    if (existing && existing.length > 0) return 'Username sudah dipakai';

    const newUser = {
      id: genId(),
      username: username.trim(),
      name: name.trim(),
      password,
      created_at: today(),
    };

    const { error } = await supabase.from('users').insert(newUser);
    if (error) return 'Gagal mendaftar, coba lagi';

    const u = username.trim();
    await supabase.from('transaksi').insert(DUMMY_TRANSAKSI.map(t => ({ id: t.id, username: u, tanggal: t.tanggal, pemasukan: t.pemasukan, sumber: t.sumber, pengeluaran: t.pengeluaran, tujuan: t.tujuan, ket: t.ket, metode_bayar: t.metodeBayar })));
    await supabase.from('tagihan').insert(DUMMY_TAGIHAN.map(t => ({ id: t.id, username: u, tanggal: t.tanggal, nominal: t.nominal, alasan: t.alasan, ket: t.ket, batas: t.batas, status: t.status })));
    await supabase.from('piutang').insert(DUMMY_PIUTANG.map(t => ({ id: t.id, username: u, dari: t.dari, jumlah: t.jumlah, ket: t.ket, dibayar: t.dibayar, tgl_hutang: t.tglHutang, tgl_bayar: t.tglBayar, status: t.status })));
    await supabase.from('hutang').insert(DUMMY_HUTANG.map(t => ({ id: t.id, username: u, dari: t.dari, jumlah: t.jumlah, ket: t.ket, dibayar: t.dibayar, tgl_hutang: t.tglHutang, tgl_bayar: t.tglBayar, status: t.status })));
    await supabase.from('aset').insert(DUMMY_ASET.map(t => ({ id: t.id, username: u, nama: t.nama, jumlah: t.jumlah, belitotal: t.belitotal, platform: t.platform, aktif: t.aktif, harga_pasar: t.hargaPasar, catatan: t.catatan })));
    await supabase.from('saldo_awal').insert({ username: u, nilai: DUMMY_SALDO_AWAL });
    await supabase.from('wifi_isp').insert(DUMMY_WIFI_ISP.map(t => ({ id: t.id, username: u, nama: t.nama, id_pelanggan: t.idPelanggan, paket: t.paket, harga: t.harga, alamat: t.alamat, ssid: t.ssid, password: t.password, ip: t.ip, user_admin: t.userAdmin, kata_kunci: t.kataKunci, status: t.status })));
    await supabase.from('wifi_bayar').insert(DUMMY_WIFI_BAYAR.map(t => ({ id: t.id, username: u, isp_id: t.ispId, tahun: t.tahun, bulan: t.bulan, lunas: t.lunas })));
    await supabase.from('budget').insert(DUMMY_BUDGET.map(t => ({ id: t.id, username: u, kategori: t.kategori, batas: t.batas })));
    await supabase.from('kategori').insert({ username: u, sumber: DUMMY_KATEGORI.sumber, tujuan: DUMMY_KATEGORI.tujuan });

    const sessionUser = { ...newUser, isFirstLogin: true };
    setSession(sessionUser);
    setUser(sessionUser);
    return null;
  };

  const logout = () => { clearSession(); setUser(null); };

  const changePassword = async (oldPassword, newPassword) => {
    if (oldPassword !== user.password) return 'Password lama salah';
    if (newPassword.length < 4) return 'Password baru minimal 4 karakter';
    const updated = { ...user, password: newPassword };
    const { error } = await supabase.from('users').update({ password: newPassword }).eq('username', user.username);
    if (error) return 'Gagal mengubah password';
    setSession(updated);
    setUser(updated);
    return null;
  };

  const updateName = async (newName) => {
    if (!newName.trim()) return 'Nama tidak boleh kosong';
    const updated = { ...user, name: newName.trim() };
    const { error } = await supabase.from('users').update({ name: newName.trim() }).eq('username', user.username);
    if (error) return 'Gagal mengubah nama';
    setSession(updated);
    setUser(updated);
    return null;
  };

  const resetData = async (username) => {
    await supabase.from('transaksi').delete().eq('username', username);
    await supabase.from('tagihan').delete().eq('username', username);
    await supabase.from('piutang').delete().eq('username', username);
    await supabase.from('hutang').delete().eq('username', username);
    await supabase.from('aset').delete().eq('username', username);
    await supabase.from('saldo_awal').update({ nilai: 0 }).eq('username', username);
    await supabase.from('wifi_isp').delete().eq('username', username);
    await supabase.from('wifi_bayar').delete().eq('username', username);
    await supabase.from('budget').delete().eq('username', username);
    await supabase.from('kategori').update({ sumber: [...DEFAULT_SUMBER], tujuan: [...DEFAULT_TUJUAN] }).eq('username', username);
  };

  const clearFirstLogin = () => {
    const updated = { ...user };
    delete updated.isFirstLogin;
    setSession(updated);
    setUser(updated);
  };

  return { user, login, register, logout, changePassword, updateName, resetData, clearFirstLogin };
}
