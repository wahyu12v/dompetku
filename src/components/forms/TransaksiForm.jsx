// ============================================================
// TransaksiForm.jsx — Form tambah/edit transaksi harian
// ============================================================
import { useState } from 'react';
import Modal from '../Modal';
import { SUMBER_OPTIONS, TUJUAN_OPTIONS } from '../../utils/constants';
import { genId, today } from '../../utils/helpers';

const DEFAULT = {
  tanggal: today(),
  pemasukan: '',
  sumber: 'Jasa Freelance',
  pengeluaran: '',
  tujuan: 'Beli Kebutuhan',
  ket: '',
};

export default function TransaksiForm({ item, onSave, onClose }) {
  const [form, setForm] = useState(item ? {
    ...item,
    pemasukan:   item.pemasukan   || '',
    pengeluaran: item.pengeluaran || '',
  } : DEFAULT);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    onSave({
      ...form,
      id:          form.id || genId(),
      pemasukan:   Number(form.pemasukan)   || 0,
      pengeluaran: Number(form.pengeluaran) || 0,
    });
  };

  return (
    <Modal
      title={item ? 'Edit Transaksi' : 'Tambah Transaksi'}
      onClose={onClose}
      onSave={handleSave}
    >
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Tanggal</label>
          <input
            type="date"
            className="form-input"
            value={form.tanggal}
            onChange={set('tanggal')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Pemasukan (Rp)</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={form.pemasukan}
            onChange={set('pemasukan')}
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Sumber Pemasukan</label>
          <select className="form-select" value={form.sumber} onChange={set('sumber')}>
            {SUMBER_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Pengeluaran (Rp)</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={form.pengeluaran}
            onChange={set('pengeluaran')}
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tujuan Pengeluaran</label>
          <select className="form-select" value={form.tujuan} onChange={set('tujuan')}>
            {TUJUAN_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Keterangan</label>
          <input
            className="form-input"
            placeholder="Opsional"
            value={form.ket}
            onChange={set('ket')}
          />
        </div>
      </div>
    </Modal>
  );
}
