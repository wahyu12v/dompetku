import { NAV_ITEMS, NAV_SECTIONS } from '../utils/constants';

export default function Sidebar({ user, page, onNavigate, onLogout, open, onClose }) {
  const grouped = NAV_ITEMS.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1>💰 Dompetku</h1>
          <p>Sistem Keuangan Pribadi</p>
        </div>
        <div className="sidebar-user">
          <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-email">@{user.username}</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section}>
              <div className="nav-section">{NAV_SECTIONS[section]}</div>
              {items.map(item => (
                <div
                  key={item.id}
                  className={`nav-item ${page === item.id ? 'active' : ''}`}
                  onClick={() => { onNavigate(item.id); onClose(); }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="nav-item logout" onClick={onLogout}>
            <span className="nav-icon">⎋</span>
            <span className="nav-label">Keluar</span>
          </div>
        </div>
      </aside>
    </>
  );
}
