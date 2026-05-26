import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials, getLogoColor } from '../../utils/helpers';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const logoColor = user ? getLogoColor(user.name) : null;

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'employer') return '/employer/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/dashboard';
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav style={styles.nav(scrolled)}>
      <Link to="/" style={styles.logo}>
        <span style={styles.logoHive}>Job</span>
        <span style={styles.logoWhite}>Hive</span>
        <span style={{ fontSize: '18px' }}>🐝</span>
      </Link>

      <ul style={styles.links}>
        {[
          { to: '/jobs', label: 'Find Jobs' },
          { to: '/companies', label: 'Companies' },
          { to: '/employers', label: 'For Employers' },
          { to: '/blog', label: 'Blog' },
        ].map(({ to, label }) => (
          <li key={to}>
            <Link to={to} style={styles.link(isActive(to))}>{label}</Link>
          </li>
        ))}
      </ul>

      <div style={styles.actions}>
        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={styles.avatarBtn}
            >
              <div style={styles.avatar(logoColor)}>
                {getInitials(user.name)}
              </div>
              <span style={styles.avatarName}>{user.name.split(' ')[0]}</span>
              <span style={{ color: 'var(--muted)', fontSize: '10px' }}>▼</span>
            </button>

            {dropdownOpen && (
              <div style={styles.dropdown} onClick={() => setDropdownOpen(false)}>
                <div style={styles.dropdownHeader}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{user.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '12px' }}>{user.email}</div>
                </div>
                <Link to={getDashboardLink()} style={styles.dropdownItem}>📊 Dashboard</Link>
                <Link to="/profile" style={styles.dropdownItem}>👤 My Profile</Link>
                {user.role === 'seeker' && (
                  <Link to="/dashboard/applications" style={styles.dropdownItem}>📝 Applications</Link>
                )}
                {user.role === 'employer' && (
                  <Link to="/employer/post-job" style={styles.dropdownItem}>📋 Post a Job</Link>
                )}
                <Link to="/settings" style={styles.dropdownItem}>⚙️ Settings</Link>
                <div style={styles.dropdownDivider} />
                <button onClick={handleLogout} style={styles.dropdownLogout}>🚪 Logout</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" style={styles.btnGhost}>Sign In</Link>
            <Link to="/register" style={styles.btnHoney}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: (scrolled) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 48px',
    height: 'var(--nav-height)',
    position: 'sticky',
    top: 0,
    zIndex: 200,
    background: scrolled ? 'rgba(15,14,12,0.97)' : 'rgba(15,14,12,0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: scrolled ? '1px solid var(--border2)' : '1px solid var(--border)',
    transition: 'all 0.3s ease',
  }),
  logo: {
    display: 'flex', alignItems: 'center', gap: '2px',
    fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700,
    letterSpacing: '-0.5px',
  },
  logoHive: { color: 'var(--honey)' },
  logoWhite: { color: 'var(--white)', marginRight: '4px' },
  links: {
    display: 'flex', gap: '8px', listStyle: 'none',
    alignItems: 'center',
  },
  link: (active) => ({
    color: active ? 'var(--white)' : 'var(--muted)',
    fontSize: '14px', fontWeight: 500,
    padding: '8px 14px', borderRadius: 'var(--radius-sm)',
    background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
    transition: 'all var(--transition)',
    display: 'block',
  }),
  actions: { display: 'flex', alignItems: 'center', gap: '10px' },
  btnGhost: {
    background: 'transparent', border: '1px solid var(--border2)',
    color: 'var(--muted)', padding: '9px 20px',
    borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 500,
    transition: 'all var(--transition)', display: 'block',
  },
  btnHoney: {
    background: 'var(--honey)', border: 'none',
    color: 'var(--dark)', padding: '9px 22px',
    borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 700,
    transition: 'all var(--transition)', display: 'block',
  },
  avatarBtn: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'var(--dark3)', border: '1px solid var(--border2)',
    borderRadius: 'var(--radius-sm)', padding: '6px 12px 6px 6px',
    cursor: 'pointer', color: 'var(--white)',
  },
  avatar: (lc) => ({
    width: '30px', height: '30px', borderRadius: '6px',
    background: lc?.bg || 'var(--honey-dim)',
    color: lc?.color || 'var(--honey)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 700,
  }),
  avatarName: { fontSize: '13px', fontWeight: 500 },
  dropdown: {
    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
    background: 'var(--dark2)', border: '1px solid var(--border2)',
    borderRadius: 'var(--radius)', padding: '8px', minWidth: '220px',
    boxShadow: 'var(--shadow)', zIndex: 300,
  },
  dropdownHeader: {
    padding: '10px 12px 14px', borderBottom: '1px solid var(--border)',
    marginBottom: '6px',
  },
  dropdownItem: {
    display: 'block', padding: '9px 12px', borderRadius: 'var(--radius-sm)',
    color: 'var(--muted2)', fontSize: '13px',
    transition: 'all var(--transition)',
  },
  dropdownDivider: { height: '1px', background: 'var(--border)', margin: '6px 0' },
  dropdownLogout: {
    display: 'block', width: '100%', textAlign: 'left',
    padding: '9px 12px', borderRadius: 'var(--radius-sm)',
    color: 'var(--red)', fontSize: '13px', background: 'transparent',
    border: 'none', cursor: 'pointer',
  },
};

export default Navbar;
