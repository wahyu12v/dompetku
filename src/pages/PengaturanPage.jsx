// import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
// import { useConfirm } from '../components/ConfirmDialog';

// function useMobile(bp = 640) {
//   const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < bp);
//   useEffect(() => {
//     const h = () => setMobile(window.innerWidth < bp);
//     window.addEventListener('resize', h);
//     return () => window.removeEventListener('resize', h);
//   }, [bp]);
//   return mobile;
// }

// // ── Design tokens for setting rows ────────────────────────
// const ROW_COLORS = {
//   blue:   { bg: '#dbeafe', icon: '#2563eb' },
//   green:  { bg: '#dcfce7', icon: '#059669' },
//   red:    { bg: '#fee2e2', icon: '#dc2626' },
//   orange: { bg: '#ffedd5', icon: '#ea580c' },
//   purple: { bg: '#ede9fe', icon: '#7c3aed' },
//   yellow: { bg: '#fef3c7', icon: '#d97706' },
//   teal:   { bg: '#ccfbf1', icon: '#0d9488' },
//   pink:   { bg: '#fce7f3', icon: '#db2777' },
// };

// // ── Setting Row (iOS-style) ────────────────────────────────
// function SettingRow({ icon, color = 'blue', label, sub, right, onClick, last = false, danger = false }) {
//   const [hov, setHov] = useState(false);
//   const c = ROW_COLORS[color] || ROW_COLORS.blue;
//   return (
//     <div
//       onClick={onClick}
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         display: 'flex', alignItems: 'center', gap: 14,
//         padding: '13px 18px',
//         borderBottom: last ? 'none' : '1px solid var(--border)',
//         background: hov && onClick ? 'var(--bg3)' : 'transparent',
//         cursor: onClick ? 'pointer' : 'default',
//         transition: 'background 0.12s',
//       }}
//     >
//       <div style={{ width: 34, height: 34, borderRadius: 9, background: danger ? '#fee2e2' : c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
//         {icon}
//       </div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{ fontWeight: 600, fontSize: '0.9rem', color: danger ? 'var(--red)' : 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
//         {sub && <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 1 }}>{sub}</div>}
//       </div>
//       {right && <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>{right}</div>}
//       {onClick && <div style={{ color: 'var(--text3)', fontSize: '0.85rem', flexShrink: 0 }}>›</div>}
//     </div>
//   );
// }

// // ── Settings Group (card container) ───────────────────────
// function SettingsGroup({ title, children }) {
//   return (
//     <div style={{ marginBottom: 20 }}>
//       {title && <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 8, paddingLeft: 4 }}>{title}</div>}
//       <div style={{ background: 'var(--card)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
//         {children}
//       </div>
//     </div>
//   );
// }

// // ── Password Input ─────────────────────────────────────────
// function PasswordInput({ value, onChange, placeholder }) {
//   const [show, setShow] = useState(false);
//   return (
//     <div style={{ position: 'relative' }}>
//       <input type={show ? 'text' : 'password'} className="form-input"
//         placeholder={placeholder} value={value} onChange={onChange}
//         style={{ paddingRight: 42 }} />
//       <button type="button" onClick={() => setShow(v => !v)} style={{
//         position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
//         background: 'none', border: 'none', cursor: 'pointer',
//         color: 'var(--text3)', fontSize: '1rem', lineHeight: 1, padding: 4,
//       }}>{show ? '🙈' : '👁️'}</button>
//     </div>
//   );
// }

// // ── Slide-up Panel (modal drawer) ─────────────────────────
// function Panel({ open, onClose, title, children }) {
//   if (!open) return null;
//   return (
//     <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
//       onClick={e => e.target === e.currentTarget && onClose()}>
//       <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
//       <div style={{
//         position: 'relative', background: 'var(--card)', borderRadius: '20px 20px 0 0',
//         width: '100%', maxWidth: 560, maxHeight: '88vh', overflowY: 'auto',
//         boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
//         animation: 'slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)',
//       }}>
//         <style>{`@keyframes slideUp { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
//         {/* Drag handle */}
//         <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
//           <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border2)' }} />
//         </div>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 20px 16px' }}>
//           <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{title}</div>
//           <button onClick={onClose} style={{ background: 'var(--bg3)', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', color: 'var(--text3)', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
//         </div>
//         <div style={{ padding: '0 20px 32px' }}>{children}</div>
//       </div>
//     </div>
//   );
// }

// // ── Panel: Edit Nama ───────────────────────────────────────
// function PanelEditNama({ user, updateName, onClose }) {
//   const [name, setName] = useState(user.name);
//   const [msg,  setMsg]  = useState({});
//   const save = () => {
//     setMsg({});
//     const err = updateName(name);
//     if (err) { setMsg({ type: 'error', text: err }); return; }
//     setMsg({ type: 'ok', text: 'Nama berhasil diperbarui!' });
//     setTimeout(onClose, 900);
//   };
//   return (
//     <>
//       {msg.text && <div className={`alert ${msg.type === 'ok' ? 'success' : 'error'} mb-3`}>{msg.text}</div>}
//       <div className="form-group" style={{ marginBottom: 12 }}>
//         <label className="form-label">Username</label>
//         <input className="form-input" value={user.username} disabled style={{ opacity: 0.5 }} />
//         <div className="form-hint">Username tidak bisa diubah</div>
//       </div>
//       <div className="form-group" style={{ marginBottom: 20 }}>
//         <label className="form-label">Nama Tampilan</label>
//         <input className="form-input" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && save()} autoFocus />
//       </div>
//       <button className="btn btn-primary w-full" onClick={save} style={{ borderRadius: 12, padding: '13px' }}>Simpan Perubahan</button>
//     </>
//   );
// }

// // ── Panel: Ubah Password ───────────────────────────────────
// function PanelPassword({ changePassword, onClose }) {
//   const [form, setForm] = useState({ lama: '', baru: '', konfirmasi: '' });
//   const [msg,  setMsg]  = useState({});
//   const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
//   const save = () => {
//     setMsg({});
//     if (!form.lama || !form.baru || !form.konfirmasi) { setMsg({ type: 'error', text: 'Semua kolom wajib diisi' }); return; }
//     if (form.baru !== form.konfirmasi) { setMsg({ type: 'error', text: 'Password baru tidak cocok' }); return; }
//     if (form.baru.length < 4) { setMsg({ type: 'error', text: 'Minimal 4 karakter' }); return; }
//     const err = changePassword(form.lama, form.baru);
//     if (err) { setMsg({ type: 'error', text: err }); return; }
//     setMsg({ type: 'ok', text: 'Password berhasil diubah!' });
//     setTimeout(onClose, 900);
//   };
//   return (
//     <>
//       {msg.text && <div className={`alert ${msg.type === 'ok' ? 'success' : 'error'} mb-3`}>{msg.text}</div>}
//       <div className="form-group" style={{ marginBottom: 12 }}>
//         <label className="form-label">Password Lama</label>
//         <PasswordInput value={form.lama} onChange={set('lama')} placeholder="Password saat ini" />
//       </div>
//       <div className="form-group" style={{ marginBottom: 12 }}>
//         <label className="form-label">Password Baru</label>
//         <PasswordInput value={form.baru} onChange={set('baru')} placeholder="Minimal 4 karakter" />
//       </div>
//       <div className="form-group" style={{ marginBottom: 20 }}>
//         <label className="form-label">Konfirmasi Password Baru</label>
//         <PasswordInput value={form.konfirmasi} onChange={set('konfirmasi')} placeholder="Ulangi password baru" />
//       </div>
//       <button className="btn btn-primary w-full" onClick={save} style={{ borderRadius: 12, padding: '13px' }}>Ganti Password</button>
//     </>
//   );
// }

// // ── Panel: Export / Import ─────────────────────────────────
// function PanelData({ data, onClose }) {
//   const [importMsg, setImportMsg] = useState(null);
//   const [preview,   setPreview]   = useState(null);
//   const [importing, setImporting] = useState(false);

//   const doExport = (type) => {
//     const exportData = { transaksi: data.transaksi, tagihan: data.tagihan, piutang: data.piutang, hutang: data.hutang, aset: data.aset, wifiIsp: data.wifiIsp, saldoAwal: data.saldoAwal, exportedAt: new Date().toISOString() };
//     let content, filename, mime;
//     if (type === 'json') {
//       content = JSON.stringify(exportData, null, 2);
//       filename = `dompetku_${new Date().toISOString().slice(0,10)}.json`;
//       mime = 'application/json';
//     } else {
//       const rows = [['Tanggal','Sumber','Pemasukan','Tujuan','Pengeluaran','Ket'], ...data.transaksi.map(t => [t.tanggal, t.sumber, t.pemasukan, t.tujuan, t.pengeluaran, t.ket||''])];
//       content = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
//       filename = `transaksi_${new Date().toISOString().slice(0,10)}.csv`;
//       mime = 'text/csv';
//     }
//     const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([content], { type: mime })), download: filename });
//     a.click();
//   };

//   const parseCSV = (text) => {
//     const lines = text.trim().split('\n').filter(Boolean);
//     if (lines.length < 2) return null;
//     const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
//     const required = ['tanggal','pemasukan','pengeluaran'];
//     const missing = required.filter(r => !headers.includes(r));
//     if (missing.length) return { error: `Kolom wajib tidak ada: ${missing.join(', ')}` };
//     const rows = lines.slice(1).map(line => {
//       const vals = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
//       const obj = {}; headers.forEach((h, idx) => { obj[h] = vals[idx] || ''; });
//       return { tanggal: obj.tanggal||'', sumber: obj.sumber||'Import CSV', pemasukan: Number(obj.pemasukan)||0, tujuan: obj.tujuan||'Tidak ada pengeluaran', pengeluaran: Number(obj.pengeluaran)||0, ket: obj.ket||'' };
//     }).filter(r => r.tanggal);
//     return { rows };
//   };

//   const handleFile = (e) => {
//     const file = e.target.files[0]; if (!file) return;
//     if (!file.name.endsWith('.csv')) { setImportMsg({ type: 'error', text: 'File harus .csv' }); return; }
//     setImportMsg(null);
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       const result = parseCSV(ev.target.result);
//       if (!result) { setImportMsg({ type: 'error', text: 'File CSV kosong atau tidak valid.' }); return; }
//       if (result.error) { setImportMsg({ type: 'error', text: result.error }); return; }
//       setPreview({ rows: result.rows, filename: file.name });
//     };
//     reader.readAsText(file); e.target.value = '';
//   };

//   const doImport = () => {
//     if (!preview) return; setImporting(true);
//     const newRows = preview.rows.map(r => ({ ...r, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) }));
//     data.setTransaksi([...data.transaksi, ...newRows]);
//     setImportMsg({ type: 'ok', text: `✓ ${newRows.length} transaksi berhasil diimport` });
//     setPreview(null); setImporting(false);
//   };

//   const stats = [
//     { label: 'Transaksi', v: data.transaksi?.length||0, color:'var(--blue)',   bg:'var(--blue-bg)',   icon:'⇄' },
//     { label: 'Tagihan',   v: data.tagihan?.length||0,   color:'var(--orange)', bg:'var(--orange-bg)', icon:'🧾' },
//     { label: 'Piutang',   v: data.piutang?.length||0,   color:'var(--yellow)', bg:'var(--yellow-bg)', icon:'💸' },
//     { label: 'Hutang',    v: data.hutang?.length||0,    color:'var(--red)',    bg:'var(--red-bg)',    icon:'🏦' },
//     { label: 'Aset',      v: data.aset?.length||0,      color:'var(--purple)', bg:'var(--purple-bg)', icon:'💎' },
//     { label: 'WiFi ISP',  v: data.wifiIsp?.length||0,   color:'var(--green)',  bg:'var(--green-bg)',  icon:'📶' },
//   ];

//   return (
//     <div>
//       {/* Stats grid */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
//         {stats.map(s => (
//           <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '12px 8px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
//             <div style={{ fontSize: '1.1rem', marginBottom: 3 }}>{s.icon}</div>
//             <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '1.15rem', color: s.color }}>{s.v}</div>
//             <div style={{ fontSize: '0.65rem', color: 'var(--text3)', fontWeight: 600, marginTop: 1 }}>{s.label}</div>
//           </div>
//         ))}
//       </div>

//       <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Export</div>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
//         {[
//           { type: 'json', icon: '📦', label: 'Export JSON — Backup Lengkap', sub: 'Semua data termasuk aset, WiFi, dll.', hc: 'var(--accent)' },
//           { type: 'csv',  icon: '📋', label: 'Export CSV — Transaksi Saja',  sub: 'Kompatibel dengan Excel / Google Sheets', hc: 'var(--green)' },
//         ].map(btn => (
//           <button key={btn.type} onClick={() => doExport(btn.type)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', background: 'var(--bg3)', border: '1.5px solid var(--border)', borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left', width: '100%' }}
//             onMouseEnter={e => { e.currentTarget.style.borderColor=btn.hc; e.currentTarget.style.background='var(--blue-bg)'; }}
//             onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--bg3)'; }}>
//             <div style={{ width:36, height:36, borderRadius:9, background:'var(--card)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0, boxShadow:'var(--shadow)' }}>{btn.icon}</div>
//             <div>
//               <div style={{ fontWeight: 700, fontSize: '0.87rem', color: 'var(--text)' }}>{btn.label}</div>
//               <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 1 }}>{btn.sub}</div>
//             </div>
//           </button>
//         ))}
//       </div>

//       <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Import CSV</div>
//       {importMsg && <div className={`alert ${importMsg.type === 'ok' ? 'success' : 'error'}`} style={{ marginBottom: 10 }}>{importMsg.text}</div>}
//       <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '20px', border: '2px dashed var(--border2)', borderRadius: 12, cursor: 'pointer', background: 'var(--bg3)', transition: 'all 0.15s', marginBottom: preview ? 14 : 0 }}
//         onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.background='var(--blue-bg)'; }}
//         onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.background='var(--bg3)'; }}>
//         <div style={{ fontSize: '1.8rem' }}>📂</div>
//         <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)' }}>Pilih file CSV</div>
//         <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>Format: Tanggal, Sumber, Pemasukan, Tujuan, Pengeluaran, Ket</div>
//         <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFile} />
//       </label>
//       {preview && (
//         <div>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
//             <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{preview.filename} · {preview.rows.length} baris</div>
//             <button className="btn btn-ghost btn-sm" onClick={() => setPreview(null)}>✕</button>
//           </div>
//           <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 12 }}>
//             <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', minWidth: 400 }}>
//               <thead><tr style={{ background: 'var(--bg3)' }}>{['Tanggal','Sumber','Masuk','Tujuan','Keluar'].map(h=><th key={h} style={{ padding:'6px 10px', textAlign:'left', fontWeight:700, textTransform:'uppercase', fontSize:'0.62rem', color:'var(--text3)', borderBottom:'1px solid var(--border)' }}>{h}</th>)}</tr></thead>
//               <tbody>
//                 {preview.rows.slice(0,4).map((r,i)=>(
//                   <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
//                     <td style={{ padding:'6px 10px', color:'var(--text3)' }}>{r.tanggal}</td>
//                     <td style={{ padding:'6px 10px' }}>{r.sumber}</td>
//                     <td style={{ padding:'6px 10px', fontFamily:'var(--mono)', color:r.pemasukan>0?'var(--green)':'var(--text3)' }}>{r.pemasukan>0?`+${r.pemasukan.toLocaleString('id-ID')}`:'—'}</td>
//                     <td style={{ padding:'6px 10px' }}>{r.tujuan}</td>
//                     <td style={{ padding:'6px 10px', fontFamily:'var(--mono)', color:r.pengeluaran>0?'var(--red)':'var(--text3)' }}>{r.pengeluaran>0?`-${r.pengeluaran.toLocaleString('id-ID')}`:'—'}</td>
//                   </tr>
//                 ))}
//                 {preview.rows.length>4&&<tr><td colSpan={5} style={{ padding:'6px 10px', textAlign:'center', color:'var(--text3)', fontStyle:'italic', fontSize:'0.7rem' }}>+{preview.rows.length-4} baris lainnya</td></tr>}
//               </tbody>
//             </table>
//           </div>
//           <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
//             <button className="btn btn-ghost" onClick={()=>setPreview(null)}>Batal</button>
//             <button className="btn btn-primary" onClick={doImport} disabled={importing} style={{ borderRadius:10 }}>
//               {importing?'Mengimport...':`⬆ Import ${preview.rows.length} Transaksi`}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Panel: Kategori ────────────────────────────────────────
// function PanelKategori({ title, icon, items, onAdd, onDelete, onEdit }) {
//   const [newVal,  setNewVal]  = useState('');
//   const [editIdx, setEditIdx] = useState(-1);
//   const [editVal, setEditVal] = useState('');
//   const doAdd = () => { const v = newVal.trim(); if (!v||items.includes(v)) return; onAdd(v); setNewVal(''); };
//   const startEdit = i => { setEditIdx(i); setEditVal(items[i]); };
//   const cancelEdit = () => { setEditIdx(-1); setEditVal(''); };
//   const saveEdit = () => { const v = editVal.trim(); if (!v) return cancelEdit(); onEdit(editIdx, v); setEditIdx(-1); setEditVal(''); };

//   return (
//     <div>
//       <div style={{ display:'flex', gap:8, marginBottom:16 }}>
//         <input className="form-input" placeholder={`Kategori ${title.toLowerCase()} baru...`} value={newVal}
//           onChange={e=>setNewVal(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doAdd()} style={{ flex:1 }} />
//         <button className="btn btn-primary" onClick={doAdd} disabled={!newVal.trim()} style={{ borderRadius:10, flexShrink:0 }}>+ Tambah</button>
//       </div>
//       {items.length === 0
//         ? <div style={{ textAlign:'center', padding:'24px', color:'var(--text3)', fontSize:'0.85rem', background:'var(--bg3)', borderRadius:12 }}>Belum ada kategori</div>
//         : (
//           <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
//             {items.map((item, idx) => (
//               <div key={`${idx}-${item}`} style={{ display:'inline-flex', alignItems:'center', gap:6, padding: editIdx===idx?'4px 6px':'6px 14px', borderRadius:20, background: editIdx===idx?'var(--blue-bg)':'var(--bg3)', border:`1.5px solid ${editIdx===idx?'var(--accent2)':'var(--border)'}`, fontSize:'0.84rem', transition:'all 0.15s' }}>
//                 {editIdx===idx ? (
//                   <>
//                     <input className="form-input" style={{ height:26, padding:'2px 8px', fontSize:'0.84rem', minWidth:80, maxWidth:140, borderRadius:6 }}
//                       value={editVal} onChange={e=>setEditVal(e.target.value)}
//                       onKeyDown={e=>{if(e.key==='Enter')saveEdit();if(e.key==='Escape')cancelEdit();}} autoFocus />
//                     <button onClick={saveEdit}   style={{ color:'var(--green)',  background:'none', border:'none', cursor:'pointer', fontWeight:700, fontSize:'1rem', lineHeight:1 }}>✓</button>
//                     <button onClick={cancelEdit} style={{ color:'var(--text3)', background:'none', border:'none', cursor:'pointer', fontSize:'1rem', lineHeight:1 }}>✕</button>
//                   </>
//                 ) : (
//                   <>
//                     <span style={{ fontWeight:600 }}>{item}</span>
//                     <button onClick={()=>startEdit(idx)} style={{ color:'var(--accent)', background:'none', border:'none', cursor:'pointer', fontSize:'0.82rem', opacity:0.7 }}>✎</button>
//                     <button onClick={()=>onDelete(idx)}  style={{ color:'var(--red)', background:'none', border:'none', cursor:'pointer', fontSize:'0.85rem', opacity:0.6 }}>✕</button>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         )
//       }
//     </div>
//   );
// }

// // ── Main Page ──────────────────────────────────────────────
// export default function PengaturanPage({ data, user, changePassword, updateName, resetData }) {
//   const { kategori, setKategori } = data;
//   const sumber = kategori?.sumber || [];
//   const tujuan = kategori?.tujuan || [];
//   const mobile = useMobile();
//   const { confirm: showConfirm, ConfirmUI } = useConfirm();

//   // Panel state
//   const [panel, setPanel] = useState(null); // 'nama' | 'password' | 'data' | 'sumber' | 'tujuan'

//   const addS = useCallback(v   => setKategori({...kategori, sumber:[...sumber,v]}),                    [kategori,sumber,setKategori]);
//   const delS = useCallback(idx => setKategori({...kategori, sumber:sumber.filter((_,i)=>i!==idx)}),   [kategori,sumber,setKategori]);
//   const edtS = useCallback((idx,v)=>{const a=[...sumber];a[idx]=v;setKategori({...kategori,sumber:a});},[kategori,sumber,setKategori]);
//   const addT = useCallback(v   => setKategori({...kategori, tujuan:[...tujuan,v]}),                    [kategori,tujuan,setKategori]);
//   const delT = useCallback(idx => setKategori({...kategori, tujuan:tujuan.filter((_,i)=>i!==idx)}),   [kategori,tujuan,setKategori]);
//   const edtT = useCallback((idx,v)=>{const a=[...tujuan];a[idx]=v;setKategori({...kategori,tujuan:a});},[kategori,tujuan,setKategori]);

//   const handleReset = async () => {
//     const ok = await showConfirm({ title: 'Reset Semua Data?', message: 'Semua data akan dihapus permanen. Tidak bisa dibatalkan!', type: 'danger' });
//     if (ok) { resetData(); window.location.reload(); }
//   };

//   const totalRecords = (data.transaksi?.length||0) + (data.tagihan?.length||0) + (data.piutang?.length||0) + (data.hutang?.length||0) + (data.aset?.length||0);

//   return (
//     <div className="fade-in" style={{ width: '100%', paddingBottom: 24 }}>
//       {ConfirmUI}

//       {/* ── Profile Card ─────────────────────────── */}
//       <div style={{
//         background: 'var(--card)', borderRadius: 16, border: '1px solid var(--border)',
//         boxShadow: 'var(--shadow)', marginBottom: 20, overflow: 'hidden',
//       }}>
//         {/* Accent bar top */}
//         <div style={{ height: 4, background: 'linear-gradient(90deg, var(--accent2), var(--purple))' }} />
//         <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 14 }}>
//           <div style={{
//             width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
//             background: 'linear-gradient(135deg, var(--accent2), var(--purple))',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: '1.4rem', fontWeight: 800, color: '#fff',
//           }}>
//             {(user.name || user.username || '?')[0].toUpperCase()}
//           </div>
//           <div style={{ flex: 1, minWidth: 0 }}>
//             <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)' }}>{user.name || user.username}</div>
//             <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>@{user.username}</div>
//             {user.createdAt && <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 1 }}>Bergabung {user.createdAt}</div>}
//           </div>
//           <button onClick={() => setPanel('nama')} className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
//             ✎ Edit
//           </button>
//         </div>
//         {/* Quick stats */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderTop: '1px solid var(--border)' }}>
//           {[
//             { label: 'Transaksi', value: data.transaksi?.length||0, color: 'var(--blue)' },
//             { label: 'Tagihan',   value: data.tagihan?.length||0,   color: 'var(--orange)' },
//             { label: 'Aset',      value: data.aset?.length||0,      color: 'var(--purple)' },
//           ].map((s, i) => (
//             <div key={s.label} style={{ padding: '12px 8px', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
//               <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '1.1rem', color: s.color }}>{s.value}</div>
//               <div style={{ fontSize: '0.65rem', color: 'var(--text3)', fontWeight: 600, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── Akun & Keamanan ───────────────────────── */}
//       <div style={{ marginBottom: 16 }}>
//         <div style={{ fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:8, paddingLeft:4 }}>Akun & Keamanan</div>
//         <div style={{ background:'var(--card)', borderRadius:16, overflow:'hidden', border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
//           <SettingRow icon="✏️" color="blue"   label="Ubah Nama Tampilan" sub={user.name}            onClick={()=>setPanel('nama')} />
//           <SettingRow icon="🔒" color="purple" label="Ganti Password"     sub="Ubah kata sandi akun" onClick={()=>setPanel('password')} last />
//         </div>
//       </div>

//       {/* ── Kategori ──────────────────────────────── */}
//       <div style={{ marginBottom: 16 }}>
//         <div style={{ fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:8, paddingLeft:4 }}>Kategori Transaksi</div>
//         <div style={{ background:'var(--card)', borderRadius:16, overflow:'hidden', border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
//           <div style={{ padding:'9px 18px', background:'var(--yellow-bg)', borderBottom:'1px solid #fcd34d', display:'flex', alignItems:'center', gap:6 }}>
//             <span style={{ fontSize:'0.78rem' }}>⚠️</span>
//             <span style={{ fontSize:'0.72rem', color:'var(--yellow2)', fontWeight:600 }}>Perubahan tidak mempengaruhi transaksi yang sudah ada</span>
//           </div>
//           <SettingRow icon="💰" color="blue"   label="Sumber Pemasukan"   sub={`${sumber.length} kategori`} onClick={()=>setPanel('sumber')} />
//           <SettingRow icon="💸" color="orange" label="Tujuan Pengeluaran" sub={`${tujuan.length} kategori`} onClick={()=>setPanel('tujuan')} last />
//         </div>
//       </div>

//       {/* ── Data & Backup ─────────────────────────── */}
//       <div style={{ marginBottom: 16 }}>
//         <div style={{ fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:8, paddingLeft:4 }}>Data & Backup</div>
//         <div style={{ background:'var(--card)', borderRadius:16, overflow:'hidden', border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
//           <SettingRow icon="📦" color="blue"  label="Export & Import Data" sub={`${totalRecords} total record tersimpan`} onClick={()=>setPanel('data')} />
//           <SettingRow icon="⬇️" color="green" label="Export JSON"          sub="Backup lengkap semua data"  onClick={()=>{ const exportData={transaksi:data.transaksi,tagihan:data.tagihan,piutang:data.piutang,hutang:data.hutang,aset:data.aset,wifiIsp:data.wifiIsp,saldoAwal:data.saldoAwal,exportedAt:new Date().toISOString()}; const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(new Blob([JSON.stringify(exportData,null,2)],{type:'application/json'})),download:`dompetku_${new Date().toISOString().slice(0,10)}.json`}); a.click(); }} />
//           <SettingRow icon="📋" color="teal"  label="Export CSV"           sub="Hanya transaksi harian"     onClick={()=>{ const rows=[['Tanggal','Sumber','Pemasukan','Tujuan','Pengeluaran','Ket'],...data.transaksi.map(t=>[t.tanggal,t.sumber,t.pemasukan,t.tujuan,t.pengeluaran,t.ket||''])]; const content=rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n'); const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(new Blob([content],{type:'text/csv'})),download:`transaksi_${new Date().toISOString().slice(0,10)}.csv`}); a.click(); }} last />
//         </div>
//       </div>

//       {/* ── Tentang & Developer ───────────────────── */}
//       <div style={{ marginBottom: 16 }}>
//         <div style={{ fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:8, paddingLeft:4 }}>Tentang</div>
//         <div style={{ background:'var(--card)', borderRadius:16, overflow:'hidden', border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
//           <SettingRow icon="🚀" color="blue"   label="Versi Aplikasi" right={<span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.82rem', color:'var(--text3)' }}>1.0.0</span>} />
//           <SettingRow icon="⚛️" color="purple" label="Framework"      right={<span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.82rem', color:'var(--text3)' }}>React + Vite</span>} />
//           <SettingRow icon="💾" color="teal"   label="Penyimpanan"    right={<span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.82rem', color:'var(--text3)' }}>Local Storage</span>} />

//           {/* Divider */}
//           <div style={{ height: 1, background: 'var(--border)', margin: '0 18px' }} />

//           {/* Developer row */}
//           <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
//             <div style={{
//               width: 42, height: 42, borderRadius: 12, flexShrink: 0,
//               background: 'linear-gradient(135deg, var(--accent2), var(--purple))',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               fontSize: '1.1rem', fontWeight: 800, color: '#fff',
//             }}>A</div>
//             <div style={{ flex: 1, minWidth: 0 }}>
//               <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>Ardian Wahyu Saputra, S.Kom</div>
//               <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>Pengembang Aplikasi</div>
//             </div>
//             <a
//               href="https://www.linkedin.com/in/ardian-wahyu-saputra-s-kom-04ab2b222/"
//               target="_blank" rel="noopener noreferrer"
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 6,
//                 padding: '7px 14px', borderRadius: 20,
//                 background: 'var(--blue-bg)', border: '1px solid #bfdbfe',
//                 color: 'var(--accent2)', fontFamily: 'var(--font)',
//                 fontWeight: 700, fontSize: '0.78rem', textDecoration: 'none',
//                 transition: 'all 0.15s', flexShrink: 0,
//               }}
//               onMouseEnter={e => { e.currentTarget.style.background='var(--accent2)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='var(--accent2)'; }}
//               onMouseLeave={e => { e.currentTarget.style.background='var(--blue-bg)'; e.currentTarget.style.color='var(--accent2)'; e.currentTarget.style.borderColor='#bfdbfe'; }}
//             >
//               <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
//               </svg>
//               LinkedIn
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* ── Zona Berbahaya ────────────────────────── */}
//       <div style={{ marginTop: 20 }}>
//         <div style={{ fontSize:'0.68rem', fontWeight:800, color:'var(--red)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:8, paddingLeft:4 }}>Zona Berbahaya</div>
//         <div style={{ background:'var(--card)', borderRadius:16, overflow:'hidden', border:'1.5px solid #fca5a5', boxShadow:'0 2px 12px rgba(220,38,38,0.07)' }}>
//           <SettingRow icon="🗑" color="red" label="Reset Semua Data" sub="Hapus semua data secara permanen" onClick={handleReset} danger last />
//         </div>
//       </div>

//       {/* ── Slide-up Panels ───────────────────────── */}
//       <Panel open={panel==='nama'}     onClose={()=>setPanel(null)} title="Edit Profil">
//         <PanelEditNama user={user} updateName={updateName} onClose={()=>setPanel(null)} />
//       </Panel>
//       <Panel open={panel==='password'} onClose={()=>setPanel(null)} title="Ganti Password">
//         <PanelPassword changePassword={changePassword} onClose={()=>setPanel(null)} />
//       </Panel>
//       <Panel open={panel==='data'}     onClose={()=>setPanel(null)} title="Export & Import Data">
//         <PanelData data={data} onClose={()=>setPanel(null)} />
//       </Panel>
//       <Panel open={panel==='sumber'}   onClose={()=>setPanel(null)} title="💰 Sumber Pemasukan">
//         <PanelKategori title="Sumber" icon="💰" items={sumber} onAdd={addS} onDelete={delS} onEdit={edtS} />
//       </Panel>
//       <Panel open={panel==='tujuan'}   onClose={()=>setPanel(null)} title="💸 Tujuan Pengeluaran">
//         <PanelKategori title="Tujuan" icon="💸" items={tujuan} onAdd={addT} onDelete={delT} onEdit={edtT} />
//       </Panel>
//     </div>
//   );
// }



import { useState, useCallback, useMemo, useEffect } from 'react';
import { useConfirm } from '../components/ConfirmDialog';

// ── Design tokens for setting rows ────────────────────────
const ROW_COLORS = {
  blue:   { bg: '#dbeafe', icon: '#2563eb' },
  green:  { bg: '#dcfce7', icon: '#059669' },
  red:    { bg: '#fee2e2', icon: '#dc2626' },
  orange: { bg: '#ffedd5', icon: '#ea580c' },
  purple: { bg: '#ede9fe', icon: '#7c3aed' },
  yellow: { bg: '#fef3c7', icon: '#d97706' },
  teal:   { bg: '#ccfbf1', icon: '#0d9488' },
  pink:   { bg: '#fce7f3', icon: '#db2777' },
};

// ── Setting Row (iOS-style) ────────────────────────────────
function SettingRow({ icon, color = 'blue', label, sub, right, onClick, last = false, danger = false }) {
  const [hov, setHov] = useState(false);
  const c = ROW_COLORS[color] || ROW_COLORS.blue;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '13px 18px',
        borderBottom: last ? 'none' : '1px solid var(--border)',
        background: hov && onClick ? 'var(--bg3)' : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.12s',
      }}
    >
      <div style={{ width: 34, height: 34, borderRadius: 9, background: danger ? '#fee2e2' : c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: danger ? 'var(--red)' : 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
        {sub && <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 1 }}>{sub}</div>}
      </div>
      {right && <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>{right}</div>}
      {onClick && <div style={{ color: 'var(--text3)', fontSize: '0.85rem', flexShrink: 0 }}>›</div>}
    </div>
  );
}


// ── Password Input ─────────────────────────────────────────
function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input type={show ? 'text' : 'password'} className="form-input"
        placeholder={placeholder} value={value} onChange={onChange}
        style={{ paddingRight: 42 }} />
      <button type="button" onClick={() => setShow(v => !v)} style={{
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--text3)', fontSize: '1rem', lineHeight: 1, padding: 4,
      }}>{show ? '🙈' : '👁️'}</button>
    </div>
  );
}

// ── Slide-up Panel (modal drawer) ─────────────────────────
function Panel({ open, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%', height: '100%',
      zIndex: 9999,
      background: 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, boxSizing: 'border-box',
      animation: 'fadeOverlay 0.18s ease',
    }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        position: 'relative', background: 'var(--card)',
        borderRadius: 20, border: '1px solid var(--border2)',
        width: '100%', maxWidth: 500,
        maxHeight: 'calc(100vh - 60px)', overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.28)',
        animation: 'scaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 22px 16px',
          borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0, background: 'var(--card)', zIndex: 1,
          borderRadius: '20px 20px 0 0',
        }}>
          <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{title}</div>
          <button onClick={onClose} style={{
            background: 'var(--bg3)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, cursor: 'pointer', color: 'var(--text3)',
            fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--red-bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg3)'}
          >✕</button>
        </div>
        <div style={{ padding: '20px 22px 28px' }}>{children}</div>
      </div>
    </div>,
    document.body
  );
}

// ── Panel: Edit Nama ───────────────────────────────────────
function PanelEditNama({ user, updateName, onClose }) {
  const [name, setName] = useState(user.name);
  const [msg,  setMsg]  = useState({});
  const save = () => {
    setMsg({});
    const err = updateName(name);
    if (err) { setMsg({ type: 'error', text: err }); return; }
    setMsg({ type: 'ok', text: 'Nama berhasil diperbarui!' });
    setTimeout(onClose, 900);
  };
  return (
    <>
      {msg.text && <div className={`alert ${msg.type === 'ok' ? 'success' : 'error'} mb-3`}>{msg.text}</div>}
      <div className="form-group" style={{ marginBottom: 12 }}>
        <label className="form-label">Username</label>
        <input className="form-input" value={user.username} disabled style={{ opacity: 0.5 }} />
        <div className="form-hint">Username tidak bisa diubah</div>
      </div>
      <div className="form-group" style={{ marginBottom: 20 }}>
        <label className="form-label">Nama Tampilan</label>
        <input className="form-input" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && save()} autoFocus />
      </div>
      <button className="btn btn-primary w-full" onClick={save} style={{ borderRadius: 12, padding: '13px' }}>Simpan Perubahan</button>
    </>
  );
}

// ── Panel: Ubah Password ───────────────────────────────────
function PanelPassword({ changePassword, onClose }) {
  const [form, setForm] = useState({ lama: '', baru: '', konfirmasi: '' });
  const [msg,  setMsg]  = useState({});
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const save = () => {
    setMsg({});
    if (!form.lama || !form.baru || !form.konfirmasi) { setMsg({ type: 'error', text: 'Semua kolom wajib diisi' }); return; }
    if (form.baru !== form.konfirmasi) { setMsg({ type: 'error', text: 'Password baru tidak cocok' }); return; }
    if (form.baru.length < 4) { setMsg({ type: 'error', text: 'Minimal 4 karakter' }); return; }
    const err = changePassword(form.lama, form.baru);
    if (err) { setMsg({ type: 'error', text: err }); return; }
    setMsg({ type: 'ok', text: 'Password berhasil diubah!' });
    setTimeout(onClose, 900);
  };
  return (
    <>
      {msg.text && <div className={`alert ${msg.type === 'ok' ? 'success' : 'error'} mb-3`}>{msg.text}</div>}
      <div className="form-group" style={{ marginBottom: 12 }}>
        <label className="form-label">Password Lama</label>
        <PasswordInput value={form.lama} onChange={set('lama')} placeholder="Password saat ini" />
      </div>
      <div className="form-group" style={{ marginBottom: 12 }}>
        <label className="form-label">Password Baru</label>
        <PasswordInput value={form.baru} onChange={set('baru')} placeholder="Minimal 4 karakter" />
      </div>
      <div className="form-group" style={{ marginBottom: 20 }}>
        <label className="form-label">Konfirmasi Password Baru</label>
        <PasswordInput value={form.konfirmasi} onChange={set('konfirmasi')} placeholder="Ulangi password baru" />
      </div>
      <button className="btn btn-primary w-full" onClick={save} style={{ borderRadius: 12, padding: '13px' }}>Ganti Password</button>
    </>
  );
}

// ── Panel: Export / Import ─────────────────────────────────
function PanelData({ data, onClose }) {
  const [importMsg, setImportMsg] = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [importing, setImporting] = useState(false);

  const doExport = (type) => {
    const exportData = { transaksi: data.transaksi, tagihan: data.tagihan, piutang: data.piutang, hutang: data.hutang, aset: data.aset, wifiIsp: data.wifiIsp, saldoAwal: data.saldoAwal, budget: data.budget, kategori: data.kategori, exportedAt: new Date().toISOString(), version: '2.0' };
    let content, filename, mime;
    if (type === 'json') {
      content = JSON.stringify(exportData, null, 2);
      filename = `dompetku_${new Date().toISOString().slice(0,10)}.json`;
      mime = 'application/json';
    } else {
      const rows = [['Tanggal','Sumber','Pemasukan','Tujuan','Pengeluaran','MetodeBayar','Ket'], ...data.transaksi.map(t => [t.tanggal, t.sumber, t.pemasukan, t.tujuan, t.pengeluaran, t.metodeBayar||'', t.ket||''])];
      content = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
      filename = `transaksi_${new Date().toISOString().slice(0,10)}.csv`;
      mime = 'text/csv';
    }
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([content], { type: mime })), download: filename });
    a.click();
  };

  const parseCSV = (text) => {
    const lines = text.trim().split('\n').filter(Boolean);
    if (lines.length < 2) return null;
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
    const required = ['tanggal','pemasukan','pengeluaran'];
    const missing = required.filter(r => !headers.includes(r));
    if (missing.length) return { error: `Kolom wajib tidak ada: ${missing.join(', ')}` };
    const rows = lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
      const obj = {}; headers.forEach((h, idx) => { obj[h] = vals[idx] || ''; });
      return { tanggal: obj.tanggal||'', sumber: obj.sumber||'Import CSV', pemasukan: Number(obj.pemasukan)||0, tujuan: obj.tujuan||'Tidak ada pengeluaran', pengeluaran: Number(obj.pengeluaran)||0, ket: obj.ket||'' };
    }).filter(r => r.tanggal);
    return { rows };
  };

  const handleFile = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setImportMsg(null);

    // Support JSON import (No.7)
    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const json = JSON.parse(ev.target.result);
          // Validasi minimal: harus punya salah satu key data
          const keys = ['transaksi','tagihan','piutang','hutang','aset'];
          if (!keys.some(k => Array.isArray(json[k]))) {
            setImportMsg({ type: 'error', text: 'File JSON tidak valid atau bukan backup Dompetku.' });
            return;
          }
          setPreview({ type: 'json', json, filename: file.name });
        } catch {
          setImportMsg({ type: 'error', text: 'File JSON tidak bisa dibaca. Pastikan file tidak korup.' });
        }
      };
      reader.readAsText(file); e.target.value = '';
      return;
    }

    if (!file.name.endsWith('.csv')) { setImportMsg({ type: 'error', text: 'File harus .csv atau .json' }); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = parseCSV(ev.target.result);
      if (!result) { setImportMsg({ type: 'error', text: 'File CSV kosong atau tidak valid.' }); return; }
      if (result.error) { setImportMsg({ type: 'error', text: result.error }); return; }
      setPreview({ type: 'csv', rows: result.rows, filename: file.name });
    };
    reader.readAsText(file); e.target.value = '';
  };

  const doImport = () => {
    if (!preview) return; setImporting(true);

    if (preview.type === 'json') {
      // JSON restore: replace semua data
      const j = preview.json;
      if (Array.isArray(j.transaksi))  data.setTransaksi(j.transaksi);
      if (Array.isArray(j.tagihan))    data.setTagihan(j.tagihan);
      if (Array.isArray(j.piutang))    data.setPiutang(j.piutang);
      if (Array.isArray(j.hutang))     data.setHutang(j.hutang);
      if (Array.isArray(j.aset))       data.setAset(j.aset);
      if (Array.isArray(j.wifiIsp))    data.setWifiIsp(j.wifiIsp);
      if (Array.isArray(j.budget))     data.setBudget(j.budget);
      if (typeof j.saldoAwal === 'number') data.setSaldoAwal(j.saldoAwal);
      if (j.kategori?.sumber && j.kategori?.tujuan) data.setKategori(j.kategori);
      const count = (j.transaksi?.length||0)+(j.tagihan?.length||0)+(j.aset?.length||0);
      setImportMsg({ type: 'ok', text: `✓ Backup berhasil di-restore! ${count} records dimuat.` });
      setPreview(null); setImporting(false);
      return;
    }

    // CSV import
    const newRows = preview.rows.map(r => ({ ...r, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) }));
    data.setTransaksi([...data.transaksi, ...newRows]);
    setImportMsg({ type: 'ok', text: `✓ ${newRows.length} transaksi berhasil diimport` });
    setPreview(null); setImporting(false);
  };

  const stats = [
    { label: 'Transaksi', v: data.transaksi?.length||0, color:'var(--blue)',   bg:'var(--blue-bg)',   icon:'⇄' },
    { label: 'Tagihan',   v: data.tagihan?.length||0,   color:'var(--orange)', bg:'var(--orange-bg)', icon:'🧾' },
    { label: 'Piutang',   v: data.piutang?.length||0,   color:'var(--yellow)', bg:'var(--yellow-bg)', icon:'💸' },
    { label: 'Hutang',    v: data.hutang?.length||0,    color:'var(--red)',    bg:'var(--red-bg)',    icon:'🏦' },
    { label: 'Aset',      v: data.aset?.length||0,      color:'var(--purple)', bg:'var(--purple-bg)', icon:'💎' },
    { label: 'WiFi ISP',  v: data.wifiIsp?.length||0,   color:'var(--green)',  bg:'var(--green-bg)',  icon:'📶' },
  ];

  return (
    <div>
      {/* Stats 2-col horizontal */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 22 }}>
        {stats.map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: s.bg, borderRadius: 12, padding: '11px 14px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '1.15rem', flexShrink: 0 }}>{s.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '1.1rem', color: s.color, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text3)', fontWeight: 600, marginTop: 3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Export</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {[
          { type: 'json', icon: '📦', label: 'Export JSON — Backup Lengkap', sub: 'Semua data + aset + WiFi + budget. Bisa di-restore kembali.', hc: 'var(--accent)' },
          { type: 'csv',  icon: '📋', label: 'Export CSV — Transaksi Saja',  sub: 'Kompatibel dengan Excel / Google Sheets', hc: 'var(--green)' },
        ].map(btn => (
          <button key={btn.type} onClick={() => doExport(btn.type)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', background: 'var(--bg3)', border: '1.5px solid var(--border)', borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left', width: '100%' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=btn.hc; e.currentTarget.style.background='var(--blue-bg)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--bg3)'; }}>
            <div style={{ width:36, height:36, borderRadius:9, background:'var(--card)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0, boxShadow:'var(--shadow)' }}>{btn.icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.87rem', color: 'var(--text)' }}>{btn.label}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 1 }}>{btn.sub}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Import CSV / Restore JSON</div>
      {importMsg && <div className={`alert ${importMsg.type === 'ok' ? 'success' : 'error'}`} style={{ marginBottom: 10 }}>{importMsg.text}</div>}
      <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '20px', border: '2px dashed var(--border2)', borderRadius: 12, cursor: 'pointer', background: 'var(--bg3)', transition: 'all 0.15s', marginBottom: preview ? 14 : 0 }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.background='var(--blue-bg)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.background='var(--bg3)'; }}>
        <div style={{ fontSize: '1.8rem' }}>📂</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)' }}>Pilih file CSV atau JSON</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>JSON: restore backup lengkap · CSV: import transaksi saja</div>
        <input type="file" accept=".csv,.json" style={{ display: 'none' }} onChange={handleFile} />
      </label>
      {preview && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{preview.filename}{preview.type === 'csv' ? ` · ${preview.rows?.length} baris` : ' · Backup JSON'}</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setPreview(null)}>✕</button>
          </div>
          {preview.type === 'json' ? (
            <div style={{ background: 'var(--green-bg)', border: '1px solid #86efac', borderRadius: 8, padding: '14px 16px', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--green2)', marginBottom: 8 }}>📦 Isi Backup JSON</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
                {[['Transaksi', preview.json.transaksi?.length||0],['Tagihan', preview.json.tagihan?.length||0],['Piutang', preview.json.piutang?.length||0],['Hutang', preview.json.hutang?.length||0],['Aset', preview.json.aset?.length||0],['Budget', preview.json.budget?.length||0]].map(([label,val])=>(
                  <div key={label} style={{ background: 'var(--card)', padding: '8px 12px', borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--green2)' }}>{val}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text3)', fontWeight: 600 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--green2)', marginTop: 10, fontWeight: 600 }}>⚠ Import JSON akan menggantikan semua data yang ada sekarang.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 12 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', minWidth: 400 }}>
                <thead><tr style={{ background: 'var(--bg3)' }}>{['Tanggal','Sumber','Masuk','Tujuan','Keluar'].map(h=><th key={h} style={{ padding:'6px 10px', textAlign:'left', fontWeight:700, textTransform:'uppercase', fontSize:'0.62rem', color:'var(--text3)', borderBottom:'1px solid var(--border)' }}>{h}</th>)}</tr></thead>
                <tbody>
                  {preview.rows?.slice(0,4).map((r,i)=>(
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding:'6px 10px', color:'var(--text3)' }}>{r.tanggal}</td>
                      <td style={{ padding:'6px 10px' }}>{r.sumber}</td>
                      <td style={{ padding:'6px 10px', fontFamily:'var(--mono)', color:r.pemasukan>0?'var(--green)':'var(--text3)' }}>{r.pemasukan>0?`+${r.pemasukan.toLocaleString('id-ID')}`:'—'}</td>
                      <td style={{ padding:'6px 10px' }}>{r.tujuan}</td>
                      <td style={{ padding:'6px 10px', fontFamily:'var(--mono)', color:r.pengeluaran>0?'var(--red)':'var(--text3)' }}>{r.pengeluaran>0?`-${r.pengeluaran.toLocaleString('id-ID')}`:'—'}</td>
                    </tr>
                  ))}
                  {preview.rows?.length>4&&<tr><td colSpan={5} style={{ padding:'6px 10px', textAlign:'center', color:'var(--text3)', fontStyle:'italic', fontSize:'0.7rem' }}>+{preview.rows.length-4} baris lainnya</td></tr>}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button className="btn btn-ghost" onClick={()=>setPreview(null)}>Batal</button>
            <button className="btn btn-primary" onClick={doImport} disabled={importing} style={{ borderRadius:10 }}>
              {importing?'Mengimport...':preview.type==='json'?'⬆ Restore Backup JSON':`⬆ Import ${preview.rows?.length} Transaksi`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Panel: Kategori ────────────────────────────────────────
function PanelKategori({ title, icon, items, onAdd, onDelete, onEdit }) {
  const [newVal,  setNewVal]  = useState('');
  const [editIdx, setEditIdx] = useState(-1);
  const [editVal, setEditVal] = useState('');
  const doAdd = () => { const v = newVal.trim(); if (!v||items.includes(v)) return; onAdd(v); setNewVal(''); };
  const startEdit = i => { setEditIdx(i); setEditVal(items[i]); };
  const cancelEdit = () => { setEditIdx(-1); setEditVal(''); };
  const saveEdit = () => { const v = editVal.trim(); if (!v) return cancelEdit(); onEdit(editIdx, v); setEditIdx(-1); setEditVal(''); };

  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <input className="form-input" placeholder={`Kategori ${title.toLowerCase()} baru...`} value={newVal}
          onChange={e=>setNewVal(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doAdd()} style={{ flex:1 }} />
        <button className="btn btn-primary" onClick={doAdd} disabled={!newVal.trim()} style={{ borderRadius:10, flexShrink:0 }}>+ Tambah</button>
      </div>
      {items.length === 0
        ? <div style={{ textAlign:'center', padding:'24px', color:'var(--text3)', fontSize:'0.85rem', background:'var(--bg3)', borderRadius:12 }}>Belum ada kategori</div>
        : (
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {items.map((item, idx) => (
              <div key={`${idx}-${item}`} style={{ display:'inline-flex', alignItems:'center', gap:6, padding: editIdx===idx?'4px 6px':'6px 14px', borderRadius:20, background: editIdx===idx?'var(--blue-bg)':'var(--bg3)', border:`1.5px solid ${editIdx===idx?'var(--accent2)':'var(--border)'}`, fontSize:'0.84rem', transition:'all 0.15s' }}>
                {editIdx===idx ? (
                  <>
                    <input className="form-input" style={{ height:26, padding:'2px 8px', fontSize:'0.84rem', minWidth:80, maxWidth:140, borderRadius:6 }}
                      value={editVal} onChange={e=>setEditVal(e.target.value)}
                      onKeyDown={e=>{if(e.key==='Enter')saveEdit();if(e.key==='Escape')cancelEdit();}} autoFocus />
                    <button onClick={saveEdit}   style={{ color:'var(--green)',  background:'none', border:'none', cursor:'pointer', fontWeight:700, fontSize:'1rem', lineHeight:1 }}>✓</button>
                    <button onClick={cancelEdit} style={{ color:'var(--text3)', background:'none', border:'none', cursor:'pointer', fontSize:'1rem', lineHeight:1 }}>✕</button>
                  </>
                ) : (
                  <>
                    <span style={{ fontWeight:600 }}>{item}</span>
                    <button onClick={()=>startEdit(idx)} style={{ color:'var(--accent)', background:'none', border:'none', cursor:'pointer', fontSize:'0.82rem', opacity:0.7 }}>✎</button>
                    <button onClick={()=>onDelete(idx)}  style={{ color:'var(--red)', background:'none', border:'none', cursor:'pointer', fontSize:'0.85rem', opacity:0.6 }}>✕</button>
                  </>
                )}
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────
export default function PengaturanPage({ data, user, changePassword, updateName, resetData }) {
  const { kategori, setKategori } = data;
  const sumber = useMemo(() => kategori?.sumber || [], [kategori]);
  const tujuan = useMemo(() => kategori?.tujuan || [], [kategori]);
  const { confirm: showConfirm, ConfirmUI } = useConfirm();

  // Panel state
  const [panel, setPanel] = useState(null); // 'nama' | 'password' | 'data' | 'sumber' | 'tujuan'

  const addS = useCallback(v   => setKategori({...kategori, sumber:[...sumber,v]}),                    [kategori,sumber,setKategori]);
  const delS = useCallback(idx => setKategori({...kategori, sumber:sumber.filter((_,i)=>i!==idx)}),   [kategori,sumber,setKategori]);
  const edtS = useCallback((idx,v)=>{const a=[...sumber];a[idx]=v;setKategori({...kategori,sumber:a});},[kategori,sumber,setKategori]);
  const addT = useCallback(v   => setKategori({...kategori, tujuan:[...tujuan,v]}),                    [kategori,tujuan,setKategori]);
  const delT = useCallback(idx => setKategori({...kategori, tujuan:tujuan.filter((_,i)=>i!==idx)}),   [kategori,tujuan,setKategori]);
  const edtT = useCallback((idx,v)=>{const a=[...tujuan];a[idx]=v;setKategori({...kategori,tujuan:a});},[kategori,tujuan,setKategori]);

  const handleReset = async () => {
    const ok = await showConfirm({ title: 'Reset Semua Data?', message: 'Semua data akan dihapus permanen. Tidak bisa dibatalkan!', type: 'danger' });
    if (ok) { resetData(); window.location.reload(); }
  };

  const totalRecords = (data.transaksi?.length||0) + (data.tagihan?.length||0) + (data.piutang?.length||0) + (data.hutang?.length||0) + (data.aset?.length||0);

  return (
    <div className="fade-in" style={{ width: '100%', paddingBottom: 24 }}>
      {ConfirmUI}

      {/* ── Profile Card ─────────────────────────── */}
      <div style={{
        background: 'var(--card)', borderRadius: 16, border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)', marginBottom: 20, overflow: 'hidden',
      }}>
        {/* Accent bar top */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, var(--accent2), var(--purple))' }} />
        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--accent2), var(--purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', fontWeight: 800, color: '#fff',
          }}>
            {(user.name || user.username || '?')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)' }}>{user.name || user.username}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>@{user.username}</div>
            {user.createdAt && <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 1 }}>Bergabung {user.createdAt}</div>}
          </div>
          <button onClick={() => setPanel('nama')} className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
            ✎ Edit
          </button>
        </div>
        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderTop: '1px solid var(--border)' }}>
          {[
            { label: 'Transaksi', value: data.transaksi?.length||0, color: 'var(--blue)' },
            { label: 'Tagihan',   value: data.tagihan?.length||0,   color: 'var(--orange)' },
            { label: 'Aset',      value: data.aset?.length||0,      color: 'var(--purple)' },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: '12px 8px', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '1.1rem', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text3)', fontWeight: 600, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Akun & Keamanan ───────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:8, paddingLeft:4 }}>Akun & Keamanan</div>
        <div style={{ background:'var(--card)', borderRadius:16, overflow:'hidden', border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
          <SettingRow icon="✏️" color="blue"   label="Ubah Nama Tampilan" sub={user.name}            onClick={()=>setPanel('nama')} />
          <SettingRow icon="🔒" color="purple" label="Ganti Password"     sub="Ubah kata sandi akun" onClick={()=>setPanel('password')} last />
        </div>
      </div>

      {/* ── Kategori ──────────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:8, paddingLeft:4 }}>Kategori Transaksi</div>
        <div style={{ background:'var(--card)', borderRadius:16, overflow:'hidden', border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
          <div style={{ padding:'9px 18px', background:'var(--yellow-bg)', borderBottom:'1px solid #fcd34d', display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:'0.78rem' }}>⚠️</span>
            <span style={{ fontSize:'0.72rem', color:'var(--yellow2)', fontWeight:600 }}>Perubahan tidak mempengaruhi transaksi yang sudah ada</span>
          </div>
          <SettingRow icon="💰" color="blue"   label="Sumber Pemasukan"   sub={`${sumber.length} kategori`} onClick={()=>setPanel('sumber')} />
          <SettingRow icon="💸" color="orange" label="Tujuan Pengeluaran" sub={`${tujuan.length} kategori`} onClick={()=>setPanel('tujuan')} last />
        </div>
      </div>

      {/* ── Data & Backup ─────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:8, paddingLeft:4 }}>Data & Backup</div>
        <div style={{ background:'var(--card)', borderRadius:16, overflow:'hidden', border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
          <SettingRow icon="📦" color="blue"  label="Export & Import Data" sub={`${totalRecords} total record tersimpan`} onClick={()=>setPanel('data')} />
          <SettingRow icon="⬇️" color="green" label="Export JSON"          sub="Backup lengkap semua data"  onClick={()=>{ const exportData={transaksi:data.transaksi,tagihan:data.tagihan,piutang:data.piutang,hutang:data.hutang,aset:data.aset,wifiIsp:data.wifiIsp,saldoAwal:data.saldoAwal,exportedAt:new Date().toISOString()}; const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(new Blob([JSON.stringify(exportData,null,2)],{type:'application/json'})),download:`dompetku_${new Date().toISOString().slice(0,10)}.json`}); a.click(); }} />
          <SettingRow icon="📋" color="teal"  label="Export CSV"           sub="Hanya transaksi harian"     onClick={()=>{ const rows=[['Tanggal','Sumber','Pemasukan','Tujuan','Pengeluaran','Ket'],...data.transaksi.map(t=>[t.tanggal,t.sumber,t.pemasukan,t.tujuan,t.pengeluaran,t.ket||''])]; const content=rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n'); const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(new Blob([content],{type:'text/csv'})),download:`transaksi_${new Date().toISOString().slice(0,10)}.csv`}); a.click(); }} last />
        </div>
      </div>

      {/* ── Tentang & Developer ───────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:8, paddingLeft:4 }}>Tentang</div>
        <div style={{ background:'var(--card)', borderRadius:16, overflow:'hidden', border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
          <SettingRow icon="🚀" color="blue"   label="Versi Aplikasi" right={<span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.82rem', color:'var(--text3)' }}>1.0.0</span>} />
          <SettingRow icon="⚛️" color="purple" label="Framework"      right={<span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.82rem', color:'var(--text3)' }}>React + Vite</span>} />
          <SettingRow icon="💾" color="teal"   label="Penyimpanan"    right={<span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.82rem', color:'var(--text3)' }}>Local Storage</span>} />

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border)', margin: '0 18px' }} />

          {/* Developer row */}
          <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, var(--accent2), var(--purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', fontWeight: 800, color: '#fff',
            }}>A</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>Ardian Wahyu Saputra, S.Kom</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>Pengembang Aplikasi</div>
            </div>
            <a
              href="https://www.linkedin.com/in/ardian-wahyu-saputra-s-kom-04ab2b222/"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 20,
                background: 'var(--blue-bg)', border: '1px solid #bfdbfe',
                color: 'var(--accent2)', fontFamily: 'var(--font)',
                fontWeight: 700, fontSize: '0.78rem', textDecoration: 'none',
                transition: 'all 0.15s', flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--accent2)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='var(--accent2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='var(--blue-bg)'; e.currentTarget.style.color='var(--accent2)'; e.currentTarget.style.borderColor='#bfdbfe'; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* ── Zona Berbahaya ────────────────────────── */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize:'0.68rem', fontWeight:800, color:'var(--red)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:8, paddingLeft:4 }}>Zona Berbahaya</div>
        <div style={{ background:'var(--card)', borderRadius:16, overflow:'hidden', border:'1.5px solid #fca5a5', boxShadow:'0 2px 12px rgba(220,38,38,0.07)' }}>
          <SettingRow icon="🗑" color="red" label="Reset Semua Data" sub="Hapus semua data secara permanen" onClick={handleReset} danger last />
        </div>
      </div>

      {/* ── Slide-up Panels ───────────────────────── */}
      <Panel open={panel==='nama'}     onClose={()=>setPanel(null)} title="Edit Profil">
        <PanelEditNama user={user} updateName={updateName} onClose={()=>setPanel(null)} />
      </Panel>
      <Panel open={panel==='password'} onClose={()=>setPanel(null)} title="Ganti Password">
        <PanelPassword changePassword={changePassword} onClose={()=>setPanel(null)} />
      </Panel>
      <Panel open={panel==='data'}     onClose={()=>setPanel(null)} title="Export & Import Data">
        <PanelData data={data} onClose={()=>setPanel(null)} />
      </Panel>
      <Panel open={panel==='sumber'}   onClose={()=>setPanel(null)} title="💰 Sumber Pemasukan">
        <PanelKategori title="Sumber" icon="💰" items={sumber} onAdd={addS} onDelete={delS} onEdit={edtS} />
      </Panel>
      <Panel open={panel==='tujuan'}   onClose={()=>setPanel(null)} title="💸 Tujuan Pengeluaran">
        <PanelKategori title="Tujuan" icon="💸" items={tujuan} onAdd={addT} onDelete={delT} onEdit={edtT} />
      </Panel>
    </div>
  );
}
