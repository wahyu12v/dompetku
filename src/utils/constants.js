// // ============================================================
// // constants.js
// // ============================================================

// export const DEFAULT_SUMBER = [
//   'Jasa Freelance','Penjualan','Penjualan Online','Bagi Hasil',
//   'Joki','Gaji Tambahan','Bonus Penjualan','Deposit Saham',
//   'Reksadana','Penarikan Tunai','Tidak ada',
// ];

// export const DEFAULT_TUJUAN = [
//   'Beli Kebutuhan','Keperluan Keluarga','Beli Barang Keinginan',
//   'Transfer Internal','Minyak','Pegangan','Keluarga',
//   'Hutang Kawan','Lainya','Tidak ada pengeluaran',
// ];

// export const TAGIHAN_OPTIONS = [
//   'Token Listrik','Indihome','Iconnet','BPJS',
//   'Paket Internet','SPP/LPK','Uang Sewa','Lainya',
// ];

// export const NAV_ITEMS = [
//   { id: 'dashboard',   label: 'Dashboard',            icon: '◈',  section: 'utama' },
//   { id: 'transaksi',   label: 'Transaksi Harian',     icon: '⇄',  section: 'utama' },
//   { id: 'tagihan',     label: 'Tagihan & Pembayaran', icon: '🧾', section: 'utama' },
//   { id: 'piutang',     label: 'Piutang & Hutang',     icon: '💸', section: 'keuangan' },
//   { id: 'aset',        label: 'Aset & Investasi',     icon: '💎', section: 'keuangan' },
//   { id: 'wifi',        label: 'WiFi & Internet',      icon: '📶', section: 'lainnya' },
//   { id: 'laporan',     label: 'Laporan & Grafik',     icon: '📊', section: 'laporan' },
//   { id: 'pengaturan',  label: 'Pengaturan',           icon: '⚙️', section: 'laporan' },
// ];

// export const NAV_SECTIONS = {
//   utama:    'Menu Utama',
//   keuangan: 'Keuangan',
//   lainnya:  'Lainnya',
//   laporan:  'Analitik & Pengaturan',
// };

// export const PAGE_TITLES = {
//   dashboard:  'Dashboard',
//   transaksi:  'Transaksi Harian',
//   tagihan:    'Tagihan & Pembayaran',
//   piutang:    'Piutang & Hutang',
//   aset:       'Aset & Investasi',
//   wifi:       'WiFi & Internet',
//   laporan:    'Laporan & Grafik',
//   pengaturan: 'Pengaturan',
// };

// export const CHART_COLORS = ['#2563eb','#059669','#7c3aed','#ea580c','#d97706','#dc2626'];

// // ── Data Dummy untuk akun baru (generik) ──────────────────
// export const DUMMY_TRANSAKSI = [
//   { id:'dt1',  tanggal:'2026-01-05', pemasukan:3500000, sumber:'Gaji Tambahan',    pengeluaran:0,       tujuan:'Tidak ada pengeluaran', ket:'Gaji bulan Januari' },
//   { id:'dt2',  tanggal:'2026-01-08', pemasukan:0,       sumber:'Tidak ada',        pengeluaran:450000,  tujuan:'Beli Kebutuhan',        ket:'Belanja bulanan' },
//   { id:'dt3',  tanggal:'2026-01-12', pemasukan:750000,  sumber:'Jasa Freelance',   pengeluaran:0,       tujuan:'Tidak ada pengeluaran', ket:'Desain logo' },
//   { id:'dt4',  tanggal:'2026-01-15', pemasukan:0,       sumber:'Tidak ada',        pengeluaran:200000,  tujuan:'Minyak',                ket:'Bensin motor' },
//   { id:'dt5',  tanggal:'2026-01-20', pemasukan:0,       sumber:'Tidak ada',        pengeluaran:350000,  tujuan:'Keperluan Keluarga',    ket:'Kebutuhan rumah' },
//   { id:'dt6',  tanggal:'2026-02-05', pemasukan:3500000, sumber:'Gaji Tambahan',    pengeluaran:0,       tujuan:'Tidak ada pengeluaran', ket:'Gaji bulan Februari' },
//   { id:'dt7',  tanggal:'2026-02-10', pemasukan:0,       sumber:'Tidak ada',        pengeluaran:500000,  tujuan:'Beli Kebutuhan',        ket:'Belanja bulanan' },
//   { id:'dt8',  tanggal:'2026-02-14', pemasukan:500000,  sumber:'Penjualan Online', pengeluaran:0,       tujuan:'Tidak ada pengeluaran', ket:'Jual barang bekas' },
//   { id:'dt9',  tanggal:'2026-02-20', pemasukan:0,       sumber:'Tidak ada',        pengeluaran:180000,  tujuan:'Minyak',                ket:'Bensin' },
//   { id:'dt10', tanggal:'2026-03-05', pemasukan:3500000, sumber:'Gaji Tambahan',    pengeluaran:0,       tujuan:'Tidak ada pengeluaran', ket:'Gaji bulan Maret' },
//   { id:'dt11', tanggal:'2026-03-08', pemasukan:0,       sumber:'Tidak ada',        pengeluaran:420000,  tujuan:'Beli Kebutuhan',        ket:'Belanja bulanan' },
//   { id:'dt12', tanggal:'2026-03-12', pemasukan:1200000, sumber:'Jasa Freelance',   pengeluaran:0,       tujuan:'Tidak ada pengeluaran', ket:'Proyek website' },
// ];

// export const DUMMY_TAGIHAN = [
//   { id:'dta1', tanggal:'2026-01-01', nominal:200000, alasan:'Token Listrik', ket:'Rumah',   batas:'2026-01-10', status:'Sudah dibayar' },
//   { id:'dta2', tanggal:'2026-01-05', nominal:300000, alasan:'Indihome',      ket:'',        batas:'2026-01-15', status:'Sudah dibayar' },
//   { id:'dta3', tanggal:'2026-01-20', nominal:150000, alasan:'BPJS',          ket:'',        batas:'2026-01-25', status:'Sudah dibayar' },
//   { id:'dta4', tanggal:'2026-02-01', nominal:200000, alasan:'Token Listrik', ket:'Rumah',   batas:'2026-02-10', status:'Sudah dibayar' },
//   { id:'dta5', tanggal:'2026-02-05', nominal:300000, alasan:'Indihome',      ket:'',        batas:'2026-02-15', status:'Sudah dibayar' },
//   { id:'dta6', tanggal:'2026-03-01', nominal:200000, alasan:'Token Listrik', ket:'Rumah',   batas:'2026-03-10', status:'Sudah dibayar' },
//   { id:'dta7', tanggal:'2026-03-05', nominal:300000, alasan:'Indihome',      ket:'',        batas:'2026-03-15', status:'Belum dibayar' },
//   { id:'dta8', tanggal:'2026-03-20', nominal:150000, alasan:'BPJS',          ket:'',        batas:'2026-03-25', status:'Belum dibayar' },
// ];

// export const DUMMY_PIUTANG = [
//   { id:'dp1', dari:'Budi',   jumlah:500000,  ket:'Pinjam uang makan',         dibayar:200000, tglHutang:'2026-01-10', tglBayar:'', status:'Belum' },
//   { id:'dp2', dari:'Sari',   jumlah:300000,  ket:'Patungan beli kado',         dibayar:300000, tglHutang:'2026-01-20', tglBayar:'2026-02-01', status:'Lunas' },
//   { id:'dp3', dari:'Randi',  jumlah:1000000, ket:'Pinjam modal usaha kecil',   dibayar:0,      tglHutang:'2026-02-05', tglBayar:'', status:'Belum' },
// ];

// export const DUMMY_HUTANG = [
//   { id:'dh1', dari:'Pak Arif', jumlah:2000000, ket:'Pinjam biaya darurat',    dibayar:500000, tglHutang:'2025-12-01', tglBayar:'', status:'Belum' },
// ];

// export const DUMMY_ASET = [
//   { id:'da1', nama:'Emas Logam Mulia', jumlah:'5 gram', belitotal:5000000, platform:'Pegadaian', aktif:true, hargaPasar:5750000, catatan:'Beli Desember 2025' },
//   { id:'da2', nama:'Reksa Dana',       jumlah:'100 unit', belitotal:1000000, platform:'Bibit',   aktif:true, hargaPasar:1120000, catatan:'NAV naik terus' },
// ];

// export const DUMMY_SALDO_AWAL = 2000000;

// export const DUMMY_WIFI_ISP = [
//   {
//     id:'dw1', nama:'Indihome', idPelanggan:'123456789', paket:'50 Mbps', harga:300000,
//     alamat:'Jl. Contoh No.1', ssid:'RumahKu_5G',
//     password:'password123', ip:'192.168.1.1', userAdmin:'admin',
//     kataKunci:'admin', status:'Aktif',
//   },
// ];

// export const DUMMY_WIFI_BAYAR = [
//   { id:'dwb1', ispId:'dw1', tahun:2026, bulan:1, lunas:true },
//   { id:'dwb2', ispId:'dw1', tahun:2026, bulan:2, lunas:true },
// ];

// export const DUMMY_KATEGORI = {
//   sumber: [...DEFAULT_SUMBER],
//   tujuan: [...DEFAULT_TUJUAN],
// };

// ============================================================
// constants.js
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

// Metode pembayaran untuk transaksi (No.9)
export const METODE_BAYAR = [
  'Cash','Transfer BCA','Transfer BRI','Transfer BNI','Transfer Mandiri',
  'GoPay','OVO','Dana','ShopeePay','Kartu Debit','Kartu Kredit','Lainnya',
];

export const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',            icon: '◈',  section: 'utama' },
  { id: 'transaksi',   label: 'Transaksi Harian',     icon: '⇄',  section: 'utama' },
  { id: 'tagihan',     label: 'Tagihan & Pembayaran', icon: '🧾', section: 'utama' },
  { id: 'budget',      label: 'Budget & Anggaran',    icon: '🎯', section: 'utama' },
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
  budget:     'Budget & Anggaran',
  piutang:    'Piutang & Hutang',
  aset:       'Aset & Investasi',
  wifi:       'WiFi & Internet',
  laporan:    'Laporan & Grafik',
  pengaturan: 'Pengaturan',
};

export const CHART_COLORS = ['#2563eb','#059669','#7c3aed','#ea580c','#d97706','#dc2626'];

// ── Data Dummy untuk akun baru (generik) ──────────────────
export const DUMMY_TRANSAKSI = [
  { id:'dt1',  tanggal:'2026-01-05', pemasukan:3500000, sumber:'Gaji Tambahan',    pengeluaran:0,       tujuan:'Tidak ada pengeluaran', ket:'Gaji bulan Januari', metodeBayar:'Transfer BCA' },
  { id:'dt2',  tanggal:'2026-01-08', pemasukan:0,       sumber:'Tidak ada',        pengeluaran:450000,  tujuan:'Beli Kebutuhan',        ket:'Belanja bulanan', metodeBayar:'Cash' },
  { id:'dt3',  tanggal:'2026-01-12', pemasukan:750000,  sumber:'Jasa Freelance',   pengeluaran:0,       tujuan:'Tidak ada pengeluaran', ket:'Desain logo', metodeBayar:'Transfer BCA' },
  { id:'dt4',  tanggal:'2026-01-15', pemasukan:0,       sumber:'Tidak ada',        pengeluaran:200000,  tujuan:'Minyak',                ket:'Bensin motor', metodeBayar:'Cash' },
  { id:'dt5',  tanggal:'2026-01-20', pemasukan:0,       sumber:'Tidak ada',        pengeluaran:350000,  tujuan:'Keperluan Keluarga',    ket:'Kebutuhan rumah', metodeBayar:'Cash' },
  { id:'dt6',  tanggal:'2026-02-05', pemasukan:3500000, sumber:'Gaji Tambahan',    pengeluaran:0,       tujuan:'Tidak ada pengeluaran', ket:'Gaji bulan Februari', metodeBayar:'Transfer BCA' },
  { id:'dt7',  tanggal:'2026-02-10', pemasukan:0,       sumber:'Tidak ada',        pengeluaran:500000,  tujuan:'Beli Kebutuhan',        ket:'Belanja bulanan', metodeBayar:'GoPay' },
  { id:'dt8',  tanggal:'2026-02-14', pemasukan:500000,  sumber:'Penjualan Online', pengeluaran:0,       tujuan:'Tidak ada pengeluaran', ket:'Jual barang bekas', metodeBayar:'Transfer BRI' },
  { id:'dt9',  tanggal:'2026-02-20', pemasukan:0,       sumber:'Tidak ada',        pengeluaran:180000,  tujuan:'Minyak',                ket:'Bensin', metodeBayar:'Cash' },
  { id:'dt10', tanggal:'2026-03-05', pemasukan:3500000, sumber:'Gaji Tambahan',    pengeluaran:0,       tujuan:'Tidak ada pengeluaran', ket:'Gaji bulan Maret', metodeBayar:'Transfer BCA' },
  { id:'dt11', tanggal:'2026-03-08', pemasukan:0,       sumber:'Tidak ada',        pengeluaran:420000,  tujuan:'Beli Kebutuhan',        ket:'Belanja bulanan', metodeBayar:'Cash' },
  { id:'dt12', tanggal:'2026-03-12', pemasukan:1200000, sumber:'Jasa Freelance',   pengeluaran:0,       tujuan:'Tidak ada pengeluaran', ket:'Proyek website', metodeBayar:'Transfer BCA' },
];

export const DUMMY_TAGIHAN = [
  { id:'dta1', tanggal:'2026-01-01', nominal:200000, alasan:'Token Listrik', ket:'Rumah',   batas:'2026-01-10', status:'Sudah dibayar' },
  { id:'dta2', tanggal:'2026-01-05', nominal:300000, alasan:'Indihome',      ket:'',        batas:'2026-01-15', status:'Sudah dibayar' },
  { id:'dta3', tanggal:'2026-01-20', nominal:150000, alasan:'BPJS',          ket:'',        batas:'2026-01-25', status:'Sudah dibayar' },
  { id:'dta4', tanggal:'2026-02-01', nominal:200000, alasan:'Token Listrik', ket:'Rumah',   batas:'2026-02-10', status:'Sudah dibayar' },
  { id:'dta5', tanggal:'2026-02-05', nominal:300000, alasan:'Indihome',      ket:'',        batas:'2026-02-15', status:'Sudah dibayar' },
  { id:'dta6', tanggal:'2026-03-01', nominal:200000, alasan:'Token Listrik', ket:'Rumah',   batas:'2026-03-10', status:'Sudah dibayar' },
  { id:'dta7', tanggal:'2026-03-05', nominal:300000, alasan:'Indihome',      ket:'',        batas:'2026-03-15', status:'Belum dibayar' },
  { id:'dta8', tanggal:'2026-03-20', nominal:150000, alasan:'BPJS',          ket:'',        batas:'2026-03-25', status:'Belum dibayar' },
];

export const DUMMY_PIUTANG = [
  { id:'dp1', dari:'Budi',   jumlah:500000,  ket:'Pinjam uang makan',         dibayar:200000, tglHutang:'2026-01-10', tglBayar:'', status:'Belum' },
  { id:'dp2', dari:'Sari',   jumlah:300000,  ket:'Patungan beli kado',         dibayar:300000, tglHutang:'2026-01-20', tglBayar:'2026-02-01', status:'Lunas' },
  { id:'dp3', dari:'Randi',  jumlah:1000000, ket:'Pinjam modal usaha kecil',   dibayar:0,      tglHutang:'2026-02-05', tglBayar:'', status:'Belum' },
];

export const DUMMY_HUTANG = [
  { id:'dh1', dari:'Pak Arif', jumlah:2000000, ket:'Pinjam biaya darurat',    dibayar:500000, tglHutang:'2025-12-01', tglBayar:'', status:'Belum' },
];

export const DUMMY_ASET = [
  { id:'da1', nama:'Emas Logam Mulia', jumlah:'5 gram',   belitotal:5000000, platform:'Pegadaian', aktif:true, hargaPasar:5750000, catatan:'Beli Desember 2025' },
  { id:'da2', nama:'Reksa Dana',       jumlah:'100 unit', belitotal:1000000, platform:'Bibit',     aktif:true, hargaPasar:1120000, catatan:'NAV naik terus' },
];

export const DUMMY_SALDO_AWAL = 2000000;

export const DUMMY_WIFI_ISP = [
  {
    id:'dw1', nama:'Indihome', idPelanggan:'123456789', paket:'50 Mbps', harga:300000,
    alamat:'Jl. Contoh No.1', ssid:'RumahKu_5G',
    password:'password123', ip:'192.168.1.1', userAdmin:'admin',
    kataKunci:'admin', status:'Aktif',
  },
];

export const DUMMY_WIFI_BAYAR = [
  { id:'dwb1', ispId:'dw1', tahun:2026, bulan:1, lunas:true },
  { id:'dwb2', ispId:'dw1', tahun:2026, bulan:2, lunas:true },
];

export const DUMMY_KATEGORI = {
  sumber: [...DEFAULT_SUMBER],
  tujuan: [...DEFAULT_TUJUAN],
};

// Budget dummy
export const DUMMY_BUDGET = [
  { id:'db1', kategori:'Beli Kebutuhan',    batas:1500000 },
  { id:'db2', kategori:'Keperluan Keluarga',batas:1000000 },
  { id:'db3', kategori:'Minyak',            batas:400000  },
  { id:'db4', kategori:'Token Listrik',     batas:250000  },
  { id:'db5', kategori:'Indihome',          batas:350000  },
];
