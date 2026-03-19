import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { DEFAULT_SUMBER, DEFAULT_TUJUAN } from '../utils/constants';

function toTransaksi(r) {
  return { id: r.id, tanggal: r.tanggal, pemasukan: r.pemasukan, sumber: r.sumber, pengeluaran: r.pengeluaran, tujuan: r.tujuan, ket: r.ket, metodeBayar: r.metode_bayar, createdAt: r.created_at };
}
function toTagihan(r) {
  return { id: r.id, tanggal: r.tanggal, nominal: r.nominal, alasan: r.alasan, ket: r.ket, batas: r.batas, status: r.status, createdAt: r.created_at };
}
function toPiutang(r) {
  return { id: r.id, dari: r.dari, jumlah: r.jumlah, ket: r.ket, dibayar: r.dibayar, tglHutang: r.tgl_hutang, tglBayar: r.tgl_bayar, status: r.status, createdAt: r.created_at };
}
function toHutang(r) {
  return { id: r.id, dari: r.dari, jumlah: r.jumlah, ket: r.ket, dibayar: r.dibayar, tglHutang: r.tgl_hutang, tglBayar: r.tgl_bayar, status: r.status, createdAt: r.created_at };
}
function toAset(r) {
  return { id: r.id, nama: r.nama, jumlah: r.jumlah, belitotal: r.belitotal, platform: r.platform, aktif: r.aktif, hargaPasar: r.harga_pasar, catatan: r.catatan };
}
function toWifiIsp(r) {
  return { id: r.id, nama: r.nama, idPelanggan: r.id_pelanggan, paket: r.paket, harga: r.harga, alamat: r.alamat, ssid: r.ssid, password: r.password, ip: r.ip, userAdmin: r.user_admin, kataKunci: r.kata_kunci, status: r.status };
}
function toWifiBayar(r) {
  return { id: r.id, ispId: r.isp_id, tahun: r.tahun, bulan: r.bulan, lunas: r.lunas };
}
function toBudget(r) {
  return { id: r.id, kategori: r.kategori, batas: r.batas };
}

// Sort: tanggal DESC, lalu createdAt DESC (untuk data tanggal sama)
function sortByTanggal(arr) {
  return [...arr].sort((a, b) => {
    const tgl = b.tanggal?.localeCompare(a.tanggal || '') || 0;
    if (tgl !== 0) return tgl;
    // Sama tanggal → sort by createdAt
    const ca = a.createdAt || '';
    const cb = b.createdAt || '';
    return cb.localeCompare(ca);
  });
}

export function useData(username) {
  const [transaksi,  setTransaksiSt]  = useState([]);
  const [tagihan,    setTagihanSt]    = useState([]);
  const [piutang,    setPiutangSt]    = useState([]);
  const [hutang,     setHutangSt]     = useState([]);
  const [aset,       setAsetSt]       = useState([]);
  const [saldoAwal,  setSaldoAwalSt]  = useState(0);
  const [wifiIsp,    setWifiIspSt]    = useState([]);
  const [wifiBayar,  setWifiBayarSt]  = useState([]);
  const [budget,     setBudgetSt]     = useState([]);
  const [kategori,   setKategoriSt]   = useState({ sumber: [...DEFAULT_SUMBER], tujuan: [...DEFAULT_TUJUAN] });
  const [loading,    setLoading]      = useState(true);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    Promise.all([
      supabase.from('transaksi').select('*').eq('username', username).order('tanggal', { ascending: false }).order('created_at', { ascending: false }),
      supabase.from('tagihan').select('*').eq('username', username).order('tanggal', { ascending: false }),
      supabase.from('piutang').select('*').eq('username', username),
      supabase.from('hutang').select('*').eq('username', username),
      supabase.from('aset').select('*').eq('username', username),
      supabase.from('saldo_awal').select('*').eq('username', username).single(),
      supabase.from('wifi_isp').select('*').eq('username', username),
      supabase.from('wifi_bayar').select('*').eq('username', username),
      supabase.from('budget').select('*').eq('username', username),
      supabase.from('kategori').select('*').eq('username', username).single(),
    ]).then(([tx, tag, piu, hut, ast, saldo, wisp, wbyr, bud, kat]) => {
      setTransaksiSt((tx.data || []).map(toTransaksi));
      setTagihanSt((tag.data || []).map(toTagihan));
      setPiutangSt((piu.data || []).map(toPiutang));
      setHutangSt((hut.data || []).map(toHutang));
      setAsetSt((ast.data || []).map(toAset));
      setSaldoAwalSt(saldo.data?.nilai || 0);
      setWifiIspSt((wisp.data || []).map(toWifiIsp));
      setWifiBayarSt((wbyr.data || []).map(toWifiBayar));
      setBudgetSt((bud.data || []).map(toBudget));
      if (kat.data) setKategoriSt({
        sumber:  kat.data.sumber  || [...DEFAULT_SUMBER],
        tujuan:  kat.data.tujuan  || [...DEFAULT_TUJUAN],
        tagihan: kat.data.tagihan || [],
        budget:  kat.data.budget  || [],
      });
      setLoading(false);
    });
  }, [username]);

  // ── Transaksi ──
  const upsertTransaksi = async (item) => {
    const row = { id: item.id, username, tanggal: item.tanggal, pemasukan: item.pemasukan, sumber: item.sumber, pengeluaran: item.pengeluaran, tujuan: item.tujuan, ket: item.ket, metode_bayar: item.metodeBayar };
    await supabase.from('transaksi').upsert(row);
    setTransaksiSt(prev => {
      const updated = prev.some(x => x.id === item.id) ? prev.map(x => x.id === item.id ? item : x) : [item, ...prev];
      return sortByTanggal(updated);
    });
  };
  const removeTransaksi = async (id) => {
    await supabase.from('transaksi').delete().eq('id', id);
    setTransaksiSt(prev => prev.filter(x => x.id !== id));
  };

  // ── Tagihan ──
  const upsertTagihan = async (item) => {
    const row = { id: item.id, username, tanggal: item.tanggal, nominal: item.nominal, alasan: item.alasan, ket: item.ket, batas: item.batas, status: item.status };
    await supabase.from('tagihan').upsert(row);
    setTagihanSt(prev => {
      const updated = prev.some(x => x.id === item.id) ? prev.map(x => x.id === item.id ? item : x) : [item, ...prev];
      return sortByTanggal(updated);
    });
  };
  const removeTagihan = async (id) => {
    await supabase.from('tagihan').delete().eq('id', id);
    setTagihanSt(prev => prev.filter(x => x.id !== id));
  };
  const markTagihanPaid = async (id) => {
    await supabase.from('tagihan').update({ status: 'Sudah dibayar' }).eq('id', id);
    setTagihanSt(prev => prev.map(x => x.id === id ? { ...x, status: 'Sudah dibayar' } : x));
  };

  // ── Piutang ──
  const upsertPiutang = async (item) => {
    const row = { id: item.id, username, dari: item.dari, jumlah: item.jumlah, ket: item.ket, dibayar: item.dibayar, tgl_hutang: item.tglHutang, tgl_bayar: item.tglBayar, status: item.status };
    await supabase.from('piutang').upsert(row);
    setPiutangSt(prev => prev.some(x => x.id === item.id) ? prev.map(x => x.id === item.id ? item : x) : [item, ...prev]);
  };
  const removePiutang = async (id) => {
    await supabase.from('piutang').delete().eq('id', id);
    setPiutangSt(prev => prev.filter(x => x.id !== id));
  };

  // ── Hutang ──
  const upsertHutang = async (item) => {
    const row = { id: item.id, username, dari: item.dari, jumlah: item.jumlah, ket: item.ket, dibayar: item.dibayar, tgl_hutang: item.tglHutang, tgl_bayar: item.tglBayar, status: item.status };
    await supabase.from('hutang').upsert(row);
    setHutangSt(prev => prev.some(x => x.id === item.id) ? prev.map(x => x.id === item.id ? item : x) : [item, ...prev]);
  };
  const removeHutang = async (id) => {
    await supabase.from('hutang').delete().eq('id', id);
    setHutangSt(prev => prev.filter(x => x.id !== id));
  };

  // ── Aset ──
  const upsertAset = async (item) => {
    const row = { id: item.id, username, nama: item.nama, jumlah: item.jumlah, belitotal: item.belitotal, platform: item.platform, aktif: item.aktif, harga_pasar: item.hargaPasar, catatan: item.catatan };
    await supabase.from('aset').upsert(row);
    setAsetSt(prev => prev.some(x => x.id === item.id) ? prev.map(x => x.id === item.id ? item : x) : [...prev, item]);
  };
  const removeAset = async (id) => {
    await supabase.from('aset').delete().eq('id', id);
    setAsetSt(prev => prev.filter(x => x.id !== id));
  };

  // ── Saldo Awal ──
  const setSaldoAwal = async (nilai) => {
    await supabase.from('saldo_awal').upsert({ username, nilai });
    setSaldoAwalSt(nilai);
  };

  // ── WiFi ISP ──
  const upsertWifiIsp = async (item) => {
    const row = { id: item.id, username, nama: item.nama, id_pelanggan: item.idPelanggan, paket: item.paket, harga: item.harga, alamat: item.alamat, ssid: item.ssid, password: item.password, ip: item.ip, user_admin: item.userAdmin, kata_kunci: item.kataKunci, status: item.status };
    await supabase.from('wifi_isp').upsert(row);
    setWifiIspSt(prev => prev.some(x => x.id === item.id) ? prev.map(x => x.id === item.id ? item : x) : [...prev, item]);
  };
  const removeWifiIsp = async (id) => {
    await supabase.from('wifi_isp').delete().eq('id', id);
    setWifiIspSt(prev => prev.filter(x => x.id !== id));
  };

  // ── WiFi Bayar ──
  const upsertWifiBayar = async (item) => {
    const row = { id: item.id, username, isp_id: item.ispId, tahun: item.tahun, bulan: item.bulan, lunas: item.lunas };
    await supabase.from('wifi_bayar').upsert(row);
    setWifiBayarSt(prev => prev.some(x => x.id === item.id) ? prev.map(x => x.id === item.id ? item : x) : [...prev, item]);
  };
  const removeWifiBayar = async (id) => {
    await supabase.from('wifi_bayar').delete().eq('id', id);
    setWifiBayarSt(prev => prev.filter(x => x.id !== id));
  };
  const toggleWifiBayar = async (ispId, tahun, bulan) => {
    const ex = wifiBayar.find(x => x.ispId === ispId && x.tahun === tahun && x.bulan === bulan);
    if (ex) {
      await supabase.from('wifi_bayar').update({ lunas: !ex.lunas }).eq('id', ex.id);
      setWifiBayarSt(prev => prev.map(x => x.id === ex.id ? { ...x, lunas: !x.lunas } : x));
    } else {
      const newItem = { id: Date.now().toString(36), ispId, tahun, bulan, lunas: true };
      await supabase.from('wifi_bayar').insert({ id: newItem.id, username, isp_id: ispId, tahun, bulan, lunas: true });
      setWifiBayarSt(prev => [...prev, newItem]);
    }
  };

  // ── Budget ──
  const upsertBudget = async (item) => {
    const row = { id: item.id, username, kategori: item.kategori, batas: item.batas };
    await supabase.from('budget').upsert(row);
    setBudgetSt(prev => prev.some(x => x.id === item.id) ? prev.map(x => x.id === item.id ? item : x) : [...prev, item]);
  };
  const removeBudget = async (id) => {
    await supabase.from('budget').delete().eq('id', id);
    setBudgetSt(prev => prev.filter(x => x.id !== id));
  };

  // ── Kategori ──
  const setKategori = async (val) => {
    await supabase.from('kategori').upsert({ username, sumber: val.sumber, tujuan: val.tujuan, tagihan: val.tagihan || [], budget: val.budget || [] });
    setKategoriSt(val);
  };

  return {
    loading,
    transaksi, tagihan, piutang, hutang, aset, saldoAwal, wifiIsp, wifiBayar, budget, kategori,
    setTransaksi: (v) => setTransaksiSt(v),
    setTagihan: (v) => setTagihanSt(v),
    setSaldoAwal, setKategori,
    setWifiIsp: upsertWifiIsp,
    setWifiBayar: upsertWifiBayar,
    setBudget: (v) => setBudgetSt(v),
    upsertTransaksi, removeTransaksi,
    upsertTagihan, removeTagihan, markTagihanPaid,
    upsertPiutang, removePiutang,
    upsertHutang, removeHutang,
    upsertAset, removeAset,
    upsertWifiIsp, removeWifiIsp,
    upsertWifiBayar, removeWifiBayar, toggleWifiBayar,
    upsertBudget, removeBudget,
  };
}
