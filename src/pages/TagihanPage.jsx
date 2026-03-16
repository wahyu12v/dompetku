import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import TagihanForm from '../components/forms/TagihanForm';
import { useConfirm } from '../components/ConfirmDialog';
import { fmtRp, fmtDate } from '../utils/format';
import { filterByMonth, sumBy, currentYearMonth, today, genId } from '../utils/helpers';

const BULAN_SINGKAT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

function KonfirmasiTransaksi({ tagihan, onYes, onNo }) {
  return createPortal(
    <div className="confirm-overlay" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
      <div className="confirm-box" style={{ maxWidth: 400, borderRadius: '16px' }}>
        <div style={{ textAlign: 'center', padding: '32px 24px 0' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--green-bg)', color: 'var(--green)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>🧾</div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 12 }}>Catat ke Transaksi Harian?</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6, padding: '0 8px' }}>
            Tagihan <strong style={{ color: 'var(--text)' }}>{tagihan.alasan}{tagihan.ket ? ` (${tagihan.ket})` : ''}</strong> sebesar{' '}
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--orange)', fontSize: '0.9rem' }}>{fmtRp(tagihan.nominal)}</span>
            {' '}akan dicatat sebagai pengeluaran.
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
  if (status === 'Sudah dibayar') return <span className="badge green" style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem' }}>✓ Lunas</span>;
  if (status === 'Belum dibayar') return <span className="badge red" style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem' }}>✕ Belum</span>;
  return <span className="badge yellow" style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem' }}>? Belum Pasti</span>;
}

// ── Mobile card untuk tagihan ──────────────────────────────
function TagihanCard({ t, onEdit, onDelete, onPaid }) {
  const overdue = t.batas && t.batas < today() && t.status !== 'Sudah dibayar';
  const lunas   = t.status === 'Sudah dibayar';
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '14px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
      borderLeft: `4px solid ${lunas ? 'var(--green)' : overdue ? 'var(--red)' : 'var(--orange)'}`,
      boxSizing: 'border-box', width: '100%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)', wordBreak: 'break-word', lineHeight: 1.3 }}>{t.alasan}</div>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.9rem', color: lunas ? 'var(--text3)' : 'var(--orange)', whiteSpace: 'nowrap', flexShrink: 0, textAlign: 'right' }}>
          {fmtRp(t.nominal)}
        </div>
      </div>

      {t.ket && <div style={{ fontSize: '0.72rem', color: 'var(--text2)', marginTop: '6px', background: 'var(--bg3)', padding: '6px 10px', borderRadius: '6px', display: 'inline-block' }}>{t.ket}</div>}

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600 }}>📅 {fmtDate(t.tanggal)}</div>
        {t.batas && (
          <div style={{ fontSize: '0.72rem', color: overdue ? 'var(--red)' : 'var(--text3)', fontWeight: overdue ? 700 : 500 }}>
            ⏰ {fmtDate(t.batas)}{overdue ? ' ⚠' : ''}
          </div>
        )}
        <StatusBadge status={t.status} />
      </div>

      <div style={{ display: 'flex', gap: '6px', marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--border)' }}>
        {!lunas && (
          <button className="btn btn-success btn-sm" style={{ flex: 1, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, padding: '6px 0' }} onClick={() => onPaid(t)}>✓ Bayar</button>
        )}
        <button className="btn btn-ghost btn-sm" style={{ flex: lunas ? 1 : 0, padding: '6px 14px', fontSize: '0.75rem', background: 'var(--bg3)', borderRadius: '8px', fontWeight: 600 }} onClick={() => onEdit(t)}>Edit</button>
        <button className="btn btn-ghost btn-sm" style={{ padding: '6px 14px', fontSize: '0.75rem', background: 'var(--red-bg)', color: 'var(--red)', borderRadius: '8px', fontWeight: 600 }} onClick={() => onDelete(t.id)}>Hapus</button>
      </div>
    </div>
  );
}

// ── Stat mini card ─────────────────────────────────────────
function MiniStat({ label, value, color, sub, icon }) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '14px 18px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
      display: 'flex', flexDirection: 'column', gap: 4, boxSizing: 'border-box', width: '100%'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: '0.95rem', flexShrink: 0 }}>{icon}</div>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text3)', lineHeight: 1.2 }}>{label}</div>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '1.15rem', color, wordBreak: 'break-word', lineHeight: 1.3 }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>{sub}</div>
    </div>
  );
}

export default function TagihanPage({ data }) {
  const { tagihan, upsertTagihan, removeTagihan, markTagihanPaid, upsertTransaksi } = data;
  const [modal, setModal] = useState(null);
  const [tab, setTab] = useState('semua');
  const { confirm: showConfirm, ConfirmUI } = useConfirm();
  const [konfirmasi, setKonfirmasi] = useState(null);

  const initialYM = currentYearMonth().split('-');
  const [filterYear, setFilterYear] = useState(parseInt(initialYM[0]));
  const [filterMonth, setFilterMonth] = useState(initialYM[1]); // format '01' - '12'
  const activeFilterKey = `${filterYear}-${filterMonth}`;

  // Menentukan batas tahun dinamis
  const { minYear, maxYear } = useMemo(() => {
    const years = tagihan.map(t => parseInt(t.tanggal.substring(0, 4)));
    const currentYear = new Date().getFullYear();
    const min = years.length > 0 ? Math.min(...years) : currentYear;
    const max = years.length > 0 ? Math.max(...years) : currentYear;
    return { minYear: Math.min(min, currentYear - 1), maxYear: Math.max(max, currentYear + 2) };
  }, [tagihan]);

  const inMonth = useMemo(() => filterByMonth(tagihan, activeFilterKey), [tagihan, activeFilterKey]);
  const filtered = useMemo(() => {
    let list = inMonth;
    if (tab === 'belum') list = list.filter(t => t.status !== 'Sudah dibayar');
    if (tab === 'sudah') list = list.filter(t => t.status === 'Sudah dibayar');
    return [...list].sort((a, b) => (a.batas || '').localeCompare(b.batas || ''));
  }, [inMonth, tab]);

  const totAll   = sumBy(inMonth, 'nominal');
  const totSudah = inMonth.filter(t => t.status === 'Sudah dibayar').reduce((s, x) => s + (x.nominal || 0), 0);
  const totBelum = totAll - totSudah;

  const handleSave   = (item) => { upsertTagihan(item); setModal(null); };
  const handleDelete = async (id) => {
    const ok = await showConfirm({ title: 'Hapus Tagihan', message: 'Tagihan ini akan dihapus permanen.', type: 'danger' });
    if (ok) removeTagihan(id);
  };
  const handlePaid = (t) => { markTagihanPaid(t.id); setKonfirmasi(t); };
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
    <div className="fade-in" style={{ paddingBottom: '30px', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {ConfirmUI}

      {konfirmasi && (
        <KonfirmasiTransaksi tagihan={konfirmasi} onYes={handleKonfirmasiYes} onNo={() => setKonfirmasi(null)} />
      )}

      {/* ── Filter Panel Tahun & Bulan Terpisah (Scalable) ── */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* BARIS 1: Stepper Tahun */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1rem' }}>📅</span>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>Periode Tagihan</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg3)', padding: '3px', borderRadius: '20px' }}>
            <button onClick={() => setFilterYear(y => Math.max(minYear, y - 1))} disabled={filterYear <= minYear}
              style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: filterYear <= minYear ? 'transparent' : 'var(--card)', color: filterYear <= minYear ? 'var(--border2)' : 'var(--text)', cursor: filterYear <= minYear ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', boxShadow: filterYear <= minYear ? 'none' : '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
              ❮
            </button>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)', minWidth: '40px', textAlign: 'center' }}>
              {filterYear}
            </div>
            <button onClick={() => setFilterYear(y => Math.min(maxYear, y + 1))} disabled={filterYear >= maxYear}
              style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: filterYear >= maxYear ? 'transparent' : 'var(--card)', color: filterYear >= maxYear ? 'var(--border2)' : 'var(--text)', cursor: filterYear >= maxYear ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', boxShadow: filterYear >= maxYear ? 'none' : '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
              ❯
            </button>
          </div>
        </div>

        {/* BARIS 2: Tombol Bulan */}
        <div style={{ display: 'flex', overflowX: 'auto', gap: '6px', paddingBottom: '4px', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', width: '100%' }}>
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          {BULAN_SINGKAT.map((b, i) => {
            const numStr = String(i + 1).padStart(2, '0');
            const isActive = filterMonth === numStr;
            return (
              <button key={numStr} onClick={() => setFilterMonth(numStr)} style={{
                flexShrink: 0,
                background: isActive ? 'var(--blue)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text2)',
                border: `1px solid ${isActive ? 'var(--blue)' : 'var(--border)'}`,
                padding: '6px 14px', borderRadius: '20px',
                fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
              }}>
                {b}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Stat cards (Responsive Grid) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '12px', marginBottom: '20px', width: '100%' }}>
        <MiniStat label="Total Tagihan"  value={fmtRp(totAll)}   color="var(--text)" icon="📋" sub={`${inMonth.length} tagihan`} />
        <MiniStat label="Sudah Dibayar" value={fmtRp(totSudah)} color="var(--green)"  icon="✅" sub="Lunas" />
        <MiniStat label="Belum Dibayar" value={fmtRp(totBelum)} color={totBelum > 0 ? 'var(--red)' : 'var(--green)'} icon="⏳" sub={totBelum > 0 ? 'Perlu dibayar' : 'Semua lunas ✓'} />
      </div>

      {/* ── Container Tabel & Kontrol ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>

        {/* ── Tab Filter & Tombol Tambah (Desain Rapi Desktop & Mobile) ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'transparent', gap: '16px' }}>
          
          {/* Tabs Filter */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {[['semua','Semua'],['belum','Belum Dibayar'],['sudah','Sudah Dibayar']].map(([k, l]) =>
              <button key={k} onClick={() => setTab(k)} style={{
                background: tab === k ? 'var(--text)' : 'var(--bg3)', 
                border: 'none', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
                fontWeight: tab === k ? 700 : 600, fontSize: '0.8rem',
                color: tab === k ? 'var(--bg)' : 'var(--text2)',
                transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0
              }}>
                {l}
              </button>
            )}
          </div>

          {/* Tombol Tambah Tagihan (Proporsional di Desktop, Wrap di HP) */}
          <button
            className="btn btn-primary"
            style={{ borderRadius: '24px', padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}
            onClick={() => setModal({ item: null })}
          >
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>＋</span> Tambah Tagihan
          </button>
        </div>

        {/* ── Tabel desktop (Disembunyikan di HP via class CSS) ── */}
        <div className="table-wrap mobile-hide">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'transparent' }}>
                <th style={{ background: 'transparent', width: 100, padding: '14px 20px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tanggal</th>
                <th style={{ background: 'transparent', padding: '14px 20px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Jenis &amp; Keterangan</th>
                <th style={{ background: 'transparent', textAlign: 'right', width: 150, padding: '14px 20px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nominal</th>
                <th style={{ background: 'transparent', width: 120, padding: '14px 20px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Batas Bayar</th>
                <th style={{ background: 'transparent', width: 110, padding: '14px 20px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                <th style={{ background: 'transparent', width: 120, padding: '14px 20px', textAlign: 'center', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text3)', padding: 60, fontSize: '0.85rem' }}>Tidak ada tagihan di kategori ini</td></tr>
              ) : filtered.map(t => {
                const overdue = t.batas && t.batas < today() && t.status !== 'Sudah dibayar';
                const lunas   = t.status === 'Sudah dibayar';
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s', background: 'transparent' }}>
                    <td style={{ padding: '14px 20px', fontSize: '0.74rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{fmtDate(t.tanggal)}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>{t.alasan}</div>
                      {t.ket && <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>{t.ket}</div>}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.88rem', color: lunas ? 'var(--text3)' : 'var(--orange)' }}>
                      {fmtRp(t.nominal)}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '0.75rem', color: overdue ? 'var(--red)' : 'var(--text3)', fontWeight: overdue ? 700 : 400, whiteSpace: 'nowrap' }}>
                      {t.batas ? fmtDate(t.batas) : <span style={{ color: 'var(--border2)' }}>—</span>}
                      {overdue && ' ⚠'}
                    </td>
                    <td style={{ padding: '14px 20px' }}><StatusBadge status={t.status} /></td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                        {!lunas && (
                          <button className="btn btn-success btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px' }} onClick={() => handlePaid(t)}>✓ Bayar</button>
                        )}
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }} onClick={() => setModal({ item: t })} title="Edit">✎</button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', color: 'var(--red)' }} onClick={() => handleDelete(t.id)} title="Hapus">✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Mobile card list (Hanya Muncul di HP via CSS) ── */}
        <div className="mobile-card-list" style={{ padding: '16px' }}>
          {filtered.length === 0
            ? <div className="empty-state" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text3)', border: '1px solid var(--border)', borderRadius: '12px' }}><p>Tidak ada tagihan di kategori ini</p></div>
            : filtered.map(t => (
                <TagihanCard
                  key={t.id}
                  t={t}
                  onEdit={x => setModal({ item: x })}
                  onDelete={handleDelete}
                  onPaid={handlePaid}
                />
              ))
          }
        </div>
      </div>

      {modal && <TagihanForm item={modal.item} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
