// ============================================================
// helpers.js — General utility functions
// ============================================================

/** Generate unique ID */
export const genId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/** Today's date as "YYYY-MM-DD" */
export const today = () => new Date().toISOString().split('T')[0];

/** Current year-month as "YYYY-MM" */
export const currentYearMonth = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`;
};

/** Get "YYYY-MM" from date string */
export const toYearMonth = (dateStr) => (dateStr || '').slice(0, 7);

/** Sum an array of objects by key */
export const sumBy = (arr, key) =>
  arr.reduce((s, x) => s + (Number(x[key]) || 0), 0);

/** Filter array by year-month prefix */
export const filterByMonth = (arr, yearMonth, dateKey = 'tanggal') =>
  arr.filter((x) => (x[dateKey] || '').startsWith(yearMonth));

/** Get unique year-month values from array */
export const getMonths = (arr, dateKey = 'tanggal') => {
  const seen = new Set();
  arr.forEach((x) => seen.add(toYearMonth(x[dateKey])));
  return [...seen].filter(Boolean).sort((a, b) => b.localeCompare(a));
};

/** Clamp value between min and max */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/** Capitalize first letter */
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
