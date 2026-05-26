import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Spinner } from '../components/common';
import toast from 'react-hot-toast';

/* ── LOGIN ── */
export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await authAPI.login(data);
      login(res.user, res.token);
      toast.success('Welcome back! 🐝');
      const role = res.user.role;
      navigate(role === 'employer' ? '/employer/dashboard' : role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Invalid credentials');
    }
  };

  return (
    <AuthLayout
      title="Welcome back 🐝"
      subtitle="Sign in to your JobHive account"
      footer={<>Don't have an account? <Link to="/register" style={ls.link}>Create one →</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={ls.form}>
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          icon="📧"
          register={register}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          icon="🔒"
          register={register}
          error={errors.password?.message}
        />
        <div style={ls.forgotRow}>
          <label style={ls.rememberLabel}>
            <input type="checkbox" style={{ accentColor: 'var(--honey)' }} />
            Remember me
          </label>
          <Link to="/forgot-password" style={ls.link}>Forgot password?</Link>
        </div>
        <Button type="submit" full size="lg" loading={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div style={ls.divider}><span>or continue with</span></div>

      <div style={ls.socialBtns}>
        <button style={ls.socialBtn}>
          <span>G</span> Google
        </button>
        <button style={ls.socialBtn}>
          <span>in</span> LinkedIn
        </button>
      </div>

      <div style={ls.demoAccounts}>
        <div style={ls.demoTitle}>Demo Accounts</div>
        <div style={ls.demoGrid}>
          {[
            { label: 'Job Seeker', email: 'seeker@demo.com' },
            { label: 'Employer', email: 'employer@demo.com' },
            { label: 'Admin', email: 'admin@demo.com' },
          ].map(({ label, email }) => (
            <div key={label} style={ls.demoCard}>
              <div style={ls.demoLabel}>{label}</div>
              <div style={ls.demoEmail}>{email}</div>
              <div style={ls.demoPass}>pass: demo123</div>
            </div>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
};

/* ── REGISTER ── */
export const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('seeker');
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const res = await authAPI.register({ ...data, role });
      login(res.user, res.token);
      toast.success('Account created! Welcome to JobHive 🐝');
      navigate(role === 'employer' ? '/employer/dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout
      title="Join JobHive 🐝"
      subtitle="Create your account and start your journey"
      footer={<>Already have an account? <Link to="/login" style={ls.link}>Sign in →</Link></>}
    >
      {/* ROLE SELECTOR */}
      <div style={ls.rolePicker}>
        {[
          { value: 'seeker', label: '👤 Job Seeker', desc: 'Find your dream job' },
          { value: 'employer', label: '🏢 Employer', desc: 'Hire top talent' },
        ].map(({ value, label, desc }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            style={ls.roleBtn(role === value)}
          >
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{label}</div>
            <div style={{ fontSize: '11px', color: role === value ? 'rgba(245,166,35,0.8)' : 'var(--muted)' }}>{desc}</div>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={ls.form}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Input
            label="First Name"
            name="firstName"
            placeholder="John"
            register={register}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            name="lastName"
            placeholder="Doe"
            register={register}
            error={errors.lastName?.message}
          />
        </div>

        {role === 'employer' && (
          <Input
            label="Company Name"
            name="companyName"
            placeholder="Acme Corp"
            icon="🏢"
            register={register}
            error={errors.companyName?.message}
          />
        )}

        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          icon="📧"
          register={register}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Min. 8 characters"
          icon="🔒"
          register={register}
          error={errors.password?.message}
          hint="Use a strong password with letters, numbers, and symbols"
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          icon="🔒"
          register={register}
          error={errors.confirmPassword?.message}
        />

        <label style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--muted2)', cursor: 'pointer', alignItems: 'flex-start' }}>
          <input type="checkbox" style={{ accentColor: 'var(--honey)', marginTop: '2px' }} required />
          I agree to the <Link to="/terms" style={ls.link}>Terms of Service</Link> and{' '}
          <Link to="/privacy" style={ls.link}>Privacy Policy</Link>
        </label>

        <Button type="submit" full size="lg" loading={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
    </AuthLayout>
  );
};

/* ── AUTH LAYOUT ── */
const AuthLayout = ({ title, subtitle, footer, children }) => (
  <div style={ls.root}>
    <div style={ls.left}>
      <div style={ls.leftContent}>
        <Link to="/" style={ls.logo}>
          <span style={{ color: 'var(--honey)' }}>Job</span>Hive 🐝
        </Link>
        <h2 style={ls.leftTitle}>The #1 Job Platform<br />in India</h2>
        <p style={ls.leftSub}>Join 2.4M+ professionals finding their dream jobs</p>
        <div style={ls.statGrid}>
          {[
            { num: '84K+', label: 'Active Jobs' },
            { num: '12K+', label: 'Companies' },
            { num: '2.4M', label: 'Users' },
            { num: '98%', label: 'Satisfaction' },
          ].map(({ num, label }) => (
            <div key={label} style={ls.stat}>
              <div style={ls.statNum}>{num}</div>
              <div style={ls.statLabel}>{label}</div>
            </div>
          ))}
        </div>
        <div style={ls.testimonialBlock}>
          <p style={ls.testimonialText}>"JobHive helped me land my dream job at Google in just 3 weeks!"</p>
          <div style={ls.testimonialAuthor}>
            <div style={ls.testimonialAvatar}>AK</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>Arjun Kumar</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Senior Engineer at Google</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style={ls.right}>
      <div style={ls.card}>
        <h1 style={ls.title}>{title}</h1>
        <p style={ls.subtitle}>{subtitle}</p>
        {children}
        {footer && <div style={ls.footer}>{footer}</div>}
      </div>
    </div>
  </div>
);

const ls = {
  root: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    minHeight: '100vh', background: 'var(--dark)',
  },
  left: {
    background: 'linear-gradient(145deg, #1A1500 0%, #2A1F00 60%, #1A1500 100%)',
    borderRight: '1px solid rgba(245,166,35,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '60px',
    position: 'relative', overflow: 'hidden',
  },
  leftContent: { position: 'relative', zIndex: 1, maxWidth: '400px' },
  logo: {
    fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700,
    display: 'block', marginBottom: '48px', color: 'var(--white)',
  },
  leftTitle: {
    fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 700,
    letterSpacing: '-1.5px', lineHeight: 1.1, color: 'var(--white)',
    marginBottom: '14px',
  },
  leftSub: { color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '36px' },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '48px' },
  stat: { textAlign: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px 8px' },
  statNum: { fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--honey)', marginBottom: '4px' },
  statLabel: { fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  testimonialBlock: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 'var(--radius)', padding: '20px',
  },
  testimonialText: { fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: '16px', fontStyle: 'italic' },
  testimonialAuthor: { display: 'flex', alignItems: 'center', gap: '10px' },
  testimonialAvatar: {
    width: '36px', height: '36px', borderRadius: '8px',
    background: 'rgba(245,166,35,0.2)', color: 'var(--honey)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 700,
  },
  right: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px', overflowY: 'auto',
  },
  card: { width: '100%', maxWidth: '460px' },
  title: {
    fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700,
    letterSpacing: '-0.5px', marginBottom: '8px',
  },
  subtitle: { color: 'var(--muted)', fontSize: '14px', marginBottom: '28px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' },
  forgotRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--muted2)' },
  rememberLabel: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  link: { color: 'var(--honey)', textDecoration: 'none' },
  divider: {
    textAlign: 'center', position: 'relative', margin: '20px 0',
    color: 'var(--muted)', fontSize: '12px',
    borderTop: '1px solid var(--border)', paddingTop: '12px',
  },
  socialBtns: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' },
  socialBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    background: 'var(--dark3)', border: '1px solid var(--border2)',
    borderRadius: 'var(--radius-sm)', padding: '10px', color: 'var(--muted2)',
    fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)',
  },
  footer: { textAlign: 'center', fontSize: '13px', color: 'var(--muted)', marginTop: '20px' },
  rolePicker: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' },
  roleBtn: (active) => ({
    background: active ? 'rgba(245,166,35,0.1)' : 'var(--dark3)',
    border: `1px solid ${active ? 'rgba(245,166,35,0.4)' : 'var(--border2)'}`,
    borderRadius: 'var(--radius-sm)', padding: '14px 12px',
    color: active ? 'var(--honey)' : 'var(--muted2)',
    cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)',
    transition: 'all var(--transition)',
  }),
  demoAccounts: {
    background: 'var(--dark3)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', padding: '14px', marginTop: '4px',
  },
  demoTitle: { fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' },
  demoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' },
  demoCard: { background: 'var(--dark2)', borderRadius: '6px', padding: '8px' },
  demoLabel: { fontSize: '11px', fontWeight: 600, color: 'var(--honey)', marginBottom: '3px' },
  demoEmail: { fontSize: '10px', color: 'var(--muted2)' },
  demoPass: { fontSize: '10px', color: 'var(--muted)' },
};
