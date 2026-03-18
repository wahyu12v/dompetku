import { useState, useEffect } from 'react';
import AsetForm, { JENIS_ASET } from '../components/forms/AsetForm';
import { useConfirm } from '../components/ConfirmDialog';
import { fmtRp } from '../utils/format';

// ── Mapping jenis aset ke CoinGecko ID ─────────────────────
const COINGECKO_MAP = {
  emas:  { id: 'tether-gold', perUnit: 'gram', convFactor: 1 / 31.1035 },
  btc:   { id: 'bitcoin',     perUnit: 'BTC',  convFactor: 1 },
  eth:   { id: 'ethereum',    perUnit: 'ETH',  convFactor: 1 },
  bnb:   { id: 'binancecoin', perUnit: 'BNB',  convFactor: 1 },
  usdt:  { id: 'tether',      perUnit: 'USDT', convFactor: 1 },
};

const ALL_IDS = Object.values(COINGECKO_MAP).map(c => c.id).join(',');

async function fetchSemuaHarga() {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ALL_IDS}&vs_currencies=idr`;
    const res  = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    const result = {};
    for (const [jenis, cfg] of Object.entries(COINGECKO_MAP)) {
      const raw = json[cfg.id]?.idr;
      if (raw) result[jenis] = Math.round(raw * cfg.convFactor);
    }
    return result;
  } catch (err) {
    return null;
  }
}

// ── Helper: jumlah efektif aset ─────────────────────────────
// Menangani data lama emas yang tersimpan dengan jumlah=0.
// Jika jumlah=0 dan ini adalah emas dengan belitotal & hargaPasar valid,
// gram dapat diturunkan dari keduanya sehingga P/L tetap bisa dihitung.
function getEffectiveJumlah(a) {
  const raw = parseFloat(String(a.jumlah ?? '').replace(/[^0-9.]/g, '')) || 0;
  if (raw === 0 && a.jenisAset === 'emas' && a.belitotal > 0 && a.hargaPasar > 0) {
    return a.belitotal / a.hargaPasar;
  }
  return raw;
}

// ── Inline edit harga pasar (HANYA UNTUK ASET MANUAL) ───────
function InlineHargaEdit({ aset, onSave }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal]         = useState(aset.hargaPasar || 0);

  if (editing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}>
        <input
          type="number"
          style={{
            width: '100%', maxWidth: '100px', minWidth: '70px', padding: '4px 8px', fontSize: '0.8rem',
            border: '1.5px solid var(--accent)', borderRadius: '6px',
            fontFamily: 'var(--mono)', background: 'var(--bg2)',
            color: 'var(--text)', boxSizing: 'border-box'
          }}
          value={val}
          onChange={e => setVal(Number(e.target.value))}
          onKeyDown={e => {
            if (e.key === 'Enter') { onSave(val); setEditing(false); }
            if (e.key === 'Escape') setEditing(false);
          }}
          autoFocus
        />
        <button
          onClick={() => { onSave(val); setEditing(false); }}
          style={{ background: 'var(--green-bg)', border: '1px solid #86efac', color: 'var(--green2)', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >✓</button>
        <button
          onClick={() => setEditing(false)}
          style={{ background: 'var(--red-bg)', border: '1px solid #fca5a5', color: 'var(--red)', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >✕</button>
      </div>
    );
  }

  return (
    <div
      onClick={() => { setVal(aset.hargaPasar || 0); setEditing(true); }}
      title="Klik untuk edit harga pasar"
      style={{
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontFamily: 'var(--mono)', color: aset.hargaPasar > 0 ? 'var(--orange)' : 'var(--text3)',
        fontSize: '0.85rem', fontWeight: 700,
        padding: '4px 8px', borderRadius: '6px',
        border: '1px dashed var(--border2)',
        transition: 'background 0.2s', whiteSpace: 'nowrap'
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {aset.hargaPasar > 0 ? fmtRp(aset.hargaPasar) : <span style={{ fontStyle: 'italic', fontSize: '0.75rem', fontWeight: 500 }}>Klik isi harga</span>}
      <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>✎</span>
    </div>
  );
}

// ── Mobile card ─────────────────────────────────────────────
function AsetCard({ a, onEdit, onDelete, onSaveHarga }) {
  const jumlah       = getEffectiveJumlah(a);
  const nilaiSekarang = a.hargaPasar > 0 ? a.hargaPasar * jumlah : 0;
  const ul           = nilaiSekarang > 0 ? nilaiSekarang - a.belitotal : null;
  const jenis        = JENIS_ASET.find(j => j.value === a.jenisAset);
  const isAuto       = !!COINGECKO_MAP[a.jenisAset];

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', marginBottom: '12px', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.nama}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 4, fontWeight: 600 }}>
            {jenis?.label || a.jenisAset || 'Lainnya'} · {a.jumlah} · {a.platform}
          </div>
        </div>
        <span className={`badge ${a.aktif ? 'green' : 'red'}`} style={{ flexShrink: 0, padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem' }}>
          {a.aktif ? 'Aktif' : 'Dijual'}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', background: 'var(--bg3)', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
        <div style={{ flex: '1 1 30%', minWidth: '80px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 800 }}>Harga Beli</div>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.85rem' }}>{fmtRp(a.belitotal)}</div>
        </div>
        <div style={{ flex: '1 1 30%', minWidth: '100px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 800 }}>Harga Pasar</div>
          {isAuto ? (
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '0.85rem', color: 'var(--text)' }}>
              {fmtRp(a.hargaPasar)}
            </div>
          ) : (
            <InlineHargaEdit aset={a} onSave={onSaveHarga} />
          )}
        </div>
        <div style={{ flex: '1 1 30%', minWidth: '80px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 800 }}>Untung/Rugi</div>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: ul === null ? 'var(--text3)' : ul >= 0 ? 'var(--green)' : 'var(--red)', fontSize: '0.85rem' }}>
            {ul !== null ? `${ul >= 0 ? '+' : ''}${fmtRp(ul)}` : '—'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button className="btn btn-ghost btn-sm" style={{ padding: '6px 16px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, background: 'var(--bg)' }} onClick={() => onEdit(a)}>Edit</button>
        <button className="btn btn-ghost btn-sm" style={{ padding: '6px 16px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--red)', background: 'var(--red-bg)', border: 'none' }} onClick={() => onDelete(a.id)}>Hapus</button>
      </div>
    </div>
  );
}

// ── Stat mini card ─────────────────────────────────────────
function MiniStat({ label, value, color, sub, icon }) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      display: 'flex', flexDirection: 'column', gap: 6, boxSizing: 'border-box', width: '100%'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</div>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text3)' }}>{label}</div>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '1.4rem', color, wordBreak: 'break-word', lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text2)', fontWeight: 500, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────
export default function AsetPage({ data }) {
  const { aset, upsertAset, removeAset } = data;
  const [modal,     setModal]     = useState(null);
  const [updating,  setUpdating]  = useState(false);
  const [updateLog, setUpdateLog] = useState(null); 
  const { confirm: showConfirm, ConfirmUI } = useConfirm();

  // ── Auto-repair saat mount: perbaiki data emas lama dengan jumlah=0 ──
  // Jika ada record emas lama yang tersimpan jumlah=0 (bug versi sebelumnya),
  // hitung ulang gram dari belitotal / hargaPasar dan simpan permanen.
  useEffect(() => {
    aset.forEach(a => {
      if (a.jenisAset !== 'emas') return;
      const jumlahTersimpan = parseFloat(String(a.jumlah ?? '').replace(/[^0-9.]/g, '')) || 0;
      if (jumlahTersimpan === 0 && a.belitotal > 0 && a.hargaPasar > 0) {
        const gramDerived = a.belitotal / a.hargaPasar;
        upsertAset({ ...a, jumlah: gramDerived });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Hanya satu kali saat komponen mount

  const aktif     = aset.filter(a => a.aktif);
  const totalBeli = aktif.reduce((s, x) => s + (x.belitotal || 0), 0);

  // Total nilai pasar = Σ (hargaPasar_per_unit × jumlah)
  const totalPasar = aktif
    .filter(x => x.hargaPasar > 0)
    .reduce((s, x) => {
      const jumlah = getEffectiveJumlah(x);
      return s + (x.hargaPasar * jumlah);
    }, 0);

  const totalUL = totalPasar > 0 ? totalPasar - totalBeli : null;

  // ── Auto Fetch Saat Buka Halaman ───────────────────────────
  useEffect(() => {
    let mounted = true;
    const fetchOtomatisLatarBelakang = async () => {
      const updatable = aset.filter(a => a.aktif && COINGECKO_MAP[a.jenisAset]);
      if (updatable.length === 0) return;

      const hargaMap = await fetchSemuaHarga();
      if (!hargaMap || !mounted) return;

      updatable.forEach(a => {
        const hargaPerUnit = hargaMap[a.jenisAset];
        if (!hargaPerUnit) return;
        // Simpan harga PER UNIT (bukan dikalikan jumlah)
        const hargaBaru = Math.round(hargaPerUnit);
        if (a.hargaPasar !== hargaBaru) {
          upsertAset({ ...a, hargaPasar: hargaBaru });
        }
      });
    };
    fetchOtomatisLatarBelakang();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Hanya dipanggil 1 kali saat komponen dipasang

  const handleSave      = (item) => { upsertAset(item); setModal(null); };
  const handleSaveHarga = (id, harga) => {
    const found = aset.find(a => a.id === id);
    if (found) upsertAset({ ...found, hargaPasar: harga });
  };
  const handleDelete = async (id) => {
    const ok = await showConfirm({ title: 'Hapus Aset', message: 'Aset ini akan dihapus permanen.', type: 'danger' });
    if (ok) removeAset(id);
  };

  const handleUpdateOtomatis = async () => {
    setUpdating(true);
    setUpdateLog(null);

    const updatable = aset.filter(a => a.aktif && COINGECKO_MAP[a.jenisAset]);
    if (updatable.length === 0) {
      setUpdateLog({ gagal: true, msg: 'Tidak ada aset yang bisa diupdate otomatis. Tambah aset jenis Emas atau Kripto, lalu pastikan Jenis Aset sudah diset di form.' });
      setUpdating(false);
      return;
    }

    const hargaMap = await fetchSemuaHarga();

    if (!hargaMap) {
      setUpdateLog({ gagal: true, msg: '⚠ Gagal mengambil data dari CoinGecko. Periksa koneksi internet lalu coba lagi.' });
      setUpdating(false);
      return;
    }

    let updated = 0, gagal = 0;
    const detail = [];

    aset.forEach(a => {
      if (!a.aktif || !COINGECKO_MAP[a.jenisAset]) return;
      const hargaPerUnit = hargaMap[a.jenisAset];
      if (!hargaPerUnit) { gagal++; return; }

      // Simpan harga PER UNIT (bukan dikalikan jumlah)
      const hargaBaru = Math.round(hargaPerUnit);
      upsertAset({ ...a, hargaPasar: hargaBaru });
      updated++;

      const jenis = JENIS_ASET.find(j => j.value === a.jenisAset);
      if (!detail.find(d => d.jenis === (jenis?.label || a.jenisAset))) {
        detail.push({
          jenis: jenis?.label || a.jenisAset,
          hargaPerUnit,
        });
      }
    });

    setUpdateLog({ updated, gagal, detail, gagalFetch: false });
    setUpdating(false);
  };

  const autoCount = aktif.filter(a => COINGECKO_MAP[a.jenisAset]).length;

  return (
    <div className="fade-in" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden', paddingBottom: '30px' }}>
      {ConfirmUI}

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '16px', marginBottom: '24px', width: '100%' }}>
        <MiniStat label="Total Harga Beli"  value={fmtRp(totalBeli)} color="var(--blue)"   icon="🛒" sub={`${aktif.length} aset aktif`} />
        <MiniStat label="Total Nilai Pasar" value={totalPasar > 0 ? fmtRp(totalPasar) : 'Belum diisi'} color="var(--orange)" icon="📈" sub="Berdasarkan harga terkini" />
        <MiniStat label="Untung / Rugi"     value={totalUL !== null ? fmtRp(totalUL) : '—'} color={totalUL === null ? 'var(--text3)' : totalUL >= 0 ? 'var(--green)' : 'var(--red)'} icon={totalUL >= 0 ? '💸' : '📉'} sub={totalUL === null ? 'Isi harga pasar dulu' : totalUL >= 0 ? 'Posisi Profit' : 'Posisi Rugi'} />
      </div>

      {/* ── Update otomatis banner ── */}
      <div style={{
        background: 'var(--blue-bg)', border: '1px solid #bfdbfe',
        borderRadius: '16px', padding: '16px 20px', marginBottom: '16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
        boxSizing: 'border-box', width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ flex: '1 1 250px' }}>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🔄 Update Harga Otomatis
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: 4, lineHeight: 1.4 }}>
            {autoCount > 0
              ? `${autoCount} aset aktif bisa diupdate otomatis (Emas & Kripto) via CoinGecko`
              : 'Tandai aset sebagai Emas atau Kripto di form untuk mengaktifkan auto-update'}
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleUpdateOtomatis}
          disabled={updating || autoCount === 0}
          style={{ whiteSpace: 'nowrap', borderRadius: '24px', padding: '10px 20px', fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          {updating ? '⏳ Mengambil data...' : `🔄 Update ${autoCount} Aset`}
        </button>
      </div>

      {/* ── Log hasil update ── */}
      {updateLog && (
        <div style={{
          background: (updateLog.gagal === true || updateLog.gagal > 0) ? 'var(--yellow-bg)' : 'var(--green-bg)',
          border: `1px solid ${(updateLog.gagal === true || updateLog.gagal > 0) ? '#fcd34d' : '#86efac'}`,
          borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', position: 'relative',
          boxSizing: 'border-box', width: '100%', display: 'flex', flexDirection: 'column', gap: '8px'
        }}>
          {updateLog.msg ? (
            <div style={{ fontSize: '0.85rem', color: 'var(--text2)', paddingRight: 28, fontWeight: 600 }}>{updateLog.msg}</div>
          ) : (
            <>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--green2)', paddingRight: 28 }}>
                ✓ Update Selesai
                <span style={{ fontWeight: 600, color: 'var(--text2)', marginLeft: '8px' }}>
                  ({updateLog.updated} aset diperbarui{updateLog.gagal > 0 ? `, ${updateLog.gagal} gagal` : ''})
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '4px' }}>
                {updateLog.detail?.map((d, i) => (
                  <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                    <span style={{ color: 'var(--text2)' }}>{d.jenis}:</span> <strong style={{ fontFamily: 'var(--mono)' }}>{fmtRp(d.hargaPerUnit)}<span style={{ fontSize: '0.7rem', color: 'var(--text3)', fontWeight: 600 }}>/unit</span></strong>
                  </div>
                ))}
              </div>
              {updateLog.gagal > 0 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--yellow2)', marginTop: '4px', fontWeight: 600 }}>
                  ⚠ Beberapa aset gagal diperbarui. Pastikan jenis aset didukung API CoinGecko.
                </div>
              )}
            </>
          )}
          <button onClick={() => setUpdateLog(null)} style={{ position: 'absolute', top: 12, right: 16, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
      )}

      {/* ── Master Card Pembungkus Tabel & Kontrol ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '16px' }}>
        
        {/* Header Tabel */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'transparent', gap: '16px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💡 <span>Aset <strong>Kripto & Emas</strong> diupdate otomatis. Aset lain klik di tabel untuk edit manual.</span>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ borderRadius: '24px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }} 
            onClick={() => setModal({ item: null })}
          >
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>＋</span> Tambah Aset
          </button>
        </div>

        {/* ── Tabel desktop ── */}
        <div className="table-wrap mobile-hide">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'transparent', borderBottom: '2px solid var(--border)' }}>
                <th style={{ background: 'transparent', padding: '16px 24px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>Nama Aset</th>
                <th style={{ background: 'transparent', padding: '16px 24px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>Jenis / Kategori</th>
                <th style={{ background: 'transparent', padding: '16px 24px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>Platform</th>
                <th style={{ background: 'transparent', textAlign: 'right', padding: '16px 24px', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>Harga Beli</th>
                <th style={{ background: 'transparent', textAlign: 'center', padding: '16px 24px', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>Harga Pasar</th>
                <th style={{ background: 'transparent', textAlign: 'right', padding: '16px 24px', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>P/L</th>
                <th style={{ background: 'transparent', padding: '16px 24px', textAlign: 'center', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ background: 'transparent', padding: '16px 24px', textAlign: 'center', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {aset.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text3)', padding: '60px 20px', fontSize: '0.9rem' }}>Belum ada portofolio aset yang tercatat</td></tr>
              ) : aset.map(a => {
                // nilaiSekarang = hargaPasar (per unit) × jumlah
                const jumlah       = getEffectiveJumlah(a);
                const nilaiSekarang = a.hargaPasar > 0 ? a.hargaPasar * jumlah : 0;
                const ul           = nilaiSekarang > 0 ? nilaiSekarang - a.belitotal : null;
                const jenis        = JENIS_ASET.find(j => j.value === a.jenisAset);
                const isAuto       = !!COINGECKO_MAP[a.jenisAset];

                return (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s', background: 'transparent' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text)' }}>{a.nama}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 4 }}>Jumlah: <span style={{ fontWeight: 600, color: 'var(--text2)' }}>{a.jumlah}</span></div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isAuto ? 'var(--blue)' : 'var(--text2)', background: isAuto ? 'var(--blue-bg)' : 'var(--bg3)', padding: '4px 10px', borderRadius: '20px' }}>
                        {jenis?.label || 'Lainnya'} {isAuto && '🔄'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text2)', fontWeight: 600 }}>{a.platform || '—'}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '0.9rem', fontWeight: 700 }}>{fmtRp(a.belitotal)}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      {isAuto ? (
                        <span style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text)' }}>
                          {fmtRp(a.hargaPasar)}
                        </span>
                      ) : (
                        <InlineHargaEdit aset={a} onSave={(harga) => handleSaveHarga(a.id, harga)} />
                      )}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '0.9rem', color: ul === null ? 'var(--text3)' : ul >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {ul !== null ? `${ul >= 0 ? '+' : ''}${fmtRp(ul)}` : '—'}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <span className={`badge ${a.aktif ? 'green' : 'red'}`} style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem' }}>{a.aktif ? 'Aktif' : 'Dijual'}</span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '6px 12px' }} onClick={() => setModal({ item: a })}>✎</button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '6px 12px', color: 'var(--red)' }} onClick={() => handleDelete(a.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Mobile card list ── */}
        <div className="mobile-card-list" style={{ padding: '16px', background: 'var(--bg)' }}>
          {aset.length === 0
            ? <div className="empty-state" style={{ padding: '60px 20px', border: '1px solid var(--border)', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.5 }}>💼</div>
                <p style={{ fontWeight: 700, color: 'var(--text2)' }}>Belum ada aset</p>
              </div>
            : aset.map(a => (
              <AsetCard
                key={a.id} a={a}
                onEdit={x => setModal({ item: x })}
                onDelete={handleDelete}
                onSaveHarga={harga => handleSaveHarga(a.id, harga)}
              />
            ))
          }
        </div>
      </div>

      {modal && <AsetForm item={modal.item} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
