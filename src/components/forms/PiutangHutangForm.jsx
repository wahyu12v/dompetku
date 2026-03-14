// ============================================================
// PiutangHutangForm.jsx — Form tambah/edit piutang & hutang
// ============================================================
import { useState } from 'react';
import Modal from '../Modal';
import { STATUS_HUTANG } from '../../utils/constants';
import { genId, today } from '../../utils/helpers';

const DEFAULT = (mode) => ({
  dari:      '',
  nama:      '',
  jumlah:    '',
  ket:       '',
  dibayar:   '',
  tglHutang: today(),
  tglBayar:  '',
  status:    'Belum',
});

export default function PiutangHutangForm({ item, mode, onSave, onClose }) {
  const isPiutang = mode === 'piutang';

  const [form, setForm] = useState(item
    ? { ...item, jumlah: item.jumlah || '', dibayar: item.dibayar || '' }
    : DEFAULT(mode)
  );

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // nama digunakan untuk hutang, dari untuk piutang — keduanya sama
  const setNama = (e) => setForm((f) => ({
    ...f,
    dari: e.target.value,
    nama: e.target.value,
  }));

  const handleSave = () => {
    onSave({
      ...form,
      id:      form.id || genId(),
      jumlah:  Number(form.jumlah)  || 0,
      dibayar: Number(form.dibayar) || 0,
      dari:    form.dari || form.nama || '',
      nama:    form.nama || form.dari || '',
    });
  };

  const whoLabel = isPiutang ? 'Dari Siapa (yang berhutang ke kamu)' : 'Kepada Siapa (kamu berhutang ke)';

  return (
    <Modal
      title={item
        ? `Edit ${isPiutang ? 'Piutang' : 'Hutang'}`
        : `Tambah ${isPiutang ? 'Piutang' : 'Hutang'}`
      }
      onClose={onClose}
      onSave={handleSave}
    >
      <div className="form-grid">
        <div className="form-group full">
          <label className="form-label">{whoLabel}</label>
          <input
            className="form-input"
            placeholder="Nama orang"
            value={form.dari || form.nama || ''}
            onChange={setNama}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Jumlah (Rp)</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={form.jumlah}
            onChange={set('jumlah')}
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Sudah Dibayar (Rp)</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={form.dibayar}
            onChange={set('dibayar')}
            min="0"
          />
        </div>

        <div className="form-group full">
          <label className="form-label">Keterangan / Detail</label>
          <input
            className="form-input"
            placeholder="Misal: Hutang monitor, pinjaman bulan lalu"
            value={form.ket}
            onChange={set('ket')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tanggal Hutang</label>
          <input
            type="date"
            className="form-input"
            value={form.tglHutang}
            onChange={set('tglHutang')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tanggal Bayar / Target</label>
          <input
            type="date"
            className="form-input"
            value={form.tglBayar}
            onChange={set('tglBayar')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={set('status')}>
            {STATUS_HUTANG.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}
