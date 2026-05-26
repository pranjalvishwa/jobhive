import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, StatusBadge } from '../common';
import { getInitials, getLogoColor, formatSalary, timeAgo } from '../../utils/helpers';

const JobCard = ({ job, showStatus, onSave, saved: initialSaved = false }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);
  const lc = getLogoColor(job.company?.name || job.companyName || '');
  const companyName = job.company?.name || job.companyName || 'Company';
  const initials = getInitials(companyName);

  const handleSave = async (e) => {
    e.stopPropagation();
    setSaving(true);
    setSaved((s) => !s);
    if (onSave) await onSave(job._id, !saved);
    setSaving(false);
  };

  const typeColor = {
    'Full-time': 'blue', 'Part-time': 'purple',
    'Contract': 'honey', 'Freelance': 'honey', 'Internship': 'green',
  };
  const modeColor = { 'Remote': 'green', 'Hybrid': 'honey', 'On-site': 'gray' };

  return (
    <div
      onClick={() => navigate(`/jobs/${job._id}`)}
      style={s.card}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(245,166,35,0.3)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={s.top}>
        <div style={{ ...s.logo, background: lc.bg, color: lc.color }}>{initials}</div>
        <button onClick={handleSave} style={s.saveBtn(saved)} title={saved ? 'Unsave' : 'Save'}>
          {saving ? '…' : saved ? '♥' : '♡'}
        </button>
      </div>

      <h3 style={s.title}>{job.title}</h3>
      <div style={s.company}>
        {companyName}
        {job.location && <span style={s.location}> · 📍 {job.location}</span>}
      </div>

      <div style={s.tags}>
        {job.type && <Badge color={typeColor[job.type] || 'blue'}>{job.type}</Badge>}
        {job.workMode && <Badge color={modeColor[job.workMode] || 'gray'}>{job.workMode}</Badge>}
        {job.experienceLevel && <Badge color="gray">{job.experienceLevel}</Badge>}
      </div>

      {job.skills?.slice(0, 3).map(skill => (
        <span key={skill} style={s.skill}>{skill}</span>
      ))}

      <div style={s.footer}>
        <div style={s.salary}>
          {formatSalary(job.salaryMin, job.salaryMax, job.currency || '₹')}
          <span style={s.period}>/year</span>
        </div>
        <div style={s.meta}>
          {showStatus && job.applicationStatus && (
            <StatusBadge status={job.applicationStatus} />
          )}
          <span style={s.time}>{timeAgo(job.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

const s = {
  card: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '22px',
    cursor: 'pointer', transition: 'all var(--transition)',
    display: 'flex', flexDirection: 'column', gap: '10px',
    animation: 'fadeIn 0.3s ease',
  },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  logo: {
    width: '46px', height: '46px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '16px', fontWeight: 700, flexShrink: 0,
  },
  saveBtn: (saved) => ({
    width: '34px', height: '34px', borderRadius: 'var(--radius-sm)',
    background: 'transparent',
    border: `1px solid ${saved ? 'rgba(231,76,60,0.4)' : 'var(--border2)'}`,
    color: saved ? 'var(--red)' : 'var(--muted)',
    fontSize: '16px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all var(--transition)',
  }),
  title: {
    fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700,
    color: 'var(--white)', lineHeight: 1.3,
  },
  company: { fontSize: '13px', color: 'var(--muted)' },
  location: { color: 'var(--muted)' },
  tags: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  skill: {
    fontSize: '11px', padding: '2px 8px',
    background: 'var(--dark3)', border: '1px solid var(--border)',
    borderRadius: '4px', color: 'var(--muted2)',
  },
  footer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: '12px', borderTop: '1px solid var(--border)', marginTop: '4px',
  },
  salary: { fontSize: '15px', fontWeight: 600, color: 'var(--white)' },
  period: { fontSize: '11px', color: 'var(--muted)', fontWeight: 400 },
  meta: { display: 'flex', alignItems: 'center', gap: '8px' },
  time: { fontSize: '11px', color: 'var(--muted)' },
};

export default JobCard;
