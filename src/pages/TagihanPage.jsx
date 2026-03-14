import { useState, useMemo } from 'react';
import StatCard from '../components/StatCard';
import TagihanForm from '../components/forms/TagihanForm';
import { useConfirm } from '../components/ConfirmDialog';
import { fmtRp, fmtDate, monthName } from '../utils/format';
import { filterByMonth, sumBy, getMonths, currentYearMonth, today } from '../utils/helpers';

function StatusBadge({ status }) {
  if (status === 'Sudah dibayar') return <span className="badge green">✓ Lunas</span>;
  if (status === 'Belum dibayar') return <span className="badge red">✕ Belum</span>;
  return <span className="badge yellow">? Belum Pasti</span>;
}

function TagihanCard({ t, onEdit, onDelete, onPaid }) {
  const overdue = t.batas && t.batas < today() && t.status !== 'Sudah dibayar';
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '12px 14px', boxShadow: 'var(--shadow)',
      borderLeft: `4px solid ${t.status === 'Sudah dibayar' ? 'var(--green)' : 'var(--red)'}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.alasan}{t.ket ? ` (${t.ket})` : ''}</div>
          <div style={{ fontSize: '0.72rem', color: overdue ? 'var(--red)' : 'var(--text3)', marginTop: 3 }}>Batas: {fmtDate(t.batas) || '—'}{overdue ? ' ⚠' : ''}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--orange)', fontSize: '0.95rem' }}>{fmtRp(t.nominal)}</div>
          <StatusBadge status={t.status} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 10, justifyContent: 'flex-end' }}>
        {t.status !== 'Sudah dibayar' && <button className="btn btn-success btn-sm" onClick={() => onPaid(t.id)}>✓ Lunas</button>}
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(t)}>✎</button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(t.id)}>✕</button>
      </div>
    </div>
  );
}

export default function TagihanPage({ data }) {
  const { tagihan, upsertTagihan, removeTagihan, markTagihanPaid } = data;
  const [modal, setModal] = useState(null);
  const [filterMonth, setFilterMonth] = useState(currentYearMonth());
  const [tab, setTab] = useState('semua');
  const { confirm: showConfirm, ConfirmUI } = useConfirm();

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
    return list.sort((a, b) => (a.batas || '').localeCompare(b.batas || ''));
  }, [inMonth, tab]);

  const totAll = sumBy(inMonth, 'nominal');
  const totSudah = inMonth.filter(t => t.status === 'Sudah dibayar').reduce((s, x) => s + (x.nominal || 0), 0);
  const totBelum = totAll - totSudah;

  const handleSave = (item) => { upsertTagihan(item); setModal(null); };
  const handleDelete = async (id) => {
    const ok = await showConfirm({ title: 'Hapus Tagihan', message: 'Tagihan ini akan dihapus permanen.', type: 'danger' });
    if (ok) removeTagihan(id);
  };

  return (
    <div className="fade-in">
      {ConfirmUI}
      <div className="flex justify-between items-center mb-4">
        <div />
        <button className="btn btn-primary" onClick={() => setModal({ item: null })}>+ Tambah Tagihan</button>
      </div>

      <div className="month-tabs">
        {months.map(m => {
          const [y, mo] = m.split('-');
          return <button key={m} className={`month-tab ${m === filterMonth ? 'active' : ''}`} onClick={() => setFilterMonth(m)}>{monthName(parseInt(mo))} {y}</button>;
        })}
      </div>

      <div className="stats-grid mb-4">
        <StatCard label="Total Tagihan" value={fmtRp(totAll)} color="blue" sub={`${inMonth.length} tagihan`} />
        <StatCard label="Sudah Dibayar" value={fmtRp(totSudah)} color="green" sub="Lunas" />
        <StatCard label="Belum Dibayar" value={fmtRp(totBelum)} color={totBelum > 0 ? 'red' : 'green'} sub={totBelum > 0 ? 'Perlu dibayar' : 'Semua lunas ✓'} />
      </div>

      <div className="card">
        <div className="tabs">
          {[['semua','Semua'],['belum','Belum Dibayar'],['sudah','Sudah Dibayar']].map(([k,l]) =>
            <div key={k} className={`tab ${tab===k?'active':''}`} onClick={() => setTab(k)}>{l}</div>
          )}
        </div>

        {/* Desktop table */}
        <div className="table-wrap mobile-hide">
          <table>
            <thead><tr>
              <th>Tanggal</th><th>Jenis</th><th>Keterangan</th>
              <th className="right">Nominal</th><th>Batas</th><th>Status</th><th>Aksi</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} className="text-center text-muted" style={{ padding: 36 }}>Tidak ada tagihan</td></tr>
                : filtered.map(t => {
                  const overdue = t.batas && t.batas < today() && t.status !== 'Sudah dibayar';
                  return (
                    <tr key={t.id}>
                      <td className="text-muted" style={{ fontSize: '0.76rem' }}>{fmtDate(t.tanggal)}</td>
                      <td style={{ fontWeight: 600 }}>{t.alasan}</td>
                      <td className="text-muted text-sm">{t.ket || '—'}</td>
                      <td className="td-mono td-right" style={{ color: 'var(--orange)', fontWeight: 600 }}>{fmtRp(t.nominal)}</td>
                      <td className={overdue ? 'tagihan-overdue' : 'text-sm text-muted'}>{fmtDate(t.batas)||'—'}{overdue?' ⚠':''}</td>
                      <td><StatusBadge status={t.status} /></td>
                      <td><div className="td-actions">
                        {t.status !== 'Sudah dibayar' && <button className="btn btn-success btn-sm" onClick={() => markTagihanPaid(t.id)}>✓</button>}
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal({ item: t })}>✎</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>✕</button>
                      </div></td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="mobile-card-list" style={{ display: 'none' }}>
          {filtered.length === 0
            ? <div className="empty-state"><p>Tidak ada tagihan</p></div>
            : filtered.map(t => <TagihanCard key={t.id} t={t} onEdit={t => setModal({ item: t })} onDelete={handleDelete} onPaid={markTagihanPaid} />)
          }
        </div>
      </div>

      {modal && <TagihanForm item={modal.item} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
