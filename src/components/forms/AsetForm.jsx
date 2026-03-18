// ============================================================
// AsetForm.jsx — Form tambah/edit aset & investasi
// ============================================================
import { useState, useEffect } from 'react';
import Modal from '../Modal';
import RupiahInput from '../RupiahInput';
import { genId } from '../../utils/helpers';

export const JENIS_ASET = [
  { value: 'emas',      label: '🥇 Emas (Antam/gram)',  auto: true,  satuan: 'gram' },
  { value: 'btc',       label: '₿ Bitcoin (BTC)',        auto: true,  satuan: 'BTC'  },
  { value: 'eth',       label: '⟠ Ethereum (ETH)',       auto: true,  satuan: 'ETH'  },
  { value: 'bnb',       label: '🔶 BNB',                 auto: true,  satuan: 'BNB'  },
  { value: 'usdt',      label: '💵 USDT / Stablecoin',   auto: true,  satuan: 'USDT' },
  { value: 'saham',     label: '📈 Saham IDX',           auto: false, satuan: 'lot'  },
  { value: 'reksadana', label: '📊 Reksa Dana',          auto: false, satuan: 'unit' },
  { value: 'properti',  label: '🏠 Properti / Tanah',    auto: false, satuan: 'unit' },
  { value: 'lainnya',   label: '📦 Lainnya',             auto: false, satuan: 'unit' },
];

const COINGECKO_MAP = {
  emas:  { id: 'tether-gold', convFactor: 1 / 31.1035 },
  btc:   { id: 'bitcoin',     convFactor: 1 },
  eth:   { id: 'ethereum',    convFactor: 1 },
  bnb:   { id: 'binancecoin', convFactor: 1 },
  usdt:  { id: 'tether',      convFactor: 1 },
};

async function fetchHargaJenis(jenis) {
  const cfg = COINGECKO_MAP[jenis];
  if (!cfg) return null;
  try {
    const url  = `https://api.coingecko.com/api/v3/simple/price?ids=${cfg.id}&vs_currencies=idr`;
    const res  = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    const raw  = json[cfg.id]?.idr;
    return raw ? Math.round(raw * cfg.convFactor) : null;
  } catch {
    return null;
  }
}

const DEFAULT = {
  nama: '', jenisAset: 'emas', jumlah: '',
  belitotal: 0, platform: '', aktif: true,
  hargaPasar: 0, catatan: '',
};

export default function AsetForm({ item, onSave, onClose }) {

  const [form, setForm] = useState(item
    ? {
        ...item,
        belitotal:  Number(item.belitotal)  || 0,
        hargaPasar: Number(item.hargaPasar) || 0,
        jumlah: (parseFloat(item.jumlah) || 0) > 0 ? String(item.jumlah) : '',
      }
    : DEFAULT
  );

  const [fetchingHarga, setFetchingHarga] = useState(false);
  const [hargaAutoInfo, setHargaAutoInfo] = useState(null);
  const [errors,        setErrors]        = useState({});

  const selectedJenis = JENIS_ASET.find(j => j.value === form.jenisAset) || JENIS_ASET[0];
  const isAuto = selectedJenis.auto;
  const isEmas = form.jenisAset === 'emas';

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrors(err => ({ ...err, [key]: '' }));
  };

  // ============================================================
  // AUTO-FETCH HARGA PASAR — selalu fetch saat jenis berubah
  // (termasuk saat form edit dibuka), supaya gram dihitung dari
  // harga pasar terkini, bukan harga lama yang tersimpan.
  // ============================================================
  useEffect(() => {
    if (!isAuto) return;
    let cancelled = false;
    setFetchingHarga(true);
    setHargaAutoInfo(null);

    fetchHargaJenis(form.jenisAset).then(harga => {
      if (cancelled) return;
      setFetchingHarga(false);
      if (harga) {
        setForm(f => ({ ...f, hargaPasar: harga }));
        setHargaAutoInfo({ harga });
      }
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.jenisAset]);

  // ============================================================
  // AUTO HITUNG JUMLAH UNIT: unit = belitotal / hargaPasar
  // ============================================================
  useEffect(() => {
    if (!isAuto) return;
    const beli  = Number(form.belitotal);
    const harga = Number(form.hargaPasar);
    if (beli <= 0 || harga <= 0) return;
    const unit = beli / harga;
    setForm(f => ({ ...f, jumlah: unit.toFixed(isEmas ? 4 : 8) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.belitotal, form.hargaPasar, isAuto]);

  // ============================================================
  // VALIDASI
  // ============================================================
  const validate = () => {
    const e = {};
    if (!form.nama.trim())            e.nama      = 'Nama aset wajib diisi';
    if (Number(form.belitotal) <= 0)  e.belitotal = 'Harga beli wajib diisi';
    if (!isAuto) {
      if (!String(form.jumlah).trim() || parseFloat(form.jumlah) <= 0)
        e.jumlah = 'Jumlah wajib diisi';
    }
    if (Number(form.hargaPasar) <= 0) e.hargaPasar = 'Harga pasar wajib diisi';
    return e;
  };

  // ============================================================
  // SAVE
  // ============================================================
  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const beli  = Number(form.belitotal);
    const harga = Number(form.hargaPasar);

    // Emas/kripto: jumlah SELALU = beli / harga (konsisten dengan mekanisme saham)
    // Manual: pakai jumlah yang diketik user
    const jumlahFinal = (isAuto && beli > 0 && harga > 0)
      ? beli / harga
      : parseFloat(form.jumlah) || 0;

    onSave({
      ...form,
      id:         form.id || genId(),
      jumlah:     jumlahFinal,
      belitotal:  beli,
      hargaPasar: harga,
      aktif:      form.aktif === true || form.aktif === 'ya',
    });
  };

  // ============================================================
  // PREVIEW P/L (hanya untuk aset auto)
  // Nilai pasar sekarang = harga_per_unit × jumlah
  // P/L = nilai_sekarang − total_beli
  // ============================================================
  const unitPreview = (() => {
    if (!isAuto) return 0;
    const beli  = Number(form.belitotal);
    const harga = Number(form.hargaPasar);
    if (beli <= 0 || harga <= 0) return 0;
    return beli / harga;
  })();

  const nilaiSekarang = unitPreview * Number(form.hargaPasar || 0);
  const pl            = nilaiSekarang - Number(form.belitotal || 0);

  // helper render error
  const Err = ({ field }) => errors[field]
    ? <div className="form-error">{errors[field]}</div>
    : null;

  return (
    <Modal
      title={item ? 'Edit Aset' : 'Tambah Aset'}
      onClose={onClose}
      onSave={handleSave}
    >
      <div className="form-grid">

        {/* JENIS ASET */}
        <div className="form-group full">
          <label className="form-label">Jenis Aset</label>
          <select className="form-select" value={form.jenisAset} onChange={set('jenisAset')}>
            {JENIS_ASET.map(j => (
              <option key={j.value} value={j.value}>{j.label}</option>
            ))}
          </select>
        </div>

        {/* NAMA ASET */}
        <div className="form-group">
          <label className="form-label">Nama Aset <span style={{ color: 'var(--red)' }}>*</span></label>
          <input
            className={`form-input${errors.nama ? ' error' : ''}`}
            style={errors.nama ? { borderColor: 'var(--red)' } : {}}
            placeholder="Emas Antam, BTC, BBCA, dll"
            value={form.nama}
            onChange={set('nama')}
          />
          <Err field="nama" />
        </div>

        {/* JUMLAH — readonly untuk aset auto */}
        <div className="form-group">
          <label className="form-label">
            Jumlah / Unit ({selectedJenis.satuan})
            {!isAuto && <span style={{ color: 'var(--red)' }}> *</span>}
          </label>
          <input
            className="form-input"
            value={isAuto && unitPreview > 0 ? unitPreview.toFixed(isEmas ? 4 : 8) : form.jumlah}
            readOnly={isAuto}
            placeholder={isAuto ? 'Otomatis dari harga beli' : 'Misal: 5'}
            style={isAuto ? {
              background: 'var(--bg3)', cursor: 'not-allowed',
              fontWeight: 'bold', color: 'var(--accent)',
            } : errors.jumlah ? { borderColor: 'var(--red)' } : {}}
            onChange={set('jumlah')}
          />
          {!isAuto && <Err field="jumlah" />}
          <div className="form-hint">
            {isAuto ? (
              unitPreview > 0
                ? `✅ Dapat ${unitPreview.toFixed(isEmas ? 4 : 8)} ${selectedJenis.satuan} · P/L: ${pl >= 0 ? '+' : '-'}Rp${Math.abs(pl).toLocaleString('id-ID')}`
                : fetchingHarga
                  ? '⏳ Mengambil harga pasar terkini...'
                  : '💡 Isi Harga Beli Total → jumlah otomatis dihitung'
            ) : (
              `Isi dalam satuan ${selectedJenis.satuan}`
            )}
          </div>
        </div>

        {/* HARGA BELI */}
        <div className="form-group">
          <label className="form-label">Harga Beli Total (Rp) <span style={{ color: 'var(--red)' }}>*</span></label>
          <RupiahInput
            value={form.belitotal}
            onChange={v => { setForm(f => ({ ...f, belitotal: v })); setErrors(e => ({ ...e, belitotal: '' })); }}
            style={errors.belitotal ? { borderColor: 'var(--red)' } : {}}
          />
          <Err field="belitotal" />
        </div>

        {/* HARGA PASAR */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isEmas ? 'Harga Emas Per Gram Sekarang (Rp)' : `Harga ${selectedJenis.satuan} Sekarang (Rp)`}
            <span style={{ color: 'var(--red)' }}>*</span>
            {fetchingHarga && (
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--blue)', background: 'var(--blue-bg)', padding: '2px 8px', borderRadius: '20px' }}>
                ⏳ Mengambil...
              </span>
            )}
            {!fetchingHarga && hargaAutoInfo && (
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--green2)', background: 'var(--green-bg)', padding: '2px 8px', borderRadius: '20px' }}>
                ✓ Auto diisi
              </span>
            )}
          </label>
          <RupiahInput
            value={form.hargaPasar}
            onChange={v => { setForm(f => ({ ...f, hargaPasar: v })); setErrors(e => ({ ...e, hargaPasar: '' })); }}
            placeholder={isAuto ? 'Diambil otomatis dari CoinGecko' : 'Isi manual'}
            style={errors.hargaPasar ? { borderColor: 'var(--red)' } : {}}
          />
          <Err field="hargaPasar" />
          {isAuto && (
            <div className="form-hint">
              {fetchingHarga
                ? '⏳ Mengambil harga terkini dari CoinGecko...'
                : form.hargaPasar > 0
                  ? `📡 Harga per ${selectedJenis.satuan}: ${Number(form.hargaPasar).toLocaleString('id-ID')} · Bisa diedit manual`
                  : '⚠ Harga belum tersedia, isi manual atau periksa koneksi'}
            </div>
          )}
        </div>

        {/* PLATFORM */}
        <div className="form-group">
          <label className="form-label">Platform / Perantara</label>
          <input
            className="form-input"
            placeholder="Toko Emas, Bibit, Binance, dll"
            value={form.platform}
            onChange={set('platform')}
          />
        </div>

        {/* STATUS */}
        <div className="form-group">
          <label className="form-label">Status Aset</label>
          <select
            className="form-select"
            value={form.aktif ? 'ya' : 'tidak'}
            onChange={e => setForm(f => ({ ...f, aktif: e.target.value === 'ya' }))}
          >
            <option value="ya">Masih Ada (Aktif)</option>
            <option value="tidak">Sudah Dijual</option>
          </select>
        </div>

        {/* CATATAN */}
        <div className="form-group full">
          <label className="form-label">Catatan</label>
          <input
            className="form-input"
            placeholder="Opsional"
            value={form.catatan}
            onChange={set('catatan')}
          />
        </div>

      </div>
    </Modal>
  );
}
