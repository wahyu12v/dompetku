// import { useState } from 'react';
// import { Storage } from '../utils/storage';
// import { DEFAULT_SUMBER, DEFAULT_TUJUAN } from '../utils/constants';

// export function useData(username) {
//   const [transaksi,  setTxSt]    = useState(() => Storage.get(username, 'transaksi',  []));
//   const [tagihan,    setTagSt]   = useState(() => Storage.get(username, 'tagihan',    []));
//   const [piutang,    setPiutSt]  = useState(() => Storage.get(username, 'piutang',    []));
//   const [hutang,     setHutSt]   = useState(() => Storage.get(username, 'hutang',     []));
//   const [aset,       setAsetSt]  = useState(() => Storage.get(username, 'aset',       []));
//   const [saldoAwal,  setSaldoSt] = useState(() => Storage.get(username, 'saldoAwal',  0));
//   const [wifiIsp,    setWifiISt] = useState(() => Storage.get(username, 'wifiIsp',    []));
//   const [wifiBayar,  setWifiBSt] = useState(() => Storage.get(username, 'wifiBayar',  []));
//   const [kategori,   setKatSt]   = useState(() =>
//     Storage.get(username, 'kategori', { sumber: [...DEFAULT_SUMBER], tujuan: [...DEFAULT_TUJUAN] })
//   );

//   const persist = (key, setter) => (value) => { setter(value); Storage.set(username, key, value); };

//   const setTransaksi   = persist('transaksi',  setTxSt);
//   const setTagihan     = persist('tagihan',    setTagSt);
//   const setPiutang     = persist('piutang',    setPiutSt);
//   const setHutang      = persist('hutang',     setHutSt);
//   const setAset        = persist('aset',       setAsetSt);
//   const setSaldoAwal   = persist('saldoAwal',  setSaldoSt);
//   const setWifiIspFn   = persist('wifiIsp',    setWifiISt);
//   const setWifiBayarFn = persist('wifiBayar',  setWifiBSt);
//   const setKategori    = persist('kategori',   setKatSt);

//   const upsert = (list, setList, item) =>
//     setList(list.some(x => x.id === item.id) ? list.map(x => x.id === item.id ? item : x) : [...list, item]);
//   const remove = (list, setList, id) => setList(list.filter(x => x.id !== id));

//   return {
//     transaksi, tagihan, piutang, hutang, aset, saldoAwal, wifiIsp, wifiBayar, kategori,
//     setTransaksi, setTagihan, setPiutang, setHutang, setAset, setSaldoAwal, setKategori,
//     setWifiIsp: setWifiIspFn, setWifiBayar: setWifiBayarFn,

//     upsertTransaksi: i  => upsert(transaksi,  setTransaksi,  i),
//     removeTransaksi: id => remove(transaksi,  setTransaksi,  id),

//     upsertTagihan:   i  => upsert(tagihan,    setTagihan,    i),
//     removeTagihan:   id => remove(tagihan,    setTagihan,    id),
//     markTagihanPaid: id => setTagihan(tagihan.map(x => x.id === id ? { ...x, status: 'Sudah dibayar' } : x)),

//     upsertPiutang:   i  => upsert(piutang,    setPiutang,    i),
//     removePiutang:   id => remove(piutang,    setPiutang,    id),

//     upsertHutang:    i  => upsert(hutang,     setHutang,     i),
//     removeHutang:    id => remove(hutang,     setHutang,     id),

//     upsertAset:      i  => upsert(aset,       setAset,       i),
//     removeAset:      id => remove(aset,       setAset,       id),

//     upsertWifiIsp:   i  => upsert(wifiIsp,    setWifiIspFn,  i),
//     removeWifiIsp:   id => remove(wifiIsp,    setWifiIspFn,  id),

//     upsertWifiBayar: i  => upsert(wifiBayar,  setWifiBayarFn, i),
//     removeWifiBayar: id => remove(wifiBayar,  setWifiBayarFn, id),
//     toggleWifiBayar: (ispId, tahun, bulan) => {
//       const ex = wifiBayar.find(x => x.ispId === ispId && x.tahun === tahun && x.bulan === bulan);
//       if (ex) {
//         setWifiBayarFn(wifiBayar.map(x =>
//           x.ispId === ispId && x.tahun === tahun && x.bulan === bulan ? { ...x, lunas: !x.lunas } : x
//         ));
//       } else {
//         setWifiBayarFn([...wifiBayar, { id: Date.now().toString(36), ispId, tahun, bulan, lunas: true }]);
//       }
//     },
//   };
// }


import { useState } from 'react';
import { Storage } from '../utils/storage';
import { DEFAULT_SUMBER, DEFAULT_TUJUAN } from '../utils/constants';

export function useData(username) {
  const [transaksi,  setTxSt]    = useState(() => Storage.get(username, 'transaksi',  []));
  const [tagihan,    setTagSt]   = useState(() => Storage.get(username, 'tagihan',    []));
  const [piutang,    setPiutSt]  = useState(() => Storage.get(username, 'piutang',    []));
  const [hutang,     setHutSt]   = useState(() => Storage.get(username, 'hutang',     []));
  const [aset,       setAsetSt]  = useState(() => Storage.get(username, 'aset',       []));
  const [saldoAwal,  setSaldoSt] = useState(() => Storage.get(username, 'saldoAwal',  0));
  const [wifiIsp,    setWifiISt] = useState(() => Storage.get(username, 'wifiIsp',    []));
  const [wifiBayar,  setWifiBSt] = useState(() => Storage.get(username, 'wifiBayar',  []));
  const [budget,     setBudgetSt]= useState(() => Storage.get(username, 'budget',     []));
  const [kategori,   setKatSt]   = useState(() =>
    Storage.get(username, 'kategori', { sumber: [...DEFAULT_SUMBER], tujuan: [...DEFAULT_TUJUAN] })
  );

  const persist = (key, setter) => (value) => { setter(value); Storage.set(username, key, value); };

  const setTransaksi   = persist('transaksi',  setTxSt);
  const setTagihan     = persist('tagihan',    setTagSt);
  const setPiutang     = persist('piutang',    setPiutSt);
  const setHutang      = persist('hutang',     setHutSt);
  const setAset        = persist('aset',       setAsetSt);
  const setSaldoAwal   = persist('saldoAwal',  setSaldoSt);
  const setWifiIspFn   = persist('wifiIsp',    setWifiISt);
  const setWifiBayarFn = persist('wifiBayar',  setWifiBSt);
  const setBudget      = persist('budget',     setBudgetSt);
  const setKategori    = persist('kategori',   setKatSt);

  const upsert = (list, setList, item) =>
    setList(list.some(x => x.id === item.id) ? list.map(x => x.id === item.id ? item : x) : [...list, item]);
  const remove = (list, setList, id) => setList(list.filter(x => x.id !== id));

  return {
    transaksi, tagihan, piutang, hutang, aset, saldoAwal, wifiIsp, wifiBayar, kategori, budget,
    setTransaksi, setTagihan, setPiutang, setHutang, setAset, setSaldoAwal, setKategori,
    setWifiIsp: setWifiIspFn, setWifiBayar: setWifiBayarFn, setBudget,

    upsertTransaksi: i  => upsert(transaksi,  setTransaksi,  i),
    removeTransaksi: id => remove(transaksi,  setTransaksi,  id),

    upsertTagihan:   i  => upsert(tagihan,    setTagihan,    i),
    removeTagihan:   id => remove(tagihan,    setTagihan,    id),
    markTagihanPaid: id => setTagihan(tagihan.map(x => x.id === id ? { ...x, status: 'Sudah dibayar' } : x)),

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
      const ex = wifiBayar.find(x => x.ispId === ispId && x.tahun === tahun && x.bulan === bulan);
      if (ex) {
        setWifiBayarFn(wifiBayar.map(x =>
          x.ispId === ispId && x.tahun === tahun && x.bulan === bulan ? { ...x, lunas: !x.lunas } : x
        ));
      } else {
        setWifiBayarFn([...wifiBayar, { id: Date.now().toString(36), ispId, tahun, bulan, lunas: true }]);
      }
    },

    upsertBudget: i  => upsert(budget, setBudget, i),
    removeBudget: id => remove(budget, setBudget, id),
  };
}
