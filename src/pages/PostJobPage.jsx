import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { jobsAPI } from '../utils/api';
import { Button, Input, Select, Textarea } from '../components/common';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { JOB_TYPES, WORK_MODES, EXPERIENCE_LEVELS, CATEGORIES } from '../utils/helpers';
import toast from 'react-hot-toast';

const STEPS = ['Job Details', 'Requirements', 'Compensation', 'Preview'];

const PostJobPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const { register, handleSubmit, watch, getValues, formState: { errors, isSubmitting } } = useForm();

  const values = watch();

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const onSubmit = async (data) => {
    try {
      await jobsAPI.create({ ...data, skills });
      toast.success('Job posted successfully! 🎉');
      navigate('/employer/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Failed to post job');
    }
  };

  const stepContent = [
    /* Step 0 - Job Details */
    <div key="step0" style={s.formGrid}>
      <div style={{ gridColumn: '1/-1' }}>
        <Input label="Job Title *" name="title" placeholder="e.g. Senior React Developer" icon="💼" register={register} error={errors.title?.message} />
      </div>
      <Select label="Job Category *" name="category" register={register} options={[{ value: '', label: 'Select category' }, ...CATEGORIES.map(c => ({ value: c.label, label: `${c.icon} ${c.label}` }))]} />
      <Select label="Job Type *" name="type" register={register} options={[{ value: '', label: 'Select type' }, ...JOB_TYPES.map(t => ({ value: t, label: t }))]} />
      <Select label="Work Mode *" name="workMode" register={register} options={[{ value: '', label: 'Select mode' }, ...WORK_MODES.map(m => ({ value: m, label: m }))]} />
      <Select label="Experience Level *" name="experienceLevel" register={register} options={[{ value: '', label: 'Select level' }, ...EXPERIENCE_LEVELS.map(l => ({ value: l, label: l }))]} />
      <div style={{ gridColumn: '1/-1' }}>
        <Input label="Location" name="location" placeholder="e.g. Bangalore, Karnataka or Remote" icon="📍" register={register} />
      </div>
      <div style={{ gridColumn: '1/-1' }}>
        <Textarea label="Job Description *" name="description" placeholder="Describe the role, responsibilities, team culture..." rows={6} register={register} error={errors.description?.message} />
      </div>
    </div>,

    /* Step 1 - Requirements */
    <div key="step1" style={s.formGrid}>
      <div style={{ gridColumn: '1/-1' }}>
        <Textarea label="Key Responsibilities" name="responsibilities" placeholder="• Lead frontend development&#10;• Collaborate with design team&#10;• Code reviews" rows={5} register={register} />
      </div>
      <div style={{ gridColumn: '1/-1' }}>
        <Textarea label="Requirements" name="requirements" placeholder="• 4+ years React experience&#10;• TypeScript proficiency&#10;• Node.js knowledge" rows={5} register={register} />
      </div>
      <div style={{ gridColumn: '1/-1' }}>
        <label style={s.label}>Skills Required</label>
        <div style={s.skillsBox}>
          {skills.map(skill => (
            <span key={skill} style={s.skillTag}>
              {skill}
              <button onClick={() => setSkills(skills.filter(s => s !== skill))} style={s.skillRemove}>×</button>
            </span>
          ))}
          <input
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={addSkill}
            placeholder="Type skill and press Enter..."
            style={s.skillInput}
          />
        </div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>Press Enter to add each skill</div>
      </div>
      <div style={{ gridColumn: '1/-1' }}>
        <Textarea label="Nice to Have" name="niceToHave" placeholder="• Experience with GraphQL&#10;• Open source contributions" rows={3} register={register} />
      </div>
    </div>,

    /* Step 2 - Compensation */
    <div key="step2" style={s.formGrid}>
      <Input label="Minimum Salary (₹)" name="salaryMin" type="number" placeholder="e.g. 1200000" icon="💰" register={register} hint="Annual CTC in INR" />
      <Input label="Maximum Salary (₹)" name="salaryMax" type="number" placeholder="e.g. 2000000" icon="💰" register={register} />
      <div style={{ gridColumn: '1/-1' }}>
        <Textarea label="Benefits & Perks" name="benefits" placeholder="• Health insurance for family&#10;• 5 days work week&#10;• Remote-friendly culture&#10;• Annual performance bonus" rows={5} register={register} />
      </div>
      <div style={{ gridColumn: '1/-1' }}>
        <Input label="Application Deadline" name="deadline" type="date" icon="📅" register={register} />
      </div>
      <div style={{ gridColumn: '1/-1' }}>
        <label style={s.label}>Visibility</label>
        <div style={s.visibilityRow}>
          {[
            { value: 'public', label: '🌐 Public', desc: 'Listed on JobHive and search engines' },
            { value: 'private', label: '🔒 Private', desc: 'Only via direct link' },
          ].map(({ value, label, desc }) => (
            <label key={value} style={s.visCard}>
              <input type="radio" name="visibility" value={value} {...register('visibility')} defaultChecked={value === 'public'} style={{ accentColor: 'var(--honey)' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{label}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>,

    /* Step 3 - Preview */
    <div key="step3" style={s.preview}>
      <div style={s.previewCard}>
        <div style={s.previewHeader}>
          <div style={s.previewLogo}>TC</div>
          <div>
            <h2 style={s.previewTitle}>{values.title || 'Job Title'}</h2>
            <div style={s.previewMeta}>TechCorp India · {values.location || 'Location'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {values.type && <span style={s.previewTag}>{values.type}</span>}
          {values.workMode && <span style={s.previewTag}>{values.workMode}</span>}
          {values.experienceLevel && <span style={s.previewTag}>{values.experienceLevel}</span>}
        </div>
        <div style={s.previewDesc}>{values.description || 'Job description will appear here...'}</div>
        {skills.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <div style={s.previewSectionTitle}>Required Skills</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {skills.map(s => <span key={s} style={s.previewTag}>{s}</span>)}
            </div>
          </div>
        )}
        <div style={s.previewFooter}>
          <div style={s.previewSalary}>
            {values.salaryMin ? `₹${(values.salaryMin / 100000).toFixed(0)}L` : 'Salary'} – {values.salaryMax ? `₹${(values.salaryMax / 100000).toFixed(0)}L` : '?'}
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 400 }}> /year</span>
          </div>
        </div>
      </div>
    </div>,
  ];

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      <Navbar />
      <div style={s.layout}>
        <Sidebar role="employer" />
        <main style={s.main}>
          <div style={s.pageHeader}>
            <h1 style={s.pageTitle}>Post a New Job</h1>
            <p style={s.pageSub}>Fill in the details below to attract the best candidates</p>
          </div>

          {/* STEPS */}
          <div style={s.steps}>
            {STEPS.map((label, i) => (
              <div key={label} style={s.stepItem}>
                <div style={s.stepCircle(i <= step, i === step)}>{i < step ? '✓' : i + 1}</div>
                <span style={s.stepLabel(i === step)}>{label}</span>
                {i < STEPS.length - 1 && <div style={s.stepLine(i < step)} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={s.formCard}>
              <h2 style={s.formTitle}>{STEPS[step]}</h2>
              {stepContent[step]}
            </div>

            <div style={s.btnRow}>
              {step > 0 && (
                <Button type="button" variant="ghost" onClick={() => setStep(s => s - 1)}>← Back</Button>
              )}
              <div style={{ flex: 1 }} />
              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={() => setStep(s => s + 1)}>
                  Next: {STEPS[step + 1]} →
                </Button>
              ) : (
                <Button type="submit" size="lg" loading={isSubmitting}>
                  🚀 Publish Job Post
                </Button>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

const s = {
  layout: { display: 'flex', marginLeft: 'var(--sidebar-width)' },
  main: { flex: 1, padding: '32px 48px', minWidth: 0, maxWidth: '800px' },
  pageHeader: { marginBottom: '32px' },
  pageTitle: { fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px' },
  pageSub: { color: 'var(--muted)', fontSize: '14px', marginTop: '6px' },
  steps: { display: 'flex', alignItems: 'center', marginBottom: '32px' },
  stepItem: { display: 'flex', alignItems: 'center', flex: 1 },
  stepCircle: (done, active) => ({
    width: '32px', height: '32px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: 700, flexShrink: 0,
    background: done ? 'var(--honey)' : 'var(--dark3)',
    color: done ? 'var(--dark)' : active ? 'var(--white)' : 'var(--muted)',
    border: active && !done ? '2px solid var(--honey)' : 'none',
    transition: 'all 0.3s ease',
  }),
  stepLabel: (active) => ({ fontSize: '12px', marginLeft: '8px', color: active ? 'var(--white)' : 'var(--muted)', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }),
  stepLine: (done) => ({ flex: 1, height: '2px', background: done ? 'var(--honey)' : 'var(--border2)', margin: '0 8px', transition: 'background 0.3s ease' }),
  formCard: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '32px', marginBottom: '20px' },
  formTitle: { fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, marginBottom: '24px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' },
  label: { fontSize: '13px', fontWeight: 500, color: 'var(--muted2)', display: 'block', marginBottom: '6px' },
  skillsBox: {
    display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center',
    background: 'var(--dark3)', border: '1px solid var(--border2)',
    borderRadius: 'var(--radius-sm)', padding: '10px 14px', minHeight: '48px',
  },
  skillTag: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.3)',
    color: 'var(--honey)', borderRadius: '999px', fontSize: '12px',
    padding: '3px 10px', fontWeight: 500,
  },
  skillRemove: { background: 'none', border: 'none', color: 'var(--honey)', cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: 0 },
  skillInput: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--white)', fontSize: '13px', minWidth: '140px', fontFamily: 'DM Sans, sans-serif' },
  visibilityRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '6px' },
  visCard: {
    display: 'flex', gap: '12px', alignItems: 'flex-start',
    background: 'var(--dark3)', border: '1px solid var(--border2)',
    borderRadius: 'var(--radius-sm)', padding: '14px', cursor: 'pointer',
  },
  btnRow: { display: 'flex', gap: '12px', alignItems: 'center' },
  preview: {},
  previewCard: { background: 'var(--dark3)', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', padding: '28px' },
  previewHeader: { display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' },
  previewLogo: { width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(59,130,246,0.18)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', flexShrink: 0 },
  previewTitle: { fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700, marginBottom: '4px' },
  previewMeta: { fontSize: '13px', color: 'var(--muted)' },
  previewTag: { fontSize: '11px', padding: '3px 10px', borderRadius: '999px', background: 'rgba(59,130,246,0.12)', color: '#60A5FA', fontWeight: 500 },
  previewDesc: { fontSize: '14px', color: 'var(--muted2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' },
  previewSectionTitle: { fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' },
  previewFooter: { borderTop: '1px solid var(--border)', marginTop: '20px', paddingTop: '16px' },
  previewSalary: { fontSize: '18px', fontWeight: 700 },
};

export default PostJobPage;
