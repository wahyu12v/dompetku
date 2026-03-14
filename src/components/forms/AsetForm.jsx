// ============================================================
// AsetForm.jsx — Form tambah/edit aset & investasi
// ============================================================
import { useState } from 'react';
import Modal from '../Modal';
import { genId } from '../../utils/helpers';

const DEFAULT = {
  nama:       '',
  jumlah:     '',
  belitotal:  '',
  platform:   '',
  aktif:      true,
  hargaPasar: '',
  catatan:    '',
};

export default function AsetForm({ item, onSave, onClose }) {
  const [form, setForm] = useState(item
    ? {
        ...item,
        belitotal:  item.belitotal  || '',
        hargaPasar: item.hargaPasar || '',
      }
    : DEFAULT
  );

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    onSave({
      ...form,
      id:         form.id || genId(),
      belitotal:  Number(form.belitotal)  || 0,
      hargaPasar: Number(form.hargaPasar) || 0,
      aktif:      form.aktif === true || form.aktif === 'ya',
    });
  };

  return (
    <Modal
      title={item ? 'Edit Aset' : 'Tambah Aset'}
      onClose={onClose}
      onSave={handleSave}
    >
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Nama Aset</label>
          <input
            className="form-input"
            placeholder="Emas, Saham, Reksa Dana, dll"
            value={form.nama}
            onChange={set('nama')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Jumlah / Unit</label>
          <input
            className="form-input"
            placeholder="3.5 unit, 10 lot, 5 gram"
            value={form.jumlah}
            onChange={set('jumlah')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Harga Beli Total (Rp)</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={form.belitotal}
            onChange={set('belitotal')}
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Harga Pasar Sekarang (Rp)</label>
          <input
            type="number"
            className="form-input"
            placeholder="Isi manual tiap bulan"
            value={form.hargaPasar}
            onChange={set('hargaPasar')}
            min="0"
          />
          <div className="form-hint">Update ini setiap bulan untuk tracking untung/rugi</div>
        </div>

        <div className="form-group">
          <label className="form-label">Platform / Perantara</label>
          <input
            className="form-input"
            placeholder="Toko Emas, Bibit, IPOT, dll"
            value={form.platform}
            onChange={set('platform')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status Aset</label>
          <select
            className="form-select"
            value={form.aktif === true || form.aktif === 'ya' ? 'ya' : 'tidak'}
            onChange={(e) => setForm((f) => ({ ...f, aktif: e.target.value === 'ya' }))}
          >
            <option value="ya">Masih Ada (Aktif)</option>
            <option value="tidak">Sudah Dijual</option>
          </select>
        </div>

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
