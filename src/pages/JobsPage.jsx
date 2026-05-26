import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import { CATEGORIES, JOB_TYPES, WORK_MODES, EXPERIENCE_LEVELS, debounce } from '../utils/helpers';
import { Button, Badge, Spinner, EmptyState } from '../components/common';
import JobCard from '../components/jobs/JobCard';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'salary_desc', label: 'Highest Salary' },
  { value: 'salary_asc', label: 'Lowest Salary' },
  { value: 'relevance', label: 'Most Relevant' },
];

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(84000);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    type: '',
    workMode: '',
    experience: '',
    salaryMin: '',
    sort: 'newest',
  });

  const fetchJobs = useCallback(
    debounce(async (params) => {
      setLoading(true);
      try {
        const data = await jobsAPI.getAll({ ...params, page });
        setJobs(data?.jobs || MOCK_JOBS);
        setTotal(data?.total || MOCK_JOBS.length);
      } catch {
        setJobs(MOCK_JOBS);
      } finally {
        setLoading(false);
      }
    }, 400),
    [page]
  );

  useEffect(() => {
    fetchJobs({ q: search, location, ...filters });
  }, [search, location, filters, page]);

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: f[key] === val ? '' : val }));
  const clearFilters = () => {
    setFilters({ category: '', type: '', workMode: '', experience: '', salaryMin: '', sort: 'newest' });
    setSearch('');
    setLocation('');
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'newest').length +
    (search ? 1 : 0) + (location ? 1 : 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--dark)' }}>
      <Navbar />

      {/* SEARCH HEADER */}
      <div style={s.searchHeader}>
        <div style={s.searchBar}>
          <span>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Job title, keyword, or company..."
            style={s.searchInput}
          />
          <div style={s.sep} />
          <span>📍</span>
          <input
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Location or Remote"
            style={{ ...s.searchInput, maxWidth: '180px' }}
          />
          <button style={s.searchBtn}>Search</button>
        </div>
      </div>

      <div style={s.layout}>
        {/* SIDEBAR FILTERS */}
        <aside style={s.filterSidebar}>
          <div style={s.filterHeader}>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>Filters</span>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} style={s.clearBtn}>
                Clear all ({activeFiltersCount})
              </button>
            )}
          </div>

          <FilterSection title="Sort By">
            {SORT_OPTIONS.map(({ value, label }) => (
              <label key={value} style={s.radioLabel}>
                <input
                  type="radio" name="sort" value={value}
                  checked={filters.sort === value}
                  onChange={() => setFilter('sort', value)}
                  style={{ accentColor: 'var(--honey)' }}
                />
                {label}
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Job Type">
            {JOB_TYPES.map(t => (
              <label key={t} style={s.checkLabel}>
                <input
                  type="checkbox" checked={filters.type === t}
                  onChange={() => setFilter('type', t)}
                  style={{ accentColor: 'var(--honey)' }}
                />
                {t}
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Work Mode">
            {WORK_MODES.map(m => (
              <label key={m} style={s.checkLabel}>
                <input
                  type="checkbox" checked={filters.workMode === m}
                  onChange={() => setFilter('workMode', m)}
                  style={{ accentColor: 'var(--honey)' }}
                />
                {m}
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Experience Level">
            {EXPERIENCE_LEVELS.map(l => (
              <label key={l} style={s.checkLabel}>
                <input
                  type="checkbox" checked={filters.experience === l}
                  onChange={() => setFilter('experience', l)}
                  style={{ accentColor: 'var(--honey)' }}
                />
                {l}
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Category">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {CATEGORIES.map(({ label }) => (
                <button
                  key={label}
                  onClick={() => setFilter('category', label)}
                  style={s.catFilterBtn(filters.category === label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </FilterSection>
        </aside>

        {/* JOBS LIST */}
        <main style={s.main}>
          <div style={s.mainHeader}>
            <div>
              <h1 style={s.mainTitle}>
                {search ? `"${search}"` : 'All Jobs'}
              </h1>
              <p style={s.mainSub}>
                {loading ? 'Searching...' : `${total.toLocaleString()} jobs found`}
                {location && ` in ${location}`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {activeFiltersCount > 0 && (
                <Badge color="honey">{activeFiltersCount} filters</Badge>
              )}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
              <Spinner size={36} />
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No jobs found"
              message="Try adjusting your filters or search terms"
              action={<Button onClick={clearFilters} variant="ghost">Clear Filters</Button>}
            />
          ) : (
            <>
              <div style={s.jobGrid}>
                {jobs.map(job => <JobCard key={job._id} job={job} />)}
              </div>
              <div style={s.pagination}>
                {[1, 2, 3, '...', 12].map((p, i) => (
                  <button
                    key={i}
                    onClick={() => typeof p === 'number' && setPage(p)}
                    style={s.pageBtn(page === p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

const FilterSection = ({ title, children }) => (
  <div style={{ marginBottom: '24px' }}>
    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', fontWeight: 500, marginBottom: '12px' }}>
      {title}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {children}
    </div>
  </div>
);

const MOCK_JOBS = Array.from({ length: 12 }, (_, i) => ({
  _id: `job-${i}`,
  title: ['Senior React Developer', 'Product Designer', 'Data Scientist', 'DevOps Engineer', 'ML Engineer', 'Backend Developer', 'Full-Stack Dev', 'UX Researcher', 'Product Manager', 'Tech Lead', 'Cloud Architect', 'Mobile Developer'][i],
  companyName: ['Google', 'Stripe', 'Uber', 'Netflix', 'Amazon', 'Flipkart', 'Razorpay', 'CRED', 'Meesho', 'Swiggy', 'Zepto', 'PhonePe'][i],
  location: ['Bangalore', 'Remote', 'Mumbai', 'Remote', 'Hyderabad', 'Delhi', 'Bangalore', 'Bangalore', 'Remote', 'Mumbai', 'Bangalore', 'Pune'][i],
  type: ['Full-time', 'Contract', 'Full-time', 'Full-time', 'Full-time', 'Full-time', 'Hybrid', 'Remote', 'Full-time', 'Full-time', 'Contract', 'Full-time'][i],
  workMode: ['Remote', 'Remote', 'On-site', 'Remote', 'Hybrid', 'On-site', 'Hybrid', 'Remote', 'Remote', 'On-site', 'Remote', 'Hybrid'][i],
  salaryMin: [6000000, 10000000, 4500000, 5500000, 15000000, 3000000, 4000000, 3500000, 8000000, 7000000, 9000000, 3000000][i],
  salaryMax: [9000000, 14000000, 7000000, 8500000, 20000000, 5000000, 6000000, 5500000, 12000000, 10000000, 13000000, 5000000][i],
  skills: [['React', 'TypeScript'], ['Figma', 'UX'], ['Python', 'ML'], ['AWS', 'K8s'], ['TensorFlow'], ['Node.js', 'Go'], ['React', 'Node'], ['Figma'], ['Strategy'], ['React', 'Node'], ['AWS', 'Azure'], ['Flutter', 'Swift']][i],
  experienceLevel: ['Senior', 'Mid Level', 'Senior', 'Mid Level', 'Senior', 'Mid Level', 'Mid Level', 'Mid Level', 'Senior', 'Lead', 'Lead', 'Mid Level'][i],
  createdAt: new Date(Date.now() - i * 86400000 * 0.5).toISOString(),
}));

const s = {
  searchHeader: {
    background: 'var(--dark2)', borderBottom: '1px solid var(--border)',
    padding: '20px 48px',
  },
  searchBar: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'var(--dark3)', border: '1px solid var(--border2)',
    borderRadius: 'var(--radius)', padding: '8px 8px 8px 18px',
    maxWidth: '900px',
  },
  searchInput: {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: 'var(--white)', fontSize: '14px', fontFamily: 'var(--font-body)',
    minWidth: 0,
  },
  sep: { width: '1px', height: '24px', background: 'var(--border2)', flexShrink: 0 },
  searchBtn: {
    background: 'var(--honey)', border: 'none', color: 'var(--dark)',
    padding: '9px 22px', borderRadius: 'var(--radius-sm)',
    fontSize: '13px', fontWeight: 700, cursor: 'pointer', flexShrink: 0,
    fontFamily: 'var(--font-body)',
  },
  layout: { display: 'grid', gridTemplateColumns: '260px 1fr', flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 48px' },
  filterSidebar: {
    padding: '28px 0 28px 0', borderRight: '1px solid var(--border)',
    paddingRight: '28px', marginTop: '28px',
  },
  filterHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  clearBtn: { background: 'none', border: 'none', color: 'var(--honey)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)' },
  radioLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--muted2)', cursor: 'pointer' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--muted2)', cursor: 'pointer' },
  catFilterBtn: (active) => ({
    textAlign: 'left', background: active ? 'rgba(245,166,35,0.1)' : 'transparent',
    border: active ? '1px solid rgba(245,166,35,0.3)' : '1px solid transparent',
    borderRadius: 'var(--radius-sm)', color: active ? 'var(--honey)' : 'var(--muted2)',
    fontSize: '12px', padding: '6px 10px', cursor: 'pointer', fontFamily: 'var(--font-body)',
    transition: 'all var(--transition)',
  }),
  main: { padding: '28px 0 28px 32px' },
  mainHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  mainTitle: { fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' },
  mainSub: { color: 'var(--muted)', fontSize: '13px', marginTop: '4px' },
  jobGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '32px' },
  pagination: { display: 'flex', gap: '8px', justifyContent: 'center' },
  pageBtn: (active) => ({
    width: '36px', height: '36px',
    background: active ? 'var(--honey)' : 'var(--dark3)',
    border: `1px solid ${active ? 'var(--honey)' : 'var(--border2)'}`,
    borderRadius: 'var(--radius-sm)', color: active ? 'var(--dark)' : 'var(--muted2)',
    fontSize: '13px', fontWeight: active ? 700 : 400, cursor: 'pointer',
    fontFamily: 'var(--font-body)', transition: 'all var(--transition)',
  }),
};

export default JobsPage;
