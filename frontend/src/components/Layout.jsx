import { Link, useLocation } from 'react-router-dom';
import auraLogo from '../assets/aura_logo.png';

function Layout({ children }) {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="aura-nav">
        <div className="aura-nav-inner">
          <Link to="/" className="aura-nav-brand">
            <img
              src={auraLogo}
              alt="Aura Events Logo"
              className="aura-nav-logo"
            />
            <span className="aura-nav-title">Aura</span>
          </Link>
          <div className="aura-nav-links">
            <Link
              to="/"
              className={`aura-nav-link${location.pathname === '/' ? ' aura-nav-link-active' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/admin"
              className={`aura-nav-link${location.pathname === '/admin' ? ' aura-nav-link-active' : ''}`}
            >
              Admin
            </Link>
            <Link
              to="/checkin"
              className={`aura-nav-link${location.pathname === '/checkin' ? ' aura-nav-link-active' : ''}`}
            >
              Check-in
            </Link>
          </div>
        </div>
      </nav>
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '24px' }}>
        {children}
      </main>
    </div>
  );
}

export default Layout;
