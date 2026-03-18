import { useMemo } from 'react';
import BarChartBulanan from '../components/charts/BarChartBulanan';
import PieChartKategori from '../components/charts/PieChartKategori';
import { fmtRp, fmtDate, monthName, fullMonth } from '../utils/format';
import { filterByMonth, sumBy } from '../utils/helpers';

// ============================================================
// FIX No.2 — Saldo tidak lagi mengurangi tagihan secara mentah.
// Tagihan yang "Sudah dibayar" sudah masuk ke transaksi harian
// via fitur "Catat ke Transaksi". Tagihan yang belum dibayar
// tidak mempengaruhi saldo (belum keluar kas).
// Rumus saldo: saldoAwal + Σ pemasukan - Σ pengeluaran (transaksi harian saja)
// ============================================================

export default function DashboardPage({ data }) {
  const { transaksi, tagihan, hutang, piutang, aset, saldoAwal } = data;
  const now      = new Date();
  const curMonth = now.getMonth() + 1;
  const curYear  = now.getFullYear();
  const curKey   = `${curYear}-${String(curMonth).padStart(2,'0')}`;

  const curTx  = useMemo(() => filterByMonth(transaksi, curKey), [transaksi, curKey]);
  const curTag = useMemo(() => filterByMonth(tagihan, curKey),   [tagihan, curKey]);

  const totalPmsKini   = sumBy(curTx, 'pemasukan');
  const totalPglHarian = sumBy(curTx, 'pengeluaran');
  // Pengeluaran bulan ini = transaksi harian + tagihan yang BELUM dibayar (estimasi kewajiban)
  const totalPglBulanan = curTag.filter(t => t.status !== 'Sudah dibayar').reduce((s,x) => s + (x.nominal||0), 0);
  const totalPglKini   = totalPglHarian + totalPglBulanan;
  const bersihKini     = totalPmsKini - totalPglKini;

  // SALDO = saldoAwal + semua transaksi harian (pemasukan - pengeluaran)
  const saldoAkhir = useMemo(() => {
    const txSum = sumBy(transaksi,'pemasukan') - sumBy(transaksi,'pengeluaran');
    return saldoAwal + txSum;
  }, [transaksi, saldoAwal]);

  const chartData = useMemo(() => Array.from({length:6},(_,i) => {
    let m = curMonth-(5-i), y = curYear;
    if (m<=0) { m+=12; y-=1; }
    const key = `${y}-${String(m).padStart(2,'0')}`;
    const tx  = filterByMonth(transaksi, key);
    const tag = filterByMonth(tagihan, key).filter(t => t.status !== 'Sudah dibayar');
    return {
      label:       monthName(m),
      pemasukan:   sumBy(tx,'pemasukan'),
      pengeluaran: sumBy(tx,'pengeluaran') + sumBy(tag,'nominal'),
    };
  }), [transaksi, tagihan, curMonth, curYear]);

  const catData = useMemo(() => {
    const cats = {};
    transaksi.forEach(t => { if(t.pengeluaran>0) cats[t.tujuan]=(cats[t.tujuan]||0)+t.pengeluaran; });
    return Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name,value])=>({name,value}));
  }, [transaksi]);

  const sisaPiutang     = sumBy(piutang,'jumlah') - sumBy(piutang,'dibayar');
  const totalAset       = aset.filter(a=>a.aktif).reduce((s,x)=>s+(x.belitotal||0),0);
  const recentTx        = [...transaksi].sort((a,b)=>b.tanggal.localeCompare(a.tanggal)).slice(0,10);
  const tagihanBulanIni = [...curTag].sort((a,b)=>(a.batas||'').localeCompare(b.batas||''));
  const hutangList      = hutang.filter(h=>h.status!=='Lunas');
  const totalTagihan    = sumBy(curTag,'nominal');
  const totSudahBayar   = curTag.filter(t=>t.status==='Sudah dibayar').reduce((s,x)=>s+(x.nominal||0),0);

  return (
    <div className="fade-in" style={{ paddingBottom: '30px' }}>

      {/* ── KPI Cards ── */}
      <div className="dash-kpi-grid mb-4" style={{ gap: '16px' }}>
        {[
          { label: 'Saldo Saat Ini',           value: saldoAkhir, color: saldoAkhir>=0?'var(--green)':'var(--red)', sub: 'Dari transaksi harian', accent: 'kpi-green' },
          { label: `Pemasukan ${fullMonth(curMonth)}`,  value: totalPmsKini,  color: 'var(--blue)',   sub: `${curTx.filter(t=>t.pemasukan>0).length} transaksi masuk`, accent: 'kpi-blue' },
          { label: `Pengeluaran ${fullMonth(curMonth)}`,value: totalPglKini,  color: 'var(--red)',    sub: 'Harian + Tagihan belum bayar', accent: 'kpi-red' },
          { label: 'Bersih Bulan Ini',         value: bersihKini, color: bersihKini>=0?'var(--green)':'var(--red)', sub: 'Pemasukan − Pengeluaran', accent: bersihKini>=0?'kpi-green':'kpi-red' },
          { label: 'Sisa Piutang',             value: sisaPiutang,color: 'var(--yellow)', sub: `Dari ${piutang.length} orang`, accent: 'kpi-yellow' },
          { label: 'Total Investasi',          value: totalAset,  color: 'var(--purple)', sub: `${aset.filter(a=>a.aktif).length} aset aktif`, accent: 'kpi-purple' },
        ].map((k,i) => (
          <div key={i} className={`kpi-card ${k.accent}`} style={{ padding: '16px', borderRadius: '12px' }}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color: k.color, wordBreak: 'break-all', fontSize: 'clamp(0.85rem, 1.5vw, 1.15rem)' }}>{fmtRp(k.value)}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Charts Row (Tanpa Paksaan Tinggi) ── */}
      <div
  className="grid-2 mb-4"
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    alignItems: 'stretch'
  }}
>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="card-title">Tren 6 Bulan Terakhir</div>
          <div style={{ flex: 1, minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChartBulanan data={chartData} />
          </div>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="card-title">Kategori Pengeluaran Harian</div>
          <div style={{ flex: 1, minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PieChartKategori data={catData} />
          </div>
        </div>
      </div>

      {/* ── Bottom Row (Tanpa Paksaan Tinggi, dengan Scroll) ── */}
      <div
  className="grid-2"
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    alignItems: 'stretch'
  }}
>

        {/* 1. Transaksi Terbaru */}
       <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Transaksi Terbaru</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text3)', background: 'var(--bg3)', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>10 terakhir</span>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '380px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 0 }}>
              <thead>
                <tr>
                  <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Tanggal</th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Sumber / Tujuan</th>
                  <th style={{ textAlign: 'right', position: 'sticky', top: 0, zIndex: 1 }}>Nominal</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text3)', padding: 40, fontSize: '0.85rem' }}>Belum ada transaksi</td></tr>
                ) : recentTx.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 20px', fontSize: '0.75rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{fmtDate(t.tanggal)}</td>
                    <td style={{ padding: '14px 20px', fontSize: '0.85rem', fontWeight: 600, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.pemasukan > 0 ? t.sumber : t.tujuan}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem', fontWeight: 700, color: t.pemasukan > 0 ? 'var(--green)' : 'var(--red)', background: t.pemasukan > 0 ? 'var(--green-bg)' : 'var(--red-bg)', padding: '4px 10px', borderRadius: '8px' }}>
                        {t.pemasukan > 0 ? `+${fmtRp(t.pemasukan)}` : `-${fmtRp(t.pengeluaran)}`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Tagihan + Hutang Bulan Ini */}
       <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Tagihan — {fullMonth(curMonth)}</div>
              {totalTagihan > 0 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                  Lunas <span style={{ color: 'var(--green)', fontWeight: 700, fontFamily: 'var(--mono)' }}>{fmtRp(totSudahBayar)}</span>
                </div>
              )}
            </div>
            {totalTagihan > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--green)', borderRadius: 3, width: `${Math.min((totSudahBayar/totalTagihan)*100,100)}%`, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '380px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tagihanBulanIni.length === 0 && hutangList.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 0', textAlign: 'center', margin: 'auto' }}>
                <div className="empty-state-icon" style={{ fontSize: '2rem', marginBottom: '12px' }}>✅</div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tidak ada tagihan bulan ini</p>
              </div>
            ) : (
              <>
                {tagihanBulanIni.map(t => {
                  const lunas = t.status === 'Sudah dibayar';
                  return (
                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '12px', flexShrink: 0, background: lunas ? 'var(--green-bg)' : 'var(--red-bg)', border: `1px solid ${lunas ? '#86efac' : '#fca5a5'}` }}>
                      <div style={{ minWidth: 0, flex: 1, marginRight: 10 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {t.alasan}{t.ket ? <span style={{ fontWeight: 500, color: 'var(--text3)' }}> ({t.ket})</span> : ''}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 4, fontWeight: 600 }}>Batas: {fmtDate(t.batas) || '—'}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '0.9rem', color: lunas ? 'var(--green2)' : 'var(--red2)' }}>{fmtRp(t.nominal)}</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, marginTop: 4, color: lunas ? 'var(--green2)' : 'var(--red2)' }}>{lunas ? '✓ Lunas' : t.status}</div>
                      </div>
                    </div>
                  );
                })}
                {hutangList.length > 0 && (
                  <>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text3)', padding: '8px 0 4px', flexShrink: 0 }}>Hutang Kamu</div>
                    {hutangList.slice(0,4).map(h => {
                      const sisa = (h.jumlah||0) - (h.dibayar||0);
                      return (
                        <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '12px', flexShrink: 0, background: 'var(--orange-bg)', border: '1px solid #fdba74' }}>
                          <div style={{ minWidth: 0, flex: 1, marginRight: 10 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.nama||h.dari}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.ket||'—'}</div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--orange)' }}>{fmtRp(sisa)}</div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, marginTop: 4, color: 'var(--orange)' }}>Belum Lunas</div>
                          </div>
                        </div>
                      );
                    })}
                    {hutangList.length > 4 && <div style={{ fontSize: '0.75rem', color: 'var(--text3)', padding: '6px 0', textAlign: 'center', fontWeight: 600 }}>+{hutangList.length-4} hutang lainnya...</div>}
                  </>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
