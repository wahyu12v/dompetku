// ============================================================
// RupiahInput.jsx — Input angka dengan format Rupiah otomatis
// Tampil: "Rp 50.000" saat diisi, simpan value angka murni
// ============================================================

/**
 * Props:
 *   value      - number (angka murni, misal: 50000)
 *   onChange   - function(number) dipanggil saat berubah
 *   placeholder - string (opsional)
 *   className  - string (opsional)
 */
export default function RupiahInput({ value, onChange, placeholder = '0', className = '' }) {
  // Format angka ke "50.000"
  const format = (num) => {
    if (!num && num !== 0) return '';
    return Number(num).toLocaleString('id-ID');
  };

  // Saat user mengetik
  const handleChange = (e) => {
    // Hapus semua selain angka
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = raw === '' ? 0 : parseInt(raw, 10);
    onChange(num);
  };

  // Tampilkan dengan prefix Rp dan titik pemisah
  const displayValue = value > 0 ? `Rp ${format(value)}` : '';

  return (
    <input
      type="text"
      inputMode="numeric"
      className={`form-input ${className}`}
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder ? `Rp ${format(placeholder) || '0'}` : 'Rp 0'}
    />
  );
}
