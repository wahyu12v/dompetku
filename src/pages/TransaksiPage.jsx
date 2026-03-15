// import { useState, useMemo } from 'react';
// import Modal from '../components/Modal';
// import { useConfirm } from '../components/ConfirmDialog';
// import { fmtRp, fmtDate, monthName } from '../utils/format';
// import RupiahInput from '../components/RupiahInput';
// import { filterByMonth, sumBy, getMonths, currentYearMonth, today, genId } from '../utils/helpers';

// // ── Forms ──────────────────────────────────────────────────
// function PemasukanForm({ item, sumberOptions, onSave, onClose }) {
//   const [form, setForm] = useState(item
//     ? { ...item, pemasukan: item.pemasukan || 0 }
//     : { tanggal: today(), pemasukan: 0, sumber: sumberOptions[0] || 'Jasa Freelance', ket: '' }
//   );
//   const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
//   const save = () => onSave({ ...form, id: form.id || genId(), pemasukan: Number(form.pemasukan) || 0, pengeluaran: 0, tujuan: 'Tidak ada pengeluaran' });
//   return (
//     <Modal title={item ? 'Edit Pemasukan' : '+ Tambah Pemasukan'} onClose={onClose} onSave={save}>
//       <div className="form-grid">
//         <div className="form-group"><label className="form-label">Tanggal</label><input type="date" className="form-input" value={form.tanggal} onChange={set('tanggal')} /></div>
//         <div className="form-group"><label className="form-label">Jumlah (Rp)</label><RupiahInput value={form.pemasukan} onChange={v => setForm(f => ({ ...f, pemasukan: v }))} /></div>
//         <div className="form-group full"><label className="form-label">Sumber</label><select className="form-select" value={form.sumber} onChange={set('sumber')}>{sumberOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
//         <div className="form-group full"><label className="form-label">Keterangan</label><input className="form-input" placeholder="Opsional" value={form.ket} onChange={set('ket')} /></div>
//       </div>
//     </Modal>
//   );
// }

// function PengeluaranForm({ item, tujuanOptions, onSave, onClose }) {
//   const [form, setForm] = useState(item
//     ? { ...item, pengeluaran: item.pengeluaran || 0 }
//     : { tanggal: today(), pengeluaran: 0, tujuan: tujuanOptions[0] || 'Beli Kebutuhan', ket: '' }
//   );
//   const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
//   const save = () => onSave({ ...form, id: form.id || genId(), pengeluaran: Number(form.pengeluaran) || 0, pemasukan: 0, sumber: 'Tidak ada' });
//   return (
//     <Modal title={item ? 'Edit Pengeluaran' : '- Tambah Pengeluaran'} onClose={onClose} onSave={save}>
//       <div className="form-grid">
//         <div className="form-group"><label className="form-label">Tanggal</label><input type="date" className="form-input" value={form.tanggal} onChange={set('tanggal')} /></div>
//         <div className="form-group"><label className="form-label">Jumlah (Rp)</label><RupiahInput value={form.pengeluaran} onChange={v => setForm(f => ({ ...f, pengeluaran: v }))} /></div>
//         <div className="form-group full"><label className="form-label">Tujuan</label><select className="form-select" value={form.tujuan} onChange={set('tujuan')}>{tujuanOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
//         <div className="form-group full"><label className="form-label">Keterangan</label><input className="form-input" placeholder="Opsional" value={form.ket} onChange={set('ket')} /></div>
//       </div>
//     </Modal>
//   );
// }

// function EditForm({ item, sumberOptions, tujuanOptions, onSave, onClose }) {
//   const [form, setForm] = useState({ ...item, pemasukan: item.pemasukan || 0, pengeluaran: item.pengeluaran || 0 });
//   const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
//   const save = () => onSave({ ...form, pemasukan: Number(form.pemasukan) || 0, pengeluaran: Number(form.pengeluaran) || 0 });
//   return (
//     <Modal title="Edit Transaksi" onClose={onClose} onSave={save}>
//       <div className="form-grid">
//         <div className="form-group"><label className="form-label">Tanggal</label><input type="date" className="form-input" value={form.tanggal} onChange={set('tanggal')} /></div>
//         <div className="form-group"><label className="form-label">Pemasukan (Rp)</label><RupiahInput value={Number(form.pemasukan)||0} onChange={v => setForm(f => ({ ...f, pemasukan: v }))} /></div>
//         <div className="form-group"><label className="form-label">Sumber</label><select className="form-select" value={form.sumber} onChange={set('sumber')}>{sumberOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
//         <div className="form-group"><label className="form-label">Pengeluaran (Rp)</label><RupiahInput value={Number(form.pengeluaran)||0} onChange={v => setForm(f => ({ ...f, pengeluaran: v }))} /></div>
//         <div className="form-group"><label className="form-label">Tujuan</label><select className="form-select" value={form.tujuan} onChange={set('tujuan')}>{tujuanOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
//         <div className="form-group"><label className="form-label">Keterangan</label><input className="form-input" value={form.ket || ''} onChange={set('ket')} /></div>
//       </div>
//     </Modal>
//   );
// }

// // ── Mobile card ────────────────────────────────────────────
// function TxCard({ t, onEdit, onDelete }) {
//   const isPms = t.pemasukan > 0;
//   return (
//     <div style={{
//       background: 'var(--card)', border: '1px solid var(--border)',
//       borderRadius: 12, padding: '12px 14px', boxShadow: 'var(--shadow)',
//       borderLeft: `3px solid ${isPms ? 'var(--green)' : 'var(--red)'}`,
//     }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
//         <div>
//           <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{isPms ? t.sumber : t.tujuan}</div>
//           <div style={{ fontSize: '0.71rem', color: 'var(--text3)', marginTop: 2 }}>{fmtDate(t.tanggal)}</div>
//         </div>
//         <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
//           <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.92rem', color: isPms ? 'var(--green)' : 'var(--red)' }}>
//             {isPms ? `+${fmtRp(t.pemasukan)}` : `-${fmtRp(t.pengeluaran)}`}
//           </div>
//           <button className="btn btn-ghost btn-sm" onClick={() => onEdit(t)}>✎</button>
//           <button className="btn btn-danger btn-sm" onClick={() => onDelete(t.id)}>✕</button>
//         </div>
//       </div>
//       {t.ket && <div style={{ fontSize: '0.71rem', color: 'var(--text3)', borderTop: '1px solid var(--border)', paddingTop: 5, marginTop: 4 }}>{t.ket}</div>}
//     </div>
//   );
// }

// // ── Stat mini card ─────────────────────────────────────────
// function MiniStat({ label, value, color, sub }) {
//   return (
//     <div style={{
//       background: 'var(--card)', border: '1px solid var(--border)',
//       borderRadius: 12, padding: '16px 20px',
//       borderTop: `3px solid ${color}`,
//       boxShadow: 'var(--shadow)',
//     }}>
//       <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text3)', marginBottom: 6 }}>{label}</div>
//       <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '1.2rem', color }}>{value}</div>
//       {sub && <div style={{ fontSize: '0.71rem', color: 'var(--text3)', marginTop: 4 }}>{sub}</div>}
//     </div>
//   );
// }

// // ── Main ───────────────────────────────────────────────────
// export default function TransaksiPage({ data }) {
//   const { transaksi, upsertTransaksi, removeTransaksi, kategori } = data;
//   const sumberOptions = kategori?.sumber || [];
//   const tujuanOptions = kategori?.tujuan || [];
//   const [modal, setModal]           = useState(null);
//   const [filterMonth, setFilterMonth] = useState(currentYearMonth());
//   const [search, setSearch]         = useState('');
//   const { confirm: showConfirm, ConfirmUI } = useConfirm();

//   const months = useMemo(() => {
//     const existing = getMonths(transaksi);
//     const now = new Date();
//     const extra = Array.from({ length: 6 }, (_, i) => {
//       const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
//       return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
//     });
//     return [...new Set([...existing, ...extra])].sort((a, b) => b.localeCompare(a)).slice(0, 18);
//   }, [transaksi]);

//   const filtered = useMemo(() => {
//     const q = search.toLowerCase();
//     return filterByMonth(transaksi, filterMonth)
//       .filter(t => !q || [t.sumber, t.tujuan, t.ket].some(v => (v || '').toLowerCase().includes(q)))
//       .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
//   }, [transaksi, filterMonth, search]);

//   const totPms   = sumBy(filtered, 'pemasukan');
//   const totPgl   = sumBy(filtered, 'pengeluaran');
//   const selisih  = totPms - totPgl;

//   const handleSave   = (item) => { upsertTransaksi(item); setModal(null); };
//   const handleDelete = async (id) => {
//     const ok = await showConfirm({ title: 'Hapus Transaksi', message: 'Transaksi ini akan dihapus permanen.', type: 'danger' });
//     if (ok) removeTransaksi(id);
//   };

//   return (
//     <div className="fade-in">
//       {ConfirmUI}

//       {/* ── Toolbar ── */}
//       <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
//         <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 320 }}>
//           <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', fontSize: '0.9rem', pointerEvents: 'none' }}>🔍</span>
//           <input
//             className="form-input"
//             style={{ paddingLeft: 34 }}
//             placeholder="Cari transaksi..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//         </div>
//         <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
//           <button className="btn btn-success" onClick={() => setModal({ type: 'pms', item: null })}>＋ Pemasukan</button>
//           <button className="btn btn-danger"  onClick={() => setModal({ type: 'pgl', item: null })}>－ Pengeluaran</button>
//         </div>
//       </div>

//       {/* ── Month tabs ── */}
//       <div className="month-tabs" style={{ marginBottom: 16 }}>
//         {months.map(m => {
//           const [y, mo] = m.split('-');
//           return (
//             <button key={m} className={`month-tab ${m === filterMonth ? 'active' : ''}`} onClick={() => setFilterMonth(m)}>
//               {monthName(parseInt(mo))} {y}
//             </button>
//           );
//         })}
//       </div>

//       {/* ── Stat cards ── */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
//         <MiniStat label="Total Pemasukan"  value={fmtRp(totPms)}   color="var(--green)"  sub={`${filtered.filter(t => t.pemasukan > 0).length} transaksi masuk`} />
//         <MiniStat label="Total Pengeluaran" value={fmtRp(totPgl)}  color="var(--red)"    sub={`${filtered.filter(t => t.pengeluaran > 0).length} transaksi keluar`} />
//         <MiniStat label="Selisih Bersih"   value={fmtRp(selisih)}  color={selisih >= 0 ? 'var(--green)' : 'var(--red)'} sub="Pemasukan − Pengeluaran" />
//       </div>

//       {/* ── Tabel desktop ── */}
//       <div className="card">
//         <div className="table-wrap mobile-hide">
//           <table>
//             <thead>
//               <tr>
//                 <th style={{ width: 100 }}>Tanggal</th>
//                 <th>Deskripsi</th>
//                 <th style={{ textAlign: 'right', width: 140 }}>Pemasukan</th>
//                 <th style={{ textAlign: 'right', width: 140 }}>Pengeluaran</th>
//                 <th style={{ width: 80 }}>Aksi</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length === 0 ? (
//                 <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text3)', padding: 40, fontSize: '0.85rem' }}>Belum ada transaksi bulan ini</td></tr>
//               ) : filtered.map(t => {
//                 const isPms = t.pemasukan > 0;
//                 return (
//                   <tr key={t.id}>
//                     {/* Tanggal */}
//                     <td style={{ fontSize: '0.76rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>
//                       {fmtDate(t.tanggal)}
//                     </td>
//                     {/* Deskripsi: gabung sumber/tujuan + keterangan */}
//                     <td>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                         <span style={{
//                           display: 'inline-block', width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
//                           background: isPms ? 'var(--green)' : 'var(--red)',
//                         }} />
//                         <div>
//                           <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
//                             {isPms ? t.sumber : t.tujuan}
//                           </div>
//                           {t.ket && (
//                             <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 1 }}>{t.ket}</div>
//                           )}
//                         </div>
//                       </div>
//                     </td>
//                     {/* Pemasukan */}
//                     <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 600, fontSize: '0.85rem', color: isPms ? 'var(--green)' : 'var(--text3)' }}>
//                       {isPms ? `+${fmtRp(t.pemasukan)}` : '—'}
//                     </td>
//                     {/* Pengeluaran */}
//                     <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 600, fontSize: '0.85rem', color: !isPms && t.pengeluaran > 0 ? 'var(--red)' : 'var(--text3)' }}>
//                       {t.pengeluaran > 0 ? `-${fmtRp(t.pengeluaran)}` : '—'}
//                     </td>
//                     {/* Aksi */}
//                     <td>
//                       <div style={{ display: 'flex', gap: 5 }}>
//                         <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: 'edit', item: t })}>✎</button>
//                         <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>✕</button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* ── Mobile card list ── */}
//         <div className="mobile-card-list" style={{ display: 'none', padding: '12px' }}>
//           {filtered.length === 0
//             ? <div className="empty-state"><p>Belum ada transaksi</p></div>
//             : filtered.map(t => <TxCard key={t.id} t={t} onEdit={x => setModal({ type: 'edit', item: x })} onDelete={handleDelete} />)
//           }
//         </div>
//       </div>

//       {modal?.type === 'pms'  && <PemasukanForm   item={modal.item} sumberOptions={sumberOptions} onSave={handleSave} onClose={() => setModal(null)} />}
//       {modal?.type === 'pgl'  && <PengeluaranForm item={modal.item} tujuanOptions={tujuanOptions}  onSave={handleSave} onClose={() => setModal(null)} />}
//       {modal?.type === 'edit' && <EditForm        item={modal.item} sumberOptions={sumberOptions} tujuanOptions={tujuanOptions} onSave={handleSave} onClose={() => setModal(null)} />}
//     </div>
//   );
// }


import { useState, useMemo } from 'react';
import Modal from '../components/Modal';
import { useConfirm } from '../components/ConfirmDialog';
import { fmtRp, fmtDate, monthName } from '../utils/format';
import RupiahInput from '../components/RupiahInput';
import { filterByMonth, sumBy, getMonths, currentYearMonth, today, genId } from '../utils/helpers';

// ── Forms ──────────────────────────────────────────────────
function PemasukanForm({ item, sumberOptions, onSave, onClose }) {
  const [form, setForm] = useState(item
    ? { ...item, pemasukan: item.pemasukan || 0 }
    : { tanggal: today(), pemasukan: 0, sumber: sumberOptions[0] || 'Jasa Freelance', ket: '' }
  );
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const save = () => onSave({ ...form, id: form.id || genId(), pemasukan: Number(form.pemasukan) || 0, pengeluaran: 0, tujuan: 'Tidak ada pengeluaran' });
  return (
    <Modal title={item ? 'Edit Pemasukan' : '+ Tambah Pemasukan'} onClose={onClose} onSave={save}>
      <div className="form-grid">
        <div className="form-group"><label className="form-label">Tanggal</label><input type="date" className="form-input" value={form.tanggal} onChange={set('tanggal')} /></div>
        <div className="form-group"><label className="form-label">Jumlah (Rp)</label><RupiahInput value={form.pemasukan} onChange={v => setForm(f => ({ ...f, pemasukan: v }))} /></div>
        <div className="form-group full"><label className="form-label">Sumber</label><select className="form-select" value={form.sumber} onChange={set('sumber')}>{sumberOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
        <div className="form-group full"><label className="form-label">Keterangan</label><input className="form-input" placeholder="Opsional" value={form.ket} onChange={set('ket')} /></div>
      </div>
    </Modal>
  );
}

function PengeluaranForm({ item, tujuanOptions, onSave, onClose }) {
  const [form, setForm] = useState(item
    ? { ...item, pengeluaran: item.pengeluaran || 0 }
    : { tanggal: today(), pengeluaran: 0, tujuan: tujuanOptions[0] || 'Beli Kebutuhan', ket: '' }
  );
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const save = () => onSave({ ...form, id: form.id || genId(), pengeluaran: Number(form.pengeluaran) || 0, pemasukan: 0, sumber: 'Tidak ada' });
  return (
    <Modal title={item ? 'Edit Pengeluaran' : '- Tambah Pengeluaran'} onClose={onClose} onSave={save}>
      <div className="form-grid">
        <div className="form-group"><label className="form-label">Tanggal</label><input type="date" className="form-input" value={form.tanggal} onChange={set('tanggal')} /></div>
        <div className="form-group"><label className="form-label">Jumlah (Rp)</label><RupiahInput value={form.pengeluaran} onChange={v => setForm(f => ({ ...f, pengeluaran: v }))} /></div>
        <div className="form-group full"><label className="form-label">Tujuan</label><select className="form-select" value={form.tujuan} onChange={set('tujuan')}>{tujuanOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
        <div className="form-group full"><label className="form-label">Keterangan</label><input className="form-input" placeholder="Opsional" value={form.ket} onChange={set('ket')} /></div>
      </div>
    </Modal>
  );
}

function EditForm({ item, sumberOptions, tujuanOptions, onSave, onClose }) {
  const [form, setForm] = useState({ ...item, pemasukan: item.pemasukan || 0, pengeluaran: item.pengeluaran || 0 });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const save = () => onSave({ ...form, pemasukan: Number(form.pemasukan) || 0, pengeluaran: Number(form.pengeluaran) || 0 });
  return (
    <Modal title="Edit Transaksi" onClose={onClose} onSave={save}>
      <div className="form-grid">
        <div className="form-group"><label className="form-label">Tanggal</label><input type="date" className="form-input" value={form.tanggal} onChange={set('tanggal')} /></div>
        <div className="form-group"><label className="form-label">Pemasukan (Rp)</label><RupiahInput value={Number(form.pemasukan)||0} onChange={v => setForm(f => ({ ...f, pemasukan: v }))} /></div>
        <div className="form-group"><label className="form-label">Sumber</label><select className="form-select" value={form.sumber} onChange={set('sumber')}>{sumberOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
        <div className="form-group"><label className="form-label">Pengeluaran (Rp)</label><RupiahInput value={Number(form.pengeluaran)||0} onChange={v => setForm(f => ({ ...f, pengeluaran: v }))} /></div>
        <div className="form-group"><label className="form-label">Tujuan</label><select className="form-select" value={form.tujuan} onChange={set('tujuan')}>{tujuanOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
        <div className="form-group"><label className="form-label">Keterangan</label><input className="form-input" value={form.ket || ''} onChange={set('ket')} /></div>
      </div>
    </Modal>
  );
}

// ── Mobile card ────────────────────────────────────────────
function TxCard({ t, onEdit, onDelete }) {
  const isPms = t.pemasukan > 0;
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '12px 14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      borderLeft: `3px solid ${isPms ? 'var(--green)' : 'var(--red)'}`,
      marginBottom: '8px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{isPms ? t.sumber : t.tujuan}</div>
          <div style={{ fontSize: '0.71rem', color: 'var(--text3)', marginTop: 2 }}>{fmtDate(t.tanggal)}</div>
        </div>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.92rem', color: isPms ? 'var(--green)' : 'var(--red)' }}>
            {isPms ? `+${fmtRp(t.pemasukan)}` : `-${fmtRp(t.pengeluaran)}`}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onEdit(t)}>✎</button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(t.id)}>✕</button>
        </div>
      </div>
      {t.ket && <div style={{ fontSize: '0.71rem', color: 'var(--text3)', borderTop: '1px solid var(--border)', paddingTop: 5, marginTop: 4 }}>{t.ket}</div>}
    </div>
  );
}

// ── Stat mini card ─────────────────────────────────────────
function MiniStat({ label, value, color, sub, icon }) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '16px 20px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
      display: 'flex', flexDirection: 'column', gap: 4
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: '1rem' }}>{icon}</div>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text3)' }}>{label}</div>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '1.2rem', color }}>{value}</div>
      {sub && <div style={{ fontSize: '0.71rem', color: 'var(--text3)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────
export default function TransaksiPage({ data }) {
  const { transaksi, upsertTransaksi, removeTransaksi, kategori } = data;
  const sumberOptions = kategori?.sumber || [];
  const tujuanOptions = kategori?.tujuan || [];
  const [modal, setModal]           = useState(null);
  const [filterMonth, setFilterMonth] = useState(currentYearMonth());
  const [search, setSearch]         = useState('');
  const { confirm: showConfirm, ConfirmUI } = useConfirm();

  const months = useMemo(() => {
    const existing = getMonths(transaksi);
    const now = new Date();
    const extra = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });
    return [...new Set([...existing, ...extra])].sort((a, b) => b.localeCompare(a)).slice(0, 18);
  }, [transaksi]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return filterByMonth(transaksi, filterMonth)
      .filter(t => !q || [t.sumber, t.tujuan, t.ket].some(v => (v || '').toLowerCase().includes(q)))
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [transaksi, filterMonth, search]);

  const totPms   = sumBy(filtered, 'pemasukan');
  const totPgl   = sumBy(filtered, 'pengeluaran');
  const selisih  = totPms - totPgl;

  const handleSave   = (item) => { upsertTransaksi(item); setModal(null); };
  const handleDelete = async (id) => {
    const ok = await showConfirm({ title: 'Hapus Transaksi', message: 'Transaksi ini akan dihapus permanen.', type: 'danger' });
    if (ok) removeTransaksi(id);
  };

  return (
    <div className="fade-in">
      {ConfirmUI}

      {/* ── Toolbar Baru Tanpa Kotak Wrapper ── */}
      <div style={{ 
        display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center'
      }}>
        {/* Search Bar menyatu dengan background */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', fontSize: '0.9rem', pointerEvents: 'none' }}>🔍</span>
          <input
            className="form-input"
            style={{ 
              paddingLeft: 42, paddingRight: 16, paddingTop: 10, paddingBottom: 10,
              borderRadius: '24px', border: '1px solid var(--border)', background: 'var(--card)',
              width: '100%', fontSize: '0.85rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}
            placeholder="Cari transaksi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        {/* Tombol Aksi bergaya Kapsul/Pill agar senada dengan search */}
        <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
          <button className="btn btn-success" style={{ borderRadius: '24px', padding: '10px 18px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }} onClick={() => setModal({ type: 'pms', item: null })}>
            <span>＋</span> Pemasukan
          </button>
          <button className="btn btn-danger" style={{ borderRadius: '24px', padding: '10px 18px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }} onClick={() => setModal({ type: 'pgl', item: null })}>
            <span>－</span> Pengeluaran
          </button>
        </div>
      </div>

      {/* ── Month tabs ── */}
      <div className="month-tabs" style={{ marginBottom: 16 }}>
        {months.map(m => {
          const [y, mo] = m.split('-');
          return (
            <button key={m} className={`month-tab ${m === filterMonth ? 'active' : ''}`} onClick={() => setFilterMonth(m)}>
              {monthName(parseInt(mo))} {y}
            </button>
          );
        })}
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <MiniStat label="Total Pemasukan"  value={fmtRp(totPms)}   color="var(--green)"  icon="📥" sub={`${filtered.filter(t => t.pemasukan > 0).length} transaksi masuk`} />
        <MiniStat label="Total Pengeluaran" value={fmtRp(totPgl)}  color="var(--red)"    icon="📤" sub={`${filtered.filter(t => t.pengeluaran > 0).length} transaksi keluar`} />
        <MiniStat label="Selisih Bersih"   value={fmtRp(selisih)}  color={selisih >= 0 ? 'var(--blue)' : 'var(--red)'} icon="⚖️" sub="Pemasukan − Pengeluaran" />
      </div>

      {/* ── Tabel desktop ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
        <div className="table-wrap mobile-hide">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ width: 100, padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tanggal</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deskripsi</th>
                <th style={{ textAlign: 'right', width: 150, padding: '12px 16px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pemasukan</th>
                <th style={{ textAlign: 'right', width: 150, padding: '12px 16px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pengeluaran</th>
                <th style={{ width: 90, padding: '12px 16px', textAlign: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text3)', padding: 40, fontSize: '0.85rem' }}>Belum ada transaksi bulan ini</td></tr>
              ) : filtered.map(t => {
                const isPms = t.pemasukan > 0;
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    {/* Tanggal */}
                    <td style={{ padding: '12px 16px', fontSize: '0.76rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>
                      {fmtDate(t.tanggal)}
                    </td>
                    {/* Deskripsi: gabung sumber/tujuan + keterangan */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          display: 'inline-block', width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                          background: isPms ? 'var(--green)' : 'var(--red)',
                        }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {isPms ? t.sumber : t.tujuan}
                          </div>
                          {t.ket && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 1 }}>{t.ket}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Pemasukan */}
                    <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {isPms ? (
                        <span style={{ display: 'inline-block', background: 'var(--green-bg)', color: 'var(--green)', padding: '3px 8px', borderRadius: '6px', fontFamily: 'var(--mono)', fontWeight: 600, fontSize: '0.85rem' }}>
                          +{fmtRp(t.pemasukan)}
                        </span>
                      ) : <span style={{ color: 'var(--text3)' }}>—</span>}
                    </td>
                    {/* Pengeluaran */}
                    <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {!isPms && t.pengeluaran > 0 ? (
                        <span style={{ display: 'inline-block', background: 'var(--red-bg)', color: 'var(--red)', padding: '3px 8px', borderRadius: '6px', fontFamily: 'var(--mono)', fontWeight: 600, fontSize: '0.85rem' }}>
                          -{fmtRp(t.pengeluaran)}
                        </span>
                      ) : <span style={{ color: 'var(--text3)' }}>—</span>}
                    </td>
                    {/* Aksi */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => setModal({ type: 'edit', item: t })} title="Edit">✎</button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: '0.8rem', color: 'var(--red)' }} onClick={() => handleDelete(t.id)} title="Hapus">✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Mobile card list ── */}
        <div className="mobile-card-list" style={{ display: 'none', padding: '12px' }}>
          {filtered.length === 0
            ? <div className="empty-state"><p>Belum ada transaksi</p></div>
            : filtered.map(t => <TxCard key={t.id} t={t} onEdit={x => setModal({ type: 'edit', item: x })} onDelete={handleDelete} />)
          }
        </div>
      </div>

      {modal?.type === 'pms'  && <PemasukanForm   item={modal.item} sumberOptions={sumberOptions} onSave={handleSave} onClose={() => setModal(null)} />}
      {modal?.type === 'pgl'  && <PengeluaranForm item={modal.item} tujuanOptions={tujuanOptions}  onSave={handleSave} onClose={() => setModal(null)} />}
      {modal?.type === 'edit' && <EditForm        item={modal.item} sumberOptions={sumberOptions} tujuanOptions={tujuanOptions} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
