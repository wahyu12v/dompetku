// ============================================================
// TagihanForm.jsx — Form tambah/edit tagihan bulanan
// ============================================================
import { useState } from 'react';
import Modal from '../Modal';
import RupiahInput from '../RupiahInput';
import { TAGIHAN_OPTIONS, STATUS_BAYAR } from '../../utils/constants';
import { genId, today } from '../../utils/helpers';

const DEFAULT = {
  tanggal: today(),
  nominal: '',
  alasan:  'Token Listrik',
  ket:     '',
  batas:   '',
  status:  'Belum Pasti',
};

export default function TagihanForm({ item, onSave, onClose }) {
  const [form, setForm] = useState(item
    ? { ...item, nominal: item.nominal || 0 }
    : DEFAULT
  );

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    onSave({
      ...form,
      id:      form.id || genId(),
      nominal: Number(form.nominal) || 0,
    });
  };

  return (
    <Modal
      title={item ? 'Edit Tagihan' : 'Tambah Tagihan'}
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
          <label className="form-label">Nominal (Rp)</label>
          <RupiahInput value={form.nominal} onChange={v => setForm(f => ({ ...f, nominal: v }))} />
        </div>

        <div className="form-group">
          <label className="form-label">Jenis Tagihan</label>
          <select className="form-select" value={form.alasan} onChange={set('alasan')}>
            {TAGIHAN_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Keterangan</label>
          <input
            className="form-input"
            placeholder="Misal: Rumah, Bedeng, C.06"
            value={form.ket}
            onChange={set('ket')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Batas Waktu Bayar</label>
          <input
            type="date"
            className="form-input"
            value={form.batas}
            onChange={set('batas')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={set('status')}>
            {STATUS_BAYAR.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}
