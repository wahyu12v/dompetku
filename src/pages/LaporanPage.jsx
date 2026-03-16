// ============================================================
// LaporanPage.jsx — Annual + Monthly drill-down reports
// ============================================================
import { useState, useMemo, useEffect } from 'react';
import BarChartBulanan from '../components/charts/BarChartBulanan';
import AreaChartSaldo from '../components/charts/AreaChartSaldo';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fmtRp, monthName, fullMonth } from '../utils/format';
import { filterByMonth, sumBy } from '../utils/helpers';

const YEARS = [2024,2025,2026,2027,2028,2029,2030];
const tooltip = {
  contentStyle: { background:'#fff', border:'1px solid #dde3ec', borderRadius:12, fontFamily:'Sora,sans-serif', fontSize:12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
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
    const tag = tagihan.filter(t=>t.tanggal>=start && t.tanggal<=end);
    return { label:`Minggu ${w+1}`, pemasukan:sumBy(tx,'pemasukan'), pengeluaran:sumBy(tx,'pengeluaran')+sumBy(tag,'nominal') };
  });
}

// ── Hero Summary Banner (mobile) ──────────────────────────
function MobileHeroBanner({ year, totalPms, totalPgl, saldoAkhir }) {
  const net = totalPms - totalPgl;
  const isPositive = net >= 0;
  const savingsRate = totalPms > 0 ? Math.round((net / totalPms) * 100) : 0;
  return (
    <div style={{
      borderRadius: 20, padding: '22px 20px 20px',
      background: isPositive
        ? 'linear-gradient(135deg, #0f172a 0%, #0c4a6e 60%, #164e63 100%)'
        : 'linear-gradient(135deg, #0f172a 0%, #7f1d1d 60%, #450a0a 100%)',
      boxShadow: isPositive ? '0 8px 32px rgba(2,132,199,0.25)' : '0 8px 32px rgba(220,38,38,0.25)',
      marginBottom: 16, position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-20, left:-20, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />

      {/* Year badge */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:20, padding:'4px 14px', display:'inline-flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:'0.65rem', fontWeight:800, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'1px' }}>Laporan</span>
          <span style={{ fontSize:'0.85rem', fontWeight:800, color:'#fff' }}>{year}</span>
        </div>
        <span style={{ fontSize:'1.1rem' }}>{isPositive ? '📈' : '📉'}</span>
      </div>

      {/* Net position — big number */}
      <div style={{ marginBottom:6 }}>
        <div style={{ fontSize:'0.65rem', fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:6 }}>Tabungan Bersih</div>
        <div style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:'2rem', color: isPositive ? '#34d399' : '#f87171', lineHeight:1, letterSpacing:'-1px' }}>
          {isPositive ? '+' : ''}{fmtRp(net)}
        </div>
      </div>

      {/* Savings rate badge */}
      <div style={{ marginBottom:20 }}>
        <span style={{ background: isPositive ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)', border: `1px solid ${isPositive ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`, borderRadius:20, padding:'3px 10px', fontSize:'0.72rem', fontWeight:700, color: isPositive ? '#34d399' : '#f87171' }}>
          {isPositive ? `Hemat ${savingsRate}% dari pemasukan` : `Defisit ${Math.abs(savingsRate)}% dari pemasukan`}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height:1, background:'rgba(255,255,255,0.08)', marginBottom:16 }} />

      {/* Two metrics side by side */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div>
          <div style={{ fontSize:'0.62rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:5 }}>💰 Pemasukan</div>
          <div style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.95rem', color:'#7dd3fc' }}>{fmtRp(totalPms)}</div>
        </div>
        <div>
          <div style={{ fontSize:'0.62rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:5 }}>💸 Pengeluaran</div>
          <div style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.95rem', color:'#fca5a5' }}>{fmtRp(totalPgl)}</div>
        </div>
        <div>
          <div style={{ fontSize:'0.62rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:5 }}>🏦 Saldo Akhir</div>
          <div style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.95rem', color:'#e2e8f0' }}>{fmtRp(saldoAkhir)}</div>
        </div>
        <div>
          {/* progress bar */}
          <div style={{ fontSize:'0.62rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:5 }}>Rasio Pgl</div>
          <div style={{ height:6, background:'rgba(255,255,255,0.1)', borderRadius:4, overflow:'hidden', marginTop:4 }}>
            <div style={{ height:'100%', borderRadius:4, background: totalPms > 0 && totalPgl/totalPms < 0.8 ? '#34d399' : '#f87171', width:`${Math.min(100, totalPms > 0 ? (totalPgl/totalPms)*100 : 0)}%`, transition:'width 0.6s ease' }} />
          </div>
          <div style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.5)', marginTop:3, fontFamily:'var(--mono)', fontWeight:700 }}>
            {totalPms > 0 ? `${Math.round((totalPgl/totalPms)*100)}%` : '—'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Drill Hero Banner (mobile drill-down) ─────────────────
function MobileDrillHero({ bulanLabel, year, drillPms, drillPgl }) {
  const net = drillPms - drillPgl;
  const isPositive = net >= 0;
  return (
    <div style={{
      borderRadius: 18, padding: '18px 18px 16px',
      background: isPositive
        ? 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)'
        : 'linear-gradient(135deg, #0f172a 0%, #7f1d1d 100%)',
      marginBottom: 16, position: 'relative', overflow: 'hidden',
      boxShadow: isPositive ? '0 6px 24px rgba(5,150,105,0.2)' : '0 6px 24px rgba(220,38,38,0.2)',
    }}>
      <div style={{ position:'absolute', top:-24, right:-24, width:90, height:90, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
      <div style={{ fontSize:'0.65rem', fontWeight:800, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:4 }}>Detail · {year}</div>
      <div style={{ fontWeight:800, fontSize:'1.2rem', color:'#fff', marginBottom:14 }}>{bulanLabel}</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
        <div>
          <div style={{ fontSize:'0.58rem', fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:4 }}>Masuk</div>
          <div style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.88rem', color:'#6ee7b7' }}>{fmtRp(drillPms)}</div>
        </div>
        <div>
          <div style={{ fontSize:'0.58rem', fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:4 }}>Keluar</div>
          <div style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.88rem', color:'#fca5a5' }}>{fmtRp(drillPgl)}</div>
        </div>
        <div>
          <div style={{ fontSize:'0.58rem', fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:4 }}>Bersih</div>
          <div style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.88rem', color: isPositive ? '#34d399' : '#f87171' }}>{isPositive?'+':''}{fmtRp(net)}</div>
        </div>
      </div>
    </div>
  );
}

// ── KPI Card Component (desktop) ──────────────────────────
function KpiCard({ label, value, color, icon, sub }) {
  const colorMap = {
    blue:   { bg: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)', accent: 'var(--blue)',   bar: '#2563eb' },
    red:    { bg: 'linear-gradient(135deg, #fee2e2 0%, #fff5f5 100%)', accent: 'var(--red)',    bar: '#dc2626' },
    green:  { bg: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)', accent: 'var(--green)',  bar: '#059669' },
    orange: { bg: 'linear-gradient(135deg, #ffedd5 0%, #fff7ed 100%)', accent: 'var(--orange)', bar: '#ea580c' },
  };
  const c = colorMap[color] || colorMap.blue;
  return (
    <div style={{ background: c.bg, borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.04)'; }}
    >
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

// ── Month Row for mobile annual view ──────────────────────
function MonthMobileCard({ m, i, onClick }) {
  const net = m.bersih;
  const total = m.pemasukan + m.pengeluaran || 1;
  const pmsRatio = Math.round((m.pemasukan / total) * 100);
  const isPositive = net >= 0;
  const MONTH_EMOJIS = ['❄️','💝','🌸','🌿','🌻','☀️','🏖️','🌊','🍂','🎃','🍁','🎄'];
  return (
    <div onClick={onClick} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden', cursor:'pointer', transition:'all 0.18s', boxShadow:'0 1px 6px rgba(0,0,0,0.03)' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 1px 6px rgba(0,0,0,0.03)'; }}
    >
      {/* Colored top bar proportional to savings */}
      <div style={{ height:3, background:'var(--bg3)', position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, height:'100%', width:`${pmsRatio}%`, background: isPositive ? 'var(--green)' : 'var(--red)', borderRadius:'0 2px 2px 0', transition:'width 0.5s ease' }} />
      </div>

      <div style={{ padding:'12px 14px', display:'flex', alignItems:'center', gap:12 }}>
        {/* Month icon + number */}
        <div style={{ width:44, height:44, borderRadius:12, background: isPositive ? 'var(--green-bg)' : 'var(--red-bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0, border:`1px solid ${isPositive ? '#86efac' : '#fca5a5'}` }}>
          <div style={{ fontSize:'0.95rem', lineHeight:1 }}>{MONTH_EMOJIS[i]}</div>
          <div style={{ fontSize:'0.55rem', fontWeight:800, color:'var(--text3)', marginTop:1 }}>{String(i+1).padStart(2,'0')}</div>
        </div>

        {/* Month name + bars */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
            <span style={{ fontWeight:700, fontSize:'0.9rem', color:'var(--text)' }}>{m.fullLabel}</span>
            <span style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.85rem', color: isPositive ? 'var(--green)' : 'var(--red)', flexShrink:0, marginLeft:8 }}>
              {isPositive ? '+' : ''}{fmtRp(net)}
            </span>
          </div>
          {/* Segmented bar: pemasukan + pengeluaran */}
          <div style={{ display:'flex', height:5, borderRadius:4, overflow:'hidden', background:'var(--bg3)', gap:'1px' }}>
            <div style={{ width:`${pmsRatio}%`, background:'#3b82f6', transition:'width 0.5s ease' }} />
            <div style={{ flex:1, background:'#ef4444' }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
            <span style={{ fontSize:'0.65rem', color:'var(--text3)', fontFamily:'var(--mono)', fontWeight:600 }}>{m.pemasukan > 0 ? fmtRp(m.pemasukan) : '—'}</span>
            <span style={{ fontSize:'0.65rem', color:'var(--text3)', fontFamily:'var(--mono)', fontWeight:600 }}>{m.pengeluaran > 0 ? fmtRp(m.pengeluaran) : '—'}</span>
          </div>
        </div>

        {/* Arrow */}
        <div style={{ color:'var(--text3)', fontSize:'0.9rem', flexShrink:0 }}>›</div>
      </div>
    </div>
  );
}

// ── Transaction mobile card ────────────────────────────────
function TxCard({ t }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)', marginBottom: 3 }}>{t.sumber}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{t.tanggal}</div>
        {t.ket && <div style={{ fontSize: '0.72rem', color: 'var(--text2)', marginTop: 3 }}>{t.ket}</div>}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
        {t.pemasukan > 0 && <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '0.88rem', color: 'var(--green)' }}>+{fmtRp(t.pemasukan)}</div>}
        {t.pengeluaran > 0 && <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '0.88rem', color: 'var(--red)' }}>-{fmtRp(t.pengeluaran)}</div>}
      </div>
    </div>
  );
}

// ── Tagihan mobile card ────────────────────────────────────
function TagihanCard({ t }) {
  const lunas = t.status === 'Sudah dibayar';
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)', marginBottom: 3 }}>{t.alasan}</div>
        {t.ket && <div style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>{t.ket}</div>}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
        <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '0.88rem', color: 'var(--orange)', marginBottom: 5 }}>{fmtRp(t.nominal)}</div>
        <span style={{ background: lunas ? 'var(--green-bg)' : 'var(--orange-bg)', color: lunas ? 'var(--green)' : 'var(--orange)', padding: '3px 9px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 700 }}>
          {lunas ? '✓ Lunas' : 'Belum'}
        </span>
      </div>
    </div>
  );
}

// ── Section Header ─────────────────────────────────────────
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
  const [year,      setYear]   = useState(new Date().getFullYear());
  const [bulanDrill, setBulan] = useState('');
  const mobile = useMobile();

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
  const drillData = useMemo(()=>{ if (!bulanDrill) return null; return weeklyData(transaksi, tagihan, year, parseInt(bulanDrill)); }, [transaksi, tagihan, year, bulanDrill]);
  const drillKey  = bulanDrill ? `${year}-${bulanDrill}` : null;
  const drillTx   = drillKey ? filterByMonth(transaksi, drillKey) : [];
  const drillTag  = drillKey ? filterByMonth(tagihan, drillKey) : [];
  const drillPms  = sumBy(drillTx,'pemasukan');
  const drillPgl  = sumBy(drillTx,'pengeluaran') + sumBy(drillTag,'nominal');
  const isDrill   = !!bulanDrill;

  return (
    <div className="fade-in" style={{ width: '100%', boxSizing: 'border-box' }}>

      {/* ════════════════════════════════
          TOOLBAR
      ════════════════════════════════ */}
      <div style={{ marginBottom: 24 }}>

        {/* Top row: Tahun + Saldo Awal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>

          {/* Year stepper */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--card)', padding: '5px 10px', borderRadius: 30, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid var(--border)' }}>
            <button
              onClick={() => { setYear(p => Math.max(YEARS[0], p-1)); setBulan(''); }}
              disabled={year <= YEARS[0]}
              style={{ width:30, height:30, borderRadius:'50%', border:'none', background:'transparent', color: year<=YEARS[0]?'var(--border2)':'var(--text)', cursor:year<=YEARS[0]?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', transition:'background 0.15s' }}
              onMouseEnter={e => { if(year>YEARS[0]) e.currentTarget.style.background='var(--bg3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}
            ><span style={{transform:'translateY(-1px)'}}>❮</span></button>

            <div style={{ minWidth:80, textAlign:'center', padding:'0 4px' }}>
              <div style={{ fontSize:'0.6rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1px' }}>Tahun</div>
              <div style={{ fontWeight:800, fontSize:'1.05rem', color:'var(--text)', lineHeight:1.2 }}>{year}</div>
            </div>

            <button
              onClick={() => { setYear(p => Math.min(YEARS[YEARS.length-1], p+1)); setBulan(''); }}
              disabled={year >= YEARS[YEARS.length-1]}
              style={{ width:30, height:30, borderRadius:'50%', border:'none', background:'transparent', color:year>=YEARS[YEARS.length-1]?'var(--border2)':'var(--text)', cursor:year>=YEARS[YEARS.length-1]?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', transition:'background 0.15s' }}
              onMouseEnter={e => { if(year<YEARS[YEARS.length-1]) e.currentTarget.style.background='var(--bg3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}
            ><span style={{transform:'translateY(-1px)'}}>❯</span></button>
          </div>

          {/* Saldo Awal */}
          <div style={{ display:'flex', alignItems:'center', gap: mobile ? 8 : 12, background:'var(--card)', padding:mobile?'6px 10px':'6px 10px 6px 18px', borderRadius:30, border:'1px solid var(--border)', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', flex: mobile ? 1 : 'none' }}>
            <span style={{ fontSize:'0.7rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.5px', whiteSpace:'nowrap' }}>Saldo Awal</span>
            <div style={{ display:'flex', alignItems:'center', background:'var(--bg3)', padding:'5px 12px', borderRadius:20, flex: mobile ? 1 : 'none' }}>
              <span style={{ fontWeight:800, color:'var(--text2)', marginRight:5, fontSize:'0.88rem' }}>Rp</span>
              <input
                type="number" value={saldoAwal}
                onChange={e => setSaldoAwal(Number(e.target.value))}
                style={{ border:'none', background:'transparent', fontFamily:'var(--mono)', fontWeight:800, fontSize: mobile?'0.9rem':'1rem', color:'var(--text)', width: mobile?'100%':'120px', outline:'none', minWidth:0 }}
              />
            </div>
          </div>
        </div>

        {/* Month filter pills — horizontal scroll */}
        <div style={{ display:'flex', overflowX:'auto', gap:8, paddingBottom:4, scrollbarWidth:'none', WebkitOverflowScrolling:'touch' }}>
          <button onClick={()=>setBulan('')} style={{
            flexShrink:0, padding:'7px 18px', borderRadius:24, border:'none', fontFamily:'var(--font)', fontWeight:700, fontSize:'0.83rem', cursor:'pointer', transition:'all 0.18s', whiteSpace:'nowrap',
            background: bulanDrill==='' ? 'var(--text)' : 'var(--card)',
            color: bulanDrill==='' ? 'var(--bg)' : 'var(--text2)',
            boxShadow: bulanDrill==='' ? '0 3px 10px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
            border: `1px solid ${bulanDrill==='' ? 'var(--text)' : 'var(--border)'}`,
          }}>📊 Tahunan</button>

          {Array.from({length:12},(_,i)=>{
            const m = String(i+1).padStart(2,'0');
            const active = bulanDrill === m;
            return (
              <button key={m} onClick={()=>setBulan(m)} style={{
                flexShrink:0, padding:'7px 16px', borderRadius:24, fontFamily:'var(--font)', fontWeight:700, fontSize:'0.83rem', cursor:'pointer', transition:'all 0.18s', whiteSpace:'nowrap',
                background: active ? 'var(--accent2)' : 'var(--card)',
                color: active ? '#fff' : 'var(--text2)',
                border: `1px solid ${active ? 'var(--accent2)' : 'var(--border)'}`,
                boxShadow: active ? '0 3px 10px rgba(3,105,161,0.2)' : '0 1px 4px rgba(0,0,0,0.04)',
              }}>{mobile ? monthName(i+1) : fullMonth(i+1)}</button>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════
          DRILL-DOWN: Monthly view
      ════════════════════════════════ */}
      {isDrill ? (
        <div className="fade-in">
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
            <div>
              <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:4 }}>Detail Laporan</div>
              <h2 style={{ fontSize: mobile?'1.1rem':'1.3rem', fontWeight:800, margin:0 }}>{fullMonth(parseInt(bulanDrill))} {year}</h2>
            </div>
            <button className="btn btn-ghost" style={{ fontWeight:700, fontSize:'0.85rem', display:'flex', alignItems:'center', gap:6, borderRadius:24, padding:'8px 18px' }} onClick={()=>setBulan('')}>
              ← Kembali ke Tahunan
            </button>
          </div>

          {/* KPI Cards */}
          {mobile ? (
            <MobileDrillHero bulanLabel={fullMonth(parseInt(bulanDrill))} year={year} drillPms={drillPms} drillPgl={drillPgl} />
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap:14, marginBottom:24 }}>
              <KpiCard label="Total Pemasukan" value={fmtRp(drillPms)} color="blue" icon="💰" />
              <KpiCard label="Total Pengeluaran" value={fmtRp(drillPgl)} color="red" icon="💸" sub="Harian + Tagihan" />
              <KpiCard label="Bersih Bulan Ini" value={fmtRp(drillPms-drillPgl)} color={(drillPms-drillPgl)>=0?'green':'red'} icon={(drillPms-drillPgl)>=0?'📈':'📉'} />
            </div>
          )}

          {/* Weekly chart */}
          <div className="card" style={{ padding: mobile?'16px':'24px', borderRadius:16, marginBottom:24 }}>
            <SectionHeader title={`Pemasukan vs Pengeluaran Per Minggu`} />
            <ResponsiveContainer width="100%" height={mobile?220:280}>
              <BarChart data={drillData} margin={{top:4,right:4,left:-16,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{fill:'var(--text2)',fontSize:11,fontWeight:600}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fill:'var(--text3)',fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000000).toFixed(1)}jt`} dx={-8} />
                <Tooltip formatter={v=>[fmtRp(v)]} cursor={{fill:'var(--bg3)'}} {...tooltip} />
                <Legend wrapperStyle={{fontSize:12,fontWeight:600,color:'var(--text2)',paddingTop:14}} iconType="circle" />
                <Bar dataKey="pemasukan"   name="Pemasukan"   fill="var(--green)" radius={[6,6,0,0]} maxBarSize={40} />
                <Bar dataKey="pengeluaran" name="Pengeluaran" fill="var(--red)"   radius={[6,6,0,0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Transaction + Tagihan tables/cards */}
          <div style={{ display:'grid', gridTemplateColumns: mobile?'1fr':'repeat(auto-fit, minmax(320px, 1fr))', gap:20 }}>

            {/* Transaksi Harian */}
            <div className="card" style={{ padding:0, borderRadius:16, overflow:'hidden' }}>
              <div style={{ padding:'16px 18px', borderBottom:'1px solid var(--border)' }}>
                <SectionHeader title="Transaksi Harian" />
              </div>

              {mobile ? (
                <div style={{ padding:'12px', display:'flex', flexDirection:'column', gap:8 }}>
                  {drillTx.length===0
                    ? <div style={{ textAlign:'center', color:'var(--text3)', padding:'32px', fontSize:'0.85rem' }}>Tidak ada data</div>
                    : [...drillTx].sort((a,b)=>a.tanggal.localeCompare(b.tanggal)).map(t=><TxCard key={t.id} t={t} />)
                  }
                </div>
              ) : (
                <div className="table-wrap">
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom:'2px solid var(--border)' }}>
                        <th style={{ background:'transparent', padding:'11px 18px', textAlign:'left', fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase' }}>Tanggal</th>
                        <th style={{ background:'transparent', padding:'11px 18px', textAlign:'left', fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase' }}>Sumber/Tujuan</th>
                        <th style={{ background:'transparent', padding:'11px 18px', textAlign:'right', fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase' }}>Pemasukan</th>
                        <th style={{ background:'transparent', padding:'11px 18px', textAlign:'right', fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase' }}>Pengeluaran</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drillTx.length===0
                        ? <tr><td colSpan={4} style={{ textAlign:'center', color:'var(--text3)', padding:'36px', fontSize:'0.85rem' }}>Tidak ada data</td></tr>
                        : [...drillTx].sort((a,b)=>a.tanggal.localeCompare(b.tanggal)).map(t=>(
                          <tr key={t.id} style={{ borderBottom:'1px solid var(--border)', transition:'background 0.15s' }} onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <td style={{ padding:'12px 18px', color:'var(--text2)', fontSize:'0.8rem', whiteSpace:'nowrap', fontFamily:'var(--mono)' }}>{t.tanggal}</td>
                            <td style={{ padding:'12px 18px', fontWeight:600, fontSize:'0.85rem' }}>{t.sumber}</td>
                            <td style={{ padding:'12px 18px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.83rem', color:t.pemasukan>0?'var(--green)':'var(--text3)' }}>{t.pemasukan>0?`+${fmtRp(t.pemasukan)}`:'—'}</td>
                            <td style={{ padding:'12px 18px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.83rem', color:t.pengeluaran>0?'var(--red)':'var(--text3)' }}>{t.pengeluaran>0?`-${fmtRp(t.pengeluaran)}`:'—'}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Tagihan */}
            <div className="card" style={{ padding:0, borderRadius:16, overflow:'hidden' }}>
              <div style={{ padding:'16px 18px', borderBottom:'1px solid var(--border)' }}>
                <SectionHeader title="Tagihan & Kewajiban" />
              </div>

              {mobile ? (
                <div style={{ padding:'12px', display:'flex', flexDirection:'column', gap:8 }}>
                  {drillTag.length===0
                    ? <div style={{ textAlign:'center', color:'var(--text3)', padding:'32px', fontSize:'0.85rem' }}>Tidak ada tagihan</div>
                    : drillTag.map(t=><TagihanCard key={t.id} t={t} />)
                  }
                </div>
              ) : (
                <div className="table-wrap">
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom:'2px solid var(--border)' }}>
                        <th style={{ background:'transparent', padding:'11px 18px', textAlign:'left', fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase' }}>Jenis</th>
                        <th style={{ background:'transparent', padding:'11px 18px', textAlign:'left', fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase' }}>Keterangan</th>
                        <th style={{ background:'transparent', padding:'11px 18px', textAlign:'right', fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase' }}>Nominal</th>
                        <th style={{ background:'transparent', padding:'11px 18px', textAlign:'center', fontSize:'0.68rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drillTag.length===0
                        ? <tr><td colSpan={4} style={{ textAlign:'center', color:'var(--text3)', padding:'36px', fontSize:'0.85rem' }}>Tidak ada tagihan</td></tr>
                        : drillTag.map(t=>(
                          <tr key={t.id} style={{ borderBottom:'1px solid var(--border)', transition:'background 0.15s' }} onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <td style={{ padding:'12px 18px', fontWeight:700, fontSize:'0.85rem' }}>{t.alasan}</td>
                            <td style={{ padding:'12px 18px', color:'var(--text2)', fontSize:'0.8rem' }}>{t.ket||'—'}</td>
                            <td style={{ padding:'12px 18px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.83rem', color:'var(--orange)' }}>{fmtRp(t.nominal)}</td>
                            <td style={{ padding:'12px 18px', textAlign:'center' }}>
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
              )}
            </div>
          </div>
        </div>

      ) : (
        /* ════════════════════════════════
           ANNUAL view
        ════════════════════════════════ */
        <div className="fade-in">

          {/* KPI summary — MOBILE: hero banner / DESKTOP: grid cards */}
          {mobile ? (
            <MobileHeroBanner year={year} totalPms={totalPms} totalPgl={totalPgl} saldoAkhir={saldoData[11]?.saldo||0} />
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap:14, marginBottom:24 }}>
              <KpiCard label={`Total Pemasukan ${year}`} value={fmtRp(totalPms)} color="blue"  icon="💰" />
              <KpiCard label={`Total Pengeluaran ${year}`} value={fmtRp(totalPgl)} color="red"   icon="💸" />
              <KpiCard
                label={`Tabungan Bersih ${year}`}
                value={fmtRp(totalPms-totalPgl)}
                color={(totalPms-totalPgl)>=0?'green':'red'}
                icon={(totalPms-totalPgl)>=0?'📈':'📉'}
                sub={(totalPms-totalPgl)>=0 ? 'Pemasukan melebihi pengeluaran' : 'Pengeluaran melebihi pemasukan'}
              />
            </div>
          )}

          {/* Charts */}
          <div style={{ display:'grid', gridTemplateColumns: mobile?'1fr':'repeat(auto-fit, minmax(360px, 1fr))', gap:20, marginBottom:24 }}>
            <div className="card" style={{ padding: mobile?'16px':'24px', borderRadius:16 }}>
              <SectionHeader title={`Pemasukan vs Pengeluaran — ${year}`} />
              <BarChartBulanan data={saldoData.map(m=>({label:m.label,pemasukan:m.pemasukan,pengeluaran:m.pengeluaran}))} height={mobile?200:260} />
            </div>
            <div className="card" style={{ padding: mobile?'16px':'24px', borderRadius:16 }}>
              <SectionHeader title={`Tren Saldo Bulanan — ${year}`} />
              <AreaChartSaldo data={saldoData} height={mobile?200:260} />
            </div>
          </div>

          {/* Monthly summary */}
          <div className="card" style={{ padding:0, borderRadius:16, overflow:'hidden' }}>
            <div style={{ padding: mobile?'14px 16px':'18px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
              <div>
                <div style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:3 }}>Ringkasan</div>
                <div style={{ fontSize:'1rem', fontWeight:800 }}>Per Bulan — {year}</div>
              </div>
              <div style={{ fontSize:'0.75rem', color:'var(--text3)', background:'var(--bg3)', padding:'5px 14px', borderRadius:20, fontWeight:600 }}>
                {mobile ? '👆 Ketuk baris' : '💡 Klik baris untuk detail mingguan'}
              </div>
            </div>

            {/* MOBILE: card list */}
            {mobile ? (
              <div style={{ padding:'12px', display:'flex', flexDirection:'column', gap:10 }}>
                {saldoData.map((m,i)=>(
                  <MonthMobileCard key={i} m={m} i={i} onClick={()=>setBulan(String(i+1).padStart(2,'0'))} />
                ))}
                {/* Totals card */}
                <div style={{ borderRadius:16, overflow:'hidden', marginTop:6 }}>
                  <div style={{ background:'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding:'18px 16px' }}>
                    <div style={{ fontSize:'0.62rem', fontWeight:800, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:12 }}>Total {year}</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 16px' }}>
                      <div>
                        <div style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase', marginBottom:3 }}>💰 Pemasukan</div>
                        <div style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.88rem', color:'#7dd3fc' }}>{fmtRp(totalPms)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase', marginBottom:3 }}>💸 Pengeluaran</div>
                        <div style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.88rem', color:'#fca5a5' }}>{fmtRp(totalPgl)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase', marginBottom:3 }}>{(totalPms-totalPgl)>=0?'📈':'📉'} Bersih</div>
                        <div style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.88rem', color:(totalPms-totalPgl)>=0?'#34d399':'#f87171' }}>{(totalPms-totalPgl)>=0?'+':''}{fmtRp(totalPms-totalPgl)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase', marginBottom:3 }}>🏦 Saldo Akhir</div>
                        <div style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.88rem', color:'#e2e8f0' }}>{fmtRp(saldoData[11]?.saldo||0)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* DESKTOP: full table */
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
                          onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}
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
                    {/* Total row */}
                    <tr style={{ borderTop:'2px solid var(--border)', background:'var(--bg3)' }}>
                      <td style={{ padding:'16px 20px', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1px', fontSize:'0.78rem' }}>Total {year}</td>
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
