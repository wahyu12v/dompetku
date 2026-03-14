// ============================================================
// DashboardPage.jsx — Revamped dashboard
// ============================================================
import { useMemo } from 'react';
import StatCard from '../components/StatCard';
import BarChartBulanan from '../components/charts/BarChartBulanan';
import PieChartKategori from '../components/charts/PieChartKategori';
import { fmtRp, fmtDate, monthName, fullMonth } from '../utils/format';
import { filterByMonth, sumBy, today } from '../utils/helpers';

export default function DashboardPage({ data }) {
  const { transaksi, tagihan, hutang, piutang, aset, saldoAwal } = data;
  const now      = new Date();
  const curMonth = now.getMonth() + 1;
  const curYear  = now.getFullYear();
  const curKey   = `${curYear}-${String(curMonth).padStart(2,'0')}`;

  const curTx  = useMemo(() => filterByMonth(transaksi, curKey), [transaksi, curKey]);
  const curTag = useMemo(() => filterByMonth(tagihan, curKey),   [tagihan,  curKey]);

  const totalPmsKini    = sumBy(curTx,  'pemasukan');
  const totalPglHarian  = sumBy(curTx,  'pengeluaran');
  const totalPglBulanan = sumBy(curTag, 'nominal');
  const totalPglKini    = totalPglHarian + totalPglBulanan;
  const bersihKini      = totalPmsKini - totalPglKini;

  const saldoAkhir = useMemo(() => {
    const txSum  = sumBy(transaksi,'pemasukan') - sumBy(transaksi,'pengeluaran');
    const tagSum = sumBy(tagihan,'nominal');
    return saldoAwal + txSum - tagSum;
  }, [transaksi, tagihan, saldoAwal]);

  const chartData = useMemo(() => Array.from({length:6},(_,i)=>{
    let m = curMonth-(5-i), y = curYear;
    if (m<=0) { m+=12; y-=1; }
    const key = `${y}-${String(m).padStart(2,'0')}`;
    const tx  = filterByMonth(transaksi, key);
    const tag = filterByMonth(tagihan, key);
    return {
      label:       monthName(m),
      pemasukan:   sumBy(tx,'pemasukan'),
      pengeluaran: sumBy(tx,'pengeluaran') + sumBy(tag,'nominal'),
    };
  }), [transaksi, tagihan, curMonth, curYear]);

  // Full category names, no truncation
  const catData = useMemo(() => {
    const cats = {};
    transaksi.forEach(t => { if(t.pengeluaran>0) cats[t.tujuan]=(cats[t.tujuan]||0)+t.pengeluaran; });
    tagihan.forEach(t   => { if(t.nominal>0)     cats[t.alasan]=(cats[t.alasan]||0)+t.nominal; });
    return Object.entries(cats)
      .sort((a,b)=>b[1]-a[1])
      .slice(0,6)
      .map(([name,value])=>({name,value}));
  }, [transaksi, tagihan]);

  const totalPiutang      = sumBy(piutang,'jumlah');
  const totalPiutangBayar = sumBy(piutang,'dibayar');
  const sisaPiutang       = totalPiutang - totalPiutangBayar;
  const totalAset         = aset.filter(a=>a.aktif).reduce((s,x)=>s+(x.belitotal||0),0);

  const recentTx = [...transaksi]
    .sort((a,b)=>b.tanggal.localeCompare(a.tanggal))
    .slice(0,8);

  const tagihanBulanIni = [...curTag].sort((a,b)=>(a.batas||'').localeCompare(b.batas||''));
  const hutangList      = hutang.filter(h=>h.status!=='Lunas');
  const totalTagihan    = sumBy(curTag,'nominal');

  return (
    <div className="fade-in">
      {/* ── KPI Cards ─────────────────────────────────────── */}
      <div className="dash-kpi-grid mb-4">
        <div className="kpi-card kpi-green">
          <div className="kpi-label">Saldo Saat Ini</div>
          <div className="kpi-value" style={{color: saldoAkhir>=0?'var(--green)':'var(--red)'}}>{fmtRp(saldoAkhir)}</div>
          <div className="kpi-sub">Akumulasi semua transaksi</div>
        </div>
        <div className="kpi-card kpi-blue">
          <div className="kpi-label">Pemasukan {fullMonth(curMonth)}</div>
          <div className="kpi-value" style={{color:'var(--blue)'}}>{fmtRp(totalPmsKini)}</div>
          <div className="kpi-sub">{curTx.filter(t=>t.pemasukan>0).length} transaksi masuk</div>
        </div>
        <div className="kpi-card kpi-red">
          <div className="kpi-label">Pengeluaran {fullMonth(curMonth)}</div>
          <div className="kpi-value" style={{color:'var(--red)'}}>{fmtRp(totalPglKini)}</div>
          <div className="kpi-sub">Harian + Tagihan</div>
        </div>
        <div className="kpi-card" style={{borderTopColor: bersihKini>=0?'var(--green)':'var(--red)'}}>
          <div className="kpi-label">Bersih Bulan Ini</div>
          <div className="kpi-value" style={{color: bersihKini>=0?'var(--green)':'var(--red)'}}>{fmtRp(bersihKini)}</div>
          <div className="kpi-sub">Pemasukan − Pengeluaran</div>
        </div>
        <div className="kpi-card kpi-yellow">
          <div className="kpi-label">Sisa Piutang</div>
          <div className="kpi-value" style={{color:'var(--yellow)'}}>{fmtRp(sisaPiutang)}</div>
          <div className="kpi-sub">Dari {piutang.length} orang</div>
        </div>
        <div className="kpi-card kpi-purple">
          <div className="kpi-label">Total Investasi</div>
          <div className="kpi-value" style={{color:'var(--purple)'}}>{fmtRp(totalAset)}</div>
          <div className="kpi-sub">{aset.filter(a=>a.aktif).length} aset aktif</div>
        </div>
      </div>

      {/* ── Charts Row ─────────────────────────────────────── */}
      <div className="grid-2 mb-4">
        <div className="card">
          <div className="card-title">Tren 6 Bulan Terakhir</div>
          <BarChartBulanan data={chartData} />
        </div>
        <div className="card">
          <div className="card-title">Kategori Pengeluaran (Semua Waktu)</div>
          <PieChartKategori data={catData} />
        </div>
      </div>

      {/* ── Bottom Row ─────────────────────────────────────── */}
      <div className="grid-2">
        {/* Transaksi terbaru */}
        <div className="card">
          <div className="section-header mb-3">
            <div className="section-title">Transaksi Terbaru</div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Sumber</th>
                  <th className="right">Pemasukan</th>
                  <th className="right">Pengeluaran</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.length===0 ? (
                  <tr><td colSpan={4} className="text-center text-muted" style={{padding:28}}>Belum ada transaksi</td></tr>
                ) : recentTx.map(t=>(
                  <tr key={t.id}>
                    <td className="text-muted" style={{fontSize:'0.76rem',whiteSpace:'nowrap'}}>{fmtDate(t.tanggal)}</td>
                    <td style={{maxWidth:130,fontSize:'0.83rem'}}>{t.sumber}</td>
                    <td className="td-mono td-right" style={{color:t.pemasukan>0?'var(--green)':'var(--text3)'}}>{t.pemasukan>0?fmtRp(t.pemasukan):'—'}</td>
                    <td className="td-mono td-right" style={{color:t.pengeluaran>0?'var(--red)':'var(--text3)'}}>{t.pengeluaran>0?fmtRp(t.pengeluaran):'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tagihan Bulanan — revamped clean design */}
        <div className="card">
          <div className="section-header mb-3">
            <div>
              <div className="section-title">Tagihan Bulanan — {fullMonth(curMonth)}</div>
              {totalTagihan > 0 && (
                <div style={{fontSize:'0.78rem',color:'var(--text3)',marginTop:2}}>
                  Total: <span style={{color:'var(--orange)',fontWeight:700,fontFamily:'var(--mono)'}}>{fmtRp(totalTagihan)}</span>
                </div>
              )}
            </div>
          </div>

          {tagihanBulanIni.length===0 && hutangList.length===0 ? (
            <div className="empty-state"><div className="empty-state-icon">✅</div><p>Tidak ada tagihan bulan ini</p></div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {tagihanBulanIni.map(t=>(
                <div key={t.id} style={{
                  display:'flex',justifyContent:'space-between',alignItems:'center',
                  padding:'10px 14px',borderRadius:10,
                  background: t.status==='Sudah dibayar' ? 'var(--green-bg)' : 'var(--red-bg)',
                  border: `1px solid ${t.status==='Sudah dibayar'?'#86efac':'#fca5a5'}`,
                }}>
                  <div>
                    <div style={{fontWeight:600,fontSize:'0.88rem'}}>
                      {t.alasan}{t.ket ? <span style={{fontWeight:400,color:'var(--text3)'}}> ({t.ket})</span> : ''}
                    </div>
                    <div style={{fontSize:'0.72rem',color:'var(--text3)',marginTop:2}}>
                      Batas: {fmtDate(t.batas)||'—'}
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontFamily:'var(--mono)',fontWeight:700,fontSize:'0.95rem',color:t.status==='Sudah dibayar'?'var(--green2)':'var(--red2)'}}>
                      {fmtRp(t.nominal)}
                    </div>
                    <div style={{fontSize:'0.7rem',fontWeight:600,marginTop:3,color:t.status==='Sudah dibayar'?'var(--green2)':'var(--red2)'}}>
                      {t.status==='Sudah dibayar' ? '✓ Lunas' : t.status}
                    </div>
                  </div>
                </div>
              ))}

              {hutangList.length>0 && (
                <>
                  <div style={{fontSize:'0.7rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',color:'var(--text3)',padding:'6px 0 2px'}}>
                    Hutang Kamu
                  </div>
                  {hutangList.slice(0,3).map(h=>{
                    const sisa=(h.jumlah||0)-(h.dibayar||0);
                    return (
                      <div key={h.id} style={{
                        display:'flex',justifyContent:'space-between',alignItems:'center',
                        padding:'10px 14px',borderRadius:10,
                        background:'var(--orange-bg)',border:'1px solid #fdba74',
                      }}>
                        <div>
                          <div style={{fontWeight:600,fontSize:'0.88rem'}}>{h.nama||h.dari}</div>
                          <div style={{fontSize:'0.72rem',color:'var(--text3)',marginTop:2}}>{h.ket||'—'}</div>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <div style={{fontFamily:'var(--mono)',fontWeight:700,fontSize:'0.95rem',color:'var(--orange)'}}>{fmtRp(sisa)}</div>
                          <div style={{fontSize:'0.7rem',fontWeight:600,marginTop:3,color:'var(--orange)'}}>Belum Lunas</div>
                        </div>
                      </div>
                    );
                  })}
                  {hutangList.length>3 && (
                    <div className="text-muted text-xs" style={{paddingTop:4}}>+{hutangList.length-3} hutang lainnya...</div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
