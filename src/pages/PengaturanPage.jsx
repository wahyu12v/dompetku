// ============================================================
// PengaturanPage.jsx — Custom category management (CRUD)
// Bug fix: controlled input with stable state, no re-render conflicts
// ============================================================
import { useState, useCallback } from 'react';

function KategoriSection({ title, desc, items, onAdd, onDelete, onEdit }) {
  const [newVal,    setNewVal]    = useState('');
  const [editIdx,   setEditIdx]   = useState(-1);
  const [editVal,   setEditVal]   = useState('');

  const handleAdd = () => {
    const v = newVal.trim();
    if (!v || items.includes(v)) return;
    onAdd(v);
    setNewVal('');
  };

  const startEdit = (idx) => {
    setEditIdx(idx);
    setEditVal(items[idx]);
  };

  const cancelEdit = () => {
    setEditIdx(-1);
    setEditVal('');
  };

  const saveEdit = () => {
    const v = editVal.trim();
    if (!v) return cancelEdit();
    onEdit(editIdx, v);
    setEditIdx(-1);
    setEditVal('');
  };

  return (
    <div className="card mb-4">
      <div className="section-header">
        <div>
          <div className="section-title">{title}</div>
          <div className="text-muted text-sm" style={{marginTop:3}}>{desc}</div>
        </div>
        <span className="badge blue">{items.length} kategori</span>
      </div>

      {/* Add new */}
      <div style={{display:'flex',gap:8,marginBottom:16}}>
        <input
          className="form-input"
          placeholder="Nama kategori baru..."
          value={newVal}
          onChange={e => setNewVal(e.target.value)}
          onKeyDown={e => e.key==='Enter' && handleAdd()}
          style={{flex:1}}
        />
        <button
          className="btn btn-primary"
          onClick={handleAdd}
          disabled={!newVal.trim()}
        >
          + Tambah
        </button>
      </div>

      {/* Chips */}
      <div className="kategori-list">
        {items.map((item, idx) => (
          <div key={`${idx}-${item}`} className="kategori-chip">
            {editIdx === idx ? (
              <>
                <input
                  className="form-input"
                  style={{height:28, padding:'2px 8px', fontSize:'0.82rem', minWidth:120, maxWidth:180}}
                  value={editVal}
                  onChange={e => setEditVal(e.target.value)}
                  onKeyDown={e => {
                    if (e.key==='Enter')  saveEdit();
                    if (e.key==='Escape') cancelEdit();
                  }}
                  autoFocus
                />
                <button
                  onClick={saveEdit}
                  style={{color:'var(--green)',background:'none',border:'none',cursor:'pointer',fontWeight:700,fontSize:'1rem',padding:'0 2px'}}
                >✓</button>
                <button
                  onClick={cancelEdit}
                  style={{color:'var(--text3)',background:'none',border:'none',cursor:'pointer',fontSize:'1rem',padding:'0 2px'}}
                >✕</button>
              </>
            ) : (
              <>
                <span style={{fontSize:'0.84rem'}}>{item}</span>
                <button
                  onClick={() => startEdit(idx)}
                  style={{color:'var(--accent)',background:'none',border:'none',cursor:'pointer',fontSize:'0.85rem',padding:'0 2px'}}
                  title="Edit"
                >✎</button>
                <button
                  onClick={() => onDelete(idx)}
                  style={{color:'var(--text3)',background:'none',border:'none',cursor:'pointer',fontSize:'0.9rem',padding:'0 2px'}}
                  title="Hapus"
                >✕</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PengaturanPage({ data }) {
  const { kategori, setKategori } = data;
  const sumber = kategori?.sumber || [];
  const tujuan = kategori?.tujuan || [];

  const addSumber    = useCallback(v => setKategori({ ...kategori, sumber: [...sumber, v] }),    [kategori, sumber, setKategori]);
  const deleteSumber = useCallback(idx => setKategori({ ...kategori, sumber: sumber.filter((_,i)=>i!==idx) }), [kategori, sumber, setKategori]);
  const editSumber   = useCallback((idx, v) => { const a=[...sumber]; a[idx]=v; setKategori({...kategori,sumber:a}); }, [kategori, sumber, setKategori]);

  const addTujuan    = useCallback(v => setKategori({ ...kategori, tujuan: [...tujuan, v] }),    [kategori, tujuan, setKategori]);
  const deleteTujuan = useCallback(idx => setKategori({ ...kategori, tujuan: tujuan.filter((_,i)=>i!==idx) }), [kategori, tujuan, setKategori]);
  const editTujuan   = useCallback((idx, v) => { const a=[...tujuan]; a[idx]=v; setKategori({...kategori,tujuan:a}); }, [kategori, tujuan, setKategori]);

  return (
    <div className="fade-in">
      <div className="alert warning mb-4">
        ⚠ Menghapus atau mengganti nama kategori tidak mengubah data transaksi yang sudah ada.
        Hanya mempengaruhi pilihan dropdown saat input baru.
      </div>

      <KategoriSection
        title="Kategori Sumber Pemasukan"
        desc="Dipakai di dropdown 'Sumber Pemasukan' saat tambah transaksi"
        items={sumber}
        onAdd={addSumber}
        onDelete={deleteSumber}
        onEdit={editSumber}
      />

      <KategoriSection
        title="Kategori Tujuan Pengeluaran"
        desc="Dipakai di dropdown 'Tujuan Pengeluaran' saat tambah transaksi"
        items={tujuan}
        onAdd={addTujuan}
        onDelete={deleteTujuan}
        onEdit={editTujuan}
      />
    </div>
  );
}
