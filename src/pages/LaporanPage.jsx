// ============================================================
// LaporanPage.jsx — Annual + Monthly drill-down reports
// ============================================================
import { useState, useMemo } from 'react';
import StatCard from '../components/StatCard';
import BarChartBulanan from '../components/charts/BarChartBulanan';
import AreaChartSaldo from '../components/charts/AreaChartSaldo';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fmtRp, monthName, fullMonth } from '../utils/format';
import { filterByMonth, sumBy } from '../utils/helpers';

const YEARS = [2024,2025,2026,2027];
const tooltip = {
  contentStyle: { background:'#fff', border:'1px solid #dde3ec', borderRadius:10, fontFamily:'Sora,sans-serif', fontSize:12 },
  labelStyle: { color:'#1a202c' },
};

// ── Weekly breakdown for a given month ─────────────────────
function weeklyData(transaksi, tagihan, year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({length:4}, (_,w) => {
    const startDay = w*7+1, endDay = Math.min((w+1)*7, daysInMonth);
    const start = `${year}-${String(month).padStart(2,'0')}-${String(startDay).padStart(2,'0')}`;
    const end   = `${year}-${String(month).padStart(2,'0')}-${String(endDay).padStart(2,'0')}`;
    const tx  = transaksi.filter(t=>t.tanggal>=start && t.tanggal<=end);
    const tag = tagihan.filter(t=>t.tanggal>=start && t.tanggal<=end);
    return {
      label: `Mgg ${w+1}`,
      pemasukan: sumBy(tx,'pemasukan'),
      pengeluaran: sumBy(tx,'pengeluaran') + sumBy(tag,'nominal'),
    };
  });
}

export default function LaporanPage({ data }) {
  const { transaksi, tagihan, saldoAwal, setSaldoAwal } = data;
  const [year,      setYear]      = useState(new Date().getFullYear());
  const [bulanDrill, setBulan]    = useState(''); // '' = tahunan, '01'-'12' = bulanan

  // ── Annual data ─────────────────────────────────────────
  const monthlyData = useMemo(() => Array.from({length:12},(_,i)=>{
    const m   = i+1;
    const key = `${year}-${String(m).padStart(2,'0')}`;
    const tx  = filterByMonth(transaksi,key);
    const tag = filterByMonth(tagihan,key);
    const pms  = sumBy(tx,'pemasukan');
    const pglH = sumBy(tx,'pengeluaran');
    const pglB = sumBy(tag,'nominal');
    return { label:monthName(m), fullLabel:fullMonth(m), pemasukan:pms, pengeluaranHarian:pglH, pengeluaranBulanan:pglB, pengeluaran:pglH+pglB, bersih:pms-pglH-pglB };
  }), [transaksi, tagihan, year]);

  const { saldoData, totalPms, totalPgl } = useMemo(()=>{
    let running = saldoAwal, totPms=0, totPgl=0;
    const sd = monthlyData.map(m=>{ running+=m.bersih; totPms+=m.pemasukan; totPgl+=m.pengeluaran; return {...m,saldo:running}; });
    return { saldoData:sd, totalPms:totPms, totalPgl:totPgl };
  }, [monthlyData, saldoAwal]);

  // ── Monthly drill-down data ─────────────────────────────
  const drillData = useMemo(()=>{
    if (!bulanDrill) return null;
    return weeklyData(transaksi, tagihan, year, parseInt(bulanDrill));
  }, [transaksi, tagihan, year, bulanDrill]);

  const drillKey = bulanDrill ? `${year}-${bulanDrill}` : null;
  const drillTx  = drillKey ? filterByMonth(transaksi, drillKey) : [];
  const drillTag = drillKey ? filterByMonth(tagihan, drillKey) : [];
  const drillPms = sumBy(drillTx,'pemasukan');
  const drillPgl = sumBy(drillTx,'pengeluaran') + sumBy(drillTag,'nominal');

  const isDrill  = !!bulanDrill;

  return (
    <div className="fade-in">
      {/* Toolbar */}
      <div className="laporan-toolbar">
        <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
          <div className="laporan-year-select">
            <span className="text-sub text-sm">Tahun:</span>
            <select className="form-select" style={{width:110}} value={year} onChange={e=>{setYear(Number(e.target.value));setBulan('');}}>
              {YEARS.map(y=><option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="laporan-year-select">
            <span className="text-sub text-sm">Bulan:</span>
            <select className="form-select" style={{width:150}} value={bulanDrill} onChange={e=>setBulan(e.target.value)}>
              <option value="">— Tampilkan Tahunan —</option>
              {Array.from({length:12},(_,i)=>{
                const m = String(i+1).padStart(2,'0');
                return <option key={m} value={m}>{fullMonth(i+1)}</option>;
              })}
            </select>
          </div>
          {isDrill && <button className="btn btn-ghost btn-sm" onClick={()=>setBulan('')}>← Kembali ke Tahunan</button>}
        </div>
        <div className="laporan-saldo-awal">
          <label>Saldo Awal:</label>
          <input type="number" className="form-input" value={saldoAwal} onChange={e=>setSaldoAwal(Number(e.target.value))} style={{width:170}} />
        </div>
      </div>

      {/* ── DRILL DOWN: Monthly view ─────────────────────── */}
      {isDrill ? (
        <>
          <div className="stats-grid mb-4" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
            <StatCard label={`Pemasukan ${fullMonth(parseInt(bulanDrill))} ${year}`} value={fmtRp(drillPms)} color="blue" sub="" />
            <StatCard label="Total Pengeluaran"  value={fmtRp(drillPgl)} color="red"  sub="Harian + Tagihan" />
            <StatCard label="Bersih Bulan Ini"   value={fmtRp(drillPms-drillPgl)} color={(drillPms-drillPgl)>=0?'green':'red'} sub="" />
          </div>

          <div className="card mb-4">
            <div className="card-title">Pemasukan vs Pengeluaran Per Minggu — {fullMonth(parseInt(bulanDrill))} {year}</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={drillData} margin={{top:4,right:4,left:-16,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="label" tick={{fill:'#718096',fontSize:12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill:'#718096',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000000).toFixed(1)}jt`} />
                <Tooltip formatter={v=>[fmtRp(v)]} {...tooltip} />
                <Legend wrapperStyle={{fontSize:12,color:'#4a5568',paddingTop:8}} />
                <Bar dataKey="pemasukan"   name="Pemasukan"   fill="#059669" radius={[4,4,0,0]} maxBarSize={48} />
                <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#dc2626" radius={[4,4,0,0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tagihan detail bulan ini */}
          <div className="grid-2">
            <div className="card">
              <div className="card-title">Transaksi Harian — {fullMonth(parseInt(bulanDrill))}</div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Tanggal</th><th>Sumber</th><th className="right">Pms</th><th className="right">Pgl</th></tr></thead>
                  <tbody>
                    {drillTx.length===0
                      ? <tr><td colSpan={4} className="text-center text-muted" style={{padding:24}}>Tidak ada data</td></tr>
                      : [...drillTx].sort((a,b)=>a.tanggal.localeCompare(b.tanggal)).map(t=>(
                        <tr key={t.id}>
                          <td className="text-muted" style={{fontSize:'0.76rem'}}>{t.tanggal}</td>
                          <td style={{fontSize:'0.82rem'}}>{t.sumber}</td>
                          <td className="td-mono td-right" style={{color:t.pemasukan>0?'var(--green)':'var(--text3)',fontSize:'0.8rem'}}>{t.pemasukan>0?fmtRp(t.pemasukan):'—'}</td>
                          <td className="td-mono td-right" style={{color:t.pengeluaran>0?'var(--red)':'var(--text3)',fontSize:'0.8rem'}}>{t.pengeluaran>0?fmtRp(t.pengeluaran):'—'}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card">
              <div className="card-title">Tagihan — {fullMonth(parseInt(bulanDrill))}</div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Jenis</th><th>Keterangan</th><th className="right">Nominal</th><th>Status</th></tr></thead>
                  <tbody>
                    {drillTag.length===0
                      ? <tr><td colSpan={4} className="text-center text-muted" style={{padding:24}}>Tidak ada tagihan</td></tr>
                      : drillTag.map(t=>(
                        <tr key={t.id}>
                          <td style={{fontWeight:600,fontSize:'0.82rem'}}>{t.alasan}</td>
                          <td className="text-muted" style={{fontSize:'0.78rem'}}>{t.ket||'—'}</td>
                          <td className="td-mono td-right" style={{color:'var(--orange)',fontSize:'0.8rem'}}>{fmtRp(t.nominal)}</td>
                          <td>{t.status==='Sudah dibayar'?<span className="badge green">✓ Lunas</span>:<span className="badge yellow">{t.status}</span>}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ── ANNUAL view ──────────────────────────────────── */
        <>
          <div className="stats-grid mb-4" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
            <StatCard label={`Total Pemasukan ${year}`}  value={fmtRp(totalPms)} color="blue" sub="" />
            <StatCard label={`Total Pengeluaran ${year}`} value={fmtRp(totalPgl)} color="red"  sub="" />
            <StatCard label={`Bersih ${year}`}           value={fmtRp(totalPms-totalPgl)} color={(totalPms-totalPgl)>=0?'green':'red'} sub="" />
          </div>

          <div className="card mb-4">
            <div className="card-title">Pemasukan vs Pengeluaran — {year}</div>
            <BarChartBulanan data={saldoData.map(m=>({label:m.label,pemasukan:m.pemasukan,pengeluaran:m.pengeluaran}))} height={260} />
          </div>

          <div className="card mb-4">
            <div className="card-title">Tren Saldo Bulanan — {year}</div>
            <AreaChartSaldo data={saldoData} height={200} />
          </div>

          <div className="card">
            <div className="card-title">Ringkasan Per Bulan — {year} (klik bulan untuk detail)</div>
            <div className="table-wrap">
              <table>
                <thead><tr>
                  <th>Bulan</th><th className="right">Pemasukan</th><th className="right">Pgl Harian</th>
                  <th className="right">Tagihan</th><th className="right">Total Pgl</th>
                  <th className="right">Bersih</th><th className="right">Saldo Akhir</th>
                </tr></thead>
                <tbody>
                  {saldoData.map((m,i)=>(
                    <tr key={i} style={{cursor:'pointer'}} onClick={()=>setBulan(String(i+1).padStart(2,'0'))}>
                      <td style={{fontWeight:600,color:'var(--accent)',textDecoration:'underline'}}>{m.fullLabel}</td>
                      <td className="td-mono td-right" style={{color:m.pemasukan>0?'var(--blue)':'var(--text3)'}}>{m.pemasukan>0?fmtRp(m.pemasukan):'—'}</td>
                      <td className="td-mono td-right" style={{color:m.pengeluaranHarian>0?'var(--text2)':'var(--text3)'}}>{m.pengeluaranHarian>0?fmtRp(m.pengeluaranHarian):'—'}</td>
                      <td className="td-mono td-right" style={{color:m.pengeluaranBulanan>0?'var(--orange)':'var(--text3)'}}>{m.pengeluaranBulanan>0?fmtRp(m.pengeluaranBulanan):'—'}</td>
                      <td className="td-mono td-right" style={{color:m.pengeluaran>0?'var(--red)':'var(--text3)'}}>{m.pengeluaran>0?fmtRp(m.pengeluaran):'—'}</td>
                      <td className="td-mono td-right" style={{fontWeight:600,color:m.bersih>=0?'var(--green)':'var(--red)'}}>{fmtRp(m.bersih)}</td>
                      <td className="td-mono td-right" style={{fontWeight:700,color:m.saldo>=0?'var(--green)':'var(--red)'}}>{fmtRp(m.saldo)}</td>
                    </tr>
                  ))}
                  <tr style={{background:'var(--bg3)'}}>
                    <td style={{fontWeight:700}}>TOTAL</td>
                    <td className="td-mono td-right" style={{fontWeight:700,color:'var(--blue)'}}>{fmtRp(totalPms)}</td>
                    <td className="td-mono td-right" style={{fontWeight:700}}>{fmtRp(saldoData.reduce((s,m)=>s+m.pengeluaranHarian,0))}</td>
                    <td className="td-mono td-right" style={{fontWeight:700,color:'var(--orange)'}}>{fmtRp(saldoData.reduce((s,m)=>s+m.pengeluaranBulanan,0))}</td>
                    <td className="td-mono td-right" style={{fontWeight:700,color:'var(--red)'}}>{fmtRp(totalPgl)}</td>
                    <td className="td-mono td-right" style={{fontWeight:700,color:(totalPms-totalPgl)>=0?'var(--green)':'var(--red)'}}>{fmtRp(totalPms-totalPgl)}</td>
                    <td className="td-mono td-right" style={{fontWeight:700,color:saldoData[11]?.saldo>=0?'var(--green)':'var(--red)'}}>{fmtRp(saldoData[11]?.saldo||0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
