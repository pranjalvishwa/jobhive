import { useState } from 'react';

/* ── Button ── */
export const Button = ({
  children, onClick, type = 'button',
  variant = 'honey', size = 'md', loading, disabled, full, style = {}
}) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', border: 'none', borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer',
    transition: 'all var(--transition)',
    width: full ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
    ...style,
  };
  const sizes = {
    sm: { fontSize: '12px', padding: '7px 16px' },
    md: { fontSize: '13px', padding: '10px 22px' },
    lg: { fontSize: '15px', padding: '13px 32px' },
  };
  const variants = {
    honey: { background: 'var(--honey)', color: 'var(--dark)' },
    ghost: { background: 'transparent', color: 'var(--muted2)', border: '1px solid var(--border2)' },
    outline: { background: 'transparent', color: 'var(--white)', border: '1px solid var(--border2)' },
    danger: { background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(231,76,60,0.3)' },
    success: { background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(46,204,113,0.3)' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading}
      style={{ ...base, ...sizes[size], ...variants[variant] }}>
      {loading ? <Spinner size={14} /> : null}
      {children}
    </button>
  );
};

/* ── Input ── */
export const Input = ({
  label, name, type = 'text', placeholder,
  register, error, icon, suffix, hint, style = {}
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
    {label && <label style={inputStyles.label}>{label}</label>}
    <div style={inputStyles.wrapper}>
      {icon && <span style={inputStyles.icon}>{icon}</span>}
      <input
        type={type} name={name} placeholder={placeholder}
        {...(register ? register(name) : {})}
        style={inputStyles.input(!!icon, !!suffix, !!error)}
      />
      {suffix && <span style={inputStyles.suffix}>{suffix}</span>}
    </div>
    {error && <span style={inputStyles.error}>{error}</span>}
    {hint && !error && <span style={inputStyles.hint}>{hint}</span>}
  </div>
);

const inputStyles = {
  label: { fontSize: '13px', fontWeight: 500, color: 'var(--muted2)' },
  wrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  icon: {
    position: 'absolute', left: '14px', fontSize: '16px',
    pointerEvents: 'none', zIndex: 1,
  },
  input: (hasIcon, hasSuffix, hasError) => ({
    width: '100%',
    background: 'var(--dark3)',
    border: `1px solid ${hasError ? 'var(--red)' : 'var(--border2)'}`,
    borderRadius: 'var(--radius-sm)',
    color: 'var(--white)',
    fontSize: '14px',
    padding: `11px ${hasSuffix ? '80px' : '16px'} 11px ${hasIcon ? '44px' : '16px'}`,
    outline: 'none',
    transition: 'border-color var(--transition)',
    fontFamily: 'var(--font-body)',
  }),
  suffix: {
    position: 'absolute', right: '14px',
    fontSize: '12px', color: 'var(--muted)', fontWeight: 500,
  },
  error: { fontSize: '12px', color: 'var(--red)' },
  hint: { fontSize: '12px', color: 'var(--muted)' },
};

/* ── Select ── */
export const Select = ({ label, name, options = [], register, error, style = {} }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
    {label && <label style={inputStyles.label}>{label}</label>}
    <select
      name={name}
      {...(register ? register(name) : {})}
      style={{
        ...inputStyles.input(false, false, !!error),
        appearance: 'none', cursor: 'pointer',
      }}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value} style={{ background: 'var(--dark2)' }}>
          {label}
        </option>
      ))}
    </select>
    {error && <span style={inputStyles.error}>{error}</span>}
  </div>
);

/* ── Textarea ── */
export const Textarea = ({ label, name, placeholder, register, error, rows = 4, style = {} }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
    {label && <label style={inputStyles.label}>{label}</label>}
    <textarea
      name={name} placeholder={placeholder} rows={rows}
      {...(register ? register(name) : {})}
      style={{
        ...inputStyles.input(false, false, !!error),
        resize: 'vertical', lineHeight: 1.6,
      }}
    />
    {error && <span style={inputStyles.error}>{error}</span>}
  </div>
);

/* ── Badge ── */
export const Badge = ({ children, color = 'honey', size = 'sm' }) => {
  const colors = {
    honey: { bg: 'var(--honey-dim)', color: 'var(--honey)', border: 'var(--border-honey)' },
    green: { bg: 'var(--green-dim)', color: 'var(--green)', border: 'rgba(46,204,113,0.25)' },
    red: { bg: 'var(--red-dim)', color: 'var(--red)', border: 'rgba(231,76,60,0.25)' },
    blue: { bg: 'var(--blue-dim)', color: '#60A5FA', border: 'rgba(59,130,246,0.25)' },
    purple: { bg: 'var(--purple-dim)', color: '#A78BFA', border: 'rgba(139,92,246,0.25)' },
    gray: { bg: 'rgba(138,136,128,0.12)', color: 'var(--muted2)', border: 'rgba(138,136,128,0.25)' },
  };
  const c = colors[color] || colors.honey;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: size === 'sm' ? '11px' : '12px',
      padding: size === 'sm' ? '3px 10px' : '5px 12px',
      borderRadius: '999px', fontWeight: 600,
      background: c.bg, color: c.color,
      border: `1px solid ${c.border}`,
    }}>
      {children}
    </span>
  );
};

/* ── Card ── */
export const Card = ({ children, style = {}, onClick, hover = false }) => (
  <div
    onClick={onClick}
    style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '22px',
      cursor: onClick ? 'pointer' : 'default',
      transition: hover ? 'all var(--transition)' : 'none',
      ...style,
    }}
  >
    {children}
  </div>
);

/* ── Spinner ── */
export const Spinner = ({ size = 20, color = 'var(--honey)' }) => (
  <div style={{
    width: size, height: size,
    border: `2px solid rgba(255,255,255,0.1)`,
    borderTopColor: color,
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    flexShrink: 0,
  }} />
);

/* ── Modal ── */
export const Modal = ({ open, onClose, title, children, width = 540 }) => {
  if (!open) return null;
  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={{ ...modalStyles.modal, maxWidth: width }} onClick={e => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>{title}</h2>
          <button onClick={onClose} style={modalStyles.close}>✕</button>
        </div>
        <div style={modalStyles.body}>{children}</div>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
  },
  modal: {
    background: 'var(--dark2)', border: '1px solid var(--border2)',
    borderRadius: 'var(--radius-lg)', width: '100%',
    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '22px 24px', borderBottom: '1px solid var(--border)',
  },
  title: { fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700 },
  close: {
    background: 'var(--dark3)', border: '1px solid var(--border2)',
    color: 'var(--muted)', width: '32px', height: '32px',
    borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '14px',
  },
  body: { padding: '24px' },
};

/* ── Empty State ── */
export const EmptyState = ({ icon = '🔍', title, message, action }) => (
  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', marginBottom: '8px' }}>{title}</h3>
    <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>{message}</p>
    {action}
  </div>
);

/* ── Status Badge ── */
export const StatusBadge = ({ status }) => {
  const config = {
    applied: { label: 'Applied', color: '#60A5FA', bg: 'rgba(59,130,246,0.12)' },
    review: { label: 'In Review', color: '#60A5FA', bg: 'rgba(59,130,246,0.12)' },
    shortlisted: { label: 'Shortlisted', color: '#F5A623', bg: 'rgba(245,166,35,0.12)' },
    interview: { label: 'Interview', color: '#F5A623', bg: 'rgba(245,166,35,0.12)' },
    offer: { label: 'Offer! 🎉', color: '#2ECC71', bg: 'rgba(46,204,113,0.12)' },
    rejected: { label: 'Rejected', color: '#E74C3C', bg: 'rgba(231,76,60,0.12)' },
    active: { label: 'Active', color: '#2ECC71', bg: 'rgba(46,204,113,0.12)' },
    paused: { label: 'Paused', color: '#F5A623', bg: 'rgba(245,166,35,0.12)' },
    closed: { label: 'Closed', color: '#E74C3C', bg: 'rgba(231,76,60,0.12)' },
  };
  const c = config[status] || config.applied;
  return (
    <span style={{
      fontSize: '11px', fontWeight: 700, padding: '4px 10px',
      borderRadius: '999px', background: c.bg, color: c.color,
      whiteSpace: 'nowrap',
    }}>
      {c.label}
    </span>
  );
};

/* ── Global Keyframes ── */
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  input:focus, select:focus, textarea:focus { border-color: var(--honey) !important; box-shadow: 0 0 0 3px rgba(245,166,35,0.1); }
`;
document.head.appendChild(styleEl);
