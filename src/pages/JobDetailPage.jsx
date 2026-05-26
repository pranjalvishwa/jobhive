import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Button, Badge, Modal, Textarea, Spinner } from '../components/common';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { getLogoColor, formatSalary, timeAgo } from '../utils/helpers';
import toast from 'react-hot-toast';

const MOCK_JOB = {
  _id: 'demo-1',
  title: 'Senior Frontend Engineer',
  companyName: 'Google',
  location: 'Bangalore, India',
  type: 'Full-time',
  workMode: 'Remote',
  experienceLevel: 'Senior',
  category: 'Technology',
  salaryMin: 6000000,
  salaryMax: 9000000,
  description: `We are looking for a Senior Frontend Engineer to join our growing team at Google. You'll be working on products used by billions of people worldwide.\n\nYou'll collaborate closely with product managers, designers, and backend engineers to build beautiful and performant user interfaces.`,
  responsibilities: ['Lead frontend development for core products', 'Architect scalable React applications', 'Conduct code reviews and mentor junior developers', 'Collaborate with design team on UX implementation', 'Optimize for performance and accessibility'],
  requirements: ['5+ years of React.js experience', 'Strong TypeScript skills', 'Experience with state management (Redux, Zustand)', 'Deep understanding of web performance', 'Excellent communication skills'],
  niceToHave: ['GraphQL experience', 'Open source contributions', 'Experience with Next.js'],
  skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'CSS', 'Redux'],
  benefits: ['Competitive salary + equity', 'Health insurance for family', 'Unlimited PTO', 'Home office stipend', '$5000 annual learning budget', 'Gym membership'],
  applicants: 142,
  createdAt: new Date(Date.now() - 2 * 86400000),
  company: { name: 'Google', industry: 'Technology', size: '10,000+', website: 'google.com', about: 'Google LLC is an American multinational technology company focusing on AI, search engine, online advertising, and more.' },
};

const SIMILAR_JOBS = [
  { _id: 's1', title: 'Staff Engineer', companyName: 'Meta', location: 'Remote', type: 'Full-time', salaryMin: 8000000, salaryMax: 12000000 },
  { _id: 's2', title: 'Frontend Lead', companyName: 'Stripe', location: 'Remote', type: 'Full-time', salaryMin: 7000000, salaryMax: 10000000 },
  { _id: 's3', title: 'React Developer', companyName: 'Vercel', location: 'Remote', type: 'Contract', salaryMin: 5000000, salaryMax: 8000000 },
];

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    jobsAPI.getOne(id)
      .then(data => setJob(data?.job || MOCK_JOB))
      .catch(() => setJob(MOCK_JOB))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try {
      await applicationsAPI.apply(id, { coverLetter });
      setApplied(true);
      setApplyOpen(false);
      toast.success('Application submitted! 🎉');
    } catch (err) {
      toast.error(err?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size={40} />
    </div>
  );

  const lc = getLogoColor(job.companyName || job.company?.name || '');
  const companyName = job.company?.name || job.companyName;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--dark)' }}>
      <Navbar />

      <div style={s.layout}>
        {/* MAIN */}
        <div style={s.main}>
          {/* JOB HEADER */}
          <div style={s.header}>
            <div style={s.headerTop}>
              <div style={{ ...s.logo, background: lc.bg, color: lc.color }}>{companyName?.[0]}</div>
              <div style={{ flex: 1 }}>
                <h1 style={s.title}>{job.title}</h1>
                <div style={s.meta}>
                  <Link to={`/companies/${job.company?._id}`} style={{ color: 'var(--honey)' }}>{companyName}</Link>
                  {job.location && <span>· 📍 {job.location}</span>}
                  <span>· {timeAgo(job.createdAt)}</span>
                </div>
              </div>
            </div>

            <div style={s.tagsRow}>
              {job.type && <Badge color="blue">{job.type}</Badge>}
              {job.workMode && <Badge color="green">{job.workMode}</Badge>}
              {job.experienceLevel && <Badge color="gray">{job.experienceLevel}</Badge>}
              {job.category && <Badge color="purple">{job.category}</Badge>}
            </div>

            <div style={s.salaryRow}>
              <div style={s.salary}>{formatSalary(job.salaryMin, job.salaryMax)}<span style={s.salaryPer}> /year</span></div>
              <div style={s.applicants}>{job.applicants || 0} applicants</div>
            </div>

            <div style={s.actionRow}>
              {applied ? (
                <div style={s.appliedBadge}>✓ Application Submitted!</div>
              ) : (
                <Button size="lg" onClick={() => setApplyOpen(true)}>Apply Now →</Button>
              )}
              <button onClick={() => setSaved(s => !s)} style={s.saveBtn(saved)}>
                {saved ? '❤️ Saved' : '♡ Save Job'}
              </button>
              <button style={s.shareBtn}>↗ Share</button>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>About the Role</h2>
            <p style={s.desc}>{job.description}</p>
          </div>

          {job.responsibilities?.length > 0 && (
            <div style={s.section}>
              <h2 style={s.sectionTitle}>Key Responsibilities</h2>
              <ul style={s.list}>
                {job.responsibilities.map((r, i) => <li key={i} style={s.listItem}>✦ {r}</li>)}
              </ul>
            </div>
          )}

          {job.requirements?.length > 0 && (
            <div style={s.section}>
              <h2 style={s.sectionTitle}>Requirements</h2>
              <ul style={s.list}>
                {job.requirements.map((r, i) => <li key={i} style={s.listItem}>✦ {r}</li>)}
              </ul>
            </div>
          )}

          {job.niceToHave?.length > 0 && (
            <div style={s.section}>
              <h2 style={s.sectionTitle}>Nice to Have</h2>
              <ul style={s.list}>
                {job.niceToHave.map((r, i) => <li key={i} style={{ ...s.listItem, color: 'var(--muted)' }}>○ {r}</li>)}
              </ul>
            </div>
          )}

          {job.skills?.length > 0 && (
            <div style={s.section}>
              <h2 style={s.sectionTitle}>Skills</h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {job.skills.map(skill => (
                  <span key={skill} style={s.skillChip}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          {job.benefits?.length > 0 && (
            <div style={s.section}>
              <h2 style={s.sectionTitle}>Benefits & Perks</h2>
              <div style={s.benefitsGrid}>
                {job.benefits.map((b, i) => (
                  <div key={i} style={s.benefitItem}>🌟 {b}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside style={s.sidebar}>
          {/* COMPANY CARD */}
          <div style={s.card}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ ...s.companyLogo, background: lc.bg, color: lc.color }}>{companyName?.[0]}</div>
              <h3 style={s.companyName}>{companyName}</h3>
              <div style={s.companyIndustry}>{job.company?.industry}</div>
            </div>
            <div style={s.companyStats}>
              {[
                { label: 'Company Size', value: job.company?.size || '1,000+' },
                { label: 'Industry', value: job.company?.industry || 'Technology' },
                { label: 'Website', value: job.company?.website || 'N/A' },
              ].map(({ label, value }) => (
                <div key={label} style={s.companyStat}>
                  <span style={s.companyStatLabel}>{label}</span>
                  <span style={s.companyStatValue}>{value}</span>
                </div>
              ))}
            </div>
            {job.company?.about && <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginTop: '14px' }}>{job.company.about}</p>}
          </div>

          {/* JOB OVERVIEW */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>Job Overview</h3>
            {[
              { icon: '📅', label: 'Posted', value: timeAgo(job.createdAt) },
              { icon: '💼', label: 'Job Type', value: job.type },
              { icon: '🏠', label: 'Work Mode', value: job.workMode },
              { icon: '📈', label: 'Experience', value: job.experienceLevel },
              { icon: '🗂️', label: 'Category', value: job.category },
              { icon: '💰', label: 'Salary', value: formatSalary(job.salaryMin, job.salaryMax) },
            ].map(({ icon, label, value }) => (
              <div key={label} style={s.overviewItem}>
                <span style={s.overviewIcon}>{icon}</span>
                <div>
                  <div style={s.overviewLabel}>{label}</div>
                  <div style={s.overviewValue}>{value || 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>

          {/* SIMILAR JOBS */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>Similar Jobs</h3>
            {SIMILAR_JOBS.map(j => {
              const lc2 = getLogoColor(j.companyName);
              return (
                <Link key={j._id} to={`/jobs/${j._id}`} style={s.similarJob}>
                  <div style={{ ...s.similarLogo, background: lc2.bg, color: lc2.color }}>{j.companyName[0]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{j.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{j.companyName} · {j.location}</div>
                    <div style={{ fontSize: '12px', color: 'var(--honey)', fontWeight: 600, marginTop: '3px' }}>{formatSalary(j.salaryMin, j.salaryMax)}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>
      </div>

      {/* APPLY MODAL */}
      <Modal open={applyOpen} onClose={() => setApplyOpen(false)} title={`Apply for ${job.title}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={s.applyJobHeader}>
            <div style={{ ...s.logo, width: '36px', height: '36px', background: lc.bg, color: lc.color, fontSize: '14px' }}>{companyName?.[0]}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{job.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{companyName}</div>
            </div>
          </div>
          <div style={s.resumeNotice}>
            📄 Your saved resume will be attached automatically
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted2)', display: 'block', marginBottom: '6px' }}>
              Cover Letter <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              placeholder="Tell them why you're a great fit..."
              rows={5}
              style={{ width: '100%', background: 'var(--dark3)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', color: 'var(--white)', fontSize: '14px', padding: '12px 14px', resize: 'vertical', fontFamily: 'DM Sans, sans-serif', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="ghost" onClick={() => setApplyOpen(false)} full>Cancel</Button>
            <Button onClick={handleApply} loading={applying} full>
              Submit Application →
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

const s = {
  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', maxWidth: '1200px', margin: '0 auto', padding: '40px 48px', width: '100%' },
  main: { minWidth: 0 },
  header: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', marginBottom: '20px' },
  headerTop: { display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' },
  logo: { width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, flexShrink: 0 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '6px' },
  meta: { display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--muted)', flexWrap: 'wrap' },
  tagsRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' },
  salaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  salary: { fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 700 },
  salaryPer: { fontSize: '13px', color: 'var(--muted)', fontWeight: 400 },
  applicants: { fontSize: '13px', color: 'var(--muted)' },
  actionRow: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
  appliedBadge: { background: 'rgba(46,204,113,0.15)', border: '1px solid rgba(46,204,113,0.3)', color: '#2ECC71', padding: '10px 22px', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: 700 },
  saveBtn: (saved) => ({ background: saved ? 'rgba(231,76,60,0.1)' : 'var(--dark3)', border: `1px solid ${saved ? 'rgba(231,76,60,0.3)' : 'var(--border2)'}`, color: saved ? 'var(--red)' : 'var(--muted2)', padding: '10px 18px', borderRadius: 'var(--radius-sm)', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }),
  shareBtn: { background: 'var(--dark3)', border: '1px solid var(--border2)', color: 'var(--muted2)', padding: '10px 18px', borderRadius: 'var(--radius-sm)', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' },
  section: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px', marginBottom: '16px' },
  sectionTitle: { fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, marginBottom: '14px' },
  desc: { color: 'var(--muted2)', fontSize: '14px', lineHeight: 1.8, whiteSpace: 'pre-wrap' },
  list: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' },
  listItem: { fontSize: '14px', color: 'var(--muted2)', lineHeight: 1.6 },
  skillChip: { fontSize: '12px', padding: '5px 14px', borderRadius: '999px', background: 'var(--dark3)', border: '1px solid var(--border2)', color: 'var(--muted2)' },
  benefitsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  benefitItem: { fontSize: '13px', color: 'var(--muted2)', padding: '10px 14px', background: 'var(--dark3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '16px', alignSelf: 'flex-start', position: 'sticky', top: '88px' },
  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '22px' },
  cardTitle: { fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, marginBottom: '16px' },
  companyLogo: { width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, margin: '0 auto 12px' },
  companyName: { fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, marginBottom: '4px' },
  companyIndustry: { fontSize: '12px', color: 'var(--muted)' },
  companyStats: { display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '14px', marginTop: '14px' },
  companyStat: { display: 'flex', justifyContent: 'space-between', fontSize: '12px' },
  companyStatLabel: { color: 'var(--muted)' },
  companyStatValue: { color: 'var(--muted2)', fontWeight: 500 },
  overviewItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 0', borderBottom: '1px solid var(--border)' },
  overviewIcon: { fontSize: '16px', width: '20px', flexShrink: 0 },
  overviewLabel: { fontSize: '11px', color: 'var(--muted)', marginBottom: '1px' },
  overviewValue: { fontSize: '13px', fontWeight: 500 },
  similarJob: { display: 'flex', gap: '10px', padding: '11px 0', borderBottom: '1px solid var(--border)' },
  similarLogo: { width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 },
  applyJobHeader: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--dark3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' },
  resumeNotice: { fontSize: '13px', color: 'var(--muted2)', background: 'var(--dark3)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' },
};

export default JobDetailPage;
