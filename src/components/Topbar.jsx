import { PAGE_TITLES } from '../utils/constants';
import { fmtDateLong } from '../utils/format';

export default function Topbar({ page, onMenuToggle }) {
  return (
    <header className="topbar">
      <button className="hamburger" onClick={onMenuToggle} aria-label="Menu">☰</button>
      <h2 className="topbar-title">{PAGE_TITLES[page] || page}</h2>
      <div className="topbar-actions">
        <span className="topbar-date">{fmtDateLong(new Date().toISOString().split('T')[0])}</span>
      </div>
    </header>
  );
}
