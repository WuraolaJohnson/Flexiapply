import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import mockApi from '../api/mockApi';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function AdminDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    fetchApps();
  }, [user, navigate, authLoading]);

  const fetchApps = async () => {
    try {
      const response = await mockApi.get('/applications');
      const sorted = response.data.sort((a, b) => (b.admissionScore || 0) - (a.admissionScore || 0));
      setApplications(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setProcessingId(id);
    try {
      await mockApi.patch(`/applications/${id}`, { status: newStatus });
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (authLoading || loading) return <div className="p-8 text-center text-slate-500">Loading admin data...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Admin Dashboard</h2>
          <p className="text-slate-600 dark:text-slate-400">Review and manage admissions</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>Log Out</Button>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-300">
              <tr>
                <th className="px-6 py-4">App ID</th>
                <th className="px-6 py-4">Applicant Name</th>
                <th className="px-6 py-4">GPA</th>
                <th className="px-6 py-4">AI Score</th>
                <th className="px-6 py-4">Likelihood</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No applications received yet.</td>
                </tr>
              ) : (
                applications.map(app => (
                  <tr key={app.id} className="border-b dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium dark:text-slate-300">{app.id}</td>
                    <td className="px-6 py-4 dark:text-slate-300">{app.personal.firstName} {app.personal.lastName}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{app.academic.gpa}</td>
                    <td className="px-6 py-4 font-medium text-primary-dark dark:text-primary-light">{app.admissionScore || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        app.acceptanceLikelihood === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                        app.acceptanceLikelihood === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                      }`}>
                        {app.acceptanceLikelihood || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 dark:text-slate-300">{new Date(app.submittedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        app.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:border-green-800/50 dark:text-green-400' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-400' :
                        'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800/50 dark:text-yellow-400'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {app.status === 'Pending' ? (
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(app.id, 'Rejected')} disabled={processingId === app.id}>Reject</Button>
                          <Button size="sm" onClick={() => handleStatusUpdate(app.id, 'Approved')} disabled={processingId === app.id}>Approve</Button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs uppercase tracking-wider">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
