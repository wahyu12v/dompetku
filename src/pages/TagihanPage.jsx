// import { useState, useMemo } from 'react';
// import { createPortal } from 'react-dom';
// import TagihanForm from '../components/forms/TagihanForm';
// import { useConfirm } from '../components/ConfirmDialog';
// import { fmtRp, fmtDate, monthName } from '../utils/format';
// import { filterByMonth, sumBy, getMonths, currentYearMonth, today, genId } from '../utils/helpers';

// function KonfirmasiTransaksi({ tagihan, onYes, onNo }) {
//   return createPortal(
//     <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
//       <div style={{
//         background: 'var(--card)', border: '1px solid var(--border2)',
//         borderRadius: 14, width: '100%', maxWidth: 400,
//         boxShadow: '0 8px 32px rgba(0,0,0,0.14)', overflow: 'hidden',
//         animation: 'scaleIn 0.18s cubic-bezier(0.34,1.56,0.64,1)',
//       }}>
//         <div style={{ textAlign: 'center', padding: '24px 24px 0' }}>
//           <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--green-bg)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🧾</div>
//           <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 10 }}>Catat ke Transaksi Harian?</div>
//           <div style={{ fontSize: '0.84rem', color: 'var(--text2)', lineHeight: 1.7, padding: '0 8px' }}>
//             Tagihan <strong>{tagihan.alasan}{tagihan.ket ? ` (${tagihan.ket})` : ''}</strong> sebesar{' '}
//             <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--orange)' }}>{fmtRp(tagihan.nominal)}</span>
//             {' '}akan dicatat sebagai pengeluaran di Transaksi Harian.
//           </div>
//         </div>
//         <div style={{ display: 'flex', gap: 10, padding: '16px 20px', borderTop: '1px solid var(--border)', justifyContent: 'flex-end', marginTop: 16 }}>
//           <button className="btn btn-ghost btn-sm" onClick={onNo}>Tidak, Skip</button>
//           <button className="btn btn-primary btn-sm" onClick={onYes}>Ya, Catat Sekarang</button>
//         </div>
//       </div>
//     </div>,
//     document.body
//   );
// }

// function StatusBadge({ status }) {
//   if (status === 'Sudah dibayar') return <span className="badge green">✓ Lunas</span>;
//   if (status === 'Belum dibayar') return <span className="badge red">✕ Belum</span>;
//   return <span className="badge yellow">? Belum Pasti</span>;
// }

// export default function TagihanPage({ data }) {
//   const { tagihan, upsertTagihan, removeTagihan, markTagihanPaid, upsertTransaksi } = data;
//   const [modal, setModal] = useState(null);
//   const [filterMonth, setFilterMonth] = useState(currentYearMonth());
//   const [tab, setTab] = useState('semua');
//   const { confirm: showConfirm, ConfirmUI } = useConfirm();
//   const [konfirmasi, setKonfirmasi] = useState(null);

//   const months = useMemo(() => {
//     const existing = getMonths(tagihan);
//     const now = new Date();
//     const extra = Array.from({ length: 6 }, (_, i) => {
//       const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
//       return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
//     });
//     return [...new Set([...existing, ...extra])].sort((a, b) => b.localeCompare(a)).slice(0, 18);
//   }, [tagihan]);

//   const inMonth = useMemo(() => filterByMonth(tagihan, filterMonth), [tagihan, filterMonth]);
//   const filtered = useMemo(() => {
//     let list = inMonth;
//     if (tab === 'belum') list = list.filter(t => t.status !== 'Sudah dibayar');
//     if (tab === 'sudah') list = list.filter(t => t.status === 'Sudah dibayar');
//     return [...list].sort((a, b) => (a.batas || '').localeCompare(b.batas || ''));
//   }, [inMonth, tab]);

//   const totAll   = sumBy(inMonth, 'nominal');
//   const totSudah = inMonth.filter(t => t.status === 'Sudah dibayar').reduce((s, x) => s + (x.nominal || 0), 0);
//   const totBelum = totAll - totSudah;

//   const handleSave = (item) => { upsertTagihan(item); setModal(null); };
//   const handleDelete = async (id) => {
//     const ok = await showConfirm({ title: 'Hapus Tagihan', message: 'Tagihan ini akan dihapus permanen.', type: 'danger' });
//     if (ok) removeTagihan(id);
//   };

//   // Tandai lunas dulu, lalu tanya apakah mau dicatat ke transaksi
//   const handlePaid = (t) => {
//     markTagihanPaid(t.id);
//     setKonfirmasi(t);
//   };

//   const handleKonfirmasiYes = () => {
//     upsertTransaksi({
//       id:          genId(),
//       tanggal:     today(),
//       pemasukan:   0,
//       sumber:      'Tidak ada',
//       pengeluaran: konfirmasi.nominal,
//       tujuan:      konfirmasi.alasan,
//       ket:         `Bayar ${konfirmasi.alasan}${konfirmasi.ket ? ' (' + konfirmasi.ket + ')' : ''}`,
//     });
//     setKonfirmasi(null);
//   };

//   return (
//     <div className="fade-in">
//       {ConfirmUI}

//       {konfirmasi && (
//         <KonfirmasiTransaksi
//           tagihan={konfirmasi}
//           onYes={handleKonfirmasiYes}
//           onNo={() => setKonfirmasi(null)}
//         />
//       )}

//       {/* ── Toolbar ── */}
//       <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
//         <button className="btn btn-primary" onClick={() => setModal({ item: null })}>+ Tambah Tagihan</button>
//       </div>

//       {/* ── Month tabs ── */}
//       <div className="month-tabs" style={{ marginBottom: 16 }}>
//         {months.map(m => {
//           const [y, mo] = m.split('-');
//           return <button key={m} className={`month-tab ${m === filterMonth ? 'active' : ''}`} onClick={() => setFilterMonth(m)}>{monthName(parseInt(mo))} {y}</button>;
//         })}
//       </div>

//       {/* ── Stat cards ── */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
//         {[
//           { label: 'Total Tagihan',  value: fmtRp(totAll),   color: 'var(--accent)', sub: `${inMonth.length} tagihan` },
//           { label: 'Sudah Dibayar', value: fmtRp(totSudah), color: 'var(--green)',  sub: 'Lunas' },
//           { label: 'Belum Dibayar', value: fmtRp(totBelum), color: totBelum > 0 ? 'var(--red)' : 'var(--green)', sub: totBelum > 0 ? 'Perlu dibayar' : 'Semua lunas ✓' },
//         ].map((s, i) => (
//           <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', borderTop: `3px solid ${s.color}`, boxShadow: 'var(--shadow)' }}>
//             <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text3)', marginBottom: 6 }}>{s.label}</div>
//             <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '1.2rem', color: s.color }}>{s.value}</div>
//             <div style={{ fontSize: '0.71rem', color: 'var(--text3)', marginTop: 4 }}>{s.sub}</div>
//           </div>
//         ))}
//       </div>

//       {/* ── Tabel ── */}
//       <div className="card">
//         <div className="tabs">
//           {[['semua','Semua'],['belum','Belum Dibayar'],['sudah','Sudah Dibayar']].map(([k,l]) =>
//             <div key={k} className={`tab ${tab===k?'active':''}`} onClick={() => setTab(k)}>{l}</div>
//           )}
//         </div>
//         <div className="table-wrap">
//           <table>
//             <thead>
//               <tr>
//                 <th style={{ width: 100 }}>Tanggal</th>
//                 <th>Jenis &amp; Keterangan</th>
//                 <th style={{ textAlign: 'right', width: 130 }}>Nominal</th>
//                 <th style={{ width: 110 }}>Batas Bayar</th>
//                 <th style={{ width: 90 }}>Status</th>
//                 <th style={{ width: 120 }}>Aksi</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length === 0 ? (
//                 <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text3)', padding: 40, fontSize: '0.85rem' }}>Tidak ada tagihan</td></tr>
//               ) : filtered.map(t => {
//                 const overdue = t.batas && t.batas < today() && t.status !== 'Sudah dibayar';
//                 const lunas   = t.status === 'Sudah dibayar';
//                 return (
//                   <tr key={t.id}>
//                     <td style={{ fontSize: '0.76rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{fmtDate(t.tanggal)}</td>
//                     <td>
//                       <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.alasan}</div>
//                       {t.ket && <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 1 }}>{t.ket}</div>}
//                     </td>
//                     <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.88rem', color: 'var(--orange)' }}>
//                       {fmtRp(t.nominal)}
//                     </td>
//                     <td style={{ fontSize: '0.78rem', color: overdue ? 'var(--red)' : 'var(--text3)', fontWeight: overdue ? 700 : 400, whiteSpace: 'nowrap' }}>
//                       {t.batas ? fmtDate(t.batas) : <span style={{ color: 'var(--border2)' }}>—</span>}
//                       {overdue && ' ⚠'}
//                     </td>
//                     <td><StatusBadge status={t.status} /></td>
//                     <td>
//                       <div style={{ display: 'flex', gap: 5 }}>
//                         {!lunas && (
//                           <button className="btn btn-success btn-sm" onClick={() => handlePaid(t)}>✓ Bayar</button>
//                         )}
//                         <button className="btn btn-ghost btn-sm" onClick={() => setModal({ item: t })}>✎</button>
//                         <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>✕</button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {modal && <TagihanForm item={modal.item} onSave={handleSave} onClose={() => setModal(null)} />}
//     </div>
//   );
// }


import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import TagihanForm from '../components/forms/TagihanForm';
import { useConfirm } from '../components/ConfirmDialog';
import { fmtRp, fmtDate, monthName } from '../utils/format';
import { filterByMonth, sumBy, getMonths, currentYearMonth, today, genId } from '../utils/helpers';

function KonfirmasiTransaksi({ tagihan, onYes, onNo }) {
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 16, width: '100%', maxWidth: 400,
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)', overflow: 'hidden',
        animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{ textAlign: 'center', padding: '32px 24px 0' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--green-bg)', color: 'var(--green)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>🧾</div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 12 }}>Catat ke Transaksi Harian?</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6, padding: '0 8px' }}>
            Tagihan <strong style={{ color: 'var(--text)' }}>{tagihan.alasan}{tagihan.ket ? ` (${tagihan.ket})` : ''}</strong> sebesar{' '}
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--orange)', fontSize: '0.9rem' }}>{fmtRp(tagihan.nominal)}</span>
            {' '}akan dicatat sebagai pengeluaran di Transaksi Harian.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, padding: '24px', justifyContent: 'center', marginTop: 8 }}>
          <button className="btn btn-ghost" style={{ flex: 1, borderRadius: '24px', padding: '10px 0', fontWeight: 600 }} onClick={onNo}>Tidak, Skip</button>
          <button className="btn btn-primary" style={{ flex: 1, borderRadius: '24px', padding: '10px 0', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onClick={onYes}>Ya, Catat</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function StatusBadge({ status }) {
  if (status === 'Sudah dibayar') return <span className="badge green" style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>✓ Lunas</span>;
  if (status === 'Belum dibayar') return <span className="badge red" style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>✕ Belum</span>;
  return <span className="badge yellow" style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>? Belum Pasti</span>;
}

export default function TagihanPage({ data }) {
  const { tagihan, upsertTagihan, removeTagihan, markTagihanPaid, upsertTransaksi } = data;
  const [modal, setModal] = useState(null);
  const [filterMonth, setFilterMonth] = useState(currentYearMonth());
  const [tab, setTab] = useState('semua');
  const { confirm: showConfirm, ConfirmUI } = useConfirm();
  const [konfirmasi, setKonfirmasi] = useState(null);

  const months = useMemo(() => {
    const existing = getMonths(tagihan);
    const now = new Date();
    const extra = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });
    return [...new Set([...existing, ...extra])].sort((a, b) => b.localeCompare(a)).slice(0, 18);
  }, [tagihan]);

  const inMonth = useMemo(() => filterByMonth(tagihan, filterMonth), [tagihan, filterMonth]);
  const filtered = useMemo(() => {
    let list = inMonth;
    if (tab === 'belum') list = list.filter(t => t.status !== 'Sudah dibayar');
    if (tab === 'sudah') list = list.filter(t => t.status === 'Sudah dibayar');
    return [...list].sort((a, b) => (a.batas || '').localeCompare(b.batas || ''));
  }, [inMonth, tab]);

  const totAll   = sumBy(inMonth, 'nominal');
  const totSudah = inMonth.filter(t => t.status === 'Sudah dibayar').reduce((s, x) => s + (x.nominal || 0), 0);
  const totBelum = totAll - totSudah;

  const handleSave = (item) => { upsertTagihan(item); setModal(null); };
  const handleDelete = async (id) => {
    const ok = await showConfirm({ title: 'Hapus Tagihan', message: 'Tagihan ini akan dihapus permanen.', type: 'danger' });
    if (ok) removeTagihan(id);
  };

  const handlePaid = (t) => {
    markTagihanPaid(t.id);
    setKonfirmasi(t);
  };

  const handleKonfirmasiYes = () => {
    upsertTransaksi({
      id:          genId(),
      tanggal:     today(),
      pemasukan:   0,
      sumber:      'Tidak ada',
      pengeluaran: konfirmasi.nominal,
      tujuan:      konfirmasi.alasan,
      ket:         `Bayar ${konfirmasi.alasan}${konfirmasi.ket ? ' (' + konfirmasi.ket + ')' : ''}`,
    });
    setKonfirmasi(null);
  };

  return (
    <div className="fade-in">
      {ConfirmUI}

      {konfirmasi && (
        <KonfirmasiTransaksi
          tagihan={konfirmasi}
          onYes={handleKonfirmasiYes}
          onNo={() => setKonfirmasi(null)}
        />
      )}

      {/* ── Month tabs dengan Horizontal Scroll ── */}
      <div style={{ 
        display: 'flex', overflowX: 'auto', gap: 10, marginBottom: 20, paddingBottom: 8, 
        flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' 
      }}>
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        {months.map(m => {
          const [y, mo] = m.split('-');
          return (
            <button key={m} className={`month-tab ${m === filterMonth ? 'active' : ''}`} style={{ flexShrink: 0, borderRadius: '20px' }} onClick={() => setFilterMonth(m)}>
              {monthName(parseInt(mo))} {y}
            </button>
          );
        })}
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Tagihan',  value: fmtRp(totAll),   color: 'var(--accent)', icon: '📋', sub: `${inMonth.length} tagihan` },
          { label: 'Sudah Dibayar', value: fmtRp(totSudah), color: 'var(--green)',  icon: '✅', sub: 'Lunas' },
          { label: 'Belum Dibayar', value: fmtRp(totBelum), color: totBelum > 0 ? 'var(--red)' : 'var(--green)', icon: '⏳', sub: totBelum > 0 ? 'Perlu dibayar' : 'Semua lunas ✓' },
        ].map((s, i) => (
          <div key={i} style={{ 
            background: 'var(--card)', border: '1px solid var(--border)', 
            borderRadius: 16, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            display: 'flex', flexDirection: 'column', gap: 4
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: '1.1rem' }}>{s.icon}</div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text3)' }}>{s.label}</div>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '1.3rem', color: s.color, margin: '4px 0' }}>{s.value}</div>
            <div style={{ fontSize: '0.71rem', color: 'var(--text3)', fontWeight: 500 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Tabel ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>
        
        {/* Tab Filter + Tombol Tambah Bersih (Tanpa background abu-abu) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 24px 0', borderBottom: '1px solid var(--border)', background: 'transparent' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {[['semua','Semua'],['belum','Belum Dibayar'],['sudah','Sudah Dibayar']].map(([k,l]) =>
              <button key={k} onClick={() => setTab(k)} style={{
                background: 'none', border: 'none', padding: '16px 0', cursor: 'pointer',
                fontWeight: tab === k ? 700 : 500,
                fontSize: '0.85rem',
                color: tab === k ? 'var(--accent)' : 'var(--text3)',
                borderBottom: tab === k ? '3px solid var(--accent)' : '3px solid transparent',
                marginBottom: '-1px', transition: 'all 0.2s'
              }}>
                {l}
              </button>
            )}
          </div>
          
          <button className="btn btn-primary" style={{ borderRadius: '24px', padding: '8px 18px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 10px rgba(0,0,0,0.08)', marginBottom: '8px' }} onClick={() => setModal({ item: null })}>
            <span style={{ fontSize: '1.1rem', lineHeight: 1, paddingBottom: '2px' }}>＋</span> Tambah Tagihan
          </button>
        </div>

        <div className="table-wrap mobile-hide">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', background: 'transparent' }}>
                <th style={{ background: 'transparent', width: 100, padding: '16px 24px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tanggal</th>
                <th style={{ background: 'transparent', padding: '16px 24px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Jenis &amp; Keterangan</th>
                <th style={{ background: 'transparent', textAlign: 'right', width: 150, padding: '16px 24px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nominal</th>
                <th style={{ background: 'transparent', width: 120, padding: '16px 24px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Batas Bayar</th>
                <th style={{ background: 'transparent', width: 110, padding: '16px 24px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                <th style={{ background: 'transparent', width: 150, padding: '16px 24px', textAlign: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text3)', padding: 60, fontSize: '0.85rem' }}>Tidak ada tagihan di kategori ini</td></tr>
              ) : filtered.map(t => {
                const overdue = t.batas && t.batas < today() && t.status !== 'Sudah dibayar';
                const lunas   = t.status === 'Sudah dibayar';
                return (
                  // Background row disetel full transparent, tidak ada lagi bg kelabu walau sudah lunas
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s', background: 'transparent' }}>
                    <td style={{ padding: '16px 24px', fontSize: '0.76rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{fmtDate(t.tanggal)}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)' }}>{t.alasan}</div>
                      {t.ket && <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>{t.ket}</div>}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.88rem', color: lunas ? 'var(--text3)' : 'var(--orange)' }}>
                      {fmtRp(t.nominal)}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.78rem', color: overdue ? 'var(--red)' : 'var(--text3)', fontWeight: overdue ? 700 : 400, whiteSpace: 'nowrap' }}>
                      {t.batas ? fmtDate(t.batas) : <span style={{ color: 'var(--border2)' }}>—</span>}
                      {overdue && ' ⚠'}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <StatusBadge status={t.status} />
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                        {!lunas && (
                          <button className="btn btn-success btn-sm" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px' }} onClick={() => handlePaid(t)}>✓ Bayar</button>
                        )}
                        <button className="btn btn-ghost btn-sm" style={{ padding: '6px 10px' }} onClick={() => setModal({ item: t })} title="Edit">✎</button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '6px 10px', color: 'var(--red)' }} onClick={() => handleDelete(t.id)} title="Hapus">✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <TagihanForm item={modal.item} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
