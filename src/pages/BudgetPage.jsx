// ============================================================
// BudgetPage.jsx — Budget & Anggaran (No.6)
// Set batas pengeluaran per kategori, tracking realisasi bulan ini
// ============================================================
import { useState, useMemo } from 'react';
import Modal from '../components/Modal';
import RupiahInput from '../components/RupiahInput';
import { useConfirm } from '../components/ConfirmDialog';
import { fmtRp, fullMonth } from '../utils/format';
import { filterByMonth, currentYearMonth, genId, sumBy } from '../utils/helpers';
import { TAGIHAN_OPTIONS } from '../utils/constants';

function BudgetForm({ item, allKategori, onSave, onClose }) {
  const [form, setForm] = useState(item
    ? { ...item }
    : { kategori: allKategori[0] || '', batas: 0 }
  );
  const save = () => {
    if (!form.kategori || Number(form.batas) <= 0) return;
    onSave({ ...form, id: form.id || genId(), batas: Number(form.batas) });
  };
  return (
    <Modal title={item ? 'Edit Budget' : 'Tambah Budget'} onClose={onClose} onSave={save}>
      <div className="form-grid">
        <div className="form-group full">
          <label className="form-label">Kategori</label>
          {item ? (
            <input className="form-input" value={form.kategori} disabled style={{ opacity: 0.6 }} />
          ) : (
            <select className="form-select" value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}>
              {allKategori.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          )}
        </div>
        <div className="form-group full">
          <label className="form-label">Batas Anggaran per Bulan (Rp)</label>
          <RupiahInput value={form.batas} onChange={v => setForm(f => ({ ...f, batas: v }))} />
          <div className="form-hint">Pengeluaran di atas batas ini akan ditandai merah</div>
        </div>
      </div>
    </Modal>
  );
}

function BudgetCard({ b, realisasi, onEdit, onDelete }) {
  const pct     = b.batas > 0 ? Math.min((realisasi / b.batas) * 100, 100) : 0;
  const over    = realisasi > b.batas && b.batas > 0;
  const sisa    = b.batas - realisasi;
  const barColor = pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--yellow)' : 'var(--green)';

  return (
    <div style={{ background: 'var(--card)', border: `1px solid ${over ? '#fca5a5' : 'var(--border)'}`, borderRadius: 14, padding: '18px 20px', boxShadow: over ? '0 2px 12px rgba(220,38,38,0.08)' : '0 2px 8px rgba(0,0,0,0.02)', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', marginBottom: 2 }}>{b.kategori}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>
            Batas: <span style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{fmtRp(b.batas)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px' }} onClick={() => onEdit(b)}>✎</button>
          <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', color: 'var(--red)' }} onClick={() => onDelete(b.id)}>✕</button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 4, transition: 'width 0.5s ease' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '0.95rem', color: over ? 'var(--red)' : 'var(--text)' }}>{fmtRp(realisasi)}</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text3)', marginLeft: 4 }}>terpakai</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          {over ? (
            <span style={{ background: 'var(--red-bg)', color: 'var(--red)', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>
              Over {fmtRp(Math.abs(sisa))}
            </span>
          ) : (
            <span style={{ background: 'var(--green-bg)', color: 'var(--green2)', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>
              Sisa {fmtRp(sisa)}
            </span>
          )}
        </div>
      </div>

      <div style={{ fontSize: '0.68rem', color: 'var(--text3)', marginTop: 6 }}>{Math.round(pct)}% dari anggaran</div>
    </div>
  );
}

export default function BudgetPage({ data }) {
  const { transaksi, tagihan, budget, upsertBudget, removeBudget, kategori } = data;
  const [modal, setModal] = useState(null);
  const { confirm: showConfirm, ConfirmUI } = useConfirm();

  const now      = new Date();
  const curMonth = now.getMonth() + 1;
  const curYear  = now.getFullYear();
  const curKey   = `${curYear}-${String(curMonth).padStart(2,'0')}`;

  // Semua kategori yang bisa dibudget: tujuan transaksi + jenis tagihan
  const tujuanList   = kategori?.tujuan || [];
  const allKategori  = [...new Set([...tujuanList, ...TAGIHAN_OPTIONS])].sort();

  // Kategori yang belum ada budgetnya
  const kategoriBelumBudget = allKategori.filter(k => !budget.find(b => b.kategori === k));

  // Realisasi pengeluaran bulan ini per kategori
  const realisasiMap = useMemo(() => {
    const map = {};
    // Dari transaksi harian
    filterByMonth(transaksi, curKey).forEach(t => {
      if (t.pengeluaran > 0) map[t.tujuan] = (map[t.tujuan] || 0) + t.pengeluaran;
    });
    // Dari tagihan yang sudah dibayar
    filterByMonth(tagihan, curKey)
      .filter(t => t.status === 'Sudah dibayar')
      .forEach(t => { map[t.alasan] = (map[t.alasan] || 0) + t.nominal; });
    return map;
  }, [transaksi, tagihan, curKey]);

  const totalBatas     = sumBy(budget, 'batas');
  const totalRealisasi = budget.reduce((s, b) => s + (realisasiMap[b.kategori] || 0), 0);
  const overCount      = budget.filter(b => (realisasiMap[b.kategori] || 0) > b.batas).length;

  const handleSave   = (item) => { upsertBudget(item); setModal(null); };
  const handleDelete = async (id) => {
    const ok = await showConfirm({ title: 'Hapus Budget', message: 'Budget ini akan dihapus.', type: 'danger' });
    if (ok) removeBudget(id);
  };

  return (
    <div className="fade-in" style={{ width: '100%', paddingBottom: 30 }}>
      {ConfirmUI}

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Periode</div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Budget {fullMonth(curMonth)} {curYear}</h2>
        </div>
        <button className="btn btn-primary" style={{ borderRadius: '24px', padding: '10px 20px', fontWeight: 700 }} onClick={() => setModal({ item: null })}>
          🎯 Tambah Budget
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Anggaran', value: fmtRp(totalBatas), color: 'var(--blue)', icon: '🎯', sub: `${budget.length} kategori dibudget` },
          { label: 'Total Realisasi', value: fmtRp(totalRealisasi), color: totalRealisasi > totalBatas ? 'var(--red)' : 'var(--text)', icon: '💸', sub: `${Math.round(totalBatas > 0 ? (totalRealisasi/totalBatas)*100 : 0)}% dari total anggaran` },
          { label: 'Kategori Over Budget', value: String(overCount), color: overCount > 0 ? 'var(--red)' : 'var(--green)', icon: overCount > 0 ? '⚠️' : '✅', sub: overCount > 0 ? 'Perlu perhatian' : 'Semua dalam batas' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text3)' }}>{s.label}</span>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '1.35rem', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Budget cards grid ── */}
      {budget.length === 0 ? (
        <div style={{ background: 'var(--card)', border: '2px dashed var(--border2)', borderRadius: 16, padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12, opacity: 0.4 }}>🎯</div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text2)', marginBottom: 6 }}>Belum ada budget</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text3)', marginBottom: 20 }}>Set anggaran per kategori untuk mulai tracking pengeluaranmu</div>
          <button className="btn btn-primary" style={{ borderRadius: 24, padding: '10px 24px' }} onClick={() => setModal({ item: null })}>Tambah Budget Pertama</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 16 }}>
          {budget
            .sort((a, b) => {
              const oa = (realisasiMap[a.kategori]||0) > a.batas;
              const ob = (realisasiMap[b.kategori]||0) > b.batas;
              if (oa && !ob) return -1;
              if (!oa && ob) return 1;
              return b.batas - a.batas;
            })
            .map(b => (
              <BudgetCard
                key={b.id}
                b={b}
                realisasi={realisasiMap[b.kategori] || 0}
                onEdit={x => setModal({ item: x })}
                onDelete={handleDelete}
              />
            ))
          }
        </div>
      )}

      {/* ── Pengeluaran tanpa budget ── */}
      {(() => {
        const tanpaBudget = Object.entries(realisasiMap)
          .filter(([k]) => !budget.find(b => b.kategori === k) && k !== 'Tidak ada pengeluaran')
          .sort((a, b) => b[1] - a[1]);
        if (tanpaBudget.length === 0) return null;
        return (
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>
              Pengeluaran tanpa budget bulan ini
            </div>
            <div style={{ background: 'var(--card)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
              {tanpaBudget.map(([kat, val], i) => (
                <div key={kat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: i < tanpaBudget.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>{kat}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.88rem', color: 'var(--orange)' }}>{fmtRp(val)}</span>
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 10 }}
                      onClick={() => setModal({ item: { kategori: kat, batas: 0 } })}>
                      + Set Budget
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {modal && (
        <BudgetForm
          item={modal.item?.id ? modal.item : (modal.item?.kategori ? modal.item : null)}
          allKategori={modal.item?.kategori ? [modal.item.kategori] : kategoriBelumBudget}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
