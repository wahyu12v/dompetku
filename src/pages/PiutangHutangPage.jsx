import { useState } from 'react';
import StatCard from '../components/StatCard';
import PiutangHutangForm from '../components/forms/PiutangHutangForm';
import { useConfirm } from '../components/ConfirmDialog';
import { fmtRp, fmtDate } from '../utils/format';
import { sumBy } from '../utils/helpers';

function StatusBadge({ status }) {
  if (status === 'Lunas') return <span className="badge green">✓ Lunas</span>;
  if (status === 'Belum') return <span className="badge red">✕ Belum</span>;
  if (status === 'Tidak Ada') return <span className="badge gray">—</span>;
  return <span className="badge yellow">{status || '—'}</span>;
}

function PHCard({ x, onEdit, onDelete }) {
  const sisa = (x.jumlah || 0) - (x.dibayar || 0);
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', boxShadow: 'var(--shadow)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{x.dari || x.nama || '—'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 3 }}>{x.ket || '—'}</div>
        </div>
        <StatusBadge status={x.status} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div><div style={{ fontSize: '0.62rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 2 }}>Jumlah</div><div style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--yellow)', fontSize: '0.85rem' }}>{fmtRp(x.jumlah)}</div></div>
        <div><div style={{ fontSize: '0.62rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 2 }}>Dibayar</div><div style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--green)', fontSize: '0.85rem' }}>{x.dibayar > 0 ? fmtRp(x.dibayar) : '—'}</div></div>
        <div><div style={{ fontSize: '0.62rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 2 }}>Sisa</div><div style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: sisa <= 0 ? 'var(--green)' : 'var(--red)', fontSize: '0.85rem' }}>{fmtRp(sisa)}</div></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>📅 {fmtDate(x.tglHutang) || '—'}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => onEdit(x)}>✎</button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(x.id)}>✕</button>
        </div>
      </div>
    </div>
  );
}

export default function PiutangHutangPage({ data }) {
  const { piutang, upsertPiutang, removePiutang, hutang, upsertHutang, removeHutang } = data;
  const [modal, setModal] = useState(null);
  const [activeTab, setActiveTab] = useState('piutang');
  const { confirm: showConfirm, ConfirmUI } = useConfirm();

  const isPiutang = activeTab === 'piutang';
  const list = isPiutang ? piutang : hutang;
  const upsert = isPiutang ? upsertPiutang : upsertHutang;
  const removeFn = isPiutang ? removePiutang : removeHutang;

  const totalJumlah = sumBy(list, 'jumlah');
  const totalDibayar = sumBy(list, 'dibayar');
  const totalSisa = totalJumlah - totalDibayar;

  const handleSave = (item) => { upsert(item); setModal(null); };
  const handleDelete = async (id) => {
    const ok = await showConfirm({ title: 'Hapus Data', message: 'Data ini akan dihapus permanen.', type: 'danger' });
    if (ok) removeFn(id);
  };

  return (
    <div className="fade-in">
      {ConfirmUI}
      <div className="tabs">
        <div className={`tab ${activeTab === 'piutang' ? 'active' : ''}`} onClick={() => setActiveTab('piutang')}>💸 Piutang</div>
        <div className={`tab ${activeTab === 'hutang' ? 'active' : ''}`} onClick={() => setActiveTab('hutang')}>🏦 Hutangku</div>
      </div>

      <div className="stats-grid mb-4">
        <StatCard label={isPiutang ? 'Total Piutang' : 'Total Hutang'} value={fmtRp(totalJumlah)} color={isPiutang ? 'yellow' : 'red'} sub={`${list.length} entri`} />
        <StatCard label="Sudah Dibayar" value={fmtRp(totalDibayar)} color="green" sub="Terbayar" />
        <StatCard label="Sisa" value={fmtRp(totalSisa)} color={totalSisa <= 0 ? 'green' : isPiutang ? 'blue' : 'red'} sub={totalSisa <= 0 ? 'Lunas ✓' : 'Belum lunas'} />
      </div>

      <div className="flex justify-between items-center mb-4">
        <div />
        <button className="btn btn-primary" onClick={() => setModal({ item: null })}>+ Tambah {isPiutang ? 'Piutang' : 'Hutang'}</button>
      </div>

      <div className="card">
        {/* Desktop table */}
        <div className="table-wrap mobile-hide">
          <table>
            <thead><tr>
              <th>{isPiutang ? 'Dari Siapa' : 'Kepada Siapa'}</th><th>Keterangan</th>
              <th className="right">Jumlah</th><th className="right">Dibayar</th>
              <th className="right">Sisa</th><th>Tgl Hutang</th><th>Status</th><th>Aksi</th>
            </tr></thead>
            <tbody>
              {list.length === 0
                ? <tr><td colSpan={8} className="text-center text-muted" style={{ padding: 36 }}>Belum ada data</td></tr>
                : list.map(x => {
                  const sisa = (x.jumlah || 0) - (x.dibayar || 0);
                  return (
                    <tr key={x.id}>
                      <td style={{ fontWeight: 700 }}>{x.dari || x.nama || '—'}</td>
                      <td className="text-muted" style={{ fontSize: '0.78rem', maxWidth: 180 }}>{x.ket || '—'}</td>
                      <td className="td-mono td-right text-yellow">{fmtRp(x.jumlah)}</td>
                      <td className="td-mono td-right" style={{ color: x.dibayar > 0 ? 'var(--green)' : 'var(--text3)' }}>{x.dibayar > 0 ? fmtRp(x.dibayar) : '—'}</td>
                      <td className="td-mono td-right" style={{ fontWeight: 600, color: sisa <= 0 ? 'var(--green)' : 'var(--red)' }}>{fmtRp(sisa)}</td>
                      <td className="text-muted" style={{ fontSize: '0.76rem' }}>{fmtDate(x.tglHutang) || '—'}</td>
                      <td><StatusBadge status={x.status} /></td>
                      <td><div className="td-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal({ item: x })}>✎</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(x.id)}>✕</button>
                      </div></td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="mobile-card-list" style={{ display: 'none' }}>
          {list.length === 0
            ? <div className="empty-state"><p>Belum ada data {isPiutang ? 'piutang' : 'hutang'}</p></div>
            : list.map(x => <PHCard key={x.id} x={x} onEdit={x => setModal({ item: x })} onDelete={handleDelete} />)
          }
        </div>
      </div>

      {modal && <PiutangHutangForm item={modal.item} mode={activeTab} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
