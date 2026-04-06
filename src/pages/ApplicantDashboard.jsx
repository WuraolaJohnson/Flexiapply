import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import mockApi from '../api/mockApi';
import { Card, CardContent } from '../components/ui/Card';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import SuccessAnimation from '../components/ui/SuccessAnimation';

export default function ApplicantDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchApps = async () => {
      try {
        const response = await mockApi.get('/applications');
        const myApps = response.data.filter(app => app.userId === user.email);
        setApplications(myApps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [user, navigate, authLoading]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (authLoading || loading) return <div className="p-8 text-center text-slate-500">Loading your applications...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome, {user?.name}</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage your admission applications</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>Log Out</Button>
      </div>

      {location.state?.success && (
        <SuccessAnimation />
      )}

      {applications.length === 0 ? (
        <Card className="text-center p-12">
          <CardContent>
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">No active applications found.</h3>
            <Button onClick={() => navigate('/apply')}>Start New Application</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {applications.map(app => (
            <Card key={app.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-1">Application ID: {app.id}</div>
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-primary">
                      {app.personal.firstName} {app.personal.lastName}
                    </h3>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                    </div>
                    {app.admissionScore !== undefined && (
                      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">AI Predictor</div>
                        <div className="flex gap-4">
                          <div className="text-sm">
                            <span className="text-slate-500">Score: </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{app.admissionScore}/100</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-slate-500">Likelihood: </span>
                            <span className={`font-semibold ${
                              app.acceptanceLikelihood === 'High' ? 'text-green-600 dark:text-green-400' :
                              app.acceptanceLikelihood === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>{app.acceptanceLikelihood}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
                    app.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:border-green-800/50 dark:text-green-400' :
                    app.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-400' :
                    'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800/50 dark:text-yellow-400'
                  }`}>
                    {app.status}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-center mt-6">
            <Button onClick={() => navigate('/apply')} variant="outline">Start Another Application</Button>
          </div>
        </div>
      )}
    </div>
  );
}
