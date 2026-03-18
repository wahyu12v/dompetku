import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Modal from '../components/Modal';
import { useConfirm } from '../components/ConfirmDialog';
import { fmtRp } from '../utils/format';
import { genId, today } from '../utils/helpers';

// ── Responsive hook ────────────────────────────────────────
function useMobile(bp = 600) {
  const [mobile, setMobile] = useState(() => window.innerWidth < bp);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < bp);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [bp]);
  return mobile;
}

const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const YEARS = [2025, 2026, 2027, 2028, 2029, 2030];
const STATUS_OPTS = ['Aktif','Berhenti','Menunggu'];

// ── Konfirmasi catat ke transaksi harian ───────────────────
function KonfirmasiTransaksi({ isp, bulanLabel, tahun, onYes, onNo }) {
  return createPortal(
    <div className="confirm-overlay" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
      <div className="confirm-box" style={{ maxWidth: 400, borderRadius: '16px' }}>
        <div style={{ textAlign: 'center', padding: '32px 24px 0' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--orange-bg)', color: 'var(--orange)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>💸</div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 12 }}>Catat ke Transaksi Harian?</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6, padding: '0 8px' }}>
            Pembayaran WiFi <strong style={{ color: 'var(--text)' }}>{isp.nama}</strong> bulan <strong style={{ color: 'var(--text)' }}>{bulanLabel} {tahun}</strong> sebesar{' '}
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--orange)', fontSize: '0.9rem' }}>{fmtRp(isp.harga)}</span>
            {' '}akan dicatat sebagai pengeluaran.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, padding: '24px', justifyContent: 'center', marginTop: 8 }}>
          <button className="btn btn-ghost" style={{ flex: 1, borderRadius: '24px', padding: '10px 0', fontWeight: 600 }} onClick={onNo}>Tidak, Skip</button>
          <button className="btn btn-primary" style={{ flex: 1, borderRadius: '24px', padding: '10px 0', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onClick={onYes}>Ya, Catat</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function IspForm({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || { nama:'', idPelanggan:'', paket:'', harga:'', alamat:'', ssid:'', password:'', ip:'', userAdmin:'', kataKunci:'', status:'Aktif' });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const save = () => onSave({ ...form, id: form.id || genId(), harga: Number(form.harga) || 0 });
  return (
    <Modal title={item ? 'Edit ISP' : 'Tambah ISP'} onClose={onClose} onSave={save} wide>
      <div className="form-grid">
        <div className="form-group"><label className="form-label">Nama ISP</label><input className="form-input" placeholder="Indihome, Iconnet..." value={form.nama} onChange={set('nama')} /></div>
        <div className="form-group"><label className="form-label">ID Pelanggan</label><input className="form-input" value={form.idPelanggan} onChange={set('idPelanggan')} /></div>
        <div className="form-group"><label className="form-label">Paket</label><input className="form-input" placeholder="50 Mbps" value={form.paket} onChange={set('paket')} /></div>
        <div className="form-group"><label className="form-label">Harga/Bulan (Rp)</label><input type="number" className="form-input" value={form.harga} onChange={set('harga')} /></div>
        <div className="form-group full"><label className="form-label">Alamat</label><input className="form-input" value={form.alamat} onChange={set('alamat')} /></div>
        <div className="form-group"><label className="form-label">Nama SSID</label><input className="form-input" value={form.ssid} onChange={set('ssid')} /></div>
        <div className="form-group"><label className="form-label">Password WiFi</label><input className="form-input" value={form.password} onChange={set('password')} /></div>
        <div className="form-group"><label className="form-label">IP Router</label><input className="form-input" placeholder="192.168.1.1" value={form.ip} onChange={set('ip')} /></div>
        <div className="form-group"><label className="form-label">User Admin</label><input className="form-input" value={form.userAdmin} onChange={set('userAdmin')} /></div>
        <div className="form-group"><label className="form-label">Kata Sandi Admin</label><input className="form-input" value={form.kataKunci} onChange={set('kataKunci')} /></div>
        <div className="form-group"><label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={set('status')}>
            {STATUS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>
    </Modal>
  );
}

function InfoField({ label, value, mono = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text3)' }}>{label}</span>
      <span style={{ fontSize: '0.85rem', fontFamily: mono ? 'var(--mono)' : 'var(--font)', fontWeight: mono ? 600 : 500, color: 'var(--text)', background: mono ? 'var(--bg3)' : 'transparent', padding: mono ? '4px 10px' : '0', borderRadius: mono ? 8 : 0, border: mono ? '1px solid var(--border)' : 'none', display: 'inline-block' }}>
        {value || '—'}
      </span>
    </div>
  );
}

function IspCard({ isp, onEdit, onDelete }) {
  const mobile = useMobile();
  const statusColor = isp.status === 'Aktif' ? 'green' : isp.status === 'Berhenti' ? 'red' : 'yellow';
  const isAktif = isp.status === 'Aktif';
  return (
    <div style={{ background: 'var(--card)', border: `1px solid ${isAktif ? 'var(--border)' : '#fca5a5'}`, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', marginBottom: 16, width: '100%', boxSizing: 'border-box' }}>
      <div style={{ height: 4, borderTopLeftRadius: 15, borderTopRightRadius: 15, background: isAktif ? 'var(--blue)' : isp.status === 'Berhenti' ? 'var(--red)' : 'var(--yellow)' }} />
      
      {/* ── Card Header ── */}
      <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'stretch' : 'flex-start', padding: '16px 18px', borderBottom: '1px solid var(--border)', gap: 12 }}>
        {/* Nama + Alamat */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: isAktif ? 'var(--blue-bg)' : 'var(--gray-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>📶</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
              {isp.nama}
              <span style={{ fontWeight: 600, color: 'var(--blue)', fontSize: '0.78rem', background: 'var(--blue-bg)', padding: '2px 8px', borderRadius: '12px', flexShrink: 0 }}>{isp.paket}</span>
            </div>
            {isp.alamat && <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>📍 {isp.alamat}</div>}
          </div>
        </div>

        {/* Badge + Harga + Aksi */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flexShrink: 0, justifyContent: mobile ? 'space-between' : 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`badge ${statusColor}`} style={{ padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.72rem' }}>{isp.status}</span>
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--orange)' }}>
              {fmtRp(isp.harga)}<span style={{ fontWeight: 600, fontSize: '0.72rem', color: 'var(--text3)' }}>/bln</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-ghost btn-sm" style={{ padding: '6px 12px' }} onClick={() => onEdit(isp)}>✎ Edit</button>
            <button className="btn btn-ghost btn-sm" style={{ padding: '6px 10px', color: 'var(--red)' }} onClick={() => onDelete(isp.id)}>✕</button>
          </div>
        </div>
      </div>

      {/* ── Info Fields ── */}
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px 24px', padding: '18px 18px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <InfoField label="SSID / Nama WiFi" value={isp.ssid} />
          <InfoField label="Password WiFi" value={isp.password} mono />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <InfoField label="IP Router" value={isp.ip} mono />
          <InfoField label="ID Pelanggan" value={isp.idPelanggan} mono />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <InfoField label="User Admin" value={isp.userAdmin} mono />
          <InfoField label="Kata Sandi Admin" value={isp.kataKunci} mono />
        </div>
      </div>
    </div>
  );
}

export default function WifiPage({ data }) {
  const { wifiIsp, wifiBayar, upsertWifiIsp, removeWifiIsp, toggleWifiBayar, upsertTransaksi } = data;
  const [modal, setModal]           = useState(null);
  const [tahunFilter, setTahun]     = useState(new Date().getFullYear());
  const [konfirmasi, setKonfirmasi] = useState(null);
  const [selectedIspId, setSelectedIspId] = useState(null);
  const { confirm: showConfirm, ConfirmUI } = useConfirm();
  const mobile = useMobile();

  const ispAktif = wifiIsp.filter(i => i.status === 'Aktif');
  const totalBulanan = ispAktif.reduce((s, i) => s + (i.harga || 0), 0);
  // Mobile tracker: auto-select first ISP if none selected or selected ISP no longer active
  const activeSelectedId = selectedIspId && ispAktif.find(i => i.id === selectedIspId)
    ? selectedIspId
    : ispAktif[0]?.id ?? null;
  const trackerIspMobile = ispAktif.find(i => i.id === activeSelectedId);

  const handleSave = (isp) => { upsertWifiIsp(isp); setModal(null); };
  const handleDel  = async (id) => {
    const ok = await showConfirm({ title: 'Hapus ISP', message: 'Data ISP dan semua catatan pembayarannya akan dihapus.', type: 'danger' });
    if (ok) removeWifiIsp(id);
  };

  const isPaid = (ispId, bulanIdx) => {
    const b = bulanIdx + 1;
    return wifiBayar.some(x => x.ispId === ispId && x.tahun === tahunFilter && x.bulan === b && x.lunas);
  };

  const paidCount = (ispId) => BULAN.filter((_, bi) => isPaid(ispId, bi)).length;

  const handleToggle = (isp, bulanIdx) => {
    const wasPaid  = isPaid(isp.id, bulanIdx);
    const bulanNum = bulanIdx + 1;
    toggleWifiBayar(isp.id, tahunFilter, bulanNum);
    if (!wasPaid) {
      setKonfirmasi({ isp, bulanIdx, bulanLabel: BULAN[bulanIdx] });
    }
  };

  const handleKonfirmasiYes = () => {
    const { isp, bulanLabel } = konfirmasi;
    upsertTransaksi({
      id: genId(), tanggal: today(),
      pemasukan: 0, sumber: 'Tidak ada',
      pengeluaran: isp.harga || 0,
      tujuan: isp.nama,
      ket: `Bayar WiFi ${isp.nama} ${bulanLabel} ${tahunFilter}`,
    });
    setKonfirmasi(null);
  };

  return (
    <div className="fade-in" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', paddingBottom: '30px' }}>
      {ConfirmUI}

      {konfirmasi && (
        <KonfirmasiTransaksi
          isp={konfirmasi.isp}
          bulanLabel={konfirmasi.bulanLabel}
          tahun={tahunFilter}
          onYes={handleKonfirmasiYes}
          onNo={() => setKonfirmasi(null)}
        />
      )}

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', borderTop: '4px solid var(--blue)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '8px' }}>
            <div style={{ fontSize: '1.2rem' }}>🌐</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total ISP Aktif</div>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--blue)' }}>{ispAktif.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: '4px', fontWeight: 500 }}>dari {wifiIsp.length} total ISP terdaftar</div>
        </div>
        
        <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', borderTop: '4px solid var(--orange)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '8px' }}>
            <div style={{ fontSize: '1.2rem' }}>💸</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Biaya Bulanan</div>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--orange)' }}>{fmtRp(totalBulanan)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: '4px', fontWeight: 500 }}>tagihan semua ISP aktif</div>
        </div>

        <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', borderTop: '4px solid var(--yellow)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '8px' }}>
            <div style={{ fontSize: '1.2rem' }}>📅</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Biaya Tahunan</div>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--yellow)' }}>{fmtRp(totalBulanan * 12)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: '4px', fontWeight: 500 }}>estimasi total per tahun</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>Daftar ISP & Pengaturan</h2>
        <button className="btn btn-primary" style={{ borderRadius: '24px', padding: '10px 20px', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onClick={() => setModal({ item: null })}>
          <span style={{ fontSize: '1.2rem', lineHeight: 1, paddingBottom: 2 }}>＋</span> Tambah ISP
        </button>
      </div>

      {wifiIsp.length === 0 ? (
        <div className="card mb-4" style={{ borderRadius: '16px', padding: '60px 20px' }}>
          <div className="empty-state">
            <div className="empty-state-icon" style={{ fontSize: '3rem', opacity: 0.5, marginBottom: '12px' }}>📡</div>
            <p style={{ fontWeight: 700, color: 'var(--text2)' }}>Belum ada data ISP</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text3)', marginTop: '4px' }}>Tambahkan profil WiFi/ISP pertama Anda</p>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 32 }}>
          {wifiIsp.map(isp => <IspCard key={isp.id} isp={isp} onEdit={i => setModal({ item: i })} onDelete={handleDel} />)}
        </div>
      )}

      {/* ── Tracker (hanya ISP aktif) ── */}
      <div className="card" style={{ padding: 0, borderRadius: '16px', width: '100%', boxSizing: 'border-box' }}>
        {/* Header */}
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>Tracker Pembayaran Bulanan</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: 4 }}>
              Hanya menampilkan ISP aktif. Klik tombol pada tabel untuk merubah status lunas.
            </div>
          </div>
          
          {/* Stepper Tahun */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg)', padding: '6px 8px', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setTahun(prev => Math.max(YEARS[0], prev - 1))}
              disabled={tahunFilter <= YEARS[0]}
              style={{
                width: 32, height: 32, borderRadius: '50%', border: 'none',
                background: tahunFilter <= YEARS[0] ? 'transparent' : 'var(--bg3)',
                color: tahunFilter <= YEARS[0] ? 'var(--text3)' : 'var(--text)',
                cursor: tahunFilter <= YEARS[0] ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', transition: 'background 0.2s'
              }}
            >
              <span style={{ transform: 'translateY(-1px)' }}>❮</span>
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 2 }}>Tahun</span>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)', lineHeight: 1 }}>{tahunFilter}</span>
            </div>

            <button
              onClick={() => setTahun(prev => Math.min(YEARS[YEARS.length - 1], prev + 1))}
              disabled={tahunFilter >= YEARS[YEARS.length - 1]}
              style={{
                width: 32, height: 32, borderRadius: '50%', border: 'none',
                background: tahunFilter >= YEARS[YEARS.length - 1] ? 'transparent' : 'var(--bg3)',
                color: tahunFilter >= YEARS[YEARS.length - 1] ? 'var(--text3)' : 'var(--text)',
                cursor: tahunFilter >= YEARS[YEARS.length - 1] ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', transition: 'background 0.2s'
              }}
            >
              <span style={{ transform: 'translateY(-1px)' }}>❯</span>
            </button>
          </div>
        </div>

        {ispAktif.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 20px' }}>
            <div className="empty-state-icon" style={{ fontSize: '2.5rem', opacity: 0.5 }}>💤</div>
            <p style={{ fontWeight: 700, marginTop: '12px' }}>Tidak ada ISP berstatus Aktif</p>
          </div>
        ) : mobile ? (
          /* ── MOBILE: ISP Tabs + Month List ── */
          <div>
            {/* ISP Tab Selector */}
            {ispAktif.length > 1 && (
              <div style={{ display: 'flex', gap: 8, padding: '12px 14px', borderBottom: '1px solid var(--border)', overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                {ispAktif.map(isp => {
                  const active = isp.id === activeSelectedId;
                  return (
                    <button
                      key={isp.id}
                      onClick={() => setSelectedIspId(isp.id)}
                      style={{
                        flexShrink: 0, padding: '7px 16px', borderRadius: '20px', border: 'none',
                        fontFamily: 'var(--font)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                        background: active ? 'var(--accent2)' : 'var(--bg3)',
                        color: active ? '#fff' : 'var(--text2)',
                        transition: 'all 0.15s', whiteSpace: 'nowrap',
                      }}
                    >
                      📶 {isp.nama}
                      <span style={{ marginLeft: 6, fontWeight: 600, fontSize: '0.72rem', opacity: 0.8 }}>
                        ({paidCount(isp.id)}/12)
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selected ISP Header */}
            {trackerIspMobile && (
              <div style={{ padding: '14px 16px', background: 'var(--bg)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)' }}>{trackerIspMobile.nama}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>{trackerIspMobile.ssid || trackerIspMobile.idPelanggan || '—'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--orange)' }}>{fmtRp(trackerIspMobile.harga)}<span style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600 }}>/bln</span></div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 4 }}>
                    <span style={{ display: 'inline-block', width: `${(paidCount(trackerIspMobile.id) / 12) * 60}px`, height: 5, background: 'var(--green)', borderRadius: 4, verticalAlign: 'middle', marginRight: 6, transition: 'width 0.4s' }} />
                    {paidCount(trackerIspMobile.id)} dari 12 bulan lunas
                  </div>
                </div>
              </div>
            )}

            {/* Month list for selected ISP */}
            {trackerIspMobile && BULAN.map((bln, bi) => {
              const paid = isPaid(trackerIspMobile.id, bi);
              return (
                <div key={bi} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text2)' }}>{bln}</span>
                  <button
                    onClick={() => handleToggle(trackerIspMobile, bi)}
                    style={{
                      background: paid ? 'var(--green-bg)' : 'transparent',
                      border: `1.5px solid ${paid ? 'var(--green)' : 'var(--border)'}`,
                      borderRadius: '20px', cursor: 'pointer', padding: '6px 18px',
                      fontSize: '0.82rem', fontWeight: 700,
                      color: paid ? 'var(--green)' : 'var(--text3)',
                      transition: 'all 0.2s', minWidth: 90,
                    }}
                  >
                    {paid ? '✓ Lunas' : 'Belum'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── DESKTOP: Full Table ── */
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ background: 'transparent', padding: '16px 24px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', width: '120px' }}>Bulan</th>
                  {ispAktif.map(isp => (
                    <th key={isp.id} style={{ background: 'transparent', textAlign: 'center', padding: '16px', minWidth: 160 }}>
                      <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '0.9rem' }}>{isp.nama}</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text3)', marginTop: 4 }}>{isp.ssid || isp.idPelanggan || '—'}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--orange)', fontFamily: 'var(--mono)', marginTop: 6, background: 'var(--orange-bg)', display: 'inline-block', padding: '2px 8px', borderRadius: '12px' }}>{fmtRp(isp.harga)}/bln</div>
                      <div style={{ marginTop: 12, padding: '0 10px' }}>
                        <div style={{ height: 6, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 4, background: 'var(--green)', width: `${(paidCount(isp.id) / 12) * 100}%`, transition: 'width 0.4s ease' }} />
                        </div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text3)', marginTop: 6 }}>{paidCount(isp.id)} dari 12 bulan lunas</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BULAN.map((bln, bi) => (
                  <tr key={bi} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 24px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text2)' }}>{bln}</td>
                    {ispAktif.map(isp => {
                      const paid = isPaid(isp.id, bi);
                      return (
                        <td key={isp.id} style={{ textAlign: 'center', padding: '14px 16px' }}>
                          <button
                            onClick={() => handleToggle(isp, bi)}
                            title={paid ? 'Klik untuk batal lunas' : 'Klik untuk tandai lunas'}
                            style={{
                              background: paid ? 'var(--green-bg)' : 'transparent',
                              border: `1.5px solid ${paid ? 'var(--green)' : 'var(--border)'}`,
                              borderRadius: '20px', cursor: 'pointer', padding: '6px 16px',
                              fontSize: '0.8rem', fontWeight: 700,
                              color: paid ? 'var(--green)' : 'var(--text3)',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', minWidth: 90,
                              boxShadow: paid ? '0 2px 6px rgba(0,0,0,0.04)' : 'none'
                            }}
                            onMouseEnter={(e) => { if (!paid) e.currentTarget.style.borderColor = 'var(--text3)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={(e) => { if (!paid) e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
                          >
                            {paid ? '✓ Lunas' : 'Belum'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && <IspForm item={modal.item} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
