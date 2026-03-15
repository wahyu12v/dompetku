// import { useMemo } from 'react';
// import StatCard from '../components/StatCard';
// import BarChartBulanan from '../components/charts/BarChartBulanan';
// import PieChartKategori from '../components/charts/PieChartKategori';
// import { fmtRp, fmtDate, monthName, fullMonth } from '../utils/format';
// import { filterByMonth, sumBy, today } from '../utils/helpers';

// export default function DashboardPage({ data }) {
//   const { transaksi, tagihan, hutang, piutang, aset, saldoAwal } = data;
//   const now      = new Date();
//   const curMonth = now.getMonth() + 1;
//   const curYear  = now.getFullYear();
//   const curKey   = `${curYear}-${String(curMonth).padStart(2,'0')}`;

//   const curTx  = useMemo(() => filterByMonth(transaksi, curKey), [transaksi, curKey]);
//   const curTag = useMemo(() => filterByMonth(tagihan, curKey),   [tagihan, curKey]);

//   const totalPmsKini    = sumBy(curTx,  'pemasukan');
//   const totalPglHarian  = sumBy(curTx,  'pengeluaran');
//   const totalPglBulanan = sumBy(curTag, 'nominal');
//   const totalPglKini    = totalPglHarian + totalPglBulanan;
//   const bersihKini      = totalPmsKini - totalPglKini;

//   const saldoAkhir = useMemo(() => {
//     const txSum  = sumBy(transaksi,'pemasukan') - sumBy(transaksi,'pengeluaran');
//     const tagSum = sumBy(tagihan,'nominal');
//     return saldoAwal + txSum - tagSum;
//   }, [transaksi, tagihan, saldoAwal]);

//   const chartData = useMemo(() => Array.from({length:6},(_,i) => {
//     let m = curMonth-(5-i), y = curYear;
//     if (m<=0) { m+=12; y-=1; }
//     const key = `${y}-${String(m).padStart(2,'0')}`;
//     const tx  = filterByMonth(transaksi, key);
//     const tag = filterByMonth(tagihan, key);
//     return {
//       label:       monthName(m),
//       pemasukan:   sumBy(tx,'pemasukan'),
//       pengeluaran: sumBy(tx,'pengeluaran') + sumBy(tag,'nominal'),
//     };
//   }), [transaksi, tagihan, curMonth, curYear]);

//   const catData = useMemo(() => {
//     const cats = {};
//     transaksi.forEach(t => { if(t.pengeluaran>0) cats[t.tujuan]=(cats[t.tujuan]||0)+t.pengeluaran; });
//     tagihan.forEach(t   => { if(t.nominal>0)     cats[t.alasan]=(cats[t.alasan]||0)+t.nominal; });
//     return Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name,value])=>({name,value}));
//   }, [transaksi, tagihan]);

//   const sisaPiutang   = sumBy(piutang,'jumlah') - sumBy(piutang,'dibayar');
//   const totalAset     = aset.filter(a=>a.aktif).reduce((s,x)=>s+(x.belitotal||0),0);
//   const recentTx      = [...transaksi].sort((a,b)=>b.tanggal.localeCompare(a.tanggal)).slice(0,10);
//   const tagihanBulanIni = [...curTag].sort((a,b)=>(a.batas||'').localeCompare(b.batas||''));
//   const hutangList    = hutang.filter(h=>h.status!=='Lunas');
//   const totalTagihan  = sumBy(curTag,'nominal');
//   const totSudahBayar = curTag.filter(t=>t.status==='Sudah dibayar').reduce((s,x)=>s+(x.nominal||0),0);

//   return (
//     <div className="fade-in">

//       {/* ── KPI Cards ── */}
//       <div className="dash-kpi-grid mb-4">
//         {[
//           { label: 'Saldo Saat Ini',           value: saldoAkhir, color: saldoAkhir>=0?'var(--green)':'var(--red)', sub: 'Akumulasi semua transaksi', accent: 'kpi-green' },
//           { label: `Pemasukan ${fullMonth(curMonth)}`,  value: totalPmsKini,  color: 'var(--blue)',   sub: `${curTx.filter(t=>t.pemasukan>0).length} transaksi masuk`, accent: 'kpi-blue' },
//           { label: `Pengeluaran ${fullMonth(curMonth)}`,value: totalPglKini,  color: 'var(--red)',    sub: 'Harian + Tagihan', accent: 'kpi-red' },
//           { label: 'Bersih Bulan Ini',         value: bersihKini, color: bersihKini>=0?'var(--green)':'var(--red)', sub: 'Pemasukan − Pengeluaran', accent: bersihKini>=0?'kpi-green':'kpi-red' },
//           { label: 'Sisa Piutang',             value: sisaPiutang,color: 'var(--yellow)', sub: `Dari ${piutang.length} orang`, accent: 'kpi-yellow' },
//           { label: 'Total Investasi',          value: totalAset,  color: 'var(--purple)', sub: `${aset.filter(a=>a.aktif).length} aset aktif`, accent: 'kpi-purple' },
//         ].map((k,i) => (
//           <div key={i} className={`kpi-card ${k.accent}`}>
//             <div className="kpi-label">{k.label}</div>
//             <div className="kpi-value" style={{ color: k.color, wordBreak: 'break-all', fontSize: 'clamp(0.85rem, 1.5vw, 1.15rem)' }}>
//               {fmtRp(k.value)}
//             </div>
//             <div className="kpi-sub">{k.sub}</div>
//           </div>
//         ))}
//       </div>

//       {/* ── Charts Row ── */}
//       <div className="grid-2 mb-4">
//         <div className="card">
//           <div className="card-title">Tren 6 Bulan Terakhir</div>
//           <BarChartBulanan data={chartData} />
//         </div>
//         <div className="card">
//           <div className="card-title">Kategori Pengeluaran (Semua Waktu)</div>
//           <PieChartKategori data={catData} />
//         </div>
//       </div>

//       {/* ── Bottom Row ── */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, alignItems: 'start' }}>

//         {/* Transaksi Terbaru */}
//         <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
//           <div className="section-header mb-3">
//             <div className="section-title">Transaksi Terbaru</div>
//             <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>10 terakhir</span>
//           </div>
//           <div style={{ overflowY: 'auto', maxHeight: 340 }}>
//             <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 0 }}>
//               <thead>
//                 <tr>
//                   <th style={thStyle}>Tanggal</th>
//                   <th style={thStyle}>Sumber / Tujuan</th>
//                   <th style={{ ...thStyle, textAlign: 'right' }}>Nominal</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentTx.length === 0 ? (
//                   <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text3)', padding: 28, fontSize: '0.83rem' }}>Belum ada transaksi</td></tr>
//                 ) : recentTx.map(t => (
//                   <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
//                     <td style={{ padding: '9px 10px', fontSize: '0.74rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{fmtDate(t.tanggal)}</td>
//                     <td style={{ padding: '9px 10px', fontSize: '0.82rem', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                       {t.pemasukan > 0 ? t.sumber : t.tujuan}
//                     </td>
//                     <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '0.82rem', fontWeight: 600, color: t.pemasukan > 0 ? 'var(--green)' : 'var(--red)', whiteSpace: 'nowrap' }}>
//                       {t.pemasukan > 0 ? `+${fmtRp(t.pemasukan)}` : `-${fmtRp(t.pengeluaran)}`}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Tagihan + Hutang Bulan Ini */}
//         <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
//           <div className="section-header mb-1">
//             <div>
//               <div className="section-title">Tagihan — {fullMonth(curMonth)}</div>
//               {totalTagihan > 0 && (
//                 <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>
//                   Lunas{' '}
//                   <span style={{ color: 'var(--green)', fontWeight: 700, fontFamily: 'var(--mono)' }}>{fmtRp(totSudahBayar)}</span>
//                   {' '}/ Total{' '}
//                   <span style={{ color: 'var(--orange)', fontWeight: 700, fontFamily: 'var(--mono)' }}>{fmtRp(totalTagihan)}</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Progress bar lunas */}
//           {totalTagihan > 0 && (
//             <div style={{ marginBottom: 12 }}>
//               <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
//                 <div style={{ height: '100%', background: 'var(--green)', borderRadius: 3, width: `${Math.min((totSudahBayar/totalTagihan)*100,100)}%`, transition: 'width 0.5s ease' }} />
//               </div>
//               <div style={{ fontSize: '0.68rem', color: 'var(--text3)', marginTop: 3 }}>
//                 {Math.round((totSudahBayar/totalTagihan)*100)}% sudah dibayar
//               </div>
//             </div>
//           )}

//           {tagihanBulanIni.length === 0 && hutangList.length === 0 ? (
//             <div className="empty-state" style={{ padding: '28px 0' }}>
//               <div className="empty-state-icon">✅</div>
//               <p>Tidak ada tagihan bulan ini</p>
//             </div>
//           ) : (
//             <div style={{ overflowY: 'auto', maxHeight: 320, display: 'flex', flexDirection: 'column', gap: 6 }}>

//               {/* Tagihan list */}
//               {tagihanBulanIni.map(t => {
//                 const lunas = t.status === 'Sudah dibayar';
//                 return (
//                   <div key={t.id} style={{
//                     display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                     padding: '9px 12px', borderRadius: 9, flexShrink: 0,
//                     background: lunas ? 'var(--green-bg)' : 'var(--red-bg)',
//                     border: `1px solid ${lunas ? '#86efac' : '#fca5a5'}`,
//                   }}>
//                     <div style={{ minWidth: 0, flex: 1, marginRight: 10 }}>
//                       <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                         {t.alasan}{t.ket ? <span style={{ fontWeight: 400, color: 'var(--text3)' }}> ({t.ket})</span> : ''}
//                       </div>
//                       <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 1 }}>
//                         Batas: {fmtDate(t.batas) || '—'}
//                       </div>
//                     </div>
//                     <div style={{ textAlign: 'right', flexShrink: 0 }}>
//                       <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.88rem', color: lunas ? 'var(--green2)' : 'var(--red2)' }}>
//                         {fmtRp(t.nominal)}
//                       </div>
//                       <div style={{ fontSize: '0.68rem', fontWeight: 600, marginTop: 2, color: lunas ? 'var(--green2)' : 'var(--red2)' }}>
//                         {lunas ? '✓ Lunas' : t.status}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}

//               {/* Hutang section */}
//               {hutangList.length > 0 && (
//                 <>
//                   <div style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text3)', padding: '8px 0 2px', flexShrink: 0 }}>
//                     Hutang Kamu
//                   </div>
//                   {hutangList.slice(0, 4).map(h => {
//                     const sisa = (h.jumlah||0) - (h.dibayar||0);
//                     return (
//                       <div key={h.id} style={{
//                         display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                         padding: '9px 12px', borderRadius: 9, flexShrink: 0,
//                         background: 'var(--orange-bg)', border: '1px solid #fdba74',
//                       }}>
//                         <div style={{ minWidth: 0, flex: 1, marginRight: 10 }}>
//                           <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.nama||h.dari}</div>
//                           <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.ket||'—'}</div>
//                         </div>
//                         <div style={{ textAlign: 'right', flexShrink: 0 }}>
//                           <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.88rem', color: 'var(--orange)' }}>{fmtRp(sisa)}</div>
//                           <div style={{ fontSize: '0.68rem', fontWeight: 600, marginTop: 2, color: 'var(--orange)' }}>Belum Lunas</div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                   {hutangList.length > 4 && (
//                     <div style={{ fontSize: '0.73rem', color: 'var(--text3)', paddingTop: 4, textAlign: 'center' }}>
//                       +{hutangList.length-4} hutang lainnya...
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// const thStyle = {
//   fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
//   letterSpacing: '0.8px', color: 'var(--text3)',
//   padding: '8px 10px', textAlign: 'left',
//   borderBottom: '2px solid var(--border)',
//   background: 'var(--bg3)', whiteSpace: 'nowrap',
//   position: 'sticky', top: 0, zIndex: 1,
// };




import { useMemo } from 'react';
import StatCard from '../components/StatCard';
import BarChartBulanan from '../components/charts/BarChartBulanan';
import PieChartKategori from '../components/charts/PieChartKategori';
import { fmtRp, fmtDate, monthName, fullMonth } from '../utils/format';
import { filterByMonth, sumBy, today } from '../utils/helpers';

export default function DashboardPage({ data }) {
  const { transaksi, tagihan, hutang, piutang, aset, saldoAwal } = data;
  const now      = new Date();
  const curMonth = now.getMonth() + 1;
  const curYear  = now.getFullYear();
  const curKey   = `${curYear}-${String(curMonth).padStart(2,'0')}`;

  const curTx  = useMemo(() => filterByMonth(transaksi, curKey), [transaksi, curKey]);
  const curTag = useMemo(() => filterByMonth(tagihan, curKey),   [tagihan, curKey]);

  const totalPmsKini    = sumBy(curTx,  'pemasukan');
  const totalPglHarian  = sumBy(curTx,  'pengeluaran');
  const totalPglBulanan = sumBy(curTag, 'nominal');
  const totalPglKini    = totalPglHarian + totalPglBulanan;
  const bersihKini      = totalPmsKini - totalPglKini;

  const saldoAkhir = useMemo(() => {
    const txSum  = sumBy(transaksi,'pemasukan') - sumBy(transaksi,'pengeluaran');
    const tagSum = sumBy(tagihan,'nominal');
    return saldoAwal + txSum - tagSum;
  }, [transaksi, tagihan, saldoAwal]);

  const chartData = useMemo(() => Array.from({length:6},(_,i) => {
    let m = curMonth-(5-i), y = curYear;
    if (m<=0) { m+=12; y-=1; }
    const key = `${y}-${String(m).padStart(2,'0')}`;
    const tx  = filterByMonth(transaksi, key);
    const tag = filterByMonth(tagihan, key);
    return {
      label:       monthName(m),
      pemasukan:   sumBy(tx,'pemasukan'),
      pengeluaran: sumBy(tx,'pengeluaran') + sumBy(tag,'nominal'),
    };
  }), [transaksi, tagihan, curMonth, curYear]);

  const catData = useMemo(() => {
    const cats = {};
    transaksi.forEach(t => { if(t.pengeluaran>0) cats[t.tujuan]=(cats[t.tujuan]||0)+t.pengeluaran; });
    tagihan.forEach(t   => { if(t.nominal>0)     cats[t.alasan]=(cats[t.alasan]||0)+t.nominal; });
    return Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name,value])=>({name,value}));
  }, [transaksi, tagihan]);

  const sisaPiutang   = sumBy(piutang,'jumlah') - sumBy(piutang,'dibayar');
  const totalAset     = aset.filter(a=>a.aktif).reduce((s,x)=>s+(x.belitotal||0),0);
  const recentTx      = [...transaksi].sort((a,b)=>b.tanggal.localeCompare(a.tanggal)).slice(0,10);
  const tagihanBulanIni = [...curTag].sort((a,b)=>(a.batas||'').localeCompare(b.batas||''));
  const hutangList    = hutang.filter(h=>h.status!=='Lunas');
  const totalTagihan  = sumBy(curTag,'nominal');
  const totSudahBayar = curTag.filter(t=>t.status==='Sudah dibayar').reduce((s,x)=>s+(x.nominal||0),0);

  return (
    <div className="fade-in">

      {/* ── KPI Cards ── */}
      <div className="dash-kpi-grid mb-4" style={{ gap: '16px' }}>
        {[
          { label: 'Saldo Saat Ini',           value: saldoAkhir, color: saldoAkhir>=0?'var(--green)':'var(--red)', sub: 'Akumulasi semua transaksi', accent: 'kpi-green' },
          { label: `Pemasukan ${fullMonth(curMonth)}`,  value: totalPmsKini,  color: 'var(--blue)',   sub: `${curTx.filter(t=>t.pemasukan>0).length} transaksi masuk`, accent: 'kpi-blue' },
          { label: `Pengeluaran ${fullMonth(curMonth)}`,value: totalPglKini,  color: 'var(--red)',    sub: 'Harian + Tagihan', accent: 'kpi-red' },
          { label: 'Bersih Bulan Ini',         value: bersihKini, color: bersihKini>=0?'var(--green)':'var(--red)', sub: 'Pemasukan − Pengeluaran', accent: bersihKini>=0?'kpi-green':'kpi-red' },
          { label: 'Sisa Piutang',             value: sisaPiutang,color: 'var(--yellow)', sub: `Dari ${piutang.length} orang`, accent: 'kpi-yellow' },
          { label: 'Total Investasi',          value: totalAset,  color: 'var(--purple)', sub: `${aset.filter(a=>a.aktif).length} aset aktif`, accent: 'kpi-purple' },
        ].map((k,i) => (
          <div key={i} className={`kpi-card ${k.accent}`} style={{ padding: '16px', borderRadius: '12px' }}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color: k.color, wordBreak: 'break-all', fontSize: 'clamp(0.85rem, 1.5vw, 1.15rem)' }}>
              {fmtRp(k.value)}
            </div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid-2 mb-4" style={{ gap: '16px' }}>
        <div className="card" style={{ borderRadius: '12px' }}>
          <div className="card-title">Tren 6 Bulan Terakhir</div>
          <BarChartBulanan data={chartData} />
        </div>
        <div className="card" style={{ borderRadius: '12px' }}>
          <div className="card-title">Kategori Pengeluaran (Semua Waktu)</div>
          <PieChartKategori data={catData} />
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, alignItems: 'start' }}>

        {/* Transaksi Terbaru */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', borderRadius: '12px' }}>
          <div className="section-header mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="section-title">Transaksi Terbaru</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text3)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: '10px' }}>10 terakhir</span>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 340 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 0 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Tanggal</th>
                  <th style={thStyle}>Sumber / Tujuan</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Nominal</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text3)', padding: 28, fontSize: '0.83rem' }}>Belum ada transaksi</td>
                  </tr>
                ) : recentTx.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px', fontSize: '0.74rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{fmtDate(t.tanggal)}</td>
                    <td style={{ padding: '10px', fontSize: '0.82rem', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.pemasukan > 0 ? t.sumber : t.tujuan}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span style={{ 
                        fontFamily: 'var(--mono)', fontSize: '0.82rem', fontWeight: 600, 
                        color: t.pemasukan > 0 ? 'var(--green)' : 'var(--red)',
                        background: t.pemasukan > 0 ? 'var(--green-bg)' : 'var(--red-bg)',
                        padding: '3px 8px', borderRadius: '6px'
                      }}>
                        {t.pemasukan > 0 ? `+${fmtRp(t.pemasukan)}` : `-${fmtRp(t.pengeluaran)}`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tagihan + Hutang Bulan Ini */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', borderRadius: '12px' }}>
          <div className="section-header mb-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div className="section-title">Tagihan — {fullMonth(curMonth)}</div>
              {totalTagihan > 0 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>
                  Lunas{' '}
                  <span style={{ color: 'var(--green)', fontWeight: 700, fontFamily: 'var(--mono)' }}>{fmtRp(totSudahBayar)}</span>
                  {' '}/ Total{' '}
                  <span style={{ color: 'var(--orange)', fontWeight: 700, fontFamily: 'var(--mono)' }}>{fmtRp(totalTagihan)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar lunas */}
          {totalTagihan > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--green)', borderRadius: 3, width: `${Math.min((totSudahBayar/totalTagihan)*100,100)}%`, transition: 'width 0.5s ease' }} />
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text3)', marginTop: 4 }}>
                {Math.round((totSudahBayar/totalTagihan)*100)}% sudah dibayar
              </div>
            </div>
          )}

          {tagihanBulanIni.length === 0 && hutangList.length === 0 ? (
            <div className="empty-state" style={{ padding: '28px 0', textAlign: 'center' }}>
              <div className="empty-state-icon" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>✅</div>
              <p style={{ fontSize: '0.85rem' }}>Tidak ada tagihan bulan ini</p>
            </div>
          ) : (
            <div style={{ overflowY: 'auto', maxHeight: 320, display: 'flex', flexDirection: 'column', gap: 8, paddingRight: '4px' }}>

              {/* Tagihan list */}
              {tagihanBulanIni.map(t => {
                const lunas = t.status === 'Sudah dibayar';
                return (
                  <div key={t.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 12px', borderRadius: 10, flexShrink: 0,
                    background: lunas ? 'var(--green-bg)' : 'var(--red-bg)',
                    border: `1px solid ${lunas ? '#86efac' : '#fca5a5'}`,
                  }}>
                    <div style={{ minWidth: 0, flex: 1, marginRight: 10 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.alasan}{t.ket ? <span style={{ fontWeight: 400, color: 'var(--text3)' }}> ({t.ket})</span> : ''}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 2 }}>
                        Batas: {fmtDate(t.batas) || '—'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.88rem', color: lunas ? 'var(--green2)' : 'var(--red2)' }}>
                        {fmtRp(t.nominal)}
                      </div>
                      <div style={{ fontSize: '0.68rem', fontWeight: 600, marginTop: 2, color: lunas ? 'var(--green2)' : 'var(--red2)' }}>
                        {lunas ? '✓ Lunas' : t.status}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Hutang section */}
              {hutangList.length > 0 && (
                <>
                  <div style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text3)', padding: '10px 0 2px', flexShrink: 0 }}>
                    Hutang Kamu
                  </div>
                  {hutangList.slice(0, 4).map(h => {
                    const sisa = (h.jumlah||0) - (h.dibayar||0);
                    return (
                      <div key={h.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '10px 12px', borderRadius: 10, flexShrink: 0,
                        background: 'var(--orange-bg)', border: '1px solid #fdba74',
                      }}>
                        <div style={{ minWidth: 0, flex: 1, marginRight: 10 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.nama||h.dari}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.ket||'—'}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.88rem', color: 'var(--orange)' }}>{fmtRp(sisa)}</div>
                          <div style={{ fontSize: '0.68rem', fontWeight: 600, marginTop: 2, color: 'var(--orange)' }}>Belum Lunas</div>
                        </div>
                      </div>
                    );
                  })}
                  {hutangList.length > 4 && (
                    <div style={{ fontSize: '0.73rem', color: 'var(--text3)', paddingTop: 4, textAlign: 'center' }}>
                      +{hutangList.length-4} hutang lainnya...
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.8px', color: 'var(--text3)',
  padding: '10px', textAlign: 'left',
  borderBottom: '2px solid var(--border)',
  background: 'var(--bg3)', whiteSpace: 'nowrap',
  position: 'sticky', top: 0, zIndex: 1,
};
