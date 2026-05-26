import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={s.footer}>
    <div style={s.top}>
      <div style={s.brand}>
        <div style={s.logo}>
          <span style={{ color: 'var(--honey)' }}>Job</span>Hive 🐝
        </div>
        <p style={s.tagline}>
          The smartest way to find and fill jobs. Trusted by millions of
          professionals and thousands of top companies worldwide.
        </p>
        <div style={s.socials}>
          {['𝕏', 'in', 'f', '▶'].map((icon, i) => (
            <a key={i} href="#" style={s.social}>{icon}</a>
          ))}
        </div>
      </div>

      {[
        {
          title: 'Job Seekers',
          links: ['Browse Jobs', 'Career Advice', 'Resume Builder', 'Salary Guide', 'Job Alerts'],
        },
        {
          title: 'Employers',
          links: ['Post a Job', 'Browse Talent', 'Pricing Plans', 'ATS Integration', 'Hire Faster'],
        },
        {
          title: 'Company',
          links: ['About Us', 'Blog', 'Careers', 'Press Kit', 'Contact'],
        },
        {
          title: 'Support',
          links: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Cookie Settings', 'Report Issue'],
        },
      ].map(({ title, links }) => (
        <div key={title} style={s.col}>
          <h4 style={s.colTitle}>{title}</h4>
          <ul style={s.colList}>
            {links.map((l) => (
              <li key={l}>
                <a href="#" style={s.colLink}>{l}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div style={s.bottom}>
      <p style={s.copy}>© 2025 JobHive Inc. All rights reserved.</p>
      <div style={s.badges}>
        <span style={s.badge}>🔒 SSL Secured</span>
        <span style={s.badge}>🛡️ GDPR Compliant</span>
        <span style={s.badge}>⭐ 4.9/5 Rating</span>
      </div>
    </div>
  </footer>
);

const s = {
  footer: {
    background: 'var(--dark2)',
    borderTop: '1px solid var(--border)',
    marginTop: 'auto',
  },
  top: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
    gap: '48px',
    padding: '60px 48px 40px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  brand: {},
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: '22px', fontWeight: 700,
    color: 'var(--white)', marginBottom: '14px',
  },
  tagline: {
    color: 'var(--muted)', fontSize: '13px',
    lineHeight: 1.7, marginBottom: '20px', maxWidth: '280px',
  },
  socials: { display: 'flex', gap: '8px' },
  social: {
    width: '34px', height: '34px', borderRadius: 'var(--radius-sm)',
    background: 'var(--dark3)', border: '1px solid var(--border2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--muted)', fontSize: '13px', fontWeight: 700,
    transition: 'all var(--transition)',
  },
  col: {},
  colTitle: {
    fontSize: '11px', textTransform: 'uppercase',
    letterSpacing: '1.2px', color: 'var(--muted)', fontWeight: 500,
    marginBottom: '16px',
  },
  colList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' },
  colLink: { color: 'var(--muted2)', fontSize: '13px', transition: 'color var(--transition)' },
  bottom: {
    borderTop: '1px solid var(--border)',
    padding: '20px 48px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    maxWidth: '1400px', margin: '0 auto',
  },
  copy: { fontSize: '12px', color: 'var(--muted)' },
  badges: { display: 'flex', gap: '12px' },
  badge: {
    fontSize: '11px', color: 'var(--muted)', padding: '4px 10px',
    background: 'var(--dark3)', border: '1px solid var(--border)',
    borderRadius: '999px',
  },
};

export default Footer;
