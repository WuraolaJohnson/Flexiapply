import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-dark via-primary to-primary-light">
            Welcome to Admissions
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Please select how you would like to proceed. Are you a prospective student looking to apply or an administrator managing applications?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student Card */}
          <Card 
            className="group hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-8 flex flex-col items-center text-center relative z-10 h-full">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
                Student Portal
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 flex-grow">
                Start a new application or log in to view the status of your existing application.
              </p>
              <div className="mt-auto flex flex-col w-full gap-3 pt-4">
                <Button className="w-full" onClick={() => navigate('/apply')}>
                  Start New Application
                </Button>
                <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 text-primary" onClick={() => navigate('/login?role=student')}>
                  Login to View Status
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Card */}
          <Card 
            className="group hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-xl transition-all duration-300 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 to-transparent dark:from-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-8 flex flex-col items-center text-center relative z-10 h-full">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100 transition-colors">
                Admin Portal
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 flex-grow">
                Log in to review applications, manage admissions, and oversee applicant statuses.
              </p>
              <div className="mt-auto flex flex-col w-full gap-3 pt-4">
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900" onClick={() => navigate('/login?role=admin')}>
                  Admin Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
