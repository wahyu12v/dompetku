// ============================================================
// WifiPage.jsx — WiFi & Internet tracker
// ============================================================
import { useState } from 'react';
import Modal from '../components/Modal';
import { useConfirm } from '../components/ConfirmDialog';
import { fmtRp } from '../utils/format';
import { genId } from '../utils/helpers';

const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const YEARS = [2025, 2026, 2027, 2028];
const STATUS_OPTS = ['Aktif','Berhenti','Menunggu'];

function IspForm({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || {
    nama:'', idPelanggan:'', paket:'', harga:'', alamat:'',
    ssid:'', password:'', ip:'', userAdmin:'', kataKunci:'', status:'Aktif',
  });
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const save = () => onSave({...form, id:form.id||genId(), harga:Number(form.harga)||0});
  return (
    <Modal title={item?'Edit ISP':'Tambah ISP'} onClose={onClose} onSave={save} wide>
      <div className="form-grid">
        <div className="form-group"><label className="form-label">Nama ISP</label><input className="form-input" placeholder="Indihome, Iconnet..." value={form.nama} onChange={set('nama')} /></div>
        <div className="form-group"><label className="form-label">ID Pelanggan</label><input className="form-input" value={form.idPelanggan} onChange={set('idPelanggan')} /></div>
        <div className="form-group"><label className="form-label">Paket</label><input className="form-input" placeholder="50 Mbps" value={form.paket} onChange={set('paket')} /></div>
        <div className="form-group"><label className="form-label">Harga/Bulan (Rp)</label><input type="number" className="form-input" value={form.harga} onChange={set('harga')} /></div>
        <div className="form-group full"><label className="form-label">Alamat</label><input className="form-input" value={form.alamat} onChange={set('alamat')} /></div>
        <div className="form-group"><label className="form-label">Nama SSID (WiFi Name)</label><input className="form-input" value={form.ssid} onChange={set('ssid')} /></div>
        <div className="form-group"><label className="form-label">Password WiFi</label><input className="form-input" value={form.password} onChange={set('password')} /></div>
        <div className="form-group"><label className="form-label">IP Router</label><input className="form-input" placeholder="192.168.1.1" value={form.ip} onChange={set('ip')} /></div>
        <div className="form-group"><label className="form-label">User Admin</label><input className="form-input" value={form.userAdmin} onChange={set('userAdmin')} /></div>
        <div className="form-group"><label className="form-label">Kata Sandi Admin</label><input className="form-input" value={form.kataKunci} onChange={set('kataKunci')} /></div>
        <div className="form-group"><label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={set('status')}>
            {STATUS_OPTS.map(o=><option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>
    </Modal>
  );
}

export default function WifiPage({ data }) {
  const { wifiIsp, wifiBayar, upsertWifiIsp, removeWifiIsp, toggleWifiBayar } = data;
  const [modal, setModal]         = useState(null);
  const [tahunFilter, setTahun]   = useState(2026);
  const { confirm: showConfirm, ConfirmUI } = useConfirm();

  const handleSave = (isp) => { upsertWifiIsp(isp); setModal(null); };
  const handleDel  = async (id) => {
    const ok = await showConfirm({ title:'Hapus ISP', message:'Data ISP dan semua catatan pembayarannya akan dihapus.', type:'danger' });
    if (ok) removeWifiIsp(id);
  };

  const isPaid = (ispId, bulan) => {
    const b = bulan + 1; // bulan is 0-indexed from map
    return wifiBayar.some(x => x.ispId===ispId && x.tahun===tahunFilter && x.bulan===b && x.lunas);
  };

  const totalBulanan = wifiIsp.filter(i=>i.status==='Aktif').reduce((s,i)=>s+(i.harga||0),0);

  return (
    <div className="fade-in">
      {ConfirmUI}

      {/* Summary */}
      <div className="stats-grid mb-4">
        <div className="stat-card blue">
          <div className="stat-label">Total ISP Aktif</div>
          <div className="stat-value blue">{wifiIsp.filter(i=>i.status==='Aktif').length}</div>
          <div className="stat-sub">dari {wifiIsp.length} total ISP</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">Biaya Bulanan</div>
          <div className="stat-value orange">{fmtRp(totalBulanan)}</div>
          <div className="stat-sub">semua ISP aktif</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Biaya Tahunan</div>
          <div className="stat-value yellow">{fmtRp(totalBulanan*12)}</div>
          <div className="stat-sub">estimasi per tahun</div>
        </div>
      </div>

      {/* ISP Cards */}
      <div className="section-header mb-4">
        <div className="section-title">📶 Daftar ISP</div>
        <button className="btn btn-primary" onClick={()=>setModal({item:null})}>+ Tambah ISP</button>
      </div>

      {wifiIsp.length===0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">📡</div><p>Belum ada data ISP</p></div></div>
      ) : wifiIsp.map(isp=>(
        <div key={isp.id} className="wifi-isp-card mb-4">
          <div className="wifi-isp-header">
            <div>
              <div className="wifi-isp-name">{isp.nama} — {isp.paket}</div>
              <div style={{fontSize:'0.78rem',color:'var(--text2)',marginTop:3}}>{isp.alamat}</div>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <span className={`badge ${isp.status==='Aktif'?'green':isp.status==='Berhenti'?'red':'yellow'}`}>{isp.status}</span>
              <span style={{fontFamily:'var(--mono)',fontSize:'0.9rem',fontWeight:700,color:'var(--orange)'}}>{fmtRp(isp.harga)}/bln</span>
              <button className="btn btn-ghost btn-sm" onClick={()=>setModal({item:isp})}>✎</button>
              <button className="btn btn-danger btn-sm" onClick={()=>handleDel(isp.id)}>✕</button>
            </div>
          </div>
          <div className="wifi-isp-grid">
            <div className="wifi-isp-field"><label>SSID</label><span>{isp.ssid||'—'}</span></div>
            <div className="wifi-isp-field"><label>Password WiFi</label><span className="wifi-password">{isp.password||'—'}</span></div>
            <div className="wifi-isp-field"><label>IP Router</label><span className="wifi-password">{isp.ip||'—'}</span></div>
            <div className="wifi-isp-field"><label>ID Pelanggan</label><span>{isp.idPelanggan||'—'}</span></div>
            <div className="wifi-isp-field"><label>User Admin</label><span>{isp.userAdmin||'—'}</span></div>
            <div className="wifi-isp-field"><label>Kata Sandi Admin</label><span className="wifi-password">{isp.kataKunci||'—'}</span></div>
          </div>
        </div>
      ))}

      {/* Payment Tracker */}
      <div className="card" style={{marginTop:24}}>
        <div className="section-header">
          <div className="section-title">📅 Tracker Pembayaran Bulanan</div>
          <select className="form-select" style={{width:110}} value={tahunFilter} onChange={e=>setTahun(Number(e.target.value))}>
            {YEARS.map(y=><option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bulan</th>
                {wifiIsp.map(isp=><th key={isp.id} className="right">{isp.nama}<br/><span style={{fontSize:'0.65rem',fontWeight:400,color:'var(--text3)'}}>{isp.ssid||isp.idPelanggan}</span></th>)}
              </tr>
            </thead>
            <tbody>
              {BULAN.map((bln,bi)=>(
                <tr key={bi}>
                  <td style={{fontWeight:600}}>{bln}</td>
                  {wifiIsp.map(isp=>{
                    const paid = isPaid(isp.id, bi);
                    const bulanNum = bi+1;
                    return (
                      <td key={isp.id} className="td-center">
                        <button
                          onClick={()=>toggleWifiBayar(isp.id, tahunFilter, bulanNum)}
                          style={{background:'none',border:'none',cursor:'pointer',fontSize:'1.1rem',padding:'2px 6px',borderRadius:6,transition:'background 0.15s'}}
                          title={paid?'Tandai Belum':'Tandai Lunas'}
                        >
                          {paid ? '✅' : '⬜'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{marginTop:12,fontSize:'0.75rem',color:'var(--text3)'}}>✅ = Sudah Lunas &nbsp; ⬜ = Belum Dibayar — Klik untuk toggle status</div>
      </div>

      {modal && <IspForm item={modal.item} onSave={handleSave} onClose={()=>setModal(null)} />}
    </div>
  );
}
