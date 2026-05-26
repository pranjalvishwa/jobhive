import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials, getLogoColor } from '../../utils/helpers';

const SidebarItem = ({ to, icon, label, badge, active }) => (
  <Link to={to} style={s.item(active)}>
    <span style={s.icon}>{icon}</span>
    <span style={s.label}>{label}</span>
    {badge && <span style={s.badge}>{badge}</span>}
  </Link>
);

const SidebarSection = ({ title }) => (
  <div style={s.section}>{title}</div>
);

const Sidebar = ({ role = 'seeker' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  const lc = getLogoColor(user?.name || '');

  const seekerNav = [
    { section: 'Main' },
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/jobs', icon: '🔍', label: 'Browse Jobs' },
    { to: '/dashboard/applications', icon: '📝', label: 'Applications', badge: '7' },
    { to: '/dashboard/saved', icon: '❤️', label: 'Saved Jobs' },
    { section: 'Profile' },
    { to: '/profile', icon: '👤', label: 'My Profile' },
    { to: '/dashboard/resume', icon: '📄', label: 'Resume' },
    { to: '/dashboard/alerts', icon: '🔔', label: 'Job Alerts', badge: '3' },
    { section: 'Account' },
    { to: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  const employerNav = [
    { section: 'Recruitment' },
    { to: '/employer/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/employer/jobs', icon: '📋', label: 'Job Postings', badge: '8' },
    { to: '/employer/candidates', icon: '👥', label: 'Candidates', badge: '142' },
    { to: '/employer/interviews', icon: '📅', label: 'Interviews' },
    { to: '/employer/messages', icon: '📬', label: 'Messages', badge: '12' },
    { section: 'Company' },
    { to: '/employer/profile', icon: '🏢', label: 'Company Profile' },
    { to: '/employer/billing', icon: '💳', label: 'Billing & Plans' },
    { section: 'Account' },
    { to: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  const adminNav = [
    { section: 'Management' },
    { to: '/admin/dashboard', icon: '📊', label: 'Overview' },
    { to: '/admin/users', icon: '👥', label: 'All Users' },
    { to: '/admin/jobs', icon: '📋', label: 'Job Listings' },
    { to: '/admin/companies', icon: '🏢', label: 'Companies' },
    { to: '/admin/reports', icon: '🚨', label: 'Reports', badge: '5' },
    { section: 'System' },
    { to: '/admin/revenue', icon: '💳', label: 'Revenue' },
    { to: '/admin/settings', icon: '⚙️', label: 'Settings' },
    { to: '/admin/emails', icon: '📧', label: 'Email Templates' },
    { to: '/admin/security', icon: '🔒', label: 'Security Logs' },
  ];

  const navItems = role === 'employer' ? employerNav : role === 'admin' ? adminNav : seekerNav;

  const badgeColor = role === 'employer' ? '#60A5FA' : role === 'admin' ? '#E74C3C' : 'var(--honey)';
  const badgeText = role === 'employer' ? '✓ Verified Company' : role === 'admin' ? '⚡ Admin Access' : '✓ Profile Verified';

  return (
    <aside style={s.sidebar}>
      <div style={s.userBlock}>
        <div style={{
          ...s.avatar,
          background: role === 'admin' ? 'linear-gradient(135deg,#E74C3C,#C0392B)'
            : role === 'employer' ? 'linear-gradient(135deg,#60A5FA,#3B82F6)'
            : `linear-gradient(135deg, ${lc.color}aa, ${lc.color})`,
        }}>
          {role === 'admin' ? 'AD' : role === 'employer' ? 'TC' : getInitials(user?.name || 'User')}
        </div>
        <div style={s.userName}>{role === 'admin' ? 'Admin Panel' : role === 'employer' ? 'TechCorp India' : user?.name}</div>
        <div style={s.userRole}>{role === 'admin' ? 'Super Administrator' : role === 'employer' ? 'Employer Account' : user?.title || 'Job Seeker'}</div>
        <span style={{ ...s.badge2, color: badgeColor, background: `${badgeColor}20` }}>{badgeText}</span>
      </div>

      <nav style={s.nav}>
        {navItems.map((item, i) =>
          item.section ? (
            <SidebarSection key={i} title={item.section} />
          ) : (
            <SidebarItem key={item.to} {...item} active={isActive(item.to)} />
          )
        )}
        <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />
        <button onClick={() => { logout(); navigate('/'); }} style={s.logoutBtn}>
          <span>🚪</span> Logout
        </button>
      </nav>
    </aside>
  );
};

const s = {
  sidebar: {
    width: 'var(--sidebar-width)',
    background: 'var(--dark2)',
    borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column',
    position: 'fixed', top: 'var(--nav-height)',
    left: 0, height: 'calc(100vh - var(--nav-height))',
    overflowY: 'auto', zIndex: 100,
  },
  userBlock: {
    padding: '24px 20px 20px',
    borderBottom: '1px solid var(--border)',
    marginBottom: '8px',
  },
  avatar: {
    width: '46px', height: '46px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '16px', fontWeight: 700, color: 'var(--dark)',
    marginBottom: '12px',
  },
  userName: { fontSize: '14px', fontWeight: 600, marginBottom: '3px' },
  userRole: { fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' },
  badge2: {
    display: 'inline-block', fontSize: '10px',
    padding: '3px 10px', borderRadius: '999px', fontWeight: 600,
  },
  nav: { padding: '4px 10px', flex: 1 },
  section: {
    fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px',
    color: 'var(--muted)', fontWeight: 500,
    padding: '14px 10px 6px',
  },
  item: (active) => ({
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '9px 12px', borderRadius: 'var(--radius-sm)',
    color: active ? 'var(--honey)' : 'var(--muted2)',
    background: active ? 'rgba(245,166,35,0.07)' : 'transparent',
    borderLeft: active ? '2px solid var(--honey)' : '2px solid transparent',
    fontSize: '13px', fontWeight: active ? 600 : 400,
    transition: 'all var(--transition)',
    marginBottom: '2px',
  }),
  icon: { fontSize: '15px', lineHeight: 1 },
  label: { flex: 1 },
  badge: {
    background: 'var(--honey)', color: 'var(--dark)',
    fontSize: '10px', fontWeight: 700,
    padding: '1px 7px', borderRadius: '999px',
    marginLeft: 'auto',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '12px',
    width: '100%', padding: '9px 12px',
    background: 'transparent', border: 'none',
    color: 'var(--red)', fontSize: '13px', cursor: 'pointer',
    borderRadius: 'var(--radius-sm)', textAlign: 'left',
  },
};

export default Sidebar;
