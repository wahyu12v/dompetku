import { useState, useCallback, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

// ── Setting Row (DIperbaiki: Tanpa useState agar tidak lag saat discroll) ──
function SettingRow({ icon, color = 'blue', label, sub, right, onClick, first = false, last = false, danger = false }) {
  const c = ROW_COLORS[color] || ROW_COLORS.blue;
  return (
    <div
      onClick={onClick}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.background = 'var(--bg3)'; }}
      onMouseLeave={e => { if (onClick) e.currentTarget.style.background = 'transparent'; }}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '13px 18px',
        borderBottom: last ? 'none' : '1px solid var(--border)',
        background: 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.12s',
        borderTopLeftRadius: first ? 15 : 0,
        borderTopRightRadius: first ? 15 : 0,
        borderBottomLeftRadius: last ? 15 : 0,
        borderBottomRightRadius: last ? 15 : 0,
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

// ── Panel: Export ─────────────────────────────────────────
function PanelData({ data, onClose }) {
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
    </div>
  );
}


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
        boxShadow: 'var(--shadow)', marginBottom: 20,
      }}>
        {/* Accent bar top */}
        <div style={{ height: 4, borderTopLeftRadius: 15, borderTopRightRadius: 15, background: 'linear-gradient(90deg, var(--accent2), var(--purple))' }} />
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
        <div style={{ background:'var(--card)', borderRadius:16, border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
          <SettingRow icon="✏️" color="blue"   label="Ubah Nama Tampilan" sub={user.name}            onClick={()=>setPanel('nama')} first />
          <SettingRow icon="🔒" color="purple" label="Ganti Password"     sub="Ubah kata sandi akun" onClick={()=>setPanel('password')} last />
        </div>
      </div>

      {/* ── Kategori ──────────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:8, paddingLeft:4 }}>Kategori Transaksi</div>
        <div style={{ background:'var(--card)', borderRadius:16, border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
          <div style={{ padding:'9px 18px', background:'var(--yellow-bg)', borderBottom:'1px solid #fcd34d', display:'flex', alignItems:'center', gap:6, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
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
        <div style={{ background:'var(--card)', borderRadius:16, border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
          <SettingRow icon="📦" color="blue"  label="Export & Import Data" sub={`${totalRecords} total record tersimpan`} onClick={()=>setPanel('data')} first />
          <SettingRow icon="⬇️" color="green" label="Export JSON"          sub="Backup lengkap semua data"  onClick={()=>{ const exportData={transaksi:data.transaksi,tagihan:data.tagihan,piutang:data.piutang,hutang:data.hutang,aset:data.aset,wifiIsp:data.wifiIsp,saldoAwal:data.saldoAwal,budget:data.budget,kategori:data.kategori,exportedAt:new Date().toISOString(),version:'2.0'}; const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(new Blob([JSON.stringify(exportData,null,2)],{type:'application/json'})),download:`dompetku_${new Date().toISOString().slice(0,10)}.json`}); a.click(); }} />
          <SettingRow icon="📋" color="teal"  label="Export CSV"           sub="Hanya transaksi harian"     onClick={()=>{ const rows=[['Tanggal','Sumber','Pemasukan','Tujuan','Pengeluaran','MetodeBayar','Ket'],...data.transaksi.map(t=>[t.tanggal,t.sumber,t.pemasukan,t.tujuan,t.pengeluaran,t.metodeBayar||'',t.ket||''])]; const content=rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n'); const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(new Blob([content],{type:'text/csv'})),download:`transaksi_${new Date().toISOString().slice(0,10)}.csv`}); a.click(); }} last />
        </div>
      </div>

      {/* ── Tentang & Developer ───────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:8, paddingLeft:4 }}>Tentang</div>
        <div style={{ background:'var(--card)', borderRadius:16, border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
          <SettingRow icon="🚀" color="blue"   label="Versi Aplikasi" right={<span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.82rem', color:'var(--text3)' }}>1.0.0</span>} first />
          <SettingRow icon="⚛️" color="purple" label="Framework"      right={<span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.82rem', color:'var(--text3)' }}>React + Vite</span>} />
          <SettingRow icon="💾" color="teal"   label="Penyimpanan"    right={<span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.82rem', color:'var(--text3)' }}>Local Storage</span>} />

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border)', margin: '0 18px' }} />

          {/* Developer row */}
          <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}>
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
        <div style={{ background:'var(--card)', borderRadius:16, border:'1.5px solid #fca5a5', boxShadow:'0 2px 12px rgba(220,38,38,0.07)' }}>
          <SettingRow icon="🗑" color="red" label="Reset Semua Data" sub="Hapus semua data secara permanen" onClick={handleReset} danger first last />
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
