// ============================================================
// AsetPage.jsx — Aset & investasi tracker
// ============================================================
import { useConfirm } from '../components/ConfirmDialog';
import { useState } from 'react';
import StatCard from '../components/StatCard';
import AsetForm from '../components/forms/AsetForm';
import { fmtRp } from '../utils/format';

export default function AsetPage({ data }) {
  const { aset, upsertAset, removeAset } = data;
  const [modal, setModal] = useState(null);
  const { confirm: showConfirm, ConfirmUI } = useConfirm();

  const aktif      = aset.filter((a) => a.aktif);
  const totalBeli  = aktif.reduce((s, x) => s + (x.belitotal  || 0), 0);
  const totalPasar = aktif.filter((a) => a.hargaPasar > 0).reduce((s, a) => s + a.hargaPasar, 0);
  const totalUL    = totalPasar > 0 ? totalPasar - totalBeli : null;

  const handleSave   = (item) => { upsertAset(item); setModal(null); };
  const handleDelete = async (id) => {
    const ok = await showConfirm({ title:'Hapus Data', message:'Data ini akan dihapus permanen. Lanjutkan?', type:'danger' });
    if (ok) removeAset(id);
  };

  return (
    <div className="fade-in">
      {ConfirmUI}
      {/* Stats */}
      <div className="stats-grid mb-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard
          label="Total Harga Beli"
          value={fmtRp(totalBeli)}
          color="blue"
          sub={`${aktif.length} aset aktif`}
        />
        <StatCard
          label="Total Nilai Pasar"
          value={totalPasar > 0 ? fmtRp(totalPasar) : 'Belum diisi'}
          color="yellow"
          sub="Update manual tiap bulan"
        />
        <StatCard
          label="Untung / Rugi"
          value={totalUL !== null ? fmtRp(totalUL) : '—'}
          color={totalUL === null ? 'blue' : totalUL >= 0 ? 'green' : 'red'}
          sub={totalUL === null ? 'Isi harga pasar dulu' : totalUL >= 0 ? '🎉 Untung' : 'Rugi'}
        />
      </div>

      {/* Note */}
      <div className="aset-note mb-4">
        💡 Update kolom <strong>Harga Pasar Sekarang</strong> setiap bulan untuk tracking untung/rugi terkini
      </div>

      {/* Action */}
      <div className="flex justify-between items-center mb-4">
        <div />
        <button className="btn btn-primary" onClick={() => setModal({ item: null })}>
          + Tambah Aset
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nama Aset</th>
                <th>Jumlah / Unit</th>
                <th>Platform</th>
                <th className="right">Harga Beli</th>
                <th className="right">Harga Pasar Skrg</th>
                <th className="right">Untung / Rugi</th>
                <th>Status</th>
                <th>Catatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {aset.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-muted" style={{ padding: 36 }}>
                    Belum ada aset. Tambahkan aset pertamamu!
                  </td>
                </tr>
              ) : aset.map((a) => {
                const ul = a.hargaPasar > 0 ? a.hargaPasar - a.belitotal : null;
                return (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 700 }}>{a.nama}</td>
                    <td className="text-sub">{a.jumlah || '—'}</td>
                    <td className="text-muted text-sm">{a.platform || '—'}</td>
                    <td className="td-mono td-right text-sub">
                      {fmtRp(a.belitotal)}
                    </td>
                    <td className="td-mono td-right">
                      {a.hargaPasar > 0 ? (
                        <span style={{ color: 'var(--yellow)' }}>{fmtRp(a.hargaPasar)}</span>
                      ) : (
                        <span className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.75rem' }}>
                          Belum diisi
                        </span>
                      )}
                    </td>
                    <td
                      className="td-mono td-right"
                      style={{
                        fontWeight: 600,
                        color: ul === null
                          ? 'var(--text3)'
                          : ul >= 0 ? 'var(--green)' : 'var(--red)',
                      }}
                    >
                      {ul !== null ? `${ul >= 0 ? '+' : ''}${fmtRp(ul)}` : '—'}
                    </td>
                    <td>
                      <span className={`badge ${a.aktif ? 'green' : 'red'}`}>
                        {a.aktif ? 'Aktif' : 'Dijual'}
                      </span>
                    </td>
                    <td className="text-muted text-sm">{a.catatan || '—'}</td>
                    <td>
                      <div className="td-actions">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setModal({ item: a })}
                          title="Edit"
                        >✎</button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(a.id)}
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
        <AsetForm
          item={modal.item}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
