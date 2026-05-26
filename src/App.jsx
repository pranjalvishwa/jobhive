import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import SeekerDashboard from './pages/SeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PostJobPage from './pages/PostJobPage';

import './styles/globals.css';

/* ── Protected Route ── */
const Protected = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0F0E0C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🐝</div>
        <div style={{ color: '#F5A623', fontSize: '14px' }}>Loading JobHive...</div>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

/* ── Auth Route (redirect if already logged in) ── */
const AuthRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'employer') return <Navigate to="/employer/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<HomePage />} />
    <Route path="/jobs" element={<JobsPage />} />
    <Route path="/jobs/:id" element={<JobDetailPage />} />

    {/* Auth */}
    <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
    <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />

    {/* Job Seeker */}
    <Route path="/dashboard" element={<Protected roles={['seeker']}><SeekerDashboard /></Protected>} />
    <Route path="/dashboard/*" element={<Protected roles={['seeker']}><SeekerDashboard /></Protected>} />

    {/* Employer */}
    <Route path="/employer/dashboard" element={<Protected roles={['employer']}><EmployerDashboard /></Protected>} />
    <Route path="/employer/post-job" element={<Protected roles={['employer']}><PostJobPage /></Protected>} />

    {/* Admin */}
    <Route path="/admin/dashboard" element={<Protected roles={['admin']}><AdminDashboard /></Protected>} />

    {/* Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const NotFound = () => (
  <div style={{ minHeight: '100vh', background: '#0F0E0C', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
    <div style={{ fontSize: '64px' }}>🐝</div>
    <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '48px', fontWeight: 800, color: '#F5A623' }}>404</h1>
    <p style={{ color: '#8A8880', fontSize: '16px' }}>This page doesn't exist in the hive.</p>
    <a href="/" style={{ background: '#F5A623', color: '#0F0E0C', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
      Back to Home →
    </a>
  </div>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1E1C19',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            fontSize: '13px',
            fontFamily: 'DM Sans, sans-serif',
          },
          success: { iconTheme: { primary: '#F5A623', secondary: '#0F0E0C' } },
        }}
      />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
