import { useState } from 'react';
import PiutangHutangForm from '../components/forms/PiutangHutangForm';
import { useConfirm } from '../components/ConfirmDialog';
import { fmtRp, fmtDate } from '../utils/format';
import { sumBy } from '../utils/helpers';

function StatusBadge({ status }) {
  if (status === 'Lunas')     return <span style={{ background: 'var(--green-bg)', color: 'var(--green)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>✓ Lunas</span>;
  if (status === 'Belum')     return <span style={{ background: 'var(--red-bg)', color: 'var(--red)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>✕ Belum</span>;
  if (status === 'Tidak Ada') return <span style={{ background: 'var(--bg3)', color: 'var(--text3)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>—</span>;
  return <span style={{ background: 'var(--orange-bg)', color: 'var(--orange)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>{status || '—'}</span>;
}

// Kolom untuk Desktop
const COLS = '2fr 130px 130px 130px 100px 90px 90px';

// ── DESKTOP: Grup Baris Tabel ──────────────────────────────
function NamaGroup({ nama, items, onEdit, onDelete }) {
  const [open, setOpen] = useState(true);
  const totalJumlah  = sumBy(items, 'jumlah');
  const totalDibayar = sumBy(items, 'dibayar');
  const totalSisa    = totalJumlah - totalDibayar;
  const semuaLunas   = items.every(x => x.status === 'Lunas');

  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      {/* Header Desktop */}
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', gap: 0,
          padding: '16px 24px', cursor: 'pointer', userSelect: 'none',
          background: open ? 'var(--bg)' : 'transparent', transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => !open && (e.currentTarget.style.background = 'var(--bg)')}
        onMouseLeave={(e) => !open && (e.currentTarget.style.background = 'transparent')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: semuaLunas ? 'var(--green-bg)' : 'var(--blue-bg)',
            color: semuaLunas ? 'var(--green)' : 'var(--accent)',
            fontWeight: 800, fontSize: '0.9rem',
          }}>
            {nama.charAt(0).toUpperCase()}
          </span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text)' }}>{nama}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 2 }}>
              {items.length} entri {semuaLunas && <span style={{ color: 'var(--green)', fontWeight: 600 }}>• Semua Lunas ✓</span>}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', paddingRight: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--yellow)', fontSize: '0.85rem' }}>{fmtRp(totalJumlah)}</div>
        </div>
        <div style={{ textAlign: 'right', paddingRight: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: totalDibayar > 0 ? 'var(--green)' : 'var(--text3)', fontSize: '0.85rem' }}>{totalDibayar > 0 ? fmtRp(totalDibayar) : '—'}</div>
        </div>
        <div style={{ textAlign: 'right', paddingRight: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: totalSisa <= 0 ? 'var(--text3)' : 'var(--red)', fontSize: '0.9rem' }}>{totalSisa <= 0 ? 'LUNAS' : fmtRp(totalSisa)}</div>
        </div>
        <div /><div />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ color: 'var(--text3)', fontSize: '0.75rem', fontWeight: 800, transition: 'transform 0.3s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </div>
      </div>

      {/* Row Desktop */}
      {open && (
        <div style={{ background: 'transparent', paddingBottom: '12px' }}>
          {items.map((x) => {
            const sisa = (x.jumlah || 0) - (x.dibayar || 0);
            return (
              <div key={x.id} style={{ display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', gap: 0, padding: '12px 24px', fontSize: '0.8rem', borderTop: '1px dashed var(--border)' }}>
                <div style={{ color: 'var(--text2)', paddingRight: 12 }}>{x.ket || '—'}</div>
                <div style={{ fontFamily: 'var(--mono)', color: 'var(--text)', fontWeight: 600, textAlign: 'right', paddingRight: 16 }}>{fmtRp(x.jumlah)}</div>
                <div style={{ fontFamily: 'var(--mono)', color: x.dibayar > 0 ? 'var(--green)' : 'var(--text3)', fontWeight: 600, textAlign: 'right', paddingRight: 16 }}>{x.dibayar > 0 ? fmtRp(x.dibayar) : '—'}</div>
                <div style={{ fontFamily: 'var(--mono)', color: sisa <= 0 ? 'var(--text3)' : 'var(--red)', fontWeight: 700, textAlign: 'right', paddingRight: 16 }}>{sisa <= 0 ? '—' : fmtRp(sisa)}</div>
                <div style={{ color: 'var(--text3)', fontSize: '0.75rem' }}>{fmtDate(x.tglPinjam) || '—'}</div>
                <div><StatusBadge status={x.status} /></div>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost btn-sm" style={{ padding: '6px 10px' }} onClick={() => onEdit(x)}>✎</button>
                  <button className="btn btn-ghost btn-sm" style={{ padding: '6px 10px', color: 'var(--red)' }} onClick={() => onDelete(x.id)}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── MOBILE: Kartu Item ─────────────────────────────────────
function MobileItemCard({ x, onEdit, onDelete }) {
  const sisa = (x.jumlah || 0) - (x.dibayar || 0);
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', marginBottom: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)', flex: 1, wordBreak: 'break-word', lineHeight: 1.4 }}>
          {x.ket || 'Tanpa keterangan'}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginBottom: '2px' }}>Total: <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--text)' }}>{fmtRp(x.jumlah)}</span></div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>Dibayar: <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--green)' }}>{fmtRp(x.dibayar)}</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', padding: '10px 0', borderTop: '1px dashed var(--border)', borderBottom: '1px dashed var(--border)' }}>
         <div style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600 }}>📅 {fmtDate(x.tglPinjam)}</div>
         <StatusBadge status={x.status} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '0.9rem', color: sisa <= 0 ? 'var(--text3)' : 'var(--red)' }}>
          Sisa: {sisa <= 0 ? 'LUNAS' : fmtRp(sisa)}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn btn-ghost btn-sm" style={{ padding: '6px 12px', fontSize: '0.72rem', background: 'var(--bg3)', borderRadius: '8px' }} onClick={() => onEdit(x)}>Edit</button>
          <button className="btn btn-ghost btn-sm" style={{ padding: '6px 12px', fontSize: '0.72rem', background: 'var(--red-bg)', color: 'var(--red)', borderRadius: '8px' }} onClick={() => onDelete(x.id)}>Hapus</button>
        </div>
      </div>
    </div>
  );
}

// ── MOBILE: Grup Akordeon ──────────────────────────────────
function MobileNamaGroup({ nama, items, onEdit, onDelete }) {
  const [open, setOpen] = useState(false); // Default tertutup di HP agar rapi
  const totalJumlah  = sumBy(items, 'jumlah');
  const totalDibayar = sumBy(items, 'dibayar');
  const totalSisa    = totalJumlah - totalDibayar;
  const semuaLunas   = items.every(x => x.status === 'Lunas');

  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '16px', marginBottom: '12px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: open ? 'var(--card)' : 'var(--card)', cursor: 'pointer', borderBottom: open ? '1px solid var(--border)' : 'none', transition: 'background 0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
           <span style={{ width: 40, height: 40, borderRadius: '50%', background: semuaLunas ? 'var(--green-bg)' : 'var(--blue-bg)', color: semuaLunas ? 'var(--green)' : 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 }}>
             {nama.charAt(0).toUpperCase()}
           </span>
           <div style={{ overflow: 'hidden' }}>
             <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nama}</div>
             <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: '2px' }}>{items.length} entri {semuaLunas && <span style={{ color: 'var(--green)', fontWeight: 600 }}>• Lunas ✓</span>}</div>
           </div>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: totalSisa <= 0 ? 'var(--text3)' : 'var(--red)', fontFamily: 'var(--mono)' }}>{totalSisa <= 0 ? 'LUNAS' : fmtRp(totalSisa)}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', marginTop: '2px' }}>Sisa Tagihan</div>
          </div>
          <span style={{ color: 'var(--text3)', fontSize: '0.7rem', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
        </div>
      </div>
      
      {open && (
        <div style={{ padding: '12px 12px 4px 12px', background: 'var(--bg3)' }}>
          {items.map(x => <MobileItemCard key={x.id} x={x} onEdit={onEdit} onDelete={onDelete} />)}
        </div>
      )}
    </div>
  );
}

// ── Stat mini card (Diperbarui agar Responsive) ────────────
function MiniStat({ label, value, color, sub, icon }) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '14px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      display: 'flex', flexDirection: 'column', gap: 4, boxSizing: 'border-box', width: '100%'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</div>
        <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text3)', lineHeight: 1.2 }}>{label}</div>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '1.25rem', color, wordBreak: 'break-word', lineHeight: 1.3 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: 'var(--text2)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────
export default function PiutangHutangPage({ data }) {
  const { piutang, upsertPiutang, removePiutang, hutang, upsertHutang, removeHutang } = data;
  const [modal,     setModal]     = useState(null);
  const [activeTab, setActiveTab] = useState('piutang');
  const { confirm: showConfirm, ConfirmUI } = useConfirm();

  const isPiutang = activeTab === 'piutang';
  const list      = isPiutang ? piutang : hutang;
  const upsert    = isPiutang ? upsertPiutang : upsertHutang;
  const removeFn  = isPiutang ? removePiutang : removeHutang;

  const totalJumlah  = sumBy(list, 'jumlah');
  const totalDibayar = sumBy(list, 'dibayar');
  const totalSisa    = totalJumlah - totalDibayar;

  const grouped = list.reduce((acc, x) => {
    const key     = (x.dari || x.nama || 'Tidak Diketahui').trim().toLowerCase();
    const display = (x.dari || x.nama || 'Tidak Diketahui').trim();
    if (!acc[key]) acc[key] = { nama: display, items: [] };
    acc[key].items.push(x);
    return acc;
  }, {});

  const handleSave   = (item) => { upsert(item); setModal(null); };
  const handleDelete = async (id) => {
    const ok = await showConfirm({ title: 'Hapus Data', message: 'Data ini akan dihapus permanen.', type: 'danger' });
    if (ok) removeFn(id);
  };

  return (
    <div className="fade-in" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden', paddingBottom: '30px' }}>
      {ConfirmUI}

      {/* ── Toolbar Atas (Fleksibel & Anti-Bocor) ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px', width: '100%' }}>
        
        {/* Tab Pilihan */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--card)', padding: '6px', borderRadius: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid var(--border)', overflowX: 'auto', scrollbarWidth: 'none', flex: '1 1 300px' }}>
          <button 
            onClick={() => setActiveTab('piutang')} 
            style={{ 
              flex: 1, whiteSpace: 'nowrap',
              background: activeTab === 'piutang' ? 'var(--blue-bg)' : 'transparent', 
              color: activeTab === 'piutang' ? 'var(--blue)' : 'var(--text2)', 
              border: 'none', padding: '10px 16px', borderRadius: '24px', 
              fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' 
            }}>
            💸 Piutang
          </button>
          <button 
            onClick={() => setActiveTab('hutang')} 
            style={{ 
              flex: 1, whiteSpace: 'nowrap',
              background: activeTab === 'hutang' ? 'var(--red-bg)' : 'transparent', 
              color: activeTab === 'hutang' ? 'var(--red)' : 'var(--text2)', 
              border: 'none', padding: '10px 16px', borderRadius: '24px', 
              fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' 
            }}>
            🏦 Hutangku
          </button>
        </div>

        {/* Tombol Tambah */}
        <button 
          className="btn btn-primary" 
          style={{ borderRadius: '24px', padding: '10px 20px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flex: '1 1 200px' }} 
          onClick={() => setModal({ item: null })}
        >
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>＋</span> Tambah {isPiutang ? 'Piutang' : 'Hutang'}
        </button>
      </div>

      {/* ── Stat cards Flexbox ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '12px', marginBottom: '24px', width: '100%' }}>
        <MiniStat label={isPiutang ? 'Total Uang Dipinjamkan' : 'Total Hutang Keseluruhan'} value={fmtRp(totalJumlah)} color={isPiutang ? 'var(--yellow)' : 'var(--red)'} icon={isPiutang ? '💰' : '💳'} sub={`${list.length} entri · ${Object.keys(grouped).length} orang`} />
        <MiniStat label="Sudah Terbayar" value={fmtRp(totalDibayar)} color="var(--green)" icon="✅" sub="Telah dilunasi" />
        <MiniStat label="Sisa Belum Lunas" value={fmtRp(totalSisa)} color={totalSisa <= 0 ? 'var(--green)' : isPiutang ? 'var(--blue)' : 'var(--red)'} icon="⏳" sub={totalSisa <= 0 ? 'Semua Lunas ✓' : 'Masih ada sisa'} />
      </div>

      {/* ── DESKTOP VIEW: Tabel Lebar ── */}
      <div className="card mobile-hide" style={{ padding: 0, borderRadius: '16px', overflow: 'hidden' }}>
        {/* Header Kolom */}
        <div style={{
          display: 'grid', gridTemplateColumns: COLS, gap: 0,
          padding: '16px 24px', background: 'transparent',
          borderBottom: '2px solid var(--border)',
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Keterangan & Orang</div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right', paddingRight: 16 }}>Jumlah</div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right', paddingRight: 16 }}>Dibayar</div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right', paddingRight: 16 }}>Sisa</div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tgl Pinjam</div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</div>
          <div />
        </div>

        {/* Isi Data */}
        {list.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px', opacity: 0.5 }}>💸</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text2)', marginBottom: '4px' }}>Belum ada catatan</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>Klik tombol tambah di atas untuk mencatat {isPiutang ? 'piutang' : 'hutang'} baru.</div>
          </div>
        ) : (
          Object.values(grouped).map(g => (
            <NamaGroup key={g.nama} nama={g.nama} items={g.items} onEdit={x => setModal({ item: x })} onDelete={handleDelete} />
          ))
        )}
      </div>

      {/* ── MOBILE VIEW: List Akordeon ── */}
      <div className="mobile-card-list" style={{ paddingBottom: '20px' }}>
        {list.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 20px', border: '1px solid var(--border)', borderRadius: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.5 }}>💸</div>
            <p style={{ fontWeight: 700, color: 'var(--text2)' }}>Belum ada catatan {isPiutang ? 'piutang' : 'hutang'}</p>
          </div>
        ) : (
          Object.values(grouped).map(g => (
            <MobileNamaGroup key={g.nama} nama={g.nama} items={g.items} onEdit={x => setModal({ item: x })} onDelete={handleDelete} />
          ))
        )}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <PiutangHutangForm
          item={modal.item}
          mode={activeTab}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
