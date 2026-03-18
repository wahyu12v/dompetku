# 💰 Dompetku — Sistem Keuangan Pribadi

Web app keuangan pribadi berbasis React. Semua data tersimpan di browser (localStorage) per akun pengguna.

## 📁 Struktur Project

```
dompetku/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── styles/
│   │   ├── globals.css         # Reset, variabel CSS, utilitas global
│   │   ├── layout.css          # Sidebar, topbar, layout utama
│   │   ├── components.css      # Card, table, badge, button, form, modal
│   │   └── pages.css           # Style khusus per halaman
│   ├── utils/
│   │   ├── storage.js          # Fungsi baca/tulis localStorage
│   │   ├── format.js           # Format angka, tanggal, rupiah
│   │   ├── constants.js        # Dropdown options, seed data
│   │   └── helpers.js          # genId, today, groupBy, dll
│   ├── hooks/
│   │   ├── useAuth.js          # Login, register, logout
│   │   └── useData.js          # CRUD transaksi, tagihan, piutang, dll
│   ├── context/
│   │   └── AppContext.js       # Global state provider
│   ├── components/
│   │   ├── Sidebar.jsx         # Navigasi sidebar
│   │   ├── Topbar.jsx          # Header atas
│   │   ├── StatCard.jsx        # Kartu statistik
│   │   ├── Modal.jsx           # Base modal wrapper
│   │   ├── forms/
│   │   │   ├── TransaksiForm.jsx
│   │   │   ├── TagihanForm.jsx
│   │   │   ├── PiutangHutangForm.jsx
│   │   │   └── AsetForm.jsx
│   │   └── charts/
│   │       ├── BarChartBulanan.jsx
│   │       ├── AreaChartSaldo.jsx
│   │       └── PieChartKategori.jsx
│   ├── pages/
│   │   ├── AuthPage.jsx        # Login & Register
│   │   ├── DashboardPage.jsx   # Ringkasan utama
|   |   |── BudgetPage.jsx      # Atur budget
│   │   ├── TransaksiPage.jsx   # Input & histori transaksi harian
│   │   ├── TagihanPage.jsx     # Tagihan & pembayaran rutin
│   │   ├── PiutangHutangPage.jsx # Tracker piutang & hutang
│   │   ├── AsetPage.jsx        # Aset & investasi
│   │   └── LaporanPage.jsx     # Laporan tahunan & grafik
│   ├── App.jsx                 # Root component + routing
│   └── index.js                # Entry point React
├── package.json
└── README.md
```

## 🚀 Cara Menjalankan

### Development
```bash
npm install
npm start
# Buka http://localhost:3000
```

### Build Production
```bash
npm run build
# Output di folder /build
```

### Deploy ke Netlify / Vercel
1. Push ke GitHub
2. Connect repo di Netlify/Vercel
3. Build command: `npm run build`
4. Publish dir: `build`

## 🔐 Sistem Akun
- Data disimpan di `localStorage` browser
- Setiap user punya data terpisah
- Data awal (seed) otomatis terisi dari data keuangan yang sudah ada

## 📊 Fitur
- ✅ Dashboard & ringkasan keuangan
- ✅ Input transaksi harian
- ✅ Tagihan & pembayaran rutin
- ✅ Tracker piutang & hutang
- ✅ Aset & investasi
- ✅ Laporan grafik tahunan
- ✅ Multi akun dengan login
