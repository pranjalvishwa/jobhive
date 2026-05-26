import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { StatusBadge, Button } from '../components/common';
import { getLogoColor } from '../utils/helpers';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 420000 }, { month: 'Feb', revenue: 380000 },
  { month: 'Mar', revenue: 510000 }, { month: 'Apr', revenue: 490000 },
  { month: 'May', revenue: 620000 }, { month: 'Jun', revenue: 710000 },
  { month: 'Jul', revenue: 840000 },
];

const PIE_DATA = [
  { name: 'Job Seekers', value: 1800000, color: '#60A5FA' },
  { name: 'Employers', value: 500000, color: 'var(--honey)' },
  { name: 'Admins', value: 100000, color: '#CE93D8' },
];

const RECENT_USERS = [
  { name: 'Arjun Kumar', email: 'arjun@gmail.com', type: 'seeker', joined: '2h ago', status: 'active' },
  { name: 'TechCorp India', email: 'hr@techcorp.in', type: 'employer', joined: '5h ago', status: 'review' },
  { name: 'Priya Sharma', email: 'priya@outlook.com', type: 'seeker', joined: '1d ago', status: 'active' },
  { name: 'StartupXYZ', email: 'jobs@startupxyz.io', type: 'employer', joined: '2d ago', status: 'rejected' },
  { name: 'Rahul Verma', email: 'rahul@email.com', type: 'seeker', joined: '3d ago', status: 'active' },
];

const REPORTS = [
  { id: 1, type: 'Fake job post', reporter: 'Anonymous', target: 'StartupXYZ', time: '1 hour ago', severity: 'high' },
  { id: 2, type: 'Spam applications', reporter: 'System', target: 'Bot Account', time: '3 hours ago', severity: 'medium' },
  { id: 3, type: 'Duplicate employer', reporter: 'admin@techcorp.in', target: 'TechCorp', time: '1 day ago', severity: 'low' },
];

const HEALTH = [
  { label: 'API Response Time', value: '142ms', status: 'good' },
  { label: 'Server Uptime', value: '99.97%', status: 'good' },
  { label: 'DB Queries/sec', value: '2,840', status: 'warn' },
  { label: 'Error Rate', value: '0.02%', status: 'good' },
  { label: 'Active Sessions', value: '18,400', status: 'good' },
  { label: 'Storage Used', value: '67%', status: 'warn' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const metrics = [
    { label: 'Total Users', value: '2.4M', change: '↑ 12,400 this week', color: '#60A5FA', icon: '👥' },
    { label: 'Monthly Revenue', value: '₹84L', change: '↑ 18% vs last month', color: '#2ECC71', icon: '💰' },
    { label: 'Active Job Posts', value: '84K', change: '↑ 1,200 today', color: 'var(--honey)', icon: '📋' },
    { label: 'Flagged Reports', value: '5', change: '⚠ Needs review', color: '#E74C3C', icon: '🚨' },
  ];

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      <Navbar />
      <div style={s.layout}>
        <Sidebar role="admin" />
        <main style={s.main}>
          {/* HEADER */}
          <div style={s.header}>
            <div>
              <h1 style={s.title}>Platform Overview ⚙️</h1>
              <p style={s.sub}>Real-time statistics · Last updated 2 mins ago</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="ghost">Export Data</Button>
              <Button>Generate Report</Button>
            </div>
          </div>

          {/* METRICS */}
          <div style={s.metrics}>
            {metrics.map(({ label, value, change, color, icon }) => (
              <div key={label} style={s.metricCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                  <span style={{ fontSize: '18px' }}>{icon}</span>
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '30px', fontWeight: 700, color, marginBottom: '6px' }}>{value}</div>
                <div style={{ fontSize: '11px', color: color === '#E74C3C' ? color : '#2ECC71' }}>{change}</div>
              </div>
            ))}
          </div>

          {/* ROW 1 */}
          <div style={s.row}>
            {/* REVENUE CHART */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>Revenue Trend</span>
                <select style={s.select}><option>Last 7 months</option></select>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2ECC71" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: 'var(--dark2)', border: '1px solid var(--border2)', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(v) => [`₹${(v / 100000).toFixed(1)}L`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#2ECC71" fill="url(#rev)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* USER BREAKDOWN */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>User Breakdown</span>
              </div>
              <PieChart width={200} height={140} style={{ margin: '0 auto' }}>
                <Pie data={PIE_DATA} cx={100} cy={70} innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {PIE_DATA.map(({ name, value, color }) => (
                  <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: color }} />
                      <span style={{ color: 'var(--muted2)' }}>{name}</span>
                    </div>
                    <span style={{ fontWeight: 600 }}>{(value / 1000000).toFixed(1)}M</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PLATFORM HEALTH */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>Platform Health</span>
                <span style={{ fontSize: '11px', color: '#2ECC71', fontWeight: 600 }}>● All systems go</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {HEALTH.map(({ label, value, status }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <span style={{ color: 'var(--muted2)' }}>{label}</span>
                    <span style={{ fontWeight: 600, color: status === 'good' ? '#2ECC71' : 'var(--honey)' }}>
                      {value} {status === 'good' ? '✓' : '⚡'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 2 */}
          <div style={s.row2}>
            {/* USERS TABLE */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>Recent Registrations</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={s.tableBtn}>Filter</button>
                  <button style={s.tableBtn}>Export CSV</button>
                </div>
              </div>
              <table style={s.table}>
                <thead>
                  <tr>
                    {['User', 'Type', 'Joined', 'Status', 'Actions'].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_USERS.map((u, i) => {
                    const lc = getLogoColor(u.name);
                    return (
                      <tr key={i}>
                        <td style={s.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: lc.bg, color: lc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                              {u.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 600 }}>{u.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={s.td}>
                          <span style={{
                            fontSize: '11px', padding: '3px 10px', borderRadius: '999px', fontWeight: 600,
                            background: u.type === 'employer' ? 'rgba(139,92,246,0.15)' : 'rgba(59,130,246,0.15)',
                            color: u.type === 'employer' ? '#A78BFA' : '#60A5FA',
                          }}>
                            {u.type === 'employer' ? '🏢 Employer' : '👤 Seeker'}
                          </span>
                        </td>
                        <td style={{ ...s.td, color: 'var(--muted)', fontSize: '12px' }}>{u.joined}</td>
                        <td style={s.td}><StatusBadge status={u.status} /></td>
                        <td style={s.td}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button style={s.actionBtn} title="View">👁️</button>
                            <button style={s.actionBtn} title="Suspend">🚫</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* REPORTS */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={{ ...s.cardTitle, color: '#E74C3C' }}>🚨 Flagged Reports</span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{REPORTS.length} pending</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {REPORTS.map((r) => (
                  <div key={r.id} style={s.reportCard(r.severity)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{r.type}</span>
                      <span style={{
                        fontSize: '10px', padding: '2px 8px', borderRadius: '999px', fontWeight: 700,
                        background: r.severity === 'high' ? 'rgba(231,76,60,0.2)' : r.severity === 'medium' ? 'rgba(245,166,35,0.2)' : 'rgba(59,130,246,0.2)',
                        color: r.severity === 'high' ? '#E74C3C' : r.severity === 'medium' ? 'var(--honey)' : '#60A5FA',
                      }}>{r.severity}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>
                      Target: <strong style={{ color: 'var(--muted2)' }}>{r.target}</strong> · {r.time}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={s.resolveBtn}>✓ Resolve</button>
                      <button style={s.dismissBtn}>✕ Dismiss</button>
                    </div>
                  </div>
                ))}
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
  title: { fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' },
  sub: { color: 'var(--muted)', fontSize: '13px', marginTop: '4px' },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' },
  metricCard: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 240px 240px', gap: '16px', marginBottom: '16px' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px' },
  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '22px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' },
  cardTitle: { fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700 },
  select: { background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--muted)', fontSize: '12px', padding: '4px 8px', fontFamily: 'DM Sans, sans-serif' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: '11px', color: 'var(--muted)', fontWeight: 500, padding: '0 0 10px 0', borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  td: { padding: '12px 0', borderBottom: '1px solid var(--border)', verticalAlign: 'middle' },
  tableBtn: { background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--muted)', fontSize: '12px', padding: '5px 12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' },
  actionBtn: { background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', fontSize: '13px' },
  reportCard: (sev) => ({
    background: sev === 'high' ? 'rgba(231,76,60,0.06)' : 'var(--dark3)',
    border: `1px solid ${sev === 'high' ? 'rgba(231,76,60,0.2)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)', padding: '14px',
  }),
  resolveBtn: { background: 'rgba(46,204,113,0.15)', border: '1px solid rgba(46,204,113,0.3)', color: '#2ECC71', borderRadius: '6px', padding: '5px 12px', fontSize: '11px', cursor: 'pointer', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' },
  dismissBtn: { background: 'var(--dark2)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '6px', padding: '5px 12px', fontSize: '11px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' },
};

export default AdminDashboard;
