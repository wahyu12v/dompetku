// ============================================================
// LaporanPage.jsx — Annual + Monthly drill-down + filter kategori
// No.4: filter per kategori pengeluaran
// No.8: tahun dinamis dari data transaksi
// No.2: saldo tidak ikutkan tagihan (konsisten dengan DashboardPage)
// ============================================================
import { useState, useMemo, useEffect } from 'react';
import BarChartBulanan from '../components/charts/BarChartBulanan';
import AreaChartSaldo from '../components/charts/AreaChartSaldo';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fmtRp, monthName, fullMonth } from '../utils/format';
import { filterByMonth, sumBy } from '../utils/helpers';

// No.8 — tahun dinamis dari data
function getYearRange(transaksi, tagihan) {
  const currentYear = new Date().getFullYear();
  const years = [
    ...transaksi.map(t => parseInt(t.tanggal?.substring(0,4))),
    ...tagihan.map(t => parseInt(t.tanggal?.substring(0,4))),
  ].filter(y => !isNaN(y) && y > 2000);
  const minY = years.length > 0 ? Math.min(...years) : currentYear;
  const maxY = Math.max(currentYear + 2, years.length > 0 ? Math.max(...years) + 1 : currentYear + 2);
  return { minYear: minY, maxYear: maxY };
}

const tooltip = {
  contentStyle: { background:'#fff', border:'1px solid #dde3ec', borderRadius:12, fontFamily:'Sora,sans-serif', fontSize:12, boxShadow:'0 4px 16px rgba(0,0,0,0.08)' },
  labelStyle: { color:'#1a202c', fontWeight: 800, marginBottom: 4 },
};

function useMobile(bp = 640) {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < bp);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < bp);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [bp]);
  return mobile;
}

function weeklyData(transaksi, tagihan, year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({length:4}, (_,w) => {
    const startDay = w*7+1, endDay = Math.min((w+1)*7, daysInMonth);
    const start = `${year}-${String(month).padStart(2,'0')}-${String(startDay).padStart(2,'0')}`;
    const end   = `${year}-${String(month).padStart(2,'0')}-${String(endDay).padStart(2,'0')}`;
    const tx  = transaksi.filter(t=>t.tanggal>=start && t.tanggal<=end);
    const tag = tagihan.filter(t=>t.tanggal>=start && t.tanggal<=end && t.status !== 'Sudah dibayar');
    return { label:`Minggu ${w+1}`, pemasukan:sumBy(tx,'pemasukan'), pengeluaran:sumBy(tx,'pengeluaran')+sumBy(tag,'nominal') };
  });
}

function KpiCard({ label, value, color, icon, sub }) {
  const colorMap = {
    blue:   { bg: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)', accent: 'var(--blue)',   bar: '#2563eb' },
    red:    { bg: 'linear-gradient(135deg, #fee2e2 0%, #fff5f5 100%)', accent: 'var(--red)',    bar: '#dc2626' },
    green:  { bg: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)', accent: 'var(--green)',  bar: '#059669' },
    orange: { bg: 'linear-gradient(135deg, #ffedd5 0%, #fff7ed 100%)', accent: 'var(--orange)', bar: '#ea580c' },
  };
  const c = colorMap[color] || colorMap.blue;
  return (
    <div style={{ background: c.bg, borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: c.bar, borderRadius: '16px 16px 0 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</div>
        <div style={{ fontSize: '1.3rem', opacity: 0.7 }}>{icon}</div>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '1.35rem', color: c.accent, marginTop: 10, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 6, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

function SectionHeader({ title, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 4, height: 20, background: 'var(--accent2)', borderRadius: 4 }} />
        <span style={{ fontSize: '1rem', fontWeight: 800 }}>{title}</span>
      </div>
      {action}
    </div>
  );
}

export default function LaporanPage({ data }) {
  const { transaksi, tagihan, saldoAwal, setSaldoAwal } = data;
  const mobile = useMobile();

  const { minYear, maxYear } = useMemo(() => getYearRange(transaksi, tagihan), [transaksi, tagihan]);
  const [year,       setYear]   = useState(new Date().getFullYear());
  const [bulanDrill, setBulan]  = useState('');
  const [filterKat, setFilterKat] = useState('');

  const allKategori = useMemo(() => {
    const set = new Set();
    transaksi.forEach(t => { if (t.pengeluaran > 0 && t.tujuan) set.add(t.tujuan); });
    tagihan.forEach(t => { if (t.alasan) set.add(t.alasan); });
    return ['', ...set].filter(Boolean);
  }, [transaksi, tagihan]);

  const transaksiFiltered = useMemo(() => {
    if (!filterKat) return transaksi;
    return transaksi.filter(t => t.tujuan === filterKat || t.sumber === filterKat);
  }, [transaksi, filterKat]);

  const tagihanFiltered = useMemo(() => {
    if (!filterKat) return tagihan;
    return tagihan.filter(t => t.alasan === filterKat);
  }, [tagihan, filterKat]);

  const monthlyData = useMemo(() => Array.from({length:12},(_,i)=>{
    const m   = i+1;
    const key = `${year}-${String(m).padStart(2,'0')}`;
    const tx  = filterByMonth(transaksiFiltered, key);
    const tag = filterByMonth(tagihanFiltered, key).filter(t => t.status !== 'Sudah dibayar');
    const pms  = sumBy(tx,'pemasukan');
    const pglH = sumBy(tx,'pengeluaran');
    const pglB = sumBy(tag,'nominal');
    return { label:monthName(m), fullLabel:fullMonth(m), pemasukan:pms, pengeluaranHarian:pglH, pengeluaranBulanan:pglB, pengeluaran:pglH+pglB, bersih:pms-pglH-pglB };
  }), [transaksiFiltered, tagihanFiltered, year]);

  const { saldoData, totalPms, totalPgl } = useMemo(()=>{
    let running = saldoAwal, totPms=0, totPgl=0;
    const sd = monthlyData.map((m, idx) => {
      const key = `${year}-${String(idx+1).padStart(2,'0')}`;
      const tx  = filterByMonth(transaksi, key);
      const txPms = sumBy(tx,'pemasukan');
      const txPgl = sumBy(tx,'pengeluaran');
      running += txPms - txPgl;
      totPms  += m.pemasukan;
      totPgl  += m.pengeluaran;
      return { ...m, saldo: running };
    });
    return { saldoData: sd, totalPms: totPms, totalPgl: totPgl };
  }, [monthlyData, saldoAwal, transaksi, year]);

  const drillData = useMemo(()=>{ if (!bulanDrill) return null; return weeklyData(transaksiFiltered, tagihanFiltered, year, parseInt(bulanDrill)); }, [transaksiFiltered, tagihanFiltered, year, bulanDrill]);
  const drillKey  = bulanDrill ? `${year}-${bulanDrill}` : null;
  const drillTx   = drillKey ? filterByMonth(transaksiFiltered, drillKey) : [];
  const drillTag  = drillKey ? filterByMonth(tagihanFiltered, drillKey) : [];
  const drillPms  = sumBy(drillTx,'pemasukan');
  const drillPgl  = sumBy(drillTx,'pengeluaran') + sumBy(drillTag.filter(t=>t.status!=='Sudah dibayar'),'nominal');

  const kategoriData = useMemo(() => {
    const map = {};
    filterByMonth(transaksi, `${year}`).forEach(t => {
      if (t.pengeluaran > 0 && t.tujuan) map[t.tujuan] = (map[t.tujuan]||0) + t.pengeluaran;
    });
    filterByMonth(tagihan, `${year}`).filter(t=>t.status!=='Sudah dibayar').forEach(t => {
      if (t.alasan) map[t.alasan] = (map[t.alasan]||0) + t.nominal;
    });
    return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([name,value])=>({name,value}));
  }, [transaksi, tagihan, year]);

  return (
    <div className="fade-in" style={{ width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>

      {/* ── Toolbar Utama ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '20px', width: '100%' }}>
        
        {/* Stepper Tahun */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', padding: '4px 6px', borderRadius: '30px', border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', flexShrink: 0 }}>
          <button onClick={() => { setYear(p => Math.max(minYear, p-1)); setBulan(''); }} disabled={year <= minYear}
            style={{ width:32, height:32, borderRadius:'50%', border:'none', background:year<=minYear?'transparent':'var(--bg3)', color:year<=minYear?'var(--border2)':'var(--text)', cursor:year<=minYear?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', transition: 'background 0.2s' }}>❮</button>
          <div style={{ minWidth: 60, textAlign:'center', padding:'0 4px' }}>
            <div style={{ fontSize:'0.6rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1px', marginBottom: 2 }}>Tahun</div>
            <div style={{ fontWeight:800, fontSize:'1.05rem', color:'var(--text)', lineHeight:1 }}>{year}</div>
          </div>
          <button onClick={() => { setYear(p => Math.min(maxYear, p+1)); setBulan(''); }} disabled={year >= maxYear}
            style={{ width:32, height:32, borderRadius:'50%', border:'none', background:year>=maxYear?'transparent':'var(--bg3)', color:year>=maxYear?'var(--border2)':'var(--text)', cursor:year>=maxYear?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', transition: 'background 0.2s' }}>❯</button>
        </div>

        {/* Filter Kategori */}
        <div style={{ flex: '1 1 200px', minWidth: '160px' }}>
          <select 
            className="form-select" 
            style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '10px 16px', fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', backgroundPosition: 'right 14px center' }}
            value={filterKat}
            onChange={e => setFilterKat(e.target.value)}
          >
            <option value="">📊 Semua Kategori</option>
            {allKategori.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        {/* Saldo Awal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', padding: '8px 16px', borderRadius: '30px', border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', flex: '1 1 250px', minWidth: '220px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Saldo Awal</span>
          <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 4px' }} />
          <span style={{ fontWeight: 800, color: 'var(--text3)', fontSize: '0.85rem' }}>Rp</span>
          <input type="number" value={saldoAwal} onChange={e => setSaldoAwal(Number(e.target.value))}
            style={{ border: 'none', background: 'transparent', fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)', width: '100%', outline: 'none', minWidth: 0 }} />
        </div>

      </div>

      {/* ── Month Tabs ── */}
      <div style={{ display:'flex', overflowX:'auto', gap: '8px', paddingBottom: '12px', marginBottom: '20px', flexWrap:'nowrap', WebkitOverflowScrolling: 'touch', scrollbarWidth:'none', width: '100%' }}>
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        <button onClick={()=>setBulan('')} style={{ flexShrink:0, padding:'8px 20px', borderRadius: '24px', fontFamily:'var(--font)', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap', background:bulanDrill===''?'var(--accent)':'#ffffff', color:bulanDrill===''?'#ffffff':'var(--text2)', boxShadow:bulanDrill===''?'0 4px 12px rgba(2, 132, 199, 0.25)':'0 2px 4px rgba(0,0,0,0.02)', border:`1px solid ${bulanDrill===''?'var(--accent)':'var(--border)'}` }}>📊 Tahunan</button>
        {Array.from({length:12},(_,i)=>{
          const m = String(i+1).padStart(2,'0');
          const active = bulanDrill === m;
          return (
            <button key={m} onClick={()=>setBulan(m)} style={{ flexShrink:0, padding:'8px 18px', borderRadius: '24px', fontFamily:'var(--font)', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap', background:active?'var(--accent)':'#ffffff', color:active?'#ffffff':'var(--text2)', border:`1px solid ${active?'var(--accent)':'var(--border)'}`, boxShadow:active?'0 4px 12px rgba(2, 132, 199, 0.25)':'0 2px 4px rgba(0,0,0,0.02)' }}>{mobile?monthName(i+1):fullMonth(i+1)}</button>
          );
        })}
      </div>

      {/* ── Drill-down view ── */}
      {bulanDrill ? (
        <div className="fade-in">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
            <div>
              <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:4 }}>Detail Laporan{filterKat ? ` · ${filterKat}` : ''}</div>
              <h2 style={{ fontSize:mobile?'1.1rem':'1.3rem', fontWeight:800, margin:0 }}>{fullMonth(parseInt(bulanDrill))} {year}</h2>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap:14, marginBottom:24 }}>
            <KpiCard label="Total Pemasukan" value={fmtRp(drillPms)} color="blue" icon="💰" />
            <KpiCard label="Total Pengeluaran" value={fmtRp(drillPgl)} color="red" icon="💸" sub="Harian + Tagihan belum bayar" />
            <KpiCard label="Bersih Bulan Ini" value={fmtRp(drillPms-drillPgl)} color={(drillPms-drillPgl)>=0?'green':'red'} icon={(drillPms-drillPgl)>=0?'📈':'📉'} />
          </div>

          <div className="card" style={{ padding:mobile?'16px':'24px', borderRadius:16, marginBottom:24 }}>
            <SectionHeader title="Pemasukan vs Pengeluaran Per Minggu" />
            <ResponsiveContainer width="100%" height={mobile?220:280}>
              <BarChart data={drillData} margin={{top:4,right:4,left:-16,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{fill:'var(--text2)',fontSize:11,fontWeight:600}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fill:'var(--text3)',fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000000).toFixed(1)}jt`} dx={-8} />
                <Tooltip formatter={v=>[fmtRp(v)]} cursor={{fill:'var(--bg3)'}} {...tooltip} />
                <Legend wrapperStyle={{fontSize:12,fontWeight:600,color:'var(--text2)',paddingTop:14}} iconType="circle" />
                <Bar dataKey="pemasukan" name="Pemasukan" fill="var(--green)" radius={[6,6,0,0]} maxBarSize={40} />
                <Bar dataKey="pengeluaran" name="Pengeluaran" fill="var(--red)" radius={[6,6,0,0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:mobile?'1fr':'repeat(auto-fit, minmax(320px, 1fr))', gap:20 }}>
            <div className="card" style={{ padding:0, borderRadius:16, overflow:'hidden' }}>
              <div style={{ padding:'16px 18px', borderBottom:'1px solid var(--border)' }}><SectionHeader title="Transaksi Harian" /></div>
              <div className="table-wrap">
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'2px solid var(--border)' }}>
                      {['Tanggal','Sumber/Tujuan','Metode','Masuk','Keluar'].map(h=>(
                        <th key={h} style={{ background:'transparent', padding:'11px 14px', textAlign: h==='Masuk'||h==='Keluar'?'right':'left', fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {drillTx.length===0
                      ? <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--text3)', padding:'36px', fontSize:'0.85rem' }}>Tidak ada data</td></tr>
                      : [...drillTx].sort((a,b)=>a.tanggal.localeCompare(b.tanggal)).map(t=>(
                        <tr key={t.id} style={{ borderBottom:'1px solid var(--border)', transition:'background 0.15s' }} onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <td style={{ padding:'10px 14px', color:'var(--text2)', fontSize:'0.78rem', whiteSpace:'nowrap', fontFamily:'var(--mono)' }}>{t.tanggal}</td>
                          <td style={{ padding:'10px 14px', fontWeight:600, fontSize:'0.83rem' }}>{t.pemasukan>0?t.sumber:t.tujuan}</td>
                          <td style={{ padding:'10px 14px' }}>{t.metodeBayar&&<span style={{ background:'var(--bg3)', padding:'2px 7px', borderRadius:6, fontSize:'0.7rem', fontWeight:600, color:'var(--text3)' }}>{t.metodeBayar}</span>}</td>
                          <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.83rem', color:t.pemasukan>0?'var(--green)':'var(--text3)' }}>{t.pemasukan>0?`+${fmtRp(t.pemasukan)}`:'—'}</td>
                          <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.83rem', color:t.pengeluaran>0?'var(--red)':'var(--text3)' }}>{t.pengeluaran>0?`-${fmtRp(t.pengeluaran)}`:'—'}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card" style={{ padding:0, borderRadius:16, overflow:'hidden' }}>
              <div style={{ padding:'16px 18px', borderBottom:'1px solid var(--border)' }}><SectionHeader title="Tagihan & Kewajiban" /></div>
              <div className="table-wrap">
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'2px solid var(--border)' }}>
                      {['Jenis','Keterangan','Nominal','Status'].map(h=>(
                        <th key={h} style={{ background:'transparent', padding:'11px 14px', textAlign:h==='Nominal'?'right':'left', fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {drillTag.length===0
                      ? <tr><td colSpan={4} style={{ textAlign:'center', color:'var(--text3)', padding:'36px', fontSize:'0.85rem' }}>Tidak ada tagihan</td></tr>
                      : drillTag.map(t=>(
                        <tr key={t.id} style={{ borderBottom:'1px solid var(--border)', transition:'background 0.15s' }} onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <td style={{ padding:'10px 14px', fontWeight:700, fontSize:'0.83rem' }}>{t.alasan}</td>
                          <td style={{ padding:'10px 14px', color:'var(--text2)', fontSize:'0.78rem' }}>{t.ket||'—'}</td>
                          <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.83rem', color:'var(--orange)' }}>{fmtRp(t.nominal)}</td>
                          <td style={{ padding:'10px 14px', textAlign:'center' }}>
                            {t.status==='Sudah dibayar'
                              ? <span style={{ background:'var(--green-bg)', color:'var(--green)', padding:'3px 10px', borderRadius:20, fontSize:'0.7rem', fontWeight:700 }}>✓ Lunas</span>
                              : <span style={{ background:'var(--orange-bg)', color:'var(--orange)', padding:'3px 10px', borderRadius:20, fontSize:'0.7rem', fontWeight:700 }}>Belum</span>
                            }
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      ) : (
        /* ── Annual view ── */
        <div className="fade-in">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap:14, marginBottom:24 }}>
            <KpiCard label={`Total Pemasukan ${year}`} value={fmtRp(totalPms)} color="blue" icon="💰" sub={filterKat ? `Filter: ${filterKat}` : undefined} />
            <KpiCard label={`Total Pengeluaran ${year}`} value={fmtRp(totalPgl)} color="red" icon="💸" />
            <KpiCard label={`Tabungan Bersih ${year}`} value={fmtRp(totalPms-totalPgl)} color={(totalPms-totalPgl)>=0?'green':'red'} icon={(totalPms-totalPgl)>=0?'📈':'📉'} sub={(totalPms-totalPgl)>=0?'Pemasukan melebihi pengeluaran':'Pengeluaran melebihi pemasukan'} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:mobile?'1fr':'repeat(auto-fit, minmax(360px, 1fr))', gap:20, marginBottom:24 }}>
            <div className="card" style={{ padding:mobile?'16px':'24px', borderRadius:16 }}>
              <SectionHeader title={`Pemasukan vs Pengeluaran — ${year}`} />
              <BarChartBulanan data={saldoData.map(m=>({label:m.label,pemasukan:m.pemasukan,pengeluaran:m.pengeluaran}))} height={mobile?200:260} />
            </div>
            <div className="card" style={{ padding:mobile?'16px':'24px', borderRadius:16 }}>
              <SectionHeader title={`Tren Saldo Bulanan — ${year}`} />
              <AreaChartSaldo data={saldoData} height={mobile?200:260} />
            </div>
          </div>

          {/* Chart per kategori */}
          {!filterKat && kategoriData.length > 0 && (
            <div className="card" style={{ padding:mobile?'16px':'24px', borderRadius:16, marginBottom:24 }}>
              <SectionHeader title={`Top Kategori Pengeluaran — ${year}`} />
              <ResponsiveContainer width="100%" height={mobile?220:280}>
                <BarChart data={kategoriData} layout="vertical" margin={{top:4,right:20,left:10,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{fill:'var(--text3)',fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000000).toFixed(1)}jt`} />
                  <YAxis type="category" dataKey="name" tick={{fill:'var(--text2)',fontSize:11,fontWeight:600}} axisLine={false} tickLine={false} width={120} />
                  <Tooltip formatter={v=>[fmtRp(v),'Pengeluaran']} cursor={{fill:'var(--bg3)'}} {...tooltip} />
                  <Bar dataKey="value" name="Pengeluaran" fill="var(--red)" radius={[0,6,6,0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Monthly table */}
          <div className="card" style={{ padding:0, borderRadius:16, overflow:'hidden' }}>
            <div style={{ padding:mobile?'14px 16px':'18px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
              <div>
                <div style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:3 }}>Ringkasan</div>
                <div style={{ fontSize:'1rem', fontWeight:800 }}>Per Bulan — {year}{filterKat ? ` · ${filterKat}` : ''}</div>
              </div>
              <div style={{ fontSize:'0.75rem', color:'var(--text3)', background:'var(--bg3)', padding:'5px 14px', borderRadius:20, fontWeight:600 }}>
                {mobile ? '👆 Ketuk baris' : '💡 Klik baris untuk detail mingguan'}
              </div>
            </div>

            <div className="table-wrap">
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ borderBottom:'2px solid var(--border)' }}>
                    {['Bulan','Pemasukan','Pgl Harian','Tagihan','Total Pgl','Bersih','Saldo Akhir'].map((h,idx)=>(
                      <th key={h} style={{ background:'transparent', padding:'14px 20px', textAlign:idx===0?'left':'right', fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.5px', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {saldoData.map((m,i)=>(
                    <tr key={i} style={{ cursor:'pointer', borderBottom:'1px solid var(--border)', transition:'background 0.15s' }}
                        onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                        onClick={()=>setBulan(String(i+1).padStart(2,'0'))}>
                      <td style={{ padding:'14px 20px' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          <span style={{ fontWeight:700, color:'var(--text)' }}>{m.fullLabel}</span>
                          <span style={{ fontSize:'0.68rem', color:'var(--blue)', fontWeight:700, background:'var(--blue-bg)', padding:'2px 8px', borderRadius:12, opacity:0.8 }}>Detail ➔</span>
                        </div>
                      </td>
                      <td style={{ padding:'14px 20px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:600, fontSize:'0.83rem', color:m.pemasukan>0?'var(--blue)':'var(--text3)' }}>{m.pemasukan>0?fmtRp(m.pemasukan):'—'}</td>
                      <td style={{ padding:'14px 20px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:600, fontSize:'0.83rem', color:m.pengeluaranHarian>0?'var(--text2)':'var(--text3)' }}>{m.pengeluaranHarian>0?fmtRp(m.pengeluaranHarian):'—'}</td>
                      <td style={{ padding:'14px 20px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:600, fontSize:'0.83rem', color:m.pengeluaranBulanan>0?'var(--orange)':'var(--text3)' }}>{m.pengeluaranBulanan>0?fmtRp(m.pengeluaranBulanan):'—'}</td>
                      <td style={{ padding:'14px 20px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.83rem', color:m.pengeluaran>0?'var(--red)':'var(--text3)' }}>{m.pengeluaran>0?fmtRp(m.pengeluaran):'—'}</td>
                      <td style={{ padding:'14px 20px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.83rem', color:m.bersih>=0?'var(--green)':'var(--red)' }}>{fmtRp(m.bersih)}</td>
                      <td style={{ padding:'14px 20px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.88rem', color:m.saldo>=0?'var(--text)':'var(--red)' }}>{fmtRp(m.saldo)}</td>
                    </tr>
                  ))}
                  
                  {/* DIUBAH: Background transparan & Teks hitam tegas agar tidak kucel abu-abu */}
                  <tr style={{ borderTop:'2px solid var(--border)', background:'transparent' }}>
                    <td style={{ padding:'16px 20px', fontWeight:800, color:'var(--text)', textTransform:'uppercase', letterSpacing:'1px', fontSize:'0.78rem' }}>Total {year}</td>
                    <td style={{ padding:'16px 20px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.9rem', color:'var(--blue)' }}>{fmtRp(totalPms)}</td>
                    <td style={{ padding:'16px 20px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.9rem' }}>{fmtRp(saldoData.reduce((s,m)=>s+m.pengeluaranHarian,0))}</td>
                    <td style={{ padding:'16px 20px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.9rem', color:'var(--orange)' }}>{fmtRp(saldoData.reduce((s,m)=>s+m.pengeluaranBulanan,0))}</td>
                    <td style={{ padding:'16px 20px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.9rem', color:'var(--red)' }}>{fmtRp(totalPgl)}</td>
                    <td style={{ padding:'16px 20px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.9rem', color:(totalPms-totalPgl)>=0?'var(--green)':'var(--red)' }}>{fmtRp(totalPms-totalPgl)}</td>
                    <td style={{ padding:'16px 20px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:800, fontSize:'1rem', color:saldoData[11]?.saldo>=0?'var(--text)':'var(--red)' }}>{fmtRp(saldoData[11]?.saldo||0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
