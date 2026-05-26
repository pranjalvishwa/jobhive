import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { employerAPI, applicationsAPI } from '../utils/api';
import { Button, StatusBadge } from '../components/common';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { getLogoColor, getInitials, timeAgo } from '../utils/helpers';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const CHART_DATA = [
  { week: 'W1', apps: 24, views: 180 },
  { week: 'W2', apps: 38, views: 240 },
  { week: 'W3', apps: 31, views: 210 },
  { week: 'W4', apps: 52, views: 320 },
  { week: 'W5', apps: 44, views: 290 },
  { week: 'W6', apps: 67, views: 410 },
];

const MOCK_CANDIDATES = [
  { id: 1, name: 'Arjun Kumar', role: 'Sr. Frontend Dev', exp: '5 yrs', match: 98, status: 'interview', avatar: 'AK' },
  { id: 2, name: 'Priya Rao', role: 'Full-Stack Dev', exp: '4 yrs', match: 94, status: 'review', avatar: 'PR' },
  { id: 3, name: 'Siddharth K.', role: 'React Dev', exp: '3 yrs', match: 89, status: 'review', avatar: 'SK' },
  { id: 4, name: 'Neha Mehta', role: 'Tech Lead', exp: '7 yrs', match: 85, status: 'offer', avatar: 'NM' },
  { id: 5, name: 'Rahul Sharma', role: 'Node.js Dev', exp: '4 yrs', match: 82, status: 'shortlisted', avatar: 'RS' },
];

const MOCK_JOBS = [
  { id: 1, title: 'Senior React Developer', applicants: 42, status: 'active', posted: new Date(Date.now() - 3 * 86400000) },
  { id: 2, title: 'Node.js Backend Engineer', applicants: 28, status: 'active', posted: new Date(Date.now() - 5 * 86400000) },
  { id: 3, title: 'DevOps Engineer', applicants: 19, status: 'paused', posted: new Date(Date.now() - 7 * 86400000) },
  { id: 4, title: 'Product Designer', applicants: 35, status: 'active', posted: new Date(Date.now() - 10 * 86400000) },
];

const FUNNEL = [
  { label: 'Applications', count: 142, pct: 100, color: '#60A5FA' },
  { label: 'Shortlisted', count: 86, pct: 60, color: 'var(--honey)' },
  { label: 'Interviewed', count: 14, pct: 25, color: '#CE93D8' },
  { label: 'Offers Made', count: 6, pct: 8, color: '#2ECC71' },
];

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const metrics = [
    { label: 'Active Jobs', value: 8, change: '3 posted this week', color: '#60A5FA', icon: '📋', up: true },
    { label: 'Total Applicants', value: 142, change: '28 new today', color: 'var(--honey)', icon: '👥', up: true },
    { label: 'Interviews Scheduled', value: 14, change: '5 this week', color: '#2ECC71', icon: '📅', up: true },
    { label: 'Offers Made', value: 6, change: '3 accepted', color: '#CE93D8', icon: '🎉', up: false },
  ];

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      <Navbar />
      <div style={s.layout}>
        <Sidebar role="employer" />
        <main style={s.main}>
          <div style={s.header}>
            <div>
              <h1 style={s.title}>Employer Dashboard 🏢</h1>
              <p style={s.sub}>142 new applications across 8 active job posts</p>
            </div>
            <Button onClick={() => navigate('/employer/post-job')}>+ Post a New Job</Button>
          </div>

          {/* METRICS */}
          <div style={s.metrics}>
            {metrics.map(({ label, value, change, color, icon, up }) => (
              <div key={label} style={s.metricCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                  <span style={{ fontSize: '18px' }}>{icon}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 700, color, marginBottom: '6px' }}>{value}</div>
                <div style={{ fontSize: '11px', color: up ? '#2ECC71' : 'var(--muted)' }}>{change}</div>
              </div>
            ))}
          </div>

          {/* ROW 1 */}
          <div style={s.row}>
            {/* CHART */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>Applications & Views Over Time</span>
                <select style={s.select}>
                  <option>Last 6 weeks</option>
                  <option>Last 3 months</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="apps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--honey)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--honey)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: 'var(--dark2)', border: '1px solid var(--border2)', borderRadius: '8px', color: 'var(--white)', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="apps" stroke="var(--honey)" fill="url(#apps)" strokeWidth={2} name="Applications" />
                  <Area type="monotone" dataKey="views" stroke="#60A5FA" fill="url(#views)" strokeWidth={2} name="Views" />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--muted)' }}>
                  <div style={{ width: '10px', height: '3px', borderRadius: '2px', background: 'var(--honey)' }} />
                  Applications
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--muted)' }}>
                  <div style={{ width: '10px', height: '3px', borderRadius: '2px', background: '#60A5FA' }} />
                  Job Views
                </div>
              </div>
            </div>

            {/* HIRING FUNNEL */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>Hiring Funnel</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {FUNNEL.map(({ label, count, pct, color }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                      <span style={{ color: 'var(--muted2)' }}>{label}</span>
                      <span style={{ fontWeight: 600, color }}>{count}</span>
                    </div>
                    <div style={{ background: 'var(--dark3)', borderRadius: '999px', height: '6px' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '999px', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', padding: '12px', background: 'var(--dark3)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Conversion Rate</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#2ECC71' }}>4.2%</div>
              </div>
            </div>
          </div>

          {/* ROW 2 */}
          <div style={s.row2}>
            {/* TOP CANDIDATES */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>Top Candidates</span>
                <Link to="/employer/candidates" style={s.viewAll}>View pipeline →</Link>
              </div>
              {MOCK_CANDIDATES.map((c) => {
                const lc = getLogoColor(c.name);
                const matchColor = c.match >= 95 ? '#2ECC71' : c.match >= 88 ? 'var(--honey)' : '#60A5FA';
                return (
                  <div key={c.id} style={s.candidateItem}>
                    <div style={{ ...s.avatar, background: lc.bg, color: lc.color }}>{c.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{c.role} · {c.exp} exp</div>
                    </div>
                    <div style={{ ...s.matchPill, color: matchColor, background: `${matchColor}18` }}>{c.match}%</div>
                    <StatusBadge status={c.status} />
                    <button style={s.actionBtn} title="Schedule Interview">📅</button>
                  </div>
                );
              })}
            </div>

            {/* JOB POSTS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardTitle}>Active Job Posts</span>
                  <Link to="/employer/jobs" style={s.viewAll}>Manage →</Link>
                </div>
                {MOCK_JOBS.map((job) => (
                  <div key={job.id} style={s.jobItem}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>{job.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{job.applicants} applicants · {timeAgo(job.posted)}</div>
                    </div>
                    <StatusBadge status={job.status} />
                    <button style={s.actionBtn}>✏️</button>
                  </div>
                ))}
                <button
                  onClick={() => navigate('/employer/post-job')}
                  style={s.addJobBtn}
                >
                  + Post New Job
                </button>
              </div>

              <div style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardTitle}>Quick Stats</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { label: 'Avg. Time to Hire', value: '14d', color: '#60A5FA' },
                    { label: 'Response Rate', value: '92%', color: '#2ECC71' },
                    { label: 'Offer Accept Rate', value: '78%', color: 'var(--honey)' },
                    { label: 'Active Pipelines', value: '8', color: '#CE93D8' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: 'var(--dark3)', borderRadius: 'var(--radius-sm)', padding: '14px', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color, marginBottom: '4px' }}>{value}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const s = {
  layout: { display: 'flex', marginLeft: 'var(--sidebar-width)' },
  main: { flex: 1, padding: '32px 36px', minWidth: 0 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  title: { fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' },
  sub: { color: 'var(--muted)', fontSize: '13px', marginTop: '4px' },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' },
  metricCard: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px', marginBottom: '16px' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px' },
  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '22px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' },
  cardTitle: { fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700 },
  viewAll: { color: 'var(--honey)', fontSize: '12px' },
  select: { background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--muted)', fontSize: '12px', padding: '4px 8px', fontFamily: 'var(--font-body)' },
  candidateItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)' },
  avatar: { width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 },
  matchPill: { fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px' },
  actionBtn: { background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: '6px', width: '30px', height: '30px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  jobItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0', borderBottom: '1px solid var(--border)' },
  addJobBtn: {
    marginTop: '12px', width: '100%', padding: '10px',
    background: 'var(--honey-dim)', border: '1px dashed var(--border-honey)',
    borderRadius: 'var(--radius-sm)', color: 'var(--honey)',
    fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
  },
};

export default EmployerDashboard;
