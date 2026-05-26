import { formatDistanceToNow, format } from 'date-fns';

export const timeAgo = (date) => {
  try { return formatDistanceToNow(new Date(date), { addSuffix: true }); }
  catch { return 'recently'; }
};

export const formatDate = (date, fmt = 'MMM d, yyyy') => {
  try { return format(new Date(date), fmt); }
  catch { return ''; }
};

export const formatSalary = (min, max, currency = '₹') => {
  const fmt = (n) => n >= 100000
    ? `${(n / 100000).toFixed(0)}L`
    : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : `${n}`;
  if (min && max) return `${currency}${fmt(min)} – ${currency}${fmt(max)}`;
  if (min) return `${currency}${fmt(min)}+`;
  return 'Competitive';
};

export const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

export const LOGO_COLORS = [
  { bg: 'rgba(59,130,246,0.18)', color: '#60A5FA' },
  { bg: 'rgba(245,166,35,0.18)', color: '#F5A623' },
  { bg: 'rgba(46,204,113,0.18)', color: '#2ECC71' },
  { bg: 'rgba(231,76,60,0.18)', color: '#E74C3C' },
  { bg: 'rgba(139,92,246,0.18)', color: '#A78BFA' },
  { bg: 'rgba(0,188,212,0.18)', color: '#4DD0E1' },
  { bg: 'rgba(255,152,0,0.18)', color: '#FFB74D' },
  { bg: 'rgba(236,64,122,0.18)', color: '#F06292' },
];

export const getLogoColor = (name = '') => {
  const idx = name.charCodeAt(0) % LOGO_COLORS.length;
  return LOGO_COLORS[idx];
};

export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
export const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];
export const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive'];

export const CATEGORIES = [
  { label: 'Technology', icon: '💻', count: '18.4K' },
  { label: 'Finance', icon: '💰', count: '6.8K' },
  { label: 'Design', icon: '🎨', count: '4.2K' },
  { label: 'Marketing', icon: '📢', count: '5.6K' },
  { label: 'Healthcare', icon: '🏥', count: '9.3K' },
  { label: 'Data & AI', icon: '📊', count: '7.1K' },
  { label: 'Engineering', icon: '🏗️', count: '11.2K' },
  { label: 'Legal', icon: '⚖️', count: '2.8K' },
];

export const STATUS_CONFIG = {
  applied: { label: 'Applied', color: '#60A5FA', bg: 'rgba(59,130,246,0.12)' },
  review: { label: 'In Review', color: '#60A5FA', bg: 'rgba(59,130,246,0.12)' },
  shortlisted: { label: 'Shortlisted', color: '#F5A623', bg: 'rgba(245,166,35,0.12)' },
  interview: { label: 'Interview', color: '#F5A623', bg: 'rgba(245,166,35,0.12)' },
  offer: { label: 'Offer!', color: '#2ECC71', bg: 'rgba(46,204,113,0.12)' },
  rejected: { label: 'Rejected', color: '#E74C3C', bg: 'rgba(231,76,60,0.12)' },
  withdrawn: { label: 'Withdrawn', color: '#8A8880', bg: 'rgba(138,136,128,0.12)' },
};

export const truncate = (str, n = 100) =>
  str && str.length > n ? str.slice(0, n) + '…' : str;

export const debounce = (fn, delay = 300) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
};
