import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import IntroAnimation from './components/IntroAnimation';
import ThemeToggle from './components/ThemeToggle';
import ApplicationForm from './pages/ApplicationForm';
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelection';
import LandingPage from './pages/LandingPage';
import InstitutionDetails from './pages/InstitutionDetails';
import ApplicantDashboard from './pages/ApplicantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { ApplicationProvider } from './context/ApplicationContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Button from './components/ui/Button';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isAdminSession = location.pathname.includes('admin');
  const isApplicantSession = location.pathname.includes('apply') || location.pathname.includes('applicant');
  const isHome = location.pathname === '/';
  
  const portalName = "FlexiApply";
  
  return (
    <header className="flex justify-between items-center mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all">
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary-dark to-slate-900 flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
          S
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            {portalName}
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Applicant Portal</span>
        </div>
      </Link>
      
      <div className="flex items-center gap-3 md:gap-6">
        <nav className="hidden md:flex items-center gap-6 mr-6">
          <Link to="/" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Find Programs</Link>
          {!isAdminSession && (
            <Link to="/login?role=admin" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Admin Portal</Link>
          )}
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            <Link 
              to={user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/applicant'}
              className="text-sm font-bold px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            >
              Dashboard
            </Link>
            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <Link to="/login">
            <Button size="sm" className="font-bold">Sign In</Button>
          </Link>
        )}
        
        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 md:block hidden" />
        <ThemeToggle />
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ApplicationProvider>
          <IntroAnimation>
            <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/institution/:id" element={<InstitutionDetails />} />
                  <Route path="/portal-selection" element={<RoleSelection />} />
                  <Route path="/apply" element={<ApplicationForm />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard/applicant" element={<ApplicantDashboard />} />
                  <Route path="/dashboard/admin" element={<AdminDashboard />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <footer className="mt-20 py-12 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="flex justify-center gap-6 mb-4">
                  <Link to="/" className="text-sm text-slate-500 hover:text-primary">Home</Link>
                  <Link to="/portal-selection" className="text-sm text-slate-500 hover:text-primary">Portals</Link>
                  <Link to="/login?role=admin" className="text-sm text-slate-500 hover:text-primary">Admin</Link>
                </div>
                <p className="text-sm text-slate-400">
                  &copy; {new Date().getFullYear()} FlexiApply. Powering the future of admissions.
                </p>
              </footer>
            </div>
          </IntroAnimation>
        </ApplicationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
