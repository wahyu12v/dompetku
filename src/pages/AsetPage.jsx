import { useState } from 'react';
import StatCard from '../components/StatCard';
import AsetForm from '../components/forms/AsetForm';
import { useConfirm } from '../components/ConfirmDialog';
import { fmtRp } from '../utils/format';

function AsetCard({ a, onEdit, onDelete }) {
  const ul = a.hargaPasar > 0 ? a.hargaPasar - a.belitotal : null;
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', boxShadow: 'var(--shadow)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{a.nama}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>{a.jumlah} · {a.platform}</div>
        </div>
        <span className={`badge ${a.aktif ? 'green' : 'red'}`}>{a.aktif ? 'Aktif' : 'Dijual'}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div><div style={{ fontSize: '0.62rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 2 }}>Harga Beli</div><div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: '0.82rem' }}>{fmtRp(a.belitotal)}</div></div>
        <div><div style={{ fontSize: '0.62rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 2 }}>Harga Pasar</div><div style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--yellow)', fontSize: '0.82rem' }}>{a.hargaPasar > 0 ? fmtRp(a.hargaPasar) : '—'}</div></div>
        <div><div style={{ fontSize: '0.62rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 2 }}>Untung/Rugi</div><div style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: ul === null ? 'var(--text3)' : ul >= 0 ? 'var(--green)' : 'var(--red)', fontSize: '0.82rem' }}>{ul !== null ? `${ul >= 0 ? '+' : ''}${fmtRp(ul)}` : '—'}</div></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(a)}>✎</button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(a.id)}>✕</button>
      </div>
    </div>
  );
}

export default function AsetPage({ data }) {
  const { aset, upsertAset, removeAset } = data;
  const [modal, setModal] = useState(null);
  const { confirm: showConfirm, ConfirmUI } = useConfirm();

  const aktif = aset.filter(a => a.aktif);
  const totalBeli  = aktif.reduce((s, x) => s + (x.belitotal || 0), 0);
  const totalPasar = aktif.filter(x => x.hargaPasar > 0).reduce((s, x) => s + x.hargaPasar, 0);
  const totalUL    = totalPasar > 0 ? totalPasar - totalBeli : null;

  const handleSave = (item) => { upsertAset(item); setModal(null); };
  const handleDelete = async (id) => {
    const ok = await showConfirm({ title: 'Hapus Aset', message: 'Aset ini akan dihapus permanen.', type: 'danger' });
    if (ok) removeAset(id);
  };

  return (
    <div className="fade-in">
      {ConfirmUI}
      <div className="stats-grid mb-4">
        <StatCard label="Total Harga Beli" value={fmtRp(totalBeli)} color="blue" sub={`${aktif.length} aset aktif`} />
        <StatCard label="Total Nilai Pasar" value={totalPasar > 0 ? fmtRp(totalPasar) : 'Belum diisi'} color="yellow" sub="Update manual tiap bulan" />
        <StatCard label="Untung / Rugi" value={totalUL !== null ? fmtRp(totalUL) : '—'} color={totalUL === null ? 'blue' : totalUL >= 0 ? 'green' : 'red'} sub={totalUL === null ? 'Isi harga pasar dulu' : totalUL >= 0 ? '🎉 Untung' : 'Rugi'} />
      </div>

      <div className="aset-note mb-4">💡 Update kolom <strong>Harga Pasar Sekarang</strong> setiap bulan untuk tracking untung/rugi terkini</div>

      <div className="flex justify-between items-center mb-4">
        <div />
        <button className="btn btn-primary" onClick={() => setModal({ item: null })}>+ Tambah Aset</button>
      </div>

      <div className="card">
        {/* Desktop table */}
        <div className="table-wrap mobile-hide">
          <table>
            <thead><tr>
              <th>Nama Aset</th><th>Jumlah</th><th>Platform</th>
              <th className="right">Harga Beli</th><th className="right">Harga Pasar</th>
              <th className="right">Untung/Rugi</th><th>Status</th><th>Aksi</th>
            </tr></thead>
            <tbody>
              {aset.length === 0
                ? <tr><td colSpan={8} className="text-center text-muted" style={{ padding: 36 }}>Belum ada aset</td></tr>
                : aset.map(a => {
                  const ul = a.hargaPasar > 0 ? a.hargaPasar - a.belitotal : null;
                  return (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 700 }}>{a.nama}</td>
                      <td className="text-sub">{a.jumlah || '—'}</td>
                      <td className="text-muted text-sm">{a.platform || '—'}</td>
                      <td className="td-mono td-right">{fmtRp(a.belitotal)}</td>
                      <td className="td-mono td-right" style={{ color: 'var(--yellow)' }}>{a.hargaPasar > 0 ? fmtRp(a.hargaPasar) : <span style={{ color: 'var(--text3)', fontStyle: 'italic', fontSize: '0.75rem' }}>Belum diisi</span>}</td>
                      <td className="td-mono td-right" style={{ fontWeight: 600, color: ul === null ? 'var(--text3)' : ul >= 0 ? 'var(--green)' : 'var(--red)' }}>{ul !== null ? `${ul >= 0 ? '+' : ''}${fmtRp(ul)}` : '—'}</td>
                      <td><span className={`badge ${a.aktif ? 'green' : 'red'}`}>{a.aktif ? 'Aktif' : 'Dijual'}</span></td>
                      <td><div className="td-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal({ item: a })}>✎</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>✕</button>
                      </div></td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="mobile-card-list" style={{ display: 'none' }}>
          {aset.length === 0
            ? <div className="empty-state"><p>Belum ada aset</p></div>
            : aset.map(a => <AsetCard key={a.id} a={a} onEdit={a => setModal({ item: a })} onDelete={handleDelete} />)
          }
        </div>
      </div>

      {modal && <AsetForm item={modal.item} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
