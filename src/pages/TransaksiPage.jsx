// ============================================================
// TransaksiPage.jsx — Split Pemasukan / Pengeluaran forms
// ============================================================
import { useState, useMemo } from 'react';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { useConfirm } from '../components/ConfirmDialog';
import { fmtRp, fmtDate, monthName } from '../utils/format';
import { filterByMonth, sumBy, getMonths, currentYearMonth, today, genId } from '../utils/helpers';
import { STATUS_BAYAR } from '../utils/constants';

// ── Pemasukan Form ────────────────────────────────────────
function PemasukanForm({ item, sumberOptions, onSave, onClose }) {
  const [form, setForm] = useState(item
    ? { ...item, pemasukan: item.pemasukan || '' }
    : { tanggal: today(), pemasukan: '', sumber: sumberOptions[0] || 'Jasa Freelance', ket: '' }
  );
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const save = () => onSave({ ...form, id: form.id||genId(), pemasukan: Number(form.pemasukan)||0, pengeluaran: 0, tujuan: 'Tidak ada pengeluaran' });
  return (
    <Modal title={item ? 'Edit Pemasukan' : '+ Tambah Pemasukan'} onClose={onClose} onSave={save}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Tanggal</label>
          <input type="date" className="form-input" value={form.tanggal} onChange={set('tanggal')} />
        </div>
        <div className="form-group">
          <label className="form-label">Jumlah Pemasukan (Rp)</label>
          <input type="number" className="form-input" placeholder="0" value={form.pemasukan} onChange={set('pemasukan')} min="0" />
        </div>
        <div className="form-group full">
          <label className="form-label">Sumber Pemasukan</label>
          <select className="form-select" value={form.sumber} onChange={set('sumber')}>
            {sumberOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="form-group full">
          <label className="form-label">Keterangan</label>
          <input className="form-input" placeholder="Opsional" value={form.ket} onChange={set('ket')} />
        </div>
      </div>
    </Modal>
  );
}

// ── Pengeluaran Form ──────────────────────────────────────
function PengeluaranForm({ item, tujuanOptions, onSave, onClose }) {
  const [form, setForm] = useState(item
    ? { ...item, pengeluaran: item.pengeluaran || '' }
    : { tanggal: today(), pengeluaran: '', tujuan: tujuanOptions[0] || 'Beli Kebutuhan', ket: '' }
  );
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const save = () => onSave({ ...form, id: form.id||genId(), pengeluaran: Number(form.pengeluaran)||0, pemasukan: 0, sumber: 'Tidak ada' });
  return (
    <Modal title={item ? 'Edit Pengeluaran' : '+ Tambah Pengeluaran'} onClose={onClose} onSave={save}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Tanggal</label>
          <input type="date" className="form-input" value={form.tanggal} onChange={set('tanggal')} />
        </div>
        <div className="form-group">
          <label className="form-label">Jumlah Pengeluaran (Rp)</label>
          <input type="number" className="form-input" placeholder="0" value={form.pengeluaran} onChange={set('pengeluaran')} min="0" />
        </div>
        <div className="form-group full">
          <label className="form-label">Tujuan Pengeluaran</label>
          <select className="form-select" value={form.tujuan} onChange={set('tujuan')}>
            {tujuanOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="form-group full">
          <label className="form-label">Keterangan</label>
          <input className="form-input" placeholder="Opsional" value={form.ket} onChange={set('ket')} />
        </div>
      </div>
    </Modal>
  );
}

// ── Combined Edit Form (for editing existing mixed records) ─
function EditForm({ item, sumberOptions, tujuanOptions, onSave, onClose }) {
  const [form, setForm] = useState({
    ...item, pemasukan: item.pemasukan||'', pengeluaran: item.pengeluaran||''
  });
  const set = k => e => setForm(f => ({...f,[k]:e.target.value}));
  const save = () => onSave({...form, id:form.id, pemasukan:Number(form.pemasukan)||0, pengeluaran:Number(form.pengeluaran)||0});
  return (
    <Modal title="Edit Transaksi" onClose={onClose} onSave={save}>
      <div className="form-grid">
        <div className="form-group"><label className="form-label">Tanggal</label><input type="date" className="form-input" value={form.tanggal} onChange={set('tanggal')} /></div>
        <div className="form-group"><label className="form-label">Pemasukan (Rp)</label><input type="number" className="form-input" value={form.pemasukan} onChange={set('pemasukan')} min="0" /></div>
        <div className="form-group"><label className="form-label">Sumber</label><select className="form-select" value={form.sumber} onChange={set('sumber')}>{sumberOptions.map(o=><option key={o} value={o}>{o}</option>)}</select></div>
        <div className="form-group"><label className="form-label">Pengeluaran (Rp)</label><input type="number" className="form-input" value={form.pengeluaran} onChange={set('pengeluaran')} min="0" /></div>
        <div className="form-group"><label className="form-label">Tujuan</label><select className="form-select" value={form.tujuan} onChange={set('tujuan')}>{tujuanOptions.map(o=><option key={o} value={o}>{o}</option>)}</select></div>
        <div className="form-group"><label className="form-label">Keterangan</label><input className="form-input" value={form.ket} onChange={set('ket')} /></div>
      </div>
    </Modal>
  );
}

export default function TransaksiPage({ data }) {
  const { transaksi, upsertTransaksi, removeTransaksi, kategori } = data;
  const sumberOptions = kategori?.sumber || [];
  const tujuanOptions = kategori?.tujuan || [];

  const [modal,       setModal]       = useState(null); // {type:'pms'|'pgl'|'edit', item}
  const [filterMonth, setFilterMonth] = useState(currentYearMonth());
  const [search,      setSearch]      = useState('');
  const { confirm: showConfirm, ConfirmUI } = useConfirm();

  const months = useMemo(() => {
    const existing = getMonths(transaksi);
    const now = new Date();
    const extra = Array.from({length:6}, (_,i) => {
      const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    });
    return [...new Set([...existing,...extra])].sort((a,b)=>b.localeCompare(a)).slice(0,18);
  }, [transaksi]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return filterByMonth(transaksi, filterMonth)
      .filter(t => !q || [t.sumber,t.tujuan,t.ket].some(v=>(v||'').toLowerCase().includes(q)))
      .sort((a,b)=>b.tanggal.localeCompare(a.tanggal));
  }, [transaksi, filterMonth, search]);

  const totPms    = sumBy(filtered,'pemasukan');
  const totPgl    = sumBy(filtered,'pengeluaran');
  const totBersih = totPms - totPgl;

  const handleSave   = (item) => { upsertTransaksi(item); setModal(null); };
  const handleDelete = async (id) => {
    const ok = await showConfirm({ title:'Hapus Transaksi', message:'Data transaksi ini akan dihapus permanen. Lanjutkan?', type:'danger' });
    if (ok) removeTransaksi(id);
  };

  return (
    <div className="fade-in">
      {ConfirmUI}
      <div className="transaksi-toolbar">
        <input className="form-input transaksi-search" placeholder="🔍 Cari sumber, tujuan, keterangan..." value={search} onChange={e=>setSearch(e.target.value)} />
        <div className="transaksi-btn-group">
          <button className="btn btn-success" onClick={()=>setModal({type:'pms',item:null})}>＋ Pemasukan</button>
          <button className="btn btn-danger"  onClick={()=>setModal({type:'pgl',item:null})}>－ Pengeluaran</button>
        </div>
      </div>

      <div className="month-tabs">
        {months.map(m => {
          const [y,mo] = m.split('-');
          return <button key={m} className={`month-tab ${m===filterMonth?'active':''}`} onClick={()=>setFilterMonth(m)}>{monthName(parseInt(mo))} {y}</button>;
        })}
      </div>

      <div className="stats-grid mb-4" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
        <StatCard label="Total Pemasukan"   value={fmtRp(totPms)}    color="green"                             sub={`${filtered.filter(t=>t.pemasukan>0).length} transaksi masuk`} />
        <StatCard label="Total Pengeluaran" value={fmtRp(totPgl)}    color="red"                               sub="Bulan ini" />
        <StatCard label="Selisih Bersih"    value={fmtRp(totBersih)} color={totBersih>=0?'green':'red'}         sub="Pemasukan − Pengeluaran" />
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Tanggal</th><th>Sumber Pemasukan</th><th className="right">Pemasukan</th>
              <th>Tujuan Pengeluaran</th><th className="right">Pengeluaran</th><th>Keterangan</th><th>Aksi</th>
            </tr></thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={7} className="text-center text-muted" style={{padding:36}}>{search?'Tidak ada hasil':'Belum ada transaksi di bulan ini'}</td></tr>
              ) : filtered.map(t=>(
                <tr key={t.id}>
                  <td className="text-muted" style={{fontSize:'0.78rem',whiteSpace:'nowrap'}}>{fmtDate(t.tanggal)}</td>
                  <td><span className="badge blue">{t.sumber}</span></td>
                  <td className="td-mono td-right" style={{color:t.pemasukan>0?'var(--green)':'var(--text3)'}}>{t.pemasukan>0?fmtRp(t.pemasukan):'—'}</td>
                  <td><span className="badge orange" style={t.pengeluaran===0?{opacity:0.35}:{}}>{t.tujuan}</span></td>
                  <td className="td-mono td-right" style={{color:t.pengeluaran>0?'var(--red)':'var(--text3)'}}>{t.pengeluaran>0?fmtRp(t.pengeluaran):'—'}</td>
                  <td className="text-muted text-sm">{t.ket||'—'}</td>
                  <td><div className="td-actions">
                    <button className="btn btn-ghost btn-sm" onClick={()=>setModal({type:'edit',item:t})} title="Edit">✎</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(t.id)} title="Hapus">✕</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal?.type==='pms'  && <PemasukanForm   item={modal.item} sumberOptions={sumberOptions} onSave={handleSave} onClose={()=>setModal(null)} />}
      {modal?.type==='pgl'  && <PengeluaranForm item={modal.item} tujuanOptions={tujuanOptions} onSave={handleSave} onClose={()=>setModal(null)} />}
      {modal?.type==='edit' && <EditForm        item={modal.item} sumberOptions={sumberOptions} tujuanOptions={tujuanOptions} onSave={handleSave} onClose={()=>setModal(null)} />}
    </div>
  );
}
