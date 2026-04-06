import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, signupAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isAdminLogin = searchParams.get('role') === 'admin';
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setAuthError('');
    setLoading(true);
    try {
      if (isAdminLogin && isSignUp) {
        if (data.password !== data.confirmPassword) {
          throw new Error("Passwords do not match. Please try again.");
        }
        await signupAdmin(data.name || 'New Admin', data.email, data.password);
        navigate('/dashboard/admin');
      } else {
        const { role } = await login(data.email, data.password);
        
        if (isAdminLogin && role !== 'ADMIN') {
          throw new Error("You are attempting to log in to the admin portal with student credentials.");
        }
        
        if (!isAdminLogin && role === 'ADMIN') {
          throw new Error("You are attempting to log in to the student portal with admin credentials.");
        }

        if (role === 'ADMIN') {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard/applicant');
        }
      }
    } catch (err) {
      setAuthError(err.message || err || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-slate-800 dark:text-slate-100">
            {isAdminLogin ? (isSignUp ? "Register as Admin" : "Admin Login") : "Admissions Portal Login"}
          </CardTitle>
          <p className="text-sm text-center text-slate-500 mt-2">
            {isAdminLogin ? (
              isSignUp ? <>Create a new administrator account securely.</> : <>Use an email containing <strong>admin</strong> and any password for Admin access.</>
            ) : (
              <>Try any email and password <strong>password123</strong>. Use an email containing <strong>admin</strong> for Admin access.</>
            )}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isAdminLogin && isSignUp && (
              <Input 
                label="Full Name" 
                type="text" 
                {...register('name', { required: 'Name is required' })} 
                error={errors.name?.message} 
              />
            )}
            <Input 
              label="Email Address" 
              type="email" 
              {...register('email', { required: 'Email is required' })} 
              error={errors.email?.message} 
            />
            <Input 
              label="Password" 
              type="password" 
              {...register('password', { required: 'Password is required' })} 
              error={errors.password?.message} 
            />
            {isAdminLogin && isSignUp && (
              <Input 
                label="Confirm Password" 
                type="password" 
                {...register('confirmPassword', { required: 'Please confirm your password' })} 
                error={errors.confirmPassword?.message} 
              />
            )}
            {authError && <div className="text-sm text-red-500 font-medium bg-red-50 dark:bg-red-900/20 p-2 border border-red-100 dark:border-red-900/30 rounded">{authError}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Authenticating...' : (isSignUp ? 'Create Admin Account' : 'Sign In')}
            </Button>
            
            <div className="mt-4 text-center border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col gap-3">
              {isAdminLogin && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {isSignUp ? "Already have an admin account?" : "Need admin access?"}
                  </p>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ? "Sign In instead" : "Register as Admin"}
                  </Button>
                </div>
              )}
              
              <div className="pt-2">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {isAdminLogin ? "Not an admin?" : "Don't have an application yet?"}
                </p>
                <Button type="button" variant="ghost" className="w-full border shadow-sm border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50" onClick={() => navigate(isAdminLogin ? '/login' : '/apply')}>
                  {isAdminLogin ? "Switch to Student Login" : "Start New Application"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
