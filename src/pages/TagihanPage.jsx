// ============================================================
// TagihanPage.jsx — Tagihan & pembayaran rutin
// ============================================================
import { useState, useMemo } from 'react';
import { useConfirm } from '../components/ConfirmDialog';
import StatCard from '../components/StatCard';
import TagihanForm from '../components/forms/TagihanForm';
import { fmtRp, fmtDate, monthName } from '../utils/format';
import { filterByMonth, sumBy, getMonths, currentYearMonth, today } from '../utils/helpers';

export default function TagihanPage({ data }) {
  const { tagihan, upsertTagihan, removeTagihan, markTagihanPaid } = data;

  const [modal,       setModal]       = useState(null);
  const { confirm: showConfirm, ConfirmUI } = useConfirm();
  const [filterMonth, setFilterMonth] = useState(currentYearMonth());
  const [tab,         setTab]         = useState('semua'); // semua | belum | sudah

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
    if (tab === 'belum') list = list.filter((t) => t.status !== 'Sudah dibayar');
    if (tab === 'sudah') list = list.filter((t) => t.status === 'Sudah dibayar');
    return list.sort((a, b) => (a.batas || '').localeCompare(b.batas || ''));
  }, [inMonth, tab]);

  const totAll   = sumBy(inMonth, 'nominal');
  const totSudah = inMonth.filter((t) => t.status === 'Sudah dibayar').reduce((s, x) => s + (x.nominal || 0), 0);
  const totBelum = totAll - totSudah;

  const handleSave   = (item) => { upsertTagihan(item); setModal(null); };
  const handleDelete = async (id) => {
    const ok = await showConfirm({ title:'Hapus Tagihan', message:'Tagihan ini akan dihapus permanen. Lanjutkan?', type:'danger' });
    if (ok) removeTagihan(id);
  };

  const StatusBadge = ({ status }) => {
    if (status === 'Sudah dibayar') return <span className="badge green">✓ Lunas</span>;
    if (status === 'Belum dibayar') return <span className="badge red">✕ Belum</span>;
    return <span className="badge yellow">? Belum Pasti</span>;
  };

  return (
    <div className="fade-in">
      {ConfirmUI}
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <div />
        <button className="btn btn-primary" onClick={() => setModal({ item: null })}>
          + Tambah Tagihan
        </button>
      </div>

      {/* Month tabs */}
      <div className="month-tabs">
        {months.map((m) => {
          const [y, mo] = m.split('-');
          return (
            <button
              key={m}
              className={`month-tab ${m === filterMonth ? 'active' : ''}`}
              onClick={() => setFilterMonth(m)}
            >
              {monthName(parseInt(mo))} {y}
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="stats-grid mb-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard label="Total Tagihan"    value={fmtRp(totAll)}   color="blue"  sub={`${inMonth.length} tagihan`} />
        <StatCard label="Sudah Dibayar"    value={fmtRp(totSudah)} color="green" sub="Lunas" />
        <StatCard label="Belum Dibayar"    value={fmtRp(totBelum)} color={totBelum > 0 ? 'red' : 'green'} sub={totBelum > 0 ? 'Perlu dibayar' : 'Semua lunas ✓'} />
      </div>

      {/* Table */}
      <div className="card">
        <div className="tabs">
          {[
            { key: 'semua', label: 'Semua' },
            { key: 'belum', label: 'Belum Dibayar' },
            { key: 'sudah', label: 'Sudah Dibayar' },
          ].map(({ key, label }) => (
            <div
              key={key}
              className={`tab ${tab === key ? 'active' : ''}`}
              onClick={() => setTab(key)}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jenis Tagihan</th>
                <th>Keterangan</th>
                <th className="right">Nominal</th>
                <th>Batas Waktu</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted" style={{ padding: 36 }}>
                    Tidak ada tagihan
                  </td>
                </tr>
              ) : filtered.map((t) => {
                const isOverdue = t.batas && t.batas < today() && t.status !== 'Sudah dibayar';
                return (
                  <tr key={t.id}>
                    <td className="text-muted" style={{ fontSize: '0.76rem', whiteSpace: 'nowrap' }}>
                      {fmtDate(t.tanggal)}
                    </td>
                    <td style={{ fontWeight: 600 }}>{t.alasan}</td>
                    <td className="text-muted text-sm">{t.ket || '—'}</td>
                    <td
                      className="td-mono td-right"
                      style={{ color: 'var(--orange)', fontWeight: 600 }}
                    >
                      {fmtRp(t.nominal)}
                    </td>
                    <td
                      className={`text-sm ${isOverdue ? 'tagihan-overdue' : 'text-muted'}`}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {fmtDate(t.batas) || '—'}
                      {isOverdue && ' ⚠'}
                    </td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>
                      <div className="td-actions">
                        {t.status !== 'Sudah dibayar' && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => markTagihanPaid(t.id)}
                            title="Tandai Lunas"
                          >✓</button>
                        )}
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setModal({ item: t })}
                          title="Edit"
                        >✎</button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(t.id)}
                          title="Hapus"
                        >✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <TagihanForm
          item={modal.item}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
