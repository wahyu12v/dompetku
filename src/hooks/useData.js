import { useState } from 'react';
import { Storage } from '../utils/storage';
import { DEFAULT_SUMBER, DEFAULT_TUJUAN, SEED_WIFI_ISP, SEED_WIFI_BAYAR } from '../utils/constants';

export function useData(username) {
  // For existing users missing new features, use seed as fallback
  const [transaksi,   setTxState]    = useState(() => Storage.get(username,'transaksi',[]));
  const [tagihan,     setTagState]   = useState(() => Storage.get(username,'tagihan',[]));
  const [piutang,     setPiutState]  = useState(() => Storage.get(username,'piutang',[]));
  const [hutang,      setHutState]   = useState(() => Storage.get(username,'hutang',[]));
  const [aset,        setAsetState]  = useState(() => Storage.get(username,'aset',[]));
  const [saldoAwal,   setSaldoState] = useState(() => Storage.get(username,'saldoAwal',0));
  const [wifiIsp,     setWifiIspSt]  = useState(() => {
    const v = Storage.get(username,'wifiIsp', null);
    if (v !== null) return v;
    // Auto-seed for existing users
    Storage.set(username,'wifiIsp', SEED_WIFI_ISP);
    return SEED_WIFI_ISP;
  });
  const [wifiBayar,   setWifiBayarSt] = useState(() => {
    const v = Storage.get(username,'wifiBayar', null);
    if (v !== null) return v;
    Storage.set(username,'wifiBayar', SEED_WIFI_BAYAR);
    return SEED_WIFI_BAYAR;
  });
  const [kategori,    setKatState]   = useState(() => {
    const v = Storage.get(username,'kategori', null);
    if (v !== null) return v;
    const def = { sumber:[...DEFAULT_SUMBER], tujuan:[...DEFAULT_TUJUAN] };
    Storage.set(username,'kategori', def);
    return def;
  });

  const persist = (key, setter) => (value) => { setter(value); Storage.set(username,key,value); };

  const setTransaksi   = persist('transaksi',  setTxState);
  const setTagihan     = persist('tagihan',    setTagState);
  const setPiutang     = persist('piutang',    setPiutState);
  const setHutang      = persist('hutang',     setHutState);
  const setAset        = persist('aset',       setAsetState);
  const setSaldoAwal   = persist('saldoAwal',  setSaldoState);
  const setWifiIspFn   = persist('wifiIsp',    setWifiIspSt);
  const setWifiBayarFn = persist('wifiBayar',  setWifiBayarSt);
  const setKategori    = persist('kategori',   setKatState);

  const upsert = (list, setList, item) => {
    const exists = list.some(x => x.id === item.id);
    setList(exists ? list.map(x => x.id===item.id ? item : x) : [...list,item]);
  };
  const remove = (list, setList, id) => setList(list.filter(x => x.id !== id));

  return {
    transaksi, tagihan, piutang, hutang, aset, saldoAwal,
    wifiIsp, wifiBayar, kategori,

    setTransaksi, setTagihan, setPiutang, setHutang,
    setAset, setSaldoAwal, setKategori,
    setWifiIsp: setWifiIspFn,
    setWifiBayar: setWifiBayarFn,

    upsertTransaksi: i  => upsert(transaksi,  setTransaksi,  i),
    removeTransaksi: id => remove(transaksi,  setTransaksi,  id),

    upsertTagihan:   i  => upsert(tagihan,    setTagihan,    i),
    removeTagihan:   id => remove(tagihan,    setTagihan,    id),
    markTagihanPaid: id => setTagihan(tagihan.map(x => x.id===id ? {...x,status:'Sudah dibayar'} : x)),

    upsertPiutang:   i  => upsert(piutang,    setPiutang,    i),
    removePiutang:   id => remove(piutang,    setPiutang,    id),

    upsertHutang:    i  => upsert(hutang,     setHutang,     i),
    removeHutang:    id => remove(hutang,     setHutang,     id),

    upsertAset:      i  => upsert(aset,       setAset,       i),
    removeAset:      id => remove(aset,       setAset,       id),

    upsertWifiIsp:   i  => upsert(wifiIsp,    setWifiIspFn,  i),
    removeWifiIsp:   id => remove(wifiIsp,    setWifiIspFn,  id),

    upsertWifiBayar: i  => upsert(wifiBayar,  setWifiBayarFn, i),
    removeWifiBayar: id => remove(wifiBayar,  setWifiBayarFn, id),
    toggleWifiBayar: (ispId, tahun, bulan) => {
      const existing = wifiBayar.find(x => x.ispId===ispId && x.tahun===tahun && x.bulan===bulan);
      if (existing) {
        setWifiBayarFn(wifiBayar.map(x =>
          (x.ispId===ispId && x.tahun===tahun && x.bulan===bulan)
            ? {...x, lunas: !x.lunas} : x
        ));
      } else {
        setWifiBayarFn([...wifiBayar, {
          id: Date.now().toString(36), ispId, tahun, bulan, lunas: true,
        }]);
      }
    },
  };
}
