import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI, usersAPI } from '../utils/api';
import { Button, Card, StatusBadge, EmptyState, Spinner } from '../components/common';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { formatSalary, timeAgo, getLogoColor, getInitials } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const WEEKLY_DATA = [
  { day: 'Mon', apps: 3 }, { day: 'Tue', apps: 7 }, { day: 'Wed', apps: 5 },
  { day: 'Thu', apps: 9 }, { day: 'Fri', apps: 6 }, { day: 'Sat', apps: 2 }, { day: 'Sun', apps: 1 },
];

const MOCK_APPS = [
  { _id: '1', jobTitle: 'Senior Frontend Engineer', company: 'Google', location: 'Bangalore', status: 'interview', appliedAt: new Date(Date.now() - 2 * 86400000) },
  { _id: '2', jobTitle: 'Software Engineer II', company: 'Stripe', location: 'Remote', status: 'review', appliedAt: new Date(Date.now() - 5 * 86400000) },
  { _id: '3', jobTitle: 'Full-Stack Developer', company: 'Uber', location: 'Mumbai', status: 'offer', appliedAt: new Date(Date.now() - 7 * 86400000) },
  { _id: '4', jobTitle: 'React Developer', company: 'Netflix', location: 'Remote', status: 'rejected', appliedAt: new Date(Date.now() - 14 * 86400000) },
  { _id: '5', jobTitle: 'Backend Engineer', company: 'Amazon', location: 'Hyderabad', status: 'review', appliedAt: new Date(Date.now() - 3 * 86400000) },
];

const AI_MATCHES = [
  { company: 'Linear', title: 'Sr. React Dev', location: 'Remote', match: 98, salary: '₹70L' },
  { company: 'Vercel', title: 'Node.js Engineer', location: 'Remote', match: 92, salary: '₹65L' },
  { company: 'GitHub', title: 'Full-Stack Lead', location: 'Hybrid', match: 88, salary: '₹80L' },
];

const ACTIVITY = [
  { color: '#2ECC71', text: 'Google viewed your profile', time: '2 hours ago' },
  { color: 'var(--honey)', text: 'Interview scheduled with Stripe', time: 'Yesterday' },
  { color: '#60A5FA', text: 'Application sent to Airbnb', time: '2 days ago' },
  { color: '#CE93D8', text: 'Uber sent you an offer letter 🎉', time: '3 days ago' },
  { color: '#E74C3C', text: 'Application rejected by Netflix', time: '5 days ago' },
];

const SeekerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState(MOCK_APPS);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    applicationsAPI.getMyApplications()
      .then(d => setApplications(d?.applications || MOCK_APPS))
      .catch(() => setApplications(MOCK_APPS));
  }, []);

  const metrics = [
    { label: 'Total Applications', value: 47, change: '+12 this month', color: '#60A5FA', icon: '📝', up: true },
    { label: 'Interviews', value: 8, change: '3 new invites', color: 'var(--honey)', icon: '🎯', up: true },
    { label: 'Offers Received', value: 2, change: 'Deadline in 3d', color: '#2ECC71', icon: '🎉', up: true },
    { label: 'Profile Views', value: 234, change: '↑ 28% this week', color: '#CE93D8', icon: '👁️', up: true },
  ];

  const profileItems = [
    { label: 'Basic Info', done: true },
    { label: 'Work Experience', done: true },
    { label: 'Skills Added', done: true },
    { label: 'Portfolio Links', done: false },
    { label: 'Certifications', done: false },
  ];
  const profilePct = Math.round((profileItems.filter(i => i.done).length / profileItems.length) * 100);

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      <Navbar />
      <div style={s.layout}>
        <Sidebar role="seeker" />
        <main style={s.main}>
          {/* HEADER */}
          <div style={s.header}>
            <div>
              <h1 style={s.title}>Good morning, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
              <p style={s.sub}>You have 3 new interview invites and 2 job matches today</p>
            </div>
            <Button onClick={() => navigate('/dashboard/resume')}>📄 Update Resume</Button>
          </div>

          {/* METRICS */}
          <div style={s.metrics}>
            {metrics.map(({ label, value, change, color, icon, up }) => (
              <MetricCard key={label} label={label} value={value} change={change} color={color} icon={icon} up={up} />
            ))}
          </div>

          {/* ROW 1 */}
          <div style={s.row}>
            {/* APPLICATIONS */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>Recent Applications</span>
                <Link to="/dashboard/applications" style={s.viewAll}>View all →</Link>
              </div>
              {applications.slice(0, 5).map(app => {
                const lc = getLogoColor(app.company);
                return (
                  <div key={app._id} style={s.appItem}>
                    <div style={{ ...s.appLogo, background: lc.bg, color: lc.color }}>
                      {getInitials(app.company)}
                    </div>
                    <div style={s.appInfo}>
                      <div style={s.appTitle}>{app.jobTitle}</div>
                      <div style={s.appCompany}>{app.company} · {timeAgo(app.appliedAt)}</div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                );
              })}
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* PROFILE STRENGTH */}
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardTitle}>Profile Strength</span>
                  <Link to="/profile" style={s.viewAll}>Edit →</Link>
                </div>
                <div style={s.profilePctRow}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{profilePct}% Complete</span>
                  <span style={{ fontSize: '12px', color: profilePct >= 80 ? '#2ECC71' : 'var(--honey)' }}>
                    {profilePct >= 80 ? 'Good' : 'Improve'}
                  </span>
                </div>
                <div style={s.progressBg}>
                  <div style={{ ...s.progressFill, width: `${profilePct}%` }} />
                </div>
                <div style={{ marginTop: '12px' }}>
                  {profileItems.map(({ label, done }) => (
                    <div key={label} style={s.profileItem}>
                      <span style={{ fontSize: '12px', color: 'var(--muted2)' }}>{label}</span>
                      <span style={{ fontSize: '12px', color: done ? '#2ECC71' : 'var(--muted)', fontWeight: done ? 600 : 400 }}>
                        {done ? '✓ Done' : 'Missing'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIVITY */}
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardTitle}>Recent Activity</span>
                </div>
                {ACTIVITY.map(({ color, text, time }, i) => (
                  <div key={i} style={s.activityItem}>
                    <div style={{ ...s.actDot, background: color }} />
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--muted2)', lineHeight: 1.5 }}>{text}</div>
                      <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>{time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 2 */}
          <div style={s.row3}>
            {/* WEEKLY CHART */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>Weekly Applications</span>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={WEEKLY_DATA} barSize={20}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: 'var(--dark2)', border: '1px solid var(--border2)', borderRadius: '8px', color: 'var(--white)', fontSize: '12px' }}
                    cursor={{ fill: 'rgba(245,166,35,0.05)' }}
                  />
                  <Bar dataKey="apps" fill="rgba(245,166,35,0.3)" radius={[4, 4, 0, 0]}
                    activeBar={{ fill: 'var(--honey)' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* AI MATCHES */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>🎯 AI Job Matches</span>
                <Link to="/jobs" style={s.viewAll}>See all →</Link>
              </div>
              {AI_MATCHES.map(({ company, title, location, match, salary }) => {
                const lc = getLogoColor(company);
                const matchColor = match >= 95 ? '#2ECC71' : match >= 88 ? 'var(--honey)' : '#60A5FA';
                return (
                  <div key={company} style={s.matchItem}>
                    <div style={{ ...s.matchLogo, background: lc.bg, color: lc.color }}>{company[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{company} · {location}</div>
                    </div>
                    <div>
                      <div style={{ ...s.matchPill, color: matchColor, background: `${matchColor}18` }}>{match}%</div>
                      <div style={{ fontSize: '11px', color: 'var(--honey)', textAlign: 'right', marginTop: '3px', fontWeight: 600 }}>{salary}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* QUICK ACTIONS */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>Quick Actions</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { icon: '🔍', label: 'Browse New Jobs', to: '/jobs' },
                  { icon: '📄', label: 'Update Resume', to: '/dashboard/resume' },
                  { icon: '🔔', label: 'Set Job Alerts', to: '/dashboard/alerts' },
                  { icon: '👤', label: 'Edit Profile', to: '/profile' },
                  { icon: '❤️', label: 'View Saved Jobs', to: '/dashboard/saved' },
                ].map(({ icon, label, to }) => (
                  <Link key={to} to={to} style={s.quickAction}>
                    <span>{icon}</span>
                    <span style={{ flex: 1, fontSize: '13px' }}>{label}</span>
                    <span style={{ color: 'var(--muted)', fontSize: '12px' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, change, color, icon, up }) => (
  <div style={s.metricCard}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
      <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      <div style={{ fontSize: '18px' }}>{icon}</div>
    </div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 700, color, marginBottom: '6px' }}>{value}</div>
    <div style={{ fontSize: '11px', color: up ? '#2ECC71' : 'var(--muted)' }}>{change}</div>
  </div>
);

const s = {
  layout: { display: 'flex', marginLeft: 'var(--sidebar-width)' },
  main: { flex: 1, padding: '32px 36px', minWidth: 0 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  title: { fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' },
  sub: { color: 'var(--muted)', fontSize: '13px', marginTop: '4px' },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' },
  metricCard: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', marginBottom: '16px' },
  row3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' },
  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '22px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' },
  cardTitle: { fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700 },
  viewAll: { color: 'var(--honey)', fontSize: '12px' },
  appItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)' },
  appLogo: { width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 },
  appInfo: { flex: 1, minWidth: 0 },
  appTitle: { fontSize: '13px', fontWeight: 600, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  appCompany: { fontSize: '11px', color: 'var(--muted)' },
  profilePctRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' },
  progressBg: { background: 'var(--dark3)', borderRadius: '999px', height: '6px' },
  progressFill: { height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, var(--honey), var(--honey-dark))', transition: 'width 0.5s ease' },
  profileItem: { display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border)' },
  activityItem: { display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border)' },
  actDot: { width: '8px', height: '8px', borderRadius: '50%', marginTop: '4px', flexShrink: 0 },
  matchItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border)' },
  matchLogo: { width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 },
  matchPill: { fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', textAlign: 'center' },
  quickAction: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '10px 12px', borderRadius: 'var(--radius-sm)',
    background: 'var(--dark3)', border: '1px solid var(--border)',
    color: 'var(--muted2)', transition: 'all var(--transition)',
  },
};

export default SeekerDashboard;
