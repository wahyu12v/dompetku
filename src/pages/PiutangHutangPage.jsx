// ============================================================
// PiutangHutangPage.jsx — Tracker piutang & hutang
// ============================================================
import { useState } from 'react';
import StatCard from '../components/StatCard';
import PiutangHutangForm from '../components/forms/PiutangHutangForm';
import { useConfirm } from '../components/ConfirmDialog';
import { fmtRp, fmtDate } from '../utils/format';
import { sumBy } from '../utils/helpers';

export default function PiutangHutangPage({ data }) {
  const { piutang, upsertPiutang, removePiutang, hutang, upsertHutang, removeHutang } = data;

  const [modal,     setModal]     = useState(null);
  const [activeTab, setActiveTab] = useState('piutang');

  // rename to showConfirm to avoid conflict with window.confirm / eslint restricted-globals
  const { confirm: showConfirm, ConfirmUI } = useConfirm();

  const isPiutang = activeTab === 'piutang';
  const list      = isPiutang ? piutang : hutang;
  const upsert    = isPiutang ? upsertPiutang : upsertHutang;
  const removeFn  = isPiutang ? removePiutang : removeHutang;

  const totalJumlah  = sumBy(list, 'jumlah');
  const totalDibayar = sumBy(list, 'dibayar');
  const totalSisa    = totalJumlah - totalDibayar;

  const handleSave   = (item) => { upsert(item); setModal(null); };
  const handleDelete = async (id) => {
    const ok = await showConfirm({
      title:   'Hapus Data',
      message: 'Data ini akan dihapus permanen. Lanjutkan?',
      type:    'danger',
    });
    if (ok) removeFn(id);
  };

  const StatusBadge = ({ status }) => {
    if (status === 'Lunas')     return <span className="badge green">✓ Lunas</span>;
    if (status === 'Belum')     return <span className="badge red">✕ Belum</span>;
    if (status === 'Tidak Ada') return <span className="badge gray">—</span>;
    return <span className="badge yellow">{status || '—'}</span>;
  };

  return (
    <div className="fade-in">
      {ConfirmUI}

      {/* Mode tabs */}
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'piutang' ? 'active' : ''}`}
          onClick={() => setActiveTab('piutang')}
        >
          💸 Piutang — Orang yang Berhutang ke Kamu
        </div>
        <div
          className={`tab ${activeTab === 'hutang' ? 'active' : ''}`}
          onClick={() => setActiveTab('hutang')}
        >
          🏦 Hutangmu — Kamu Berhutang ke Orang Lain
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid mb-4">
        <StatCard
          label={isPiutang ? 'Total Piutang' : 'Total Hutang'}
          value={fmtRp(totalJumlah)}
          color={isPiutang ? 'yellow' : 'red'}
          sub={`${list.length} entri`}
        />
        <StatCard
          label="Sudah Dibayar"
          value={fmtRp(totalDibayar)}
          color="green"
          sub="Terbayar"
        />
        <StatCard
          label="Sisa"
          value={fmtRp(totalSisa)}
          color={totalSisa <= 0 ? 'green' : isPiutang ? 'blue' : 'red'}
          sub={totalSisa <= 0 ? 'Semua lunas ✓' : 'Belum lunas'}
        />
      </div>

      {/* Action */}
      <div className="flex justify-between items-center mb-4">
        <div />
        <button className="btn btn-primary" onClick={() => setModal({ item: null })}>
          + Tambah {isPiutang ? 'Piutang' : 'Hutang'}
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{isPiutang ? 'Dari Siapa' : 'Kepada Siapa'}</th>
                <th>Keterangan</th>
                <th className="right">Jumlah</th>
                <th className="right">Dibayar</th>
                <th className="right">Sisa</th>
                <th>Tgl Hutang</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted" style={{ padding: 36 }}>
                    Belum ada data {isPiutang ? 'piutang' : 'hutang'}
                  </td>
                </tr>
              ) : list.map((x) => {
                const sisa = (x.jumlah || 0) - (x.dibayar || 0);
                return (
                  <tr key={x.id}>
                    <td style={{ fontWeight: 700 }}>{x.dari || x.nama || '—'}</td>
                    <td className="text-muted" style={{ fontSize: '0.78rem', maxWidth: 200 }}>{x.ket || '—'}</td>
                    <td className="td-mono td-right text-yellow">{fmtRp(x.jumlah)}</td>
                    <td className="td-mono td-right" style={{ color: x.dibayar > 0 ? 'var(--green)' : 'var(--text3)' }}>
                      {x.dibayar > 0 ? fmtRp(x.dibayar) : '—'}
                    </td>
                    <td className="td-mono td-right" style={{ fontWeight: 600, color: sisa <= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {fmtRp(sisa)}
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.76rem', whiteSpace: 'nowrap' }}>
                      {fmtDate(x.tglHutang) || '—'}
                    </td>
                    <td><StatusBadge status={x.status} /></td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal({ item: x })} title="Edit">✎</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(x.id)} title="Hapus">✕</button>
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
