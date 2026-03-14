// ============================================================
// format.js — Number, currency, and date formatting helpers
// ============================================================

/** Format number with thousand separator (no Rp prefix) */
export const fmtNumber = (n) =>
  new Intl.NumberFormat('id-ID').format(Math.abs(Math.round(n || 0)));

/** Format Rupiah: "Rp 1.500.000" or "-Rp 500.000" */
export const fmtRp = (n) => {
  const v = Math.round(n || 0);
  return (v < 0 ? '-' : '') + 'Rp\u00A0' + fmtNumber(Math.abs(v));
};

/** Short Rupiah: "1,5jt" or "300rb" */
export const fmtRpShort = (n) => {
  const v = Math.abs(Math.round(n || 0));
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace('.0', '') + 'jt';
  if (v >= 1_000) return (v / 1_000).toFixed(0) + 'rb';
  return String(v);
};

/** Format date to "01 Jan 2026" */
export const fmtDate = (d) => {
  if (!d) return '-';
  try {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return d;
  }
};

/** Format date to "Senin, 14 Maret 2026" */
export const fmtDateLong = (d) => {
  if (!d) return '-';
  try {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return d;
  }
};

/** Short month name: "Jan", "Feb", etc. */
export const monthName = (m) =>
  ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'][m - 1] || '';

/** Full month name: "Januari", etc. */
export const fullMonth = (m) =>
  ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus',
   'September','Oktober','November','Desember'][m - 1] || '';
