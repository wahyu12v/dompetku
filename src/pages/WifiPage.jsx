import { useState } from 'react';
import { createPortal } from 'react-dom';
import Modal from '../components/Modal';
import { useConfirm } from '../components/ConfirmDialog';
import { fmtRp } from '../utils/format';
import { genId, today } from '../utils/helpers';

const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const YEARS = [2025, 2026, 2027, 2028];
const STATUS_OPTS = ['Aktif','Berhenti','Menunggu'];

// ── Konfirmasi catat ke transaksi harian ───────────────────
function KonfirmasiTransaksi({ isp, bulanLabel, tahun, onYes, onNo }) {
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border2)',
        borderRadius: 14, width: '100%', maxWidth: 400,
        boxShadow: '0 8px 32px rgba(0,0,0,0.14)', overflow: 'hidden',
        animation: 'scaleIn 0.18s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div style={{ textAlign: 'center', padding: '24px 24px 0' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--green-bg)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>💸</div>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 10 }}>Catat ke Transaksi Harian?</div>
          <div style={{ fontSize: '0.84rem', color: 'var(--text2)', lineHeight: 1.7, padding: '0 8px' }}>
            Pembayaran WiFi <strong>{isp.nama}</strong> bulan <strong>{bulanLabel} {tahun}</strong> sebesar{' '}
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--orange)' }}>{fmtRp(isp.harga)}</span>
            {' '}akan dicatat sebagai pengeluaran di Transaksi Harian.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '16px 20px', borderTop: '1px solid var(--border)', justifyContent: 'flex-end', marginTop: 16 }}>
          <button className="btn btn-ghost btn-sm" onClick={onNo}>Tidak, Skip</button>
          <button className="btn btn-primary btn-sm" onClick={onYes}>Ya, Catat Sekarang</button>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ fontSize: '0.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--text3)' }}>{label}</span>
      <span style={{ fontSize: '0.82rem', fontFamily: mono ? 'var(--mono)' : 'var(--font)', color: 'var(--text)', background: mono ? 'var(--bg3)' : 'transparent', padding: mono ? '2px 8px' : '0', borderRadius: mono ? 6 : 0, border: mono ? '1px solid var(--border)' : 'none', display: 'inline-block' }}>
        {value || '—'}
      </span>
    </div>
  );
}

function IspCard({ isp, onEdit, onDelete }) {
  const statusColor = isp.status === 'Aktif' ? 'green' : isp.status === 'Berhenti' ? 'red' : 'yellow';
  const isAktif = isp.status === 'Aktif';
  return (
    <div style={{ background: 'var(--card)', border: `1.5px solid ${isAktif ? 'var(--border)' : '#fca5a5'}`, borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow)', marginBottom: 12 }}>
      <div style={{ height: 4, background: isAktif ? 'linear-gradient(90deg, var(--accent), var(--green))' : isp.status === 'Berhenti' ? 'var(--red)' : 'var(--yellow)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 18px 10px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: isAktif ? 'var(--blue-bg)' : 'var(--gray-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>📶</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{isp.nama}<span style={{ fontWeight: 400, color: 'var(--text3)', marginLeft: 8, fontSize: '0.82rem' }}>{isp.paket}</span></div>
            {isp.alamat && <div style={{ fontSize: '0.74rem', color: 'var(--text3)', marginTop: 2 }}>📍 {isp.alamat}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span className={`badge ${statusColor}`}>{isp.status}</span>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.92rem', color: 'var(--orange)', background: 'var(--orange-bg)', padding: '4px 10px', borderRadius: 8, border: '1px solid #fdba74' }}>
            {fmtRp(isp.harga)}<span style={{ fontWeight: 400, fontSize: '0.72rem', color: 'var(--text3)' }}>/bln</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onEdit(isp)}>✎</button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(isp.id)}>✕</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 20px', padding: '14px 18px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <InfoField label="SSID / Nama WiFi" value={isp.ssid} />
          <InfoField label="Password WiFi" value={isp.password} mono />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <InfoField label="IP Router" value={isp.ip} mono />
          <InfoField label="ID Pelanggan" value={isp.idPelanggan} mono />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
  const [tahunFilter, setTahun]     = useState(2026);
  const [konfirmasi, setKonfirmasi] = useState(null);
  const { confirm: showConfirm, ConfirmUI } = useConfirm();

  // Hanya ISP aktif di tracker
  const ispAktif = wifiIsp.filter(i => i.status === 'Aktif');
  const totalBulanan = ispAktif.reduce((s, i) => s + (i.harga || 0), 0);

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

  // Toggle: jika tandai LUNAS → minta konfirmasi catat transaksi
  const handleToggle = (isp, bulanIdx) => {
    const wasPaid  = isPaid(isp.id, bulanIdx);
    const bulanNum = bulanIdx + 1;
    toggleWifiBayar(isp.id, tahunFilter, bulanNum);
    if (!wasPaid) {
      // Baru ditandai lunas → tanya apakah mau dicatat ke transaksi
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
    <div className="fade-in">
      {ConfirmUI}

      {/* Konfirmasi catat transaksi */}
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
      <div className="stats-grid mb-4">
        <div className="stat-card blue">
          <div className="stat-label">Total ISP Aktif</div>
          <div className="stat-value blue">{ispAktif.length}</div>
          <div className="stat-sub">dari {wifiIsp.length} total ISP</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">Biaya Bulanan</div>
          <div className="stat-value orange">{fmtRp(totalBulanan)}</div>
          <div className="stat-sub">semua ISP aktif</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Biaya Tahunan</div>
          <div className="stat-value yellow">{fmtRp(totalBulanan * 12)}</div>
          <div className="stat-sub">estimasi per tahun</div>
        </div>
      </div>

      {/* ── Daftar ISP ── */}
      <div className="section-header mb-3">
        <div className="section-title">📶 Daftar ISP</div>
        <button className="btn btn-primary" onClick={() => setModal({ item: null })}>+ Tambah ISP</button>
      </div>

      {wifiIsp.length === 0 ? (
        <div className="card mb-4"><div className="empty-state"><div className="empty-state-icon">📡</div><p>Belum ada data ISP</p></div></div>
      ) : (
        <div className="mb-4">
          {wifiIsp.map(isp => <IspCard key={isp.id} isp={isp} onEdit={i => setModal({ item: i })} onDelete={handleDel} />)}
        </div>
      )}

      {/* ── Tracker (hanya ISP aktif) ── */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div>
            <div className="section-title">📅 Tracker Pembayaran Bulanan</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text3)', marginTop: 3 }}>
              Hanya ISP aktif · Klik untuk toggle · Tandai lunas akan ditawarkan pencatatan ke Transaksi Harian
            </div>
          </div>
          <select className="form-select" style={{ width: 110 }} value={tahunFilter} onChange={e => setTahun(Number(e.target.value))}>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {ispAktif.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📡</div><p>Tidak ada ISP aktif</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ minWidth: 100 }}>Bulan</th>
                  {ispAktif.map(isp => (
                    <th key={isp.id} style={{ textAlign: 'center', minWidth: 130 }}>
                      <div style={{ fontWeight: 700 }}>{isp.nama}</div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 400, color: 'var(--text3)', marginTop: 2 }}>{isp.ssid || isp.idPelanggan || '—'}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--orange)', fontFamily: 'var(--mono)', marginTop: 1 }}>{fmtRp(isp.harga)}/bln</div>
                      <div style={{ marginTop: 6 }}>
                        <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 2, background: 'var(--green)', width: `${(paidCount(isp.id) / 12) * 100}%`, transition: 'width 0.4s ease' }} />
                        </div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text3)', marginTop: 2 }}>{paidCount(isp.id)}/12 bulan</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BULAN.map((bln, bi) => (
                  <tr key={bi}>
                    <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{bln}</td>
                    {ispAktif.map(isp => {
                      const paid = isPaid(isp.id, bi);
                      return (
                        <td key={isp.id} style={{ textAlign: 'center', padding: '7px 10px' }}>
                          <button
                            onClick={() => handleToggle(isp, bi)}
                            title={paid ? 'Tandai Belum Bayar' : 'Tandai Lunas'}
                            style={{
                              background: paid ? 'var(--green-bg)' : 'var(--bg3)',
                              border: `1.5px solid ${paid ? '#86efac' : 'var(--border)'}`,
                              borderRadius: 8, cursor: 'pointer', padding: '4px 10px',
                              fontSize: '0.78rem', fontWeight: 600,
                              color: paid ? 'var(--green2)' : 'var(--text3)',
                              transition: 'all 0.15s', minWidth: 80,
                            }}
                          >
                            {paid ? '✓ Lunas' : '○ Belum'}
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
