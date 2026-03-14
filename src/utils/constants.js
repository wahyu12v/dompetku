// ============================================================
// constants.js — App-wide constants, nav, seed data
// ============================================================

export const DEFAULT_SUMBER = [
  'Jasa Freelance','Penjualan','Penjualan Online','Bagi Hasil',
  'Joki','Gaji Tambahan','Bonus Penjualan','Deposit Saham',
  'Reksadana','Penarikan Tunai','Tidak ada',
];

export const DEFAULT_TUJUAN = [
  'Beli Kebutuhan','Keperluan Keluarga','Beli Barang Keinginan',
  'Transfer Internal','Minyak','Pegangan','Keluarga',
  'Hutang Kawan','Lainya','Tidak ada pengeluaran',
];

export const TAGIHAN_OPTIONS = [
  'Token Listrik','Indihome','Iconnet','BPJS',
  'Paket Internet','SPP/LPK','Uang Sewa','Lainya',
];

export const STATUS_BAYAR  = ['Sudah dibayar','Belum dibayar','Belum Pasti'];
export const STATUS_HUTANG = ['Belum','Lunas','Tidak Ada'];

// ── Nav ────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',            icon: '◈',  section: 'utama' },
  { id: 'transaksi',   label: 'Transaksi Harian',     icon: '⇄',  section: 'utama' },
  { id: 'tagihan',     label: 'Tagihan & Pembayaran', icon: '🧾', section: 'utama' },
  { id: 'piutang',     label: 'Piutang & Hutang',     icon: '💸', section: 'keuangan' },
  { id: 'aset',        label: 'Aset & Investasi',     icon: '💎', section: 'keuangan' },
  { id: 'wifi',        label: 'WiFi & Internet',      icon: '📶', section: 'lainnya' },
  { id: 'laporan',     label: 'Laporan & Grafik',     icon: '📊', section: 'laporan' },
  { id: 'pengaturan',  label: 'Pengaturan',           icon: '⚙️', section: 'laporan' },
];

export const NAV_SECTIONS = {
  utama:    'Menu Utama',
  keuangan: 'Keuangan',
  lainnya:  'Lainnya',
  laporan:  'Analitik & Pengaturan',
};

export const PAGE_TITLES = {
  dashboard:  'Dashboard',
  transaksi:  'Transaksi Harian',
  tagihan:    'Tagihan & Pembayaran',
  piutang:    'Piutang & Hutang',
  aset:       'Aset & Investasi',
  wifi:       'WiFi & Internet',
  laporan:    'Laporan & Grafik',
  pengaturan: 'Pengaturan Kategori',
};

// ── Seed Data ──────────────────────────────────────────────
export const SEED_TRANSAKSI = [
  { id:'t1',  tanggal:'2025-12-01', pemasukan:80000,   sumber:'Joki',             pengeluaran:50000,   tujuan:'Pegangan',             ket:'' },
  { id:'t2',  tanggal:'2025-12-02', pemasukan:80000,   sumber:'Bagi Hasil',       pengeluaran:0,       tujuan:'Tidak ada pengeluaran', ket:'' },
  { id:'t3',  tanggal:'2025-12-03', pemasukan:80000,   sumber:'Joki',             pengeluaran:50000,   tujuan:'Pegangan',             ket:'' },
  { id:'t4',  tanggal:'2025-12-05', pemasukan:80000,   sumber:'Penjualan',        pengeluaran:50000,   tujuan:'Beli Kebutuhan',       ket:'' },
  { id:'t5',  tanggal:'2025-12-11', pemasukan:130000,  sumber:'Jasa Freelance',   pengeluaran:50000,   tujuan:'Beli Kebutuhan',       ket:'' },
  { id:'t6',  tanggal:'2025-12-12', pemasukan:526000,  sumber:'Jasa Freelance',   pengeluaran:650000,  tujuan:'Beli Kebutuhan',       ket:'' },
  { id:'t7',  tanggal:'2025-12-13', pemasukan:360000,  sumber:'Penjualan',        pengeluaran:0,       tujuan:'Tidak ada pengeluaran', ket:'' },
  { id:'t8',  tanggal:'2025-12-15', pemasukan:280000,  sumber:'Jasa Freelance',   pengeluaran:201000,  tujuan:'Keperluan Keluarga',   ket:'' },
  { id:'t9',  tanggal:'2025-12-16', pemasukan:0,       sumber:'Tidak ada',        pengeluaran:2283000, tujuan:'Keperluan Keluarga',   ket:'' },
  { id:'t10', tanggal:'2025-12-17', pemasukan:400000,  sumber:'Jasa Freelance',   pengeluaran:0,       tujuan:'Tidak ada pengeluaran', ket:'' },
  { id:'t11', tanggal:'2025-12-26', pemasukan:653000,  sumber:'Reksadana',        pengeluaran:203000,  tujuan:'Keperluan Keluarga',   ket:'' },
  { id:'t12', tanggal:'2025-12-29', pemasukan:949000,  sumber:'Bagi Hasil',       pengeluaran:505000,  tujuan:'Keperluan Keluarga',   ket:'' },
  { id:'t13', tanggal:'2026-01-03', pemasukan:1222000, sumber:'Jasa Freelance',   pengeluaran:1000000, tujuan:'Keluarga',             ket:'' },
  { id:'t14', tanggal:'2026-01-05', pemasukan:1450000, sumber:'Jasa Freelance',   pengeluaran:1302500, tujuan:'Transfer Internal',    ket:'' },
  { id:'t15', tanggal:'2026-01-06', pemasukan:2300000, sumber:'Joki',             pengeluaran:2000000, tujuan:'Beli Kebutuhan',       ket:'' },
  { id:'t16', tanggal:'2026-01-09', pemasukan:850000,  sumber:'Bagi Hasil',       pengeluaran:600000,  tujuan:'Keluarga',             ket:'paket bapak 100' },
  { id:'t17', tanggal:'2026-01-13', pemasukan:1229000, sumber:'Penjualan Online', pengeluaran:1001000, tujuan:'Beli Kebutuhan',       ket:'' },
  { id:'t18', tanggal:'2026-01-22', pemasukan:450000,  sumber:'Bagi Hasil',       pengeluaran:0,       tujuan:'Tidak ada pengeluaran', ket:'' },
  { id:'t19', tanggal:'2026-02-02', pemasukan:28000,   sumber:'Jasa Freelance',   pengeluaran:100000,  tujuan:'Transfer Internal',    ket:'' },
  { id:'t20', tanggal:'2026-02-05', pemasukan:500000,  sumber:'Penjualan',        pengeluaran:1500000, tujuan:'Transfer Internal',    ket:'' },
  { id:'t21', tanggal:'2026-03-02', pemasukan:300000,  sumber:'Penjualan',        pengeluaran:300000,  tujuan:'Beli Kebutuhan',       ket:'' },
];

export const SEED_TAGIHAN = [
  { id:'b1',  tanggal:'2025-12-01', nominal:270000,  alasan:'Indihome',      ket:'C.06',        batas:'2025-12-25', status:'Sudah dibayar' },
  { id:'b2',  tanggal:'2025-12-02', nominal:135000,  alasan:'Iconnet',       ket:'',            batas:'2025-12-13', status:'Sudah dibayar' },
  { id:'b3',  tanggal:'2025-12-03', nominal:350000,  alasan:'SPP/LPK',       ket:'',            batas:'2025-12-06', status:'Sudah dibayar' },
  { id:'b4',  tanggal:'2025-12-04', nominal:200000,  alasan:'Token Listrik', ket:'Rumah',       batas:'2025-12-07', status:'Sudah dibayar' },
  { id:'b5',  tanggal:'2025-12-16', nominal:203000,  alasan:'Token Listrik', ket:'',            batas:'2025-12-16', status:'Sudah dibayar' },
  { id:'b6',  tanggal:'2026-01-04', nominal:203000,  alasan:'Token Listrik', ket:'Token Rumah', batas:'2026-01-04', status:'Sudah dibayar' },
  { id:'b7',  tanggal:'2026-01-08', nominal:203000,  alasan:'Token Listrik', ket:'Token Bedeng',batas:'2026-01-08', status:'Sudah dibayar' },
  { id:'b8',  tanggal:'2026-01-09', nominal:100000,  alasan:'Paket Internet',ket:'Paket bapak', batas:'2026-01-09', status:'Sudah dibayar' },
  { id:'b9',  tanggal:'2026-01-10', nominal:276000,  alasan:'Indihome',      ket:'C.06',        batas:'2026-01-10', status:'Sudah dibayar' },
  { id:'b10', tanggal:'2026-02-03', nominal:203000,  alasan:'Token Listrik', ket:'Rumah',       batas:'2026-02-03', status:'Sudah dibayar' },
  { id:'b11', tanggal:'2026-02-04', nominal:400000,  alasan:'Indihome',      ket:'C6 dan C9',   batas:'2026-02-04', status:'Sudah dibayar' },
  { id:'b12', tanggal:'2026-02-26', nominal:145000,  alasan:'BPJS',          ket:'',            batas:'2026-02-26', status:'Sudah dibayar' },
  { id:'b13', tanggal:'2026-03-01', nominal:203000,  alasan:'Token Listrik', ket:'Angkringan',  batas:'2026-03-01', status:'Sudah dibayar' },
  { id:'b14', tanggal:'2026-03-13', nominal:1030000, alasan:'Token Listrik', ket:'Rumah',       batas:'2026-03-13', status:'Sudah dibayar' },
];

export const SEED_PIUTANG = [
  { id:'p1', dari:'Hadid', jumlah:550000,  ket:'Uang joki Skripsi dan pinjaman',          dibayar:0,      tglHutang:'2025-07-09', tglBayar:'2025-08-21', status:'Belum' },
  { id:'p2', dari:'Arief', jumlah:700000,  ket:'Hutang Monitor',                          dibayar:400000, tglHutang:'2025-11-12', tglBayar:'2026-01-06', status:'Belum' },
  { id:'p3', dari:'Ibuk',  jumlah:2500000, ket:'Mak Yusri 1,5 Juta dan 1 Juta angsuran', dibayar:0,      tglHutang:'2025-07-16', tglBayar:'',           status:'Belum' },
  { id:'p4', dari:'ibuk',  jumlah:2000000, ket:'Mak Yusri 2 juta',                        dibayar:0,      tglHutang:'2025-12-05', tglBayar:'',           status:'Belum' },
  { id:'p5', dari:'Hadid', jumlah:280000,  ket:'Uang Gym dan pegangan',                   dibayar:0,      tglHutang:'2026-01-08', tglBayar:'',           status:'Belum' },
  { id:'p6', dari:'ibuk',  jumlah:1500000, ket:'Mak Yusri 1,5 Juta',                      dibayar:0,      tglHutang:'2026-01-12', tglBayar:'',           status:'Belum' },
  { id:'p7', dari:'ibuk',  jumlah:2600000, ket:'Uang Qris dan Bayar Mak Yusri',           dibayar:0,      tglHutang:'2026-01-15', tglBayar:'',           status:'Belum' },
];

export const SEED_HUTANG = [];

export const SEED_ASET = [
  { id:'a1', nama:'Emas', jumlah:'3.5 unit', belitotal:7000000, platform:'Toko Emas', aktif:true, hargaPasar:0, catatan:'' },
];

export const SEED_SALDO_AWAL = 1401000;

// ── WiFi seed data (from user's spreadsheet) ──────────────
export const SEED_WIFI_ISP = [
  {
    id:'w1', nama:'Iconnet', idPelanggan:'None', paket:'10 Mbps', harga:214000,
    alamat:'Perumahan Karya Abadi C.06', ssid:'ARDIAN',
    password:'pekanbaru', ip:'192.168.10.1', userAdmin:'Epuser',
    kataKunci:'pekanbaru', status:'Berhenti',
  },
  {
    id:'w2', nama:'Indihome', idPelanggan:'111502249398', paket:'50 Mbps', harga:280000,
    alamat:'Perumahan Karya Abadi C.06', ssid:'Surya4G',
    password:'Surya12345', ip:'192.168.100.1', userAdmin:'Admin',
    kataKunci:'admin', status:'Aktif',
  },
  {
    id:'w3', nama:'Indihome', idPelanggan:'111502246547', paket:'50 Mbps', harga:280000,
    alamat:'Perumahan Karya Abadi C.09', ssid:'ARDIAN4G',
    password:'pekanbaru/pekanbaru123', ip:'192.168.1.1', userAdmin:'admin',
    kataKunci:'pekanbaru123', status:'Aktif',
  },
];

// Payment tracker: { ispId, tahun, bulan } → paid boolean
export const SEED_WIFI_BAYAR = [
  { id:'wb1', ispId:'w2', tahun:2026, bulan:1, lunas:true },
  { id:'wb2', ispId:'w3', tahun:2026, bulan:1, lunas:true },
  { id:'wb3', ispId:'w2', tahun:2026, bulan:2, lunas:true },
  { id:'wb4', ispId:'w3', tahun:2026, bulan:2, lunas:true },
];

// Default user categories (seeded when new account registered)
export const SEED_KATEGORI = {
  sumber: [...DEFAULT_SUMBER],
  tujuan: [...DEFAULT_TUJUAN],
};

export const CHART_COLORS = ['#2563eb','#059669','#7c3aed','#ea580c','#d97706','#dc2626'];
