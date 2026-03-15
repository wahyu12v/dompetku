// ============================================================
// PiutangHutangForm.jsx — Form tambah/edit piutang & hutang
// ============================================================
import { useState } from 'react';
import Modal from '../Modal';
import RupiahInput from '../RupiahInput';
import { genId, today } from '../../utils/helpers';

const STATUS_OPTIONS = ['Belum', 'Lunas', 'Tidak Ada'];

const DEFAULT = (mode) => ({
  dari:      '',
  nama:      '',
  jumlah:    0,
  dibayar:   0,
  ket:       '',
  tglHutang: today(),
  tglBayar:  '',
  status:    'Belum',
});

export default function PiutangHutangForm({ item, mode, onSave, onClose }) {
  const isPiutang = mode === 'piutang';
  const [form, setForm] = useState(item
    ? { ...item, jumlah: item.jumlah || 0, dibayar: item.dibayar || 0 }
    : DEFAULT(mode)
  );

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    onSave({
      ...form,
      id:      form.id || genId(),
      jumlah:  Number(form.jumlah)  || 0,
      dibayar: Number(form.dibayar) || 0,
      // piutang pakai field 'dari', hutang juga pakai 'dari'
      dari:    form.dari || form.nama || '',
      nama:    form.dari || form.nama || '',
    });
  };

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
          <label className="form-label">
            {isPiutang ? 'Nama Peminjam (yang berhutang ke kamu)' : 'Nama Pemberi Hutang (yang kamu hutangi)'}
          </label>
          <input
            className="form-input"
            placeholder={isPiutang ? 'Misal: Budi, Sari' : 'Misal: Pak Arif, Bank BRI'}
            value={form.dari || form.nama || ''}
            onChange={(e) => setForm((f) => ({ ...f, dari: e.target.value, nama: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Jumlah Pinjaman (Rp)</label>
          <RupiahInput
            value={form.jumlah}
            onChange={(v) => setForm((f) => ({ ...f, jumlah: v }))}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Sudah Dibayar (Rp)</label>
          <RupiahInput
            value={form.dibayar}
            onChange={(v) => setForm((f) => ({ ...f, dibayar: v }))}
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tanggal Pinjam</label>
          <input
            type="date"
            className="form-input"
            value={form.tglHutang}
            onChange={set('tglHutang')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tanggal Lunas / Target Bayar</label>
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
            {STATUS_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="form-group full">
          <label className="form-label">Keterangan</label>
          <input
            className="form-input"
            placeholder="Misal: Pinjam biaya makan, modal usaha, dll"
            value={form.ket}
            onChange={set('ket')}
          />
        </div>
      </div>

      {/* Tampilkan sisa hutang secara realtime */}
      {form.jumlah > 0 && (
        <div style={{
          marginTop: 12,
          padding: '10px 14px',
          borderRadius: 8,
          background: (form.jumlah - form.dibayar) <= 0 ? 'var(--green-bg)' : 'var(--yellow-bg)',
          border: `1px solid ${(form.jumlah - form.dibayar) <= 0 ? '#86efac' : '#fcd34d'}`,
          fontSize: '0.82rem',
          color: (form.jumlah - form.dibayar) <= 0 ? 'var(--green2)' : 'var(--yellow2)',
          fontWeight: 600,
        }}>
          Sisa: Rp {Number(form.jumlah - form.dibayar).toLocaleString('id-ID')}
          {(form.jumlah - form.dibayar) <= 0 ? ' ✓ Lunas' : ''}
        </div>
      )}
    </Modal>
  );
}
