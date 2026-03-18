// import { useState, useMemo } from 'react';
// import Modal from '../components/Modal';
// import { useConfirm } from '../components/ConfirmDialog';
// import { fmtRp, fmtDate, monthName } from '../utils/format';
// import RupiahInput from '../components/RupiahInput';
// import { filterByMonth, sumBy, currentYearMonth, today, genId } from '../utils/helpers';

// const BULAN_SINGKAT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

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

// // ── Mobile card Diperkecil Fontnya ─────────────────────────
// function TxCard({ t, onEdit, onDelete }) {
//   const isPms = t.pemasukan > 0;
//   return (
//     <div style={{
//       background: 'var(--card)', border: '1px solid var(--border)',
//       borderRadius: '12px', padding: '12px 14px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
//       borderLeft: `4px solid ${isPms ? 'var(--green)' : 'var(--red)'}`,
//       marginBottom: '12px', boxSizing: 'border-box', width: '100%', overflow: 'hidden'
//     }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//             {isPms ? t.sumber : t.tujuan}
//           </div>
//           <div style={{ fontSize: '0.71rem', color: 'var(--text3)', marginTop: 2 }}>{fmtDate(t.tanggal)}</div>
//         </div>
//         <div style={{ flexShrink: 0, textAlign: 'right' }}>
//           <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.88rem', color: isPms ? 'var(--green)' : 'var(--red)' }}>
//             {isPms ? `+${fmtRp(t.pemasukan)}` : `-${fmtRp(t.pengeluaran)}`}
//           </div>
//         </div>
//       </div>

//       {t.ket && (
//         <div style={{ fontSize: '0.72rem', color: 'var(--text2)', marginTop: '8px', background: 'var(--bg3)', padding: '6px 10px', borderRadius: '6px', wordBreak: 'break-word', lineHeight: 1.4 }}>
//           {t.ket}
//         </div>
//       )}

//       <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '10px', gap: '6px' }}>
//         <button className="btn btn-ghost btn-sm" style={{ padding: '4px 12px', fontSize: '0.71rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '16px', fontWeight: 600 }} onClick={() => onEdit(t)}>Edit</button>
//         <button className="btn btn-ghost btn-sm" style={{ padding: '4px 12px', fontSize: '0.71rem', background: 'var(--red-bg)', color: 'var(--red)', border: '1px solid #fca5a5', borderRadius: '16px', fontWeight: 600 }} onClick={() => onDelete(t.id)}>Hapus</button>
//       </div>
//     </div>
//   );
// }

// // ── Stat mini card ─────────────────────────────────────────
// function MiniStat({ label, value, color, sub, icon }) {
//   return (
//     <div style={{
//       background: 'var(--card)', border: '1px solid var(--border)',
//       borderRadius: '12px', padding: '14px 18px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
//       display: 'flex', flexDirection: 'column', gap: 4, boxSizing: 'border-box', width: '100%'
//     }}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//         <div style={{ fontSize: '0.95rem' }}>{icon}</div>
//         <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text3)' }}>{label}</div>
//       </div>
//       <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '1.15rem', color, wordBreak: 'break-word' }}>{value}</div>
//       {sub && <div style={{ fontSize: '0.7rem', color: 'var(--text3)', fontWeight: 500 }}>{sub}</div>}
//     </div>
//   );
// }

// // ── Main ───────────────────────────────────────────────────
// export default function TransaksiPage({ data }) {
//   const { transaksi, upsertTransaksi, removeTransaksi, kategori } = data;
//   const sumberOptions = kategori?.sumber || [];
//   const tujuanOptions = kategori?.tujuan || [];
//   const [modal, setModal] = useState(null);
//   const [search, setSearch] = useState('');
//   const { confirm: showConfirm, ConfirmUI } = useConfirm();

//   const initialYM = currentYearMonth().split('-');
//   const [filterYear, setFilterYear] = useState(parseInt(initialYM[0]));
//   const [filterMonth, setFilterMonth] = useState(initialYM[1]); // format '01' - '12'
//   const activeFilterKey = `${filterYear}-${filterMonth}`;

//   const { minYear, maxYear } = useMemo(() => {
//     const years = transaksi.map(t => parseInt(t.tanggal.substring(0, 4)));
//     const currentYear = new Date().getFullYear();
//     const min = years.length > 0 ? Math.min(...years) : currentYear;
//     const max = years.length > 0 ? Math.max(...years) : currentYear;
//     return { minYear: Math.min(min, currentYear - 1), maxYear: Math.max(max, currentYear + 2) };
//   }, [transaksi]);

//   const filtered = useMemo(() => {
//     const q = search.toLowerCase();
//     return filterByMonth(transaksi, activeFilterKey)
//       .filter(t => !q || [t.sumber, t.tujuan, t.ket].some(v => (v || '').toLowerCase().includes(q)))
//       .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
//   }, [transaksi, activeFilterKey, search]);

//   const totPms   = sumBy(filtered, 'pemasukan');
//   const totPgl   = sumBy(filtered, 'pengeluaran');
//   const selisih  = totPms - totPgl;

//   const handleSave   = (item) => { upsertTransaksi(item); setModal(null); };
//   const handleDelete = async (id) => {
//     const ok = await showConfirm({ title: 'Hapus Transaksi', message: 'Transaksi ini akan dihapus permanen.', type: 'danger' });
//     if (ok) removeTransaksi(id);
//   };

//   return (
//     <div className="fade-in" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden', paddingBottom: '30px' }}>
//       {ConfirmUI}

//       {/* ── Toolbar Search & Tombol ── */}
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
//         <div style={{ flex: '1 1 250px', minWidth: 0, position: 'relative', maxWidth: '400px' }}>
//           <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', fontSize: '0.85rem', pointerEvents: 'none' }}>🔍</span>
//           <input
//             className="form-input"
//             style={{ 
//               paddingLeft: 38, paddingRight: 14, paddingTop: 8, paddingBottom: 8,
//               borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--card)',
//               width: '100%', fontSize: '0.8rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', boxSizing: 'border-box'
//             }}
//             placeholder="Cari transaksi..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//         </div>
        
//         <div style={{ flex: '1 1 250px', minWidth: 0, display: 'flex', gap: '8px' }}>
//           <button className="btn btn-success" style={{ flex: 1, minWidth: 0, borderRadius: '20px', padding: '8px 6px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, boxShadow: '0 2px 4px rgba(16, 185, 129, 0.1)' }} onClick={() => setModal({ type: 'pms', item: null })}>
//             <span style={{ fontSize: '0.9rem' }}>＋</span> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Pemasukan</span>
//           </button>
//           <button className="btn btn-danger" style={{ flex: 1, minWidth: 0, borderRadius: '20px', padding: '8px 6px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)' }} onClick={() => setModal({ type: 'pgl', item: null })}>
//             <span style={{ fontSize: '0.9rem' }}>－</span> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Pengeluaran</span>
//           </button>
//         </div>
//       </div>

//       {/* ── Filter Panel ── */}
//       <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//             <span style={{ fontSize: '1rem' }}>📅</span>
//             <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>Periode Transaksi</span>
//           </div>
          
//           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg3)', padding: '3px', borderRadius: '20px' }}>
//             <button onClick={() => setFilterYear(y => Math.max(minYear, y - 1))} disabled={filterYear <= minYear}
//               style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: filterYear <= minYear ? 'transparent' : 'var(--card)', color: filterYear <= minYear ? 'var(--border2)' : 'var(--text)', cursor: filterYear <= minYear ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', boxShadow: filterYear <= minYear ? 'none' : '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
//               ❮
//             </button>
//             <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)', minWidth: '40px', textAlign: 'center' }}>
//               {filterYear}
//             </div>
//             <button onClick={() => setFilterYear(y => Math.min(maxYear, y + 1))} disabled={filterYear >= maxYear}
//               style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: filterYear >= maxYear ? 'transparent' : 'var(--card)', color: filterYear >= maxYear ? 'var(--border2)' : 'var(--text)', cursor: filterYear >= maxYear ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', boxShadow: filterYear >= maxYear ? 'none' : '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
//               ❯
//             </button>
//           </div>
//         </div>

//         <div style={{ display: 'flex', overflowX: 'auto', gap: '6px', paddingBottom: '4px', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
//           <style>{`div::-webkit-scrollbar { display: none; }`}</style>
//           {BULAN_SINGKAT.map((b, i) => {
//             const numStr = String(i + 1).padStart(2, '0');
//             const isActive = filterMonth === numStr;
//             return (
//               <button key={numStr} onClick={() => setFilterMonth(numStr)} style={{
//                 flexShrink: 0,
//                 background: isActive ? 'var(--blue)' : 'transparent',
//                 color: isActive ? '#fff' : 'var(--text2)',
//                 border: `1px solid ${isActive ? 'var(--blue)' : 'var(--border)'}`,
//                 padding: '6px 14px', borderRadius: '20px',
//                 fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s',
//                 boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
//               }}>
//                 {b}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* ── Stat cards Flexbox ── */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '20px', width: '100%' }}>
//         <MiniStat label="Pemasukan Masuk"  value={fmtRp(totPms)}   color="var(--green)"  icon="📥" sub={`${filtered.filter(t => t.pemasukan > 0).length} transaksi`} />
//         <MiniStat label="Pengeluaran Keluar" value={fmtRp(totPgl)}  color="var(--red)"    icon="📤" sub={`${filtered.filter(t => t.pengeluaran > 0).length} transaksi`} />
//         <MiniStat label="Sisa Bersih"   value={fmtRp(selisih)}  color={selisih >= 0 ? 'var(--blue)' : 'var(--red)'} icon="⚖️" sub="Bulan ini" />
//       </div>

//       {/* ── Tabel desktop (Disembunyikan di HP) ── */}
//       <div className="card mobile-hide" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
//         <div className="table-wrap">
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ background: 'transparent', borderBottom: '1px solid var(--border)' }}>
//                 <th style={{ width: 100, padding: '12px 16px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tanggal</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deskripsi</th>
//                 <th style={{ textAlign: 'right', width: 140, padding: '12px 16px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pemasukan</th>
//                 <th style={{ textAlign: 'right', width: 140, padding: '12px 16px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pengeluaran</th>
//                 <th style={{ width: 90, padding: '12px 16px', textAlign: 'center', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aksi</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length === 0 ? (
//                 <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text3)', padding: 60, fontSize: '0.85rem' }}>Belum ada transaksi di bulan ini</td></tr>
//               ) : filtered.map(t => {
//                 const isPms = t.pemasukan > 0;
//                 return (
//                   <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
//                     <td style={{ padding: '12px 16px', fontSize: '0.74rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>
//                       {fmtDate(t.tanggal)}
//                     </td>
//                     <td style={{ padding: '12px 16px' }}>
//                       <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
//                         <span style={{
//                           display: 'inline-block', width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 4,
//                           background: isPms ? 'var(--green)' : 'var(--red)',
//                         }} />
//                         <div>
//                           <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>
//                             {isPms ? t.sumber : t.tujuan}
//                           </div>
//                           {t.ket && (
//                             <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 2 }}>{t.ket}</div>
//                           )}
//                         </div>
//                       </div>
//                     </td>
//                     <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
//                       {isPms ? (
//                         <span style={{ display: 'inline-block', background: 'var(--green-bg)', color: 'var(--green)', padding: '2px 8px', borderRadius: '6px', fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.82rem' }}>
//                           +{fmtRp(t.pemasukan)}
//                         </span>
//                       ) : <span style={{ color: 'var(--text3)' }}>—</span>}
//                     </td>
//                     <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
//                       {!isPms && t.pengeluaran > 0 ? (
//                         <span style={{ display: 'inline-block', background: 'var(--red-bg)', color: 'var(--red)', padding: '2px 8px', borderRadius: '6px', fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.82rem' }}>
//                           -{fmtRp(t.pengeluaran)}
//                         </span>
//                       ) : <span style={{ color: 'var(--text3)' }}>—</span>}
//                     </td>
//                     <td style={{ padding: '12px 16px' }}>
//                       <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
//                         <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setModal({ type: 'edit', item: t })} title="Edit">✎</button>
//                         <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--red)' }} onClick={() => handleDelete(t.id)} title="Hapus">✕</button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ── Mobile card list ── */}
//       <div className="mobile-card-list" style={{ paddingBottom: '20px' }}>
//         {filtered.length === 0
//           ? <div className="empty-state" style={{ padding: '40px 20px', border: '1px solid var(--border)', borderRadius: '12px' }}>
//               <div style={{fontSize: '2rem', marginBottom: '8px', opacity: 0.5}}>🍃</div>
//               <p style={{fontWeight: 600, fontSize: '0.85rem', color: 'var(--text2)'}}>Belum ada transaksi bulan ini</p>
//             </div>
//           : filtered.map(t => <TxCard key={t.id} t={t} onEdit={x => setModal({ type: 'edit', item: x })} onDelete={handleDelete} />)
//         }
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
import { filterByMonth, sumBy, currentYearMonth, today, genId } from '../utils/helpers';
import { METODE_BAYAR } from '../utils/constants';

const BULAN_SINGKAT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];

// ── Forms ──────────────────────────────────────────────────
function PemasukanForm({ item, sumberOptions, onSave, onClose }) {
  const [form, setForm] = useState(item
    ? { ...item, pemasukan: item.pemasukan || 0 }
    : { tanggal: today(), pemasukan: 0, sumber: sumberOptions[0] || 'Jasa Freelance', ket: '', metodeBayar: 'Cash' }
  );
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const save = () => onSave({ ...form, id: form.id || genId(), pemasukan: Number(form.pemasukan) || 0, pengeluaran: 0, tujuan: 'Tidak ada pengeluaran' });
  return (
    <Modal title={item ? 'Edit Pemasukan' : '+ Tambah Pemasukan'} onClose={onClose} onSave={save}>
      <div className="form-grid">
        <div className="form-group"><label className="form-label">Tanggal</label><input type="date" className="form-input" value={form.tanggal} onChange={set('tanggal')} /></div>
        <div className="form-group"><label className="form-label">Jumlah (Rp)</label><RupiahInput value={form.pemasukan} onChange={v => setForm(f => ({ ...f, pemasukan: v }))} /></div>
        <div className="form-group"><label className="form-label">Sumber</label><select className="form-select" value={form.sumber} onChange={set('sumber')}>{sumberOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
        <div className="form-group"><label className="form-label">Metode Terima</label><select className="form-select" value={form.metodeBayar || 'Cash'} onChange={set('metodeBayar')}>{METODE_BAYAR.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
        <div className="form-group full"><label className="form-label">Keterangan</label><input className="form-input" placeholder="Opsional" value={form.ket} onChange={set('ket')} /></div>
      </div>
    </Modal>
  );
}

function PengeluaranForm({ item, tujuanOptions, onSave, onClose }) {
  const [form, setForm] = useState(item
    ? { ...item, pengeluaran: item.pengeluaran || 0 }
    : { tanggal: today(), pengeluaran: 0, tujuan: tujuanOptions[0] || 'Beli Kebutuhan', ket: '', metodeBayar: 'Cash' }
  );
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const save = () => onSave({ ...form, id: form.id || genId(), pengeluaran: Number(form.pengeluaran) || 0, pemasukan: 0, sumber: 'Tidak ada' });
  return (
    <Modal title={item ? 'Edit Pengeluaran' : '- Tambah Pengeluaran'} onClose={onClose} onSave={save}>
      <div className="form-grid">
        <div className="form-group"><label className="form-label">Tanggal</label><input type="date" className="form-input" value={form.tanggal} onChange={set('tanggal')} /></div>
        <div className="form-group"><label className="form-label">Jumlah (Rp)</label><RupiahInput value={form.pengeluaran} onChange={v => setForm(f => ({ ...f, pengeluaran: v }))} /></div>
        <div className="form-group"><label className="form-label">Tujuan</label><select className="form-select" value={form.tujuan} onChange={set('tujuan')}>{tujuanOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
        <div className="form-group"><label className="form-label">Metode Bayar</label><select className="form-select" value={form.metodeBayar || 'Cash'} onChange={set('metodeBayar')}>{METODE_BAYAR.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
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
        <div className="form-group"><label className="form-label">Metode Bayar</label><select className="form-select" value={form.metodeBayar || 'Cash'} onChange={set('metodeBayar')}>{METODE_BAYAR.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
        <div className="form-group full"><label className="form-label">Keterangan</label><input className="form-input" value={form.ket || ''} onChange={set('ket')} /></div>
      </div>
    </Modal>
  );
}

// ── Mobile card ─────────────────────────────────────────────
function TxCard({ t, onEdit, onDelete }) {
  const isPms = t.pemasukan > 0;
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '12px 14px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
      borderLeft: `4px solid ${isPms ? 'var(--green)' : 'var(--red)'}`,
      marginBottom: '12px', boxSizing: 'border-box', width: '100%', overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {isPms ? t.sumber : t.tujuan}
          </div>
          <div style={{ fontSize: '0.71rem', color: 'var(--text3)', marginTop: 2, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span>{fmtDate(t.tanggal)}</span>
            {t.metodeBayar && <span style={{ background: 'var(--bg3)', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>{t.metodeBayar}</span>}
          </div>
        </div>
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.88rem', color: isPms ? 'var(--green)' : 'var(--red)' }}>
            {isPms ? `+${fmtRp(t.pemasukan)}` : `-${fmtRp(t.pengeluaran)}`}
          </div>
        </div>
      </div>
      {t.ket && (
        <div style={{ fontSize: '0.72rem', color: 'var(--text2)', marginTop: '8px', background: 'var(--bg3)', padding: '6px 10px', borderRadius: '6px', wordBreak: 'break-word', lineHeight: 1.4 }}>
          {t.ket}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '10px', gap: '6px' }}>
        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 12px', fontSize: '0.71rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '16px', fontWeight: 600 }} onClick={() => onEdit(t)}>Edit</button>
        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 12px', fontSize: '0.71rem', background: 'var(--red-bg)', color: 'var(--red)', border: '1px solid #fca5a5', borderRadius: '16px', fontWeight: 600 }} onClick={() => onDelete(t.id)}>Hapus</button>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color, sub, icon }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 18px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: 4, boxSizing: 'border-box', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: '0.95rem' }}>{icon}</div>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text3)' }}>{label}</div>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '1.15rem', color, wordBreak: 'break-word' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: 'var(--text3)', fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

export default function TransaksiPage({ data }) {
  const { transaksi, upsertTransaksi, removeTransaksi, kategori } = data;
  const sumberOptions = kategori?.sumber || [];
  const tujuanOptions = kategori?.tujuan || [];
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [filterMetode, setFilterMetode] = useState('');
  const { confirm: showConfirm, ConfirmUI } = useConfirm();

  const initialYM = currentYearMonth().split('-');
  const [filterYear, setFilterYear] = useState(parseInt(initialYM[0]));
  const [filterMonth, setFilterMonth] = useState(initialYM[1]);
  const activeFilterKey = `${filterYear}-${filterMonth}`;

  const { minYear, maxYear } = useMemo(() => {
    const years = transaksi.map(t => parseInt(t.tanggal.substring(0, 4)));
    const currentYear = new Date().getFullYear();
    const min = years.length > 0 ? Math.min(...years) : currentYear;
    const max = years.length > 0 ? Math.max(...years) : currentYear;
    return { minYear: Math.min(min, currentYear - 1), maxYear: Math.max(max, currentYear + 2) };
  }, [transaksi]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return filterByMonth(transaksi, activeFilterKey)
      .filter(t => !q || [t.sumber, t.tujuan, t.ket].some(v => (v || '').toLowerCase().includes(q)))
      .filter(t => !filterMetode || t.metodeBayar === filterMetode)
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [transaksi, activeFilterKey, search, filterMetode]);

  const totPms  = sumBy(filtered, 'pemasukan');
  const totPgl  = sumBy(filtered, 'pengeluaran');
  const selisih = totPms - totPgl;

  // Daftar metode unik dari transaksi bulan ini
  const metodeList = useMemo(() => {
    const set = new Set(filterByMonth(transaksi, activeFilterKey).map(t => t.metodeBayar).filter(Boolean));
    return [...set].sort();
  }, [transaksi, activeFilterKey]);

  const handleSave   = (item) => { upsertTransaksi(item); setModal(null); };
  const handleDelete = async (id) => {
    const ok = await showConfirm({ title: 'Hapus Transaksi', message: 'Transaksi ini akan dihapus permanen.', type: 'danger' });
    if (ok) removeTransaksi(id);
  };

  return (
    <div className="fade-in" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden', paddingBottom: '30px' }}>
      {ConfirmUI}

      {/* ── Toolbar ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ flex: '1 1 250px', minWidth: 0, position: 'relative', maxWidth: '400px' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', fontSize: '0.85rem', pointerEvents: 'none' }}>🔍</span>
          <input className="form-input" style={{ paddingLeft: 38, paddingRight: 14, paddingTop: 8, paddingBottom: 8, borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--card)', width: '100%', fontSize: '0.8rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', boxSizing: 'border-box' }}
            placeholder="Cari transaksi..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ flex: '1 1 250px', minWidth: 0, display: 'flex', gap: '8px' }}>
          <button className="btn btn-success" style={{ flex: 1, minWidth: 0, borderRadius: '20px', padding: '8px 6px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }} onClick={() => setModal({ type: 'pms', item: null })}>
            <span>＋</span> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Pemasukan</span>
          </button>
          <button className="btn btn-danger" style={{ flex: 1, minWidth: 0, borderRadius: '20px', padding: '8px 6px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }} onClick={() => setModal({ type: 'pgl', item: null })}>
            <span>－</span> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Pengeluaran</span>
          </button>
        </div>
      </div>

      {/* ── Filter Panel ── */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📅</span>
            <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>Periode Transaksi</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg3)', padding: '3px', borderRadius: '20px' }}>
            <button onClick={() => setFilterYear(y => Math.max(minYear, y - 1))} disabled={filterYear <= minYear}
              style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: filterYear <= minYear ? 'transparent' : 'var(--card)', color: filterYear <= minYear ? 'var(--border2)' : 'var(--text)', cursor: filterYear <= minYear ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>❮</button>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)', minWidth: '40px', textAlign: 'center' }}>{filterYear}</div>
            <button onClick={() => setFilterYear(y => Math.min(maxYear, y + 1))} disabled={filterYear >= maxYear}
              style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: filterYear >= maxYear ? 'transparent' : 'var(--card)', color: filterYear >= maxYear ? 'var(--border2)' : 'var(--text)', cursor: filterYear >= maxYear ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>❯</button>
          </div>
        </div>

        <div style={{ display: 'flex', overflowX: 'auto', gap: '6px', paddingBottom: '4px', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
          {BULAN_SINGKAT.map((b, i) => {
            const numStr = String(i + 1).padStart(2, '0');
            const isActive = filterMonth === numStr;
            return (
              <button key={numStr} onClick={() => setFilterMonth(numStr)} style={{ flexShrink: 0, background: isActive ? 'var(--blue)' : 'transparent', color: isActive ? '#fff' : 'var(--text2)', border: `1px solid ${isActive ? 'var(--blue)' : 'var(--border)'}`, padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s' }}>{b}</button>
            );
          })}
        </div>

        {/* Filter metode bayar */}
        {metodeList.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600 }}>Metode:</span>
            <button onClick={() => setFilterMetode('')} style={{ padding: '3px 10px', borderRadius: 20, border: `1px solid ${!filterMetode ? 'var(--accent2)' : 'var(--border)'}`, background: !filterMetode ? 'var(--blue-bg)' : 'transparent', color: !filterMetode ? 'var(--accent2)' : 'var(--text3)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>Semua</button>
            {metodeList.map(m => (
              <button key={m} onClick={() => setFilterMetode(m === filterMetode ? '' : m)} style={{ padding: '3px 10px', borderRadius: 20, border: `1px solid ${filterMetode === m ? 'var(--accent2)' : 'var(--border)'}`, background: filterMetode === m ? 'var(--blue-bg)' : 'transparent', color: filterMetode === m ? 'var(--accent2)' : 'var(--text3)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>{m}</button>
            ))}
          </div>
        )}
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '20px', width: '100%' }}>
        <MiniStat label="Pemasukan Masuk"    value={fmtRp(totPms)}  color="var(--green)" icon="📥" sub={`${filtered.filter(t => t.pemasukan > 0).length} transaksi`} />
        <MiniStat label="Pengeluaran Keluar" value={fmtRp(totPgl)}  color="var(--red)"   icon="📤" sub={`${filtered.filter(t => t.pengeluaran > 0).length} transaksi`} />
        <MiniStat label="Sisa Bersih"        value={fmtRp(selisih)} color={selisih >= 0 ? 'var(--blue)' : 'var(--red)'} icon="⚖️" sub="Bulan ini" />
      </div>

      {/* ── Tabel desktop ── */}
      <div className="card mobile-hide" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
        <div className="table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'transparent', borderBottom: '1px solid var(--border)' }}>
                <th style={{ width: 100, padding: '12px 16px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tanggal</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deskripsi</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Metode</th>
                <th style={{ textAlign: 'right', width: 140, padding: '12px 16px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pemasukan</th>
                <th style={{ textAlign: 'right', width: 140, padding: '12px 16px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pengeluaran</th>
                <th style={{ width: 90, padding: '12px 16px', textAlign: 'center', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text3)', padding: 60, fontSize: '0.85rem' }}>Belum ada transaksi di bulan ini</td></tr>
              ) : filtered.map(t => {
                const isPms = t.pemasukan > 0;
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontSize: '0.74rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{fmtDate(t.tanggal)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 4, background: isPms ? 'var(--green)' : 'var(--red)' }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>{isPms ? t.sumber : t.tujuan}</div>
                          {t.ket && <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 2 }}>{t.ket}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {t.metodeBayar && (
                        <span style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600, color: 'var(--text2)', whiteSpace: 'nowrap' }}>{t.metodeBayar}</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {isPms ? (<span style={{ display: 'inline-block', background: 'var(--green-bg)', color: 'var(--green)', padding: '2px 8px', borderRadius: '6px', fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.82rem' }}>+{fmtRp(t.pemasukan)}</span>) : <span style={{ color: 'var(--text3)' }}>—</span>}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {!isPms && t.pengeluaran > 0 ? (<span style={{ display: 'inline-block', background: 'var(--red-bg)', color: 'var(--red)', padding: '2px 8px', borderRadius: '6px', fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.82rem' }}>-{fmtRp(t.pengeluaran)}</span>) : <span style={{ color: 'var(--text3)' }}>—</span>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setModal({ type: 'edit', item: t })}>✎</button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--red)' }} onClick={() => handleDelete(t.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile card list ── */}
      <div className="mobile-card-list" style={{ paddingBottom: '20px' }}>
        {filtered.length === 0
          ? <div className="empty-state" style={{ padding: '40px 20px', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.5 }}>🍃</div>
              <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text2)' }}>Belum ada transaksi bulan ini</p>
            </div>
          : filtered.map(t => <TxCard key={t.id} t={t} onEdit={x => setModal({ type: 'edit', item: x })} onDelete={handleDelete} />)
        }
      </div>

      {modal?.type === 'pms'  && <PemasukanForm   item={modal.item} sumberOptions={sumberOptions} onSave={handleSave} onClose={() => setModal(null)} />}
      {modal?.type === 'pgl'  && <PengeluaranForm item={modal.item} tujuanOptions={tujuanOptions}  onSave={handleSave} onClose={() => setModal(null)} />}
      {modal?.type === 'edit' && <EditForm        item={modal.item} sumberOptions={sumberOptions} tujuanOptions={tujuanOptions} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
