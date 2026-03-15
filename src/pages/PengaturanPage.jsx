import { useState, useCallback } from 'react';
import { useConfirm } from '../components/ConfirmDialog';

const PCard = ({ children, danger = false, style = {} }) => (
  <div style={{
    background: 'var(--card)',
    border: `1.5px solid ${danger ? '#fca5a5' : 'var(--border)'}`,
    borderRadius: 12, padding: '20px', // Sedikit memperbesar padding agar lebih proporsional saat lebar
    boxShadow: 'var(--shadow)', ...style,
  }}>
    {children}
  </div>
);

const PTitle = ({ icon, children, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
    <span style={{ fontSize: '1.2rem' }}>{icon}</span>
    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: color || 'var(--text)' }}>{children}</span>
  </div>
);

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ paddingRight: 40 }}
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text3)', fontSize: '1rem', lineHeight: 1, padding: 2,
        }}
        title={show ? 'Sembunyikan' : 'Lihat password'}
      >
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  );
}

function InfoAkun({ user, updateName }) {
  const [name, setName] = useState(user.name);
  const [msg, setMsg]   = useState({});

  const save = () => {
    setMsg({});
    const err = updateName(name);
    setMsg(err ? { type: 'error', text: err } : { type: 'ok', text: 'Nama berhasil diperbarui!' });
  };

  return (
    <PCard>
      <PTitle icon="👤">Info Akun</PTitle>
      {msg.text && <div className={`alert ${msg.type === 'ok' ? 'success' : 'error'} mb-3`}>{msg.text}</div>}
      <div className="form-group" style={{ marginBottom: 12 }}>
        <label className="form-label">Username</label>
        <input className="form-input" value={user.username} disabled style={{ opacity: 0.55 }} />
        <div className="form-hint">Username tidak bisa diubah</div>
      </div>
      <div className="form-group" style={{ marginBottom: 12 }}>
        <label className="form-label">Nama Tampilan</label>
        <input className="form-input" value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()} />
      </div>
      <div className="form-group" style={{ marginBottom: 16 }}>
        <label className="form-label">Bergabung Sejak</label>
        <input className="form-input" value={user.createdAt || '—'} disabled style={{ opacity: 0.55 }} />
      </div>
      <button className="btn btn-primary w-full" onClick={save}>Simpan Nama</button>
    </PCard>
  );
}

function UbahPassword({ changePassword }) {
  const [form, setForm] = useState({ lama: '', baru: '', konfirmasi: '' });
  const [msg, setMsg]   = useState({});
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = () => {
    setMsg({});
    if (!form.lama || !form.baru || !form.konfirmasi) { setMsg({ type: 'error', text: 'Semua kolom wajib diisi' }); return; }
    if (form.baru !== form.konfirmasi) { setMsg({ type: 'error', text: 'Password baru tidak cocok' }); return; }
    if (form.baru.length < 4) { setMsg({ type: 'error', text: 'Password baru minimal 4 karakter' }); return; }
    const err = changePassword(form.lama, form.baru);
    if (err) { setMsg({ type: 'error', text: err }); return; }
    setMsg({ type: 'ok', text: 'Password berhasil diubah!' });
    setForm({ lama: '', baru: '', konfirmasi: '' });
  };

  return (
    <PCard>
      <PTitle icon="🔒">Ubah Password</PTitle>
      {msg.text && <div className={`alert ${msg.type === 'ok' ? 'success' : 'error'} mb-3`}>{msg.text}</div>}
      <div className="form-group" style={{ marginBottom: 12 }}>
        <label className="form-label">Password Lama</label>
        <PasswordInput value={form.lama} onChange={set('lama')} placeholder="Masukkan password lama" />
      </div>
      <div className="form-group" style={{ marginBottom: 12 }}>
        <label className="form-label">Password Baru</label>
        <PasswordInput value={form.baru} onChange={set('baru')} placeholder="Minimal 4 karakter" />
      </div>
      <div className="form-group" style={{ marginBottom: 16 }}>
        <label className="form-label">Konfirmasi Password Baru</label>
        <PasswordInput value={form.konfirmasi} onChange={set('konfirmasi')} placeholder="Ulangi password baru" />
      </div>
      <button className="btn btn-primary w-full" onClick={save}>Simpan Password</button>
    </PCard>
  );
}

function ExportData({ data }) {
  const doExport = (type) => {
    const exportData = { transaksi: data.transaksi, tagihan: data.tagihan, piutang: data.piutang, hutang: data.hutang, aset: data.aset, wifiIsp: data.wifiIsp, saldoAwal: data.saldoAwal, exportedAt: new Date().toISOString() };
    let content, filename, mime;
    if (type === 'json') {
      content = JSON.stringify(exportData, null, 2);
      filename = `dompetku_${new Date().toISOString().slice(0,10)}.json`;
      mime = 'application/json';
    } else {
      const rows = [['Tanggal','Sumber','Pemasukan','Tujuan','Pengeluaran','Ket'], ...data.transaksi.map(t => [t.tanggal,t.sumber,t.pemasukan,t.tujuan,t.pengeluaran,t.ket||''])];
      content = rows.map(r => r.map(v=>`"${v}"`).join(',')).join('\n');
      filename = `transaksi_${new Date().toISOString().slice(0,10)}.csv`;
      mime = 'text/csv';
    }
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([content],{type:mime})), download: filename });
    a.click();
  };

  const stats = [
    { label: 'Transaksi', value: data.transaksi?.length || 0, color: 'var(--blue)',   icon: '⇄' },
    { label: 'Tagihan',   value: data.tagihan?.length   || 0, color: 'var(--orange)', icon: '🧾' },
    { label: 'Piutang',   value: data.piutang?.length   || 0, color: 'var(--yellow)', icon: '💸' },
    { label: 'Hutang',    value: data.hutang?.length    || 0, color: 'var(--red)',    icon: '🏦' },
    { label: 'Aset',      value: data.aset?.length      || 0, color: 'var(--purple)', icon: '💎' },
    { label: 'WiFi ISP',  value: data.wifiIsp?.length   || 0, color: 'var(--green)',  icon: '📶' },
  ];

  return (
    <PCard>
      <PTitle icon="📤">Export & Backup Data</PTitle>
      {/* Menggunakan auto-fit agar grid icon lebih fleksibel menyesuaikan lebar container */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--bg3)', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '1.2rem', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-ghost" style={{ flex: 1, padding: '12px' }} onClick={() => doExport('json')}>⬇ JSON — Backup Lengkap</button>
        <button className="btn btn-ghost" style={{ flex: 1, padding: '12px' }} onClick={() => doExport('csv')}>⬇ CSV — Transaksi Saja</button>
      </div>
    </PCard>
  );
}

function ResetData({ resetData }) {
  const { confirm: showConfirm, ConfirmUI } = useConfirm();
  const handle = async () => {
    const ok = await showConfirm({ title: 'Reset Semua Data?', message: 'Semua data akan dihapus permanen. Tidak bisa dibatalkan!', type: 'danger' });
    if (ok) { resetData(); window.location.reload(); }
  };
  return (
    <>
      {ConfirmUI}
      <PCard danger>
        <PTitle icon="⚠️" color="var(--red)">Zona Berbahaya</PTitle>
        <p style={{ fontSize: '0.9rem', color: 'var(--text2)', marginBottom: 16, lineHeight: 1.6 }}>
          Hapus semua transaksi, tagihan, piutang, hutang, aset, dan data WiFi secara permanen.
          Gunakan tombol ini untuk menghapus data contoh dan mulai input dari nol.
        </p>
        <button className="btn btn-danger" onClick={handle}>🗑 Reset Semua Data</button>
      </PCard>
    </>
  );
}

function KategoriSection({ title, desc, items, onAdd, onDelete, onEdit }) {
  const [newVal, setNewVal]   = useState('');
  const [editIdx, setEditIdx] = useState(-1);
  const [editVal, setEditVal] = useState('');

  const doAdd    = () => { const v = newVal.trim(); if (!v || items.includes(v)) return; onAdd(v); setNewVal(''); };
  const startEdit  = i => { setEditIdx(i); setEditVal(items[i]); };
  const cancelEdit = () => { setEditIdx(-1); setEditVal(''); };
  const saveEdit   = () => { const v = editVal.trim(); if (!v) return cancelEdit(); onEdit(editIdx, v); setEditIdx(-1); setEditVal(''); };

  return (
    <PCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{title}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: 4 }}>{desc}</div>
        </div>
        <span className="badge blue">{items.length} kategori</span>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input className="form-input" placeholder="Tambah kategori baru..." value={newVal}
          onChange={e => setNewVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && doAdd()} style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={doAdd} disabled={!newVal.trim()}>+ Tambah</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {items.map((item, idx) => (
          <div key={`${idx}-${item}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 20,
            background: 'var(--bg3)', border: '1.5px solid var(--border)', fontSize: '0.85rem',
          }}>
            {editIdx === idx ? (
              <>
                <input className="form-input" style={{ height: 26, padding: '2px 8px', fontSize: '0.85rem', minWidth: 100, maxWidth: 160, borderRadius: 6 }}
                  value={editVal} onChange={e => setEditVal(e.target.value)}
                  onKeyDown={e => { if (e.key==='Enter') saveEdit(); if (e.key==='Escape') cancelEdit(); }} autoFocus />
                <button onClick={saveEdit}   style={{ color:'var(--green)',  background:'none', border:'none', cursor:'pointer', fontWeight:700, fontSize:'1rem' }}>✓</button>
                <button onClick={cancelEdit} style={{ color:'var(--text3)', background:'none', border:'none', cursor:'pointer', fontSize:'1rem' }}>✕</button>
              </>
            ) : (
              <>
                <span>{item}</span>
                <button onClick={() => startEdit(idx)} style={{ color:'var(--accent)', background:'none', border:'none', cursor:'pointer', fontSize:'0.85rem' }}>✎</button>
                <button onClick={() => onDelete(idx)}  style={{ color:'var(--text3)', background:'none', border:'none', cursor:'pointer', fontSize:'0.9rem' }}>✕</button>
              </>
            )}
          </div>
        ))}
      </div>
    </PCard>
  );
}

export default function PengaturanPage({ data, user, changePassword, updateName, resetData }) {
  const { kategori, setKategori } = data;
  const sumber = kategori?.sumber || [];
  const tujuan = kategori?.tujuan || [];

  const addS = useCallback(v   => setKategori({...kategori, sumber:[...sumber,v]}),                    [kategori,sumber,setKategori]);
  const delS = useCallback(idx => setKategori({...kategori, sumber:sumber.filter((_,i)=>i!==idx)}),   [kategori,sumber,setKategori]);
  const edtS = useCallback((idx,v)=>{const a=[...sumber];a[idx]=v;setKategori({...kategori,sumber:a});},[kategori,sumber,setKategori]);

  const addT = useCallback(v   => setKategori({...kategori, tujuan:[...tujuan,v]}),                    [kategori,tujuan,setKategori]);
  const delT = useCallback(idx => setKategori({...kategori, tujuan:tujuan.filter((_,i)=>i!==idx)}),   [kategori,tujuan,setKategori]);
  const edtT = useCallback((idx,v)=>{const a=[...tujuan];a[idx]=v;setKategori({...kategori,tujuan:a});},[kategori,tujuan,setKategori]);

  return (
    // FIX UTAMA: Menghapus maxWidth: 1100 dan menggantinya dengan width: '100%'
    <div className="fade-in" style={{ width: '100%' }}> 
      
      {/* Menambah gap dari 12 ke 16 agar ada ruang nafas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16, alignItems: 'start' }}>
        <InfoAkun user={user} updateName={updateName} />
        <UbahPassword changePassword={changePassword} />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <ExportData data={data} />
      </div>
      
      <div className="alert warning" style={{ marginBottom: 16 }}>
        ⚠ Mengubah kategori tidak mempengaruhi data transaksi yang sudah ada.
      </div>
      
      {/* Menambahkan alignItems: 'start' agar kartu kategori tidak ikut memanjang kalau kartu sebelahnya lebih tinggi */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16, alignItems: 'start' }}>
        <KategoriSection title="Sumber Pemasukan" desc="Dipakai di dropdown transaksi pemasukan"
          items={sumber} onAdd={addS} onDelete={delS} onEdit={edtS} />
        <KategoriSection title="Tujuan Pengeluaran" desc="Dipakai di dropdown transaksi pengeluaran"
          items={tujuan} onAdd={addT} onDelete={delT} onEdit={edtT} />
      </div>
      
      <ResetData resetData={resetData} />
    </div>
  );
}
