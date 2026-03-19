// import { useState } from 'react';
// import Modal from '../Modal';
// import RupiahInput from '../RupiahInput';
// import { genId, today } from '../../utils/helpers';

// const STATUS_BAYAR = ['Sudah dibayar','Belum dibayar','Belum Pasti'];

// const DEFAULT = {
//   tanggal: today(),
//   nominal: '',
//   alasan:  '',
//   ket:     '',
//   batas:   '',
//   status:  'Belum Pasti',
// };

// export default function TagihanForm({ item, onSave, onClose, tujuanKategori = [], tagihanKategori = [] }) {
//   // Gabungkan kategori tagihan dari pengaturan + tujuan pengeluaran (tanpa duplikat)
//   const allOptions = [...new Set([...tagihanKategori, ...tujuanKategori])];

//   const [form, setForm] = useState(item
//     ? { ...item, nominal: item.nominal || 0 }
//     : { ...DEFAULT, alasan: allOptions[0] || '' }
//   );

//   const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

//   const handleSave = () => {
//     onSave({ ...form, id: form.id || genId(), nominal: Number(form.nominal) || 0 });
//   };

//   return (
//     <Modal title={item ? 'Edit Tagihan' : 'Tambah Tagihan'} onClose={onClose} onSave={handleSave}>
//       <div className="form-grid">
//         <div className="form-group">
//           <label className="form-label">Tanggal</label>
//           <input type="date" className="form-input" value={form.tanggal} onChange={set('tanggal')} />
//         </div>

//         <div className="form-group">
//           <label className="form-label">Nominal (Rp)</label>
//           <RupiahInput value={form.nominal} onChange={v => setForm(f => ({ ...f, nominal: v }))} />
//         </div>

//         <div className="form-group">
//           <label className="form-label">Jenis Tagihan</label>
//           <select className="form-select" value={form.alasan} onChange={set('alasan')}>
//             {tagihanKategori.length > 0 && (
//               <optgroup label="Tagihan Umum">
//                 {tagihanKategori.map(o => <option key={o} value={o}>{o}</option>)}
//               </optgroup>
//             )}
//             {tujuanKategori.filter(o => !tagihanKategori.includes(o)).length > 0 && (
//               <optgroup label="Kategori Pengeluaranmu">
//                 {tujuanKategori.filter(o => !tagihanKategori.includes(o)).map(o => (
//                   <option key={o} value={o}>{o}</option>
//                 ))}
//               </optgroup>
//             )}
//             {allOptions.length === 0 && (
//               <option value="">-- Belum ada kategori --</option>
//             )}
//           </select>
//         </div>

//         <div className="form-group">
//           <label className="form-label">Keterangan</label>
//           <input className="form-input" placeholder="Misal: Rumah, Bedeng, C.06" value={form.ket} onChange={set('ket')} />
//         </div>

//         <div className="form-group">
//           <label className="form-label">Batas Waktu Bayar</label>
//           <input type="date" className="form-input" value={form.batas} onChange={set('batas')} />
//         </div>

//         <div className="form-group">
//           <label className="form-label">Status</label>
//           <select className="form-select" value={form.status} onChange={set('status')}>
//             {STATUS_BAYAR.map(o => <option key={o} value={o}>{o}</option>)}
//           </select>
//         </div>
//       </div>
//     </Modal>
//   );
// }
import { useState } from 'react';
import Modal from '../Modal';
import RupiahInput from '../RupiahInput';
import { genId, today } from '../../utils/helpers';
import { TAGIHAN_OPTIONS } from '../../utils/constants';

const STATUS_BAYAR = ['Sudah dibayar','Belum dibayar','Belum Pasti'];

const DEFAULT = {
  tanggal: today(),
  nominal: '',
  alasan:  '',
  ket:     '',
  batas:   '',
  status:  'Belum Pasti',
};

export default function TagihanForm({ item, onSave, onClose, tujuanKategori = [], tagihanKategori = [] }) {
  // Gabungkan: bawaan + user tagihan + tujuan pengeluaran
  const allTagihan = [...new Set([...TAGIHAN_OPTIONS, ...tagihanKategori])];
  const tujuanOnly = tujuanKategori.filter(o => !allTagihan.includes(o));

  const [form, setForm] = useState(item
    ? { ...item, nominal: item.nominal || 0 }
    : { ...DEFAULT, alasan: TAGIHAN_OPTIONS[0] || '' }
  );

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    onSave({ ...form, id: form.id || genId(), nominal: Number(form.nominal) || 0 });
  };

  return (
    <Modal title={item ? 'Edit Tagihan' : 'Tambah Tagihan'} onClose={onClose} onSave={handleSave}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Tanggal</label>
          <input type="date" className="form-input" value={form.tanggal} onChange={set('tanggal')} />
        </div>

        <div className="form-group">
          <label className="form-label">Nominal (Rp)</label>
          <RupiahInput value={form.nominal} onChange={v => setForm(f => ({ ...f, nominal: v }))} />
        </div>

        <div className="form-group">
          <label className="form-label">Jenis Tagihan</label>
          <select className="form-select" value={form.alasan} onChange={set('alasan')}>
            <optgroup label="Tagihan Umum">
              {TAGIHAN_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </optgroup>
            {tagihanKategori.length > 0 && (
              <optgroup label="Tagihan Kustom">
                {tagihanKategori.map(o => <option key={o} value={o}>{o}</option>)}
              </optgroup>
            )}
            {tujuanOnly.length > 0 && (
              <optgroup label="Kategori Pengeluaranmu">
                {tujuanOnly.map(o => <option key={o} value={o}>{o}</option>)}
              </optgroup>
            )}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Keterangan</label>
          <input className="form-input" placeholder="Misal: Rumah, Bedeng, C.06" value={form.ket} onChange={set('ket')} />
        </div>

        <div className="form-group">
          <label className="form-label">Batas Waktu Bayar</label>
          <input type="date" className="form-input" value={form.batas} onChange={set('batas')} />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={set('status')}>
            {STATUS_BAYAR.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>
    </Modal>
  );
}
