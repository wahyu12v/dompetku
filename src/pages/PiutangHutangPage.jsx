import { useState } from 'react';
import StatCard from '../components/StatCard';
import PiutangHutangForm from '../components/forms/PiutangHutangForm';
import { useConfirm } from '../components/ConfirmDialog';
import { fmtRp, fmtDate } from '../utils/format';
import { sumBy } from '../utils/helpers';

function StatusBadge({ status }) {
  if (status === 'Lunas')     return <span className="badge green">✓ Lunas</span>;
  if (status === 'Belum')     return <span className="badge red">✕ Belum</span>;
  if (status === 'Tidak Ada') return <span className="badge gray">—</span>;
  return <span className="badge yellow">{status || '—'}</span>;
}

// Kolom: Keterangan | Jumlah | Dibayar | Sisa | Tgl | Status | Aksi
const COLS = '2fr 130px 130px 110px 100px 90px 80px';

function NamaGroup({ nama, items, onEdit, onDelete }) {
  const [open, setOpen] = useState(true);
  const totalJumlah  = sumBy(items, 'jumlah');
  const totalDibayar = sumBy(items, 'dibayar');
  const totalSisa    = totalJumlah - totalDibayar;
  const semuaLunas   = items.every(x => x.status === 'Lunas');

  return (
    <div style={{
      marginBottom: 10,
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow)',
    }}>
      {/* ── Header group: nama + summary inline ── */}
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'grid',
          gridTemplateColumns: COLS,
          alignItems: 'center',
          gap: 0,
          padding: '11px 16px',
          cursor: 'pointer',
          userSelect: 'none',
          background: 'var(--bg3)',
          borderBottom: open ? '1px solid var(--border)' : 'none',
        }}
      >
        {/* Kolom 1: avatar + nama */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: semuaLunas ? 'var(--green-bg)' : 'var(--blue-bg)',
            color: semuaLunas ? 'var(--green)' : 'var(--accent)',
            fontWeight: 800, fontSize: '0.85rem',
          }}>
            {nama.charAt(0).toUpperCase()}
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{nama}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text3)', marginTop: 1 }}>
              {items.length} transaksi
              {semuaLunas && <span style={{ color: 'var(--green)', marginLeft: 6 }}>• Semua Lunas ✓</span>}
            </div>
          </div>
        </div>

        {/* Kolom 2: total jumlah */}
        <div style={{ textAlign: 'right', paddingRight: 8 }}>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--yellow)', fontSize: '0.88rem' }}>
            {fmtRp(totalJumlah)}
          </div>
        </div>

        {/* Kolom 3: total dibayar */}
        <div style={{ textAlign: 'right', paddingRight: 8 }}>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: totalDibayar > 0 ? 'var(--green)' : 'var(--text3)', fontSize: '0.88rem' }}>
            {totalDibayar > 0 ? fmtRp(totalDibayar) : '—'}
          </div>
        </div>

        {/* Kolom 4: sisa */}
        <div style={{ textAlign: 'right', paddingRight: 8 }}>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: totalSisa <= 0 ? 'var(--green)' : 'var(--red)', fontSize: '0.88rem' }}>
            {fmtRp(totalSisa)}
          </div>
        </div>

        {/* Kolom 5,6,7: kosong + chevron */}
        <div />
        <div />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{
            color: 'var(--text3)', fontSize: '0.75rem',
            transition: 'transform 0.2s', display: 'inline-block',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}>▼</span>
        </div>
      </div>

      {/* ── Rows ── */}
      {open && (
        <div style={{ background: 'var(--card)' }}>
          {items.map((x, i) => {
            const sisa = (x.jumlah || 0) - (x.dibayar || 0);
            return (
              <div key={x.id} style={{
                display: 'grid',
                gridTemplateColumns: COLS,
                alignItems: 'center',
                gap: 0,
                padding: '10px 16px',
                borderTop: '1px solid var(--border)',
                fontSize: '0.83rem',
              }}>
                <div style={{ color: 'var(--text2)', paddingRight: 12 }}>{x.ket || '—'}</div>
                <div style={{ fontFamily: 'var(--mono)', color: 'var(--yellow)', fontWeight: 600, textAlign: 'right', paddingRight: 8 }}>{fmtRp(x.jumlah)}</div>
                <div style={{ fontFamily: 'var(--mono)', color: x.dibayar > 0 ? 'var(--green)' : 'var(--text3)', textAlign: 'right', paddingRight: 8 }}>{x.dibayar > 0 ? fmtRp(x.dibayar) : '—'}</div>
                <div style={{ fontFamily: 'var(--mono)', color: sisa <= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700, textAlign: 'right', paddingRight: 8 }}>{fmtRp(sisa)}</div>
                <div style={{ color: 'var(--text3)', fontSize: '0.74rem' }}>{fmtDate(x.tglHutang) || '—'}</div>
                <div><StatusBadge status={x.status} /></div>
                <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => onEdit(x)}>✎</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(x.id)}>✕</button>
                </div>
              </div>
            );
          })}

          {/* ── Total row ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: COLS,
            gap: 0,
            padding: '8px 16px',
            background: 'var(--bg3)',
            borderTop: '2px solid var(--border)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text3)',
          }}>
            <div style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total {nama}</div>
            <div style={{ fontFamily: 'var(--mono)', color: 'var(--yellow)', textAlign: 'right', paddingRight: 8 }}>{fmtRp(totalJumlah)}</div>
            <div style={{ fontFamily: 'var(--mono)', color: 'var(--green)', textAlign: 'right', paddingRight: 8 }}>{totalDibayar > 0 ? fmtRp(totalDibayar) : '—'}</div>
            <div style={{ fontFamily: 'var(--mono)', color: totalSisa <= 0 ? 'var(--green)' : 'var(--red)', textAlign: 'right', paddingRight: 8 }}>{fmtRp(totalSisa)}</div>
            <div /><div /><div />
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div className="fade-in">
      {ConfirmUI}

      {/* ── Tabs ── */}
      <div className="tabs">
        <div className={`tab ${activeTab === 'piutang' ? 'active' : ''}`} onClick={() => setActiveTab('piutang')}>
          💸 Piutang — Orang yang Berhutang ke Kamu
        </div>
        <div className={`tab ${activeTab === 'hutang' ? 'active' : ''}`} onClick={() => setActiveTab('hutang')}>
          🏦 Hutangku — Kamu Berhutang ke Orang Lain
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="stats-grid mb-4">
        <StatCard
          label={isPiutang ? 'Total Piutang' : 'Total Hutang'}
          value={fmtRp(totalJumlah)}
          color={isPiutang ? 'yellow' : 'red'}
          sub={`${list.length} entri · ${Object.keys(grouped).length} orang`}
        />
        <StatCard label="Sudah Dibayar" value={fmtRp(totalDibayar)} color="green" sub="Terbayar" />
        <StatCard
          label="Sisa"
          value={fmtRp(totalSisa)}
          color={totalSisa <= 0 ? 'green' : isPiutang ? 'blue' : 'red'}
          sub={totalSisa <= 0 ? 'Lunas ✓' : 'Belum lunas'}
        />
      </div>

      {/* ── Toolbar ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button className="btn btn-primary" onClick={() => setModal({ item: null })}>
          + Tambah {isPiutang ? 'Piutang' : 'Hutang'}
        </button>
      </div>

      {/* ── Column header (hanya tampil kalau ada data) ── */}
      {list.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: COLS,
          gap: 0,
          padding: '6px 16px',
          fontSize: '0.63rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          color: 'var(--text3)',
          marginBottom: 4,
        }}>
          <div>Keterangan</div>
          <div style={{ textAlign: 'right', paddingRight: 8 }}>Jumlah</div>
          <div style={{ textAlign: 'right', paddingRight: 8 }}>Dibayar</div>
          <div style={{ textAlign: 'right', paddingRight: 8 }}>Sisa</div>
          <div>Tgl Pinjam</div>
          <div>Status</div>
          <div />
        </div>
      )}

      {/* ── Content ── */}
      {list.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">💸</div>
            <p>Belum ada data {isPiutang ? 'piutang' : 'hutang'}</p>
          </div>
        </div>
      ) : (
        Object.values(grouped).map(g => (
          <NamaGroup
            key={g.nama}
            nama={g.nama}
            items={g.items}
            onEdit={x => setModal({ item: x })}
            onDelete={handleDelete}
          />
        ))
      )}

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
