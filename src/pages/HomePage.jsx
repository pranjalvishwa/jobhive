import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import { CATEGORIES, getLogoColor, getInitials, formatSalary, timeAgo } from '../utils/helpers';
import { Badge, Button, Card, Spinner } from '../components/common';
import JobCard from '../components/jobs/JobCard';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const STATS = [
  { num: '84K+', label: 'Active Jobs' },
  { num: '12K+', label: 'Companies Hiring' },
  { num: '2.4M', label: 'Registered Users' },
  { num: '98%', label: 'Satisfaction Rate' },
];

const HERO_TAGS = ['React Developer', 'Product Manager', 'UI/UX Designer', 'Data Scientist', 'DevOps', 'ML Engineer'];

const TOP_COMPANIES = [
  { name: 'Google', jobs: 142, industry: 'Technology' },
  { name: 'Stripe', jobs: 87, industry: 'Fintech' },
  { name: 'Netflix', jobs: 64, industry: 'Media' },
  { name: 'Uber', jobs: 118, industry: 'Transport' },
  { name: 'Amazon', jobs: 200, industry: 'E-Commerce' },
  { name: 'Figma', jobs: 32, industry: 'Design Tools' },
  { name: 'Vercel', jobs: 28, industry: 'Dev Tools' },
  { name: 'Linear', jobs: 19, industry: 'Productivity' },
];

const TESTIMONIALS = [
  { name: 'Arjun Kumar', role: 'Software Engineer at Google', text: 'JobHive helped me land my dream job in 3 weeks. The AI matching is incredibly accurate!', avatar: 'AK' },
  { name: 'Priya Sharma', role: 'Product Manager at Stripe', text: 'The best job platform I\'ve used. Clean, fast, and the applications process is seamless.', avatar: 'PS' },
  { name: 'Rahul Verma', role: 'Designer at Figma', text: 'Found my perfect role through JobHive. The company profiles are so detailed and honest.', avatar: 'RV' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [hoveredCompany, setHoveredCompany] = useState(null);

  useEffect(() => {
    jobsAPI.getFeatured()
      .then(data => setFeaturedJobs(data?.jobs || MOCK_JOBS))
      .catch(() => setFeaturedJobs(MOCK_JOBS))
      .finally(() => setLoadingJobs(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?q=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroBg} />
        <div style={s.heroContent}>
          <div style={s.heroLeft}>
            <div style={s.heroTag}>
              <span style={s.heroDot} />
              12,500+ Active Jobs Posted This Week
            </div>
            <h1 style={s.h1}>
              Find Your{' '}
              <span style={s.accent}>Dream Job</span>
              <br />Faster Than Ever
            </h1>
            <p style={s.heroSub}>
              JobHive connects top talent with the world's best companies.
              Search, apply, and get hired — all in one place.
            </p>

            <form onSubmit={handleSearch} style={s.searchBar}>
              <span style={s.searchIcon}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Job title, keyword, or company..."
                style={s.searchInput}
              />
              <div style={s.searchSep} />
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                style={s.searchSelect}
              >
                <option value="">All Locations</option>
                <option>Remote</option>
                <option>Mumbai</option>
                <option>Bangalore</option>
                <option>Delhi NCR</option>
                <option>Hyderabad</option>
                <option>Pune</option>
              </select>
              <button type="submit" style={s.searchBtn}>Search Jobs</button>
            </form>

            <div style={s.heroTagsRow}>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Trending:</span>
              {HERO_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => navigate(`/jobs?q=${encodeURIComponent(tag)}`)}
                  style={s.trendTag}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div style={s.heroRight}>
            {/* Floating card 1 */}
            <div style={{ ...s.floatCard, top: 0, right: 0, animationName: 'float1' }}>
              <div style={s.fcTop}>
                <div style={{ ...s.fcLogo, background: 'rgba(59,130,246,0.18)', color: '#60A5FA' }}>G</div>
                <div>
                  <div style={s.fcCompany}>Google</div>
                  <div style={s.fcLoc}>📍 Bangalore</div>
                </div>
              </div>
              <div style={s.fcTitle}>Senior Software Engineer</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Badge color="blue">Full-time</Badge>
                <Badge color="green">Remote OK</Badge>
              </div>
              <div style={s.fcSalary}>₹45L – ₹80L/year</div>
            </div>

            {/* Floating stat card */}
            <div style={{ ...s.floatCard, top: '140px', left: 0, width: '200px', animationName: 'float2' }}>
              <div style={s.statBig}>84K+</div>
              <div style={s.statLabel}>Jobs Available</div>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ ...s.statBig, fontSize: '20px', color: '#2ECC71' }}>12K</div>
                  <div style={s.statLabel}>Hired</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ ...s.statBig, fontSize: '20px', color: '#60A5FA' }}>5K+</div>
                  <div style={s.statLabel}>Companies</div>
                </div>
              </div>
            </div>

            {/* Floating card 2 */}
            <div style={{ ...s.floatCard, bottom: '20px', right: '20px', animationName: 'float3' }}>
              <div style={s.fcTop}>
                <div style={{ ...s.fcLogo, background: 'rgba(245,166,35,0.18)', color: 'var(--honey)' }}>S</div>
                <div>
                  <div style={s.fcCompany}>Stripe</div>
                  <div style={s.fcLoc}>📍 Remote</div>
                </div>
              </div>
              <div style={s.fcTitle}>Product Designer</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Badge color="honey">Contract</Badge>
                <Badge color="green">Remote</Badge>
              </div>
              <div style={s.fcSalary}>$120K/year</div>
            </div>

            <style>{`
              @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
              @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }
              @keyframes float3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
            `}</style>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={s.statsBar}>
        {STATS.map(({ num, label }) => (
          <div key={label} style={s.statItem}>
            <div style={s.statNum}>{num}</div>
            <div style={s.statLabel2}>{label}</div>
          </div>
        ))}
      </div>

      {/* CATEGORIES */}
      <section style={s.section}>
        <div style={s.sectionHead}>
          <div>
            <h2 style={s.sectionTitle}>Browse by Category</h2>
            <p style={s.sectionSub}>Explore opportunities across industries</p>
          </div>
          <Link to="/jobs" style={s.seeAll}>View all categories →</Link>
        </div>
        <div style={s.catGrid}>
          {CATEGORIES.map(({ label, icon, count }) => (
            <div
              key={label}
              onClick={() => navigate(`/jobs?category=${encodeURIComponent(label)}`)}
              style={s.catCard}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,166,35,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={s.catIcon}>{icon}</div>
              <div>
                <div style={s.catName}>{label}</div>
                <div style={s.catCount}>{count} jobs</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section style={{ ...s.section, paddingTop: 0 }}>
        <div style={s.sectionHead}>
          <div>
            <h2 style={s.sectionTitle}>Featured Jobs</h2>
            <p style={s.sectionSub}>Hand-picked opportunities just for you</p>
          </div>
          <Link to="/jobs" style={s.seeAll}>See all jobs →</Link>
        </div>
        {loadingJobs ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <Spinner size={32} />
          </div>
        ) : (
          <div style={s.jobGrid}>
            {featuredJobs.slice(0, 6).map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Button onClick={() => navigate('/jobs')} size="lg">
            Explore All Jobs →
          </Button>
        </div>
      </section>

      {/* TOP COMPANIES */}
      <section style={{ ...s.section, paddingTop: 0 }}>
        <div style={s.sectionHead}>
          <div>
            <h2 style={s.sectionTitle}>Top Companies Hiring</h2>
            <p style={s.sectionSub}>Work with the best in the business</p>
          </div>
          <Link to="/companies" style={s.seeAll}>All companies →</Link>
        </div>
        <div style={s.companyGrid}>
          {TOP_COMPANIES.map((company) => {
            const lc = getLogoColor(company.name);
            return (
              <div
                key={company.name}
                style={s.companyCard}
                onMouseEnter={e => {
                  setHoveredCompany(company.name);
                  e.currentTarget.style.borderColor = 'rgba(245,166,35,0.3)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  setHoveredCompany(null);
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ ...s.companyLogo, background: lc.bg, color: lc.color }}>
                  {company.name[0]}
                </div>
                <div style={s.companyName}>{company.name}</div>
                <div style={s.companyJobs}>{company.jobs} open roles</div>
                <div style={s.companyIndustry}>{company.industry}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ ...s.section, paddingTop: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={s.sectionTitle}>Loved by Professionals</h2>
          <p style={s.sectionSub}>Join millions who found their dream jobs through JobHive</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {TESTIMONIALS.map(({ name, role, text, avatar }) => {
            const lc = getLogoColor(name);
            return (
              <div key={name} style={s.testimonial}>
                <div style={s.quote}>"</div>
                <p style={s.testimonialText}>{text}</p>
                <div style={s.testimonialAuthor}>
                  <div style={{ ...s.testimonialAvatar, background: lc.bg, color: lc.color }}>{avatar}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{role}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={s.cta}>
        <div style={s.ctaGlow} />
        <h2 style={s.ctaTitle}>Ready to Start Your<br />Career Journey? 🐝</h2>
        <p style={s.ctaSub}>Join 2.4M+ professionals already using JobHive. Free to sign up, always.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Button onClick={() => navigate('/register')} size="lg">Get Started Free →</Button>
          <Button onClick={() => navigate('/employer/register')} variant="outline" size="lg">Post a Job</Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Fallback mock jobs
const MOCK_JOBS = Array.from({ length: 6 }, (_, i) => ({
  _id: `mock-${i}`,
  title: ['Senior Frontend Engineer', 'Product Designer', 'Data Scientist', 'ML Engineer', 'DevOps Engineer', 'Full-Stack Developer'][i],
  companyName: ['Google', 'Stripe', 'Uber', 'Netflix', 'Amazon', 'Flipkart'][i],
  location: ['Bangalore', 'Remote', 'Mumbai', 'Remote', 'Hyderabad', 'Delhi'][i],
  type: ['Full-time', 'Contract', 'Full-time', 'Full-time', 'Full-time', 'Hybrid'][i],
  workMode: ['Remote', 'Remote', 'On-site', 'Remote', 'Hybrid', 'Hybrid'][i],
  salaryMin: [6000000, 10000000, 4500000, 15000000, 5500000, 3000000][i],
  salaryMax: [9000000, 14000000, 7000000, 20000000, 8500000, 5000000][i],
  skills: [['React', 'TypeScript'], ['Figma', 'UX'], ['Python', 'ML'], ['TensorFlow'], ['AWS', 'K8s'], ['Node.js']][i],
  experienceLevel: ['Senior', 'Mid Level', 'Senior', 'Senior', 'Mid Level', 'Mid Level'][i],
  createdAt: new Date(Date.now() - [2, 1, 3, 0.2, 1, 6][i] * 86400000).toISOString(),
}));

const s = {
  hero: {
    position: 'relative', overflow: 'hidden',
    padding: '80px 48px 60px',
    background: 'var(--dark)',
  },
  heroBg: {
    position: 'absolute', top: '-200px', right: '-100px',
    width: '600px', height: '600px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 65%)',
    pointerEvents: 'none',
  },
  heroContent: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '60px', alignItems: 'center',
    maxWidth: '1300px', margin: '0 auto', position: 'relative',
  },
  heroLeft: {},
  heroTag: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)',
    color: 'var(--honey)', fontSize: '12px', fontWeight: 500,
    padding: '6px 14px', borderRadius: '999px', marginBottom: '24px',
  },
  heroDot: {
    width: '7px', height: '7px', borderRadius: '50%',
    background: 'var(--honey)', animation: 'pulse 1.5s infinite',
    display: 'inline-block',
  },
  h1: {
    fontFamily: 'var(--font-display)', fontSize: '58px',
    fontWeight: 700, lineHeight: 1.05, letterSpacing: '-2.5px',
    marginBottom: '20px',
  },
  accent: { color: 'var(--honey)' },
  heroSub: { color: 'var(--muted)', fontSize: '16px', lineHeight: 1.7, marginBottom: '36px', maxWidth: '480px' },
  searchBar: {
    display: 'flex', alignItems: 'center',
    background: 'var(--dark2)', border: '1px solid var(--border2)',
    borderRadius: 'var(--radius)', padding: '6px 6px 6px 16px',
    marginBottom: '16px', gap: '8px',
  },
  searchIcon: { fontSize: '16px', flexShrink: 0 },
  searchInput: {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: 'var(--white)', fontSize: '14px', fontFamily: 'var(--font-body)',
    minWidth: 0,
  },
  searchSep: { width: '1px', height: '28px', background: 'var(--border2)', flexShrink: 0 },
  searchSelect: {
    background: 'transparent', border: 'none', outline: 'none',
    color: 'var(--muted)', fontSize: '13px', fontFamily: 'var(--font-body)',
    cursor: 'pointer', flexShrink: 0,
  },
  searchBtn: {
    background: 'var(--honey)', border: 'none', color: 'var(--dark)',
    padding: '10px 22px', borderRadius: 'var(--radius-sm)',
    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
    fontFamily: 'var(--font-body)', flexShrink: 0,
  },
  heroTagsRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' },
  trendTag: {
    background: 'var(--dark3)', border: '1px solid var(--border)',
    color: 'var(--muted2)', fontSize: '11px', padding: '5px 12px',
    borderRadius: '999px', cursor: 'pointer',
    fontFamily: 'var(--font-body)', transition: 'all var(--transition)',
  },
  heroRight: { position: 'relative', height: '420px' },
  floatCard: {
    position: 'absolute', background: 'var(--card2)',
    border: '1px solid var(--border2)', borderRadius: 'var(--radius)',
    padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px',
    width: '270px', animationDuration: '4s', animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite', boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  fcTop: { display: 'flex', alignItems: 'center', gap: '10px' },
  fcLogo: { width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px' },
  fcCompany: { fontSize: '13px', fontWeight: 600 },
  fcLoc: { fontSize: '11px', color: 'var(--muted)' },
  fcTitle: { fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700 },
  fcSalary: { fontSize: '12px', color: 'var(--honey)', fontWeight: 600 },
  statBig: { fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--honey)', textAlign: 'center' },
  statLabel: { fontSize: '11px', color: 'var(--muted)', textAlign: 'center' },
  statsBar: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
    background: 'var(--dark2)',
  },
  statItem: {
    padding: '32px 48px', borderRight: '1px solid var(--border)',
    '&:lastChild': { borderRight: 'none' },
  },
  statNum: { fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700, color: 'var(--honey)' },
  statLabel2: { fontSize: '13px', color: 'var(--muted)', marginTop: '4px' },
  section: { padding: '80px 48px', maxWidth: '1400px', margin: '0 auto' },
  sectionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, letterSpacing: '-1px' },
  sectionSub: { color: 'var(--muted)', fontSize: '14px', marginTop: '6px' },
  seeAll: { color: 'var(--honey)', fontSize: '13px', borderBottom: '1px solid rgba(245,166,35,0.3)', paddingBottom: '2px' },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' },
  catCard: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '20px',
    display: 'flex', alignItems: 'center', gap: '14px',
    cursor: 'pointer', transition: 'all var(--transition)',
  },
  catIcon: { fontSize: '26px', lineHeight: 1 },
  catName: { fontSize: '14px', fontWeight: 600, marginBottom: '3px' },
  catCount: { fontSize: '11px', color: 'var(--muted)' },
  jobGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  companyGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' },
  companyCard: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '28px 20px',
    textAlign: 'center', cursor: 'pointer', transition: 'all var(--transition)',
  },
  companyLogo: {
    width: '56px', height: '56px', borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', fontWeight: 700, margin: '0 auto 14px',
  },
  companyName: { fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, marginBottom: '4px' },
  companyJobs: { fontSize: '12px', color: 'var(--honey)', marginBottom: '4px' },
  companyIndustry: { fontSize: '11px', color: 'var(--muted)' },
  testimonial: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '28px',
    display: 'flex', flexDirection: 'column', gap: '16px',
  },
  quote: { fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--honey)', lineHeight: 0.8 },
  testimonialText: { color: 'var(--muted2)', fontSize: '14px', lineHeight: 1.7, flex: 1 },
  testimonialAuthor: { display: 'flex', alignItems: 'center', gap: '12px' },
  testimonialAvatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: 700, flexShrink: 0,
  },
  cta: {
    margin: '0 48px 80px',
    background: 'linear-gradient(135deg, #1A1500 0%, #2A1F00 50%, #1A1500 100%)',
    border: '1px solid rgba(245,166,35,0.2)',
    borderRadius: 'var(--radius-xl)', padding: '80px 48px',
    textAlign: 'center', position: 'relative', overflow: 'hidden',
  },
  ctaGlow: {
    position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
    width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245,166,35,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  ctaTitle: { fontFamily: 'var(--font-display)', fontSize: '44px', fontWeight: 700, letterSpacing: '-1.5px', marginBottom: '16px', position: 'relative' },
  ctaSub: { color: 'var(--muted)', fontSize: '16px', marginBottom: '36px', position: 'relative' },
};

export default HomePage;
