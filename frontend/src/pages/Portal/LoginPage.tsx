import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, KeyRound, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../../config';


export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await res.json();
      
      if (data.require_otp) {
        setStep('otp');
        setIsLoading(false);
        return;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp_code: otp }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Invalid or expired OTP');
      }

      const data = await res.json();
      const token = data.access_token;

      // Fetch user profile
      const userRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (userRes.ok) {
        const userData = await userRes.json();
        login(token, {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          role: userData.account_type,
        });
        
        if (userData.account_type === 'internal_admin') {
          navigate('/admin');
        } else {
          navigate('/portal');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during OTP verification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop py-12 flex justify-center items-center min-h-[calc(100vh-100px)] animate-fade-in">
      <div className="neo-extruded bg-surface p-8 md:p-12 rounded-[40px] w-full max-w-md">
        {step === 'login' ? (
          <div className="flex flex-col items-center mb-8">
            <div className="neo-recessed p-4 rounded-2xl bg-surface-container-low mb-6">
              <LogIn size={32} className="text-secondary" />
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">Welcome Back</h1>
            <p className="text-on-surface-variant font-body-md text-body-md text-center">
              Enter your credentials to access your account.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center mb-8 relative">
            <button 
              onClick={() => { setStep('login'); setOtp(''); setError(''); }}
              className="absolute left-0 top-2 text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label="Back to login"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="neo-recessed p-4 rounded-2xl bg-surface-container-low mb-6">
              <KeyRound size={32} className="text-secondary" />
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">Two-Factor Auth</h1>
            <p className="text-on-surface-variant font-body-md text-body-md text-center">
              Enter the 6-digit code sent to your email.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-6 text-center font-body-md text-body-md font-medium">
            {error}
          </div>
        )}

        {step === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-label-md text-label-sm text-on-surface-variant uppercase tracking-widest">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="neo-recessed bg-surface w-full p-4 rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-label-md text-label-sm text-on-surface-variant uppercase tracking-widest">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="neo-recessed bg-surface w-full p-4 rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
              />
            </div>
            
            <button 
              type="submit" 
              className="neo-extruded-sm neo-interactive w-full py-4 mt-2 rounded-xl bg-on-surface text-surface font-label-md font-bold"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="otp" className="font-label-md text-label-sm text-on-surface-variant uppercase tracking-widest text-center">6-Digit Code</label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                required
                className="neo-recessed bg-surface w-full p-4 rounded-xl font-headline-xl text-on-surface text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
              />
            </div>
            
            <button 
              type="submit" 
              className="neo-extruded-sm neo-interactive w-full py-4 mt-2 rounded-xl bg-on-surface text-surface font-label-md font-bold"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}
        <p className="mt-8 text-center text-on-surface-variant font-body-md text-body-md">
          Don't have an account? <Link to="/portal/signup" className="text-secondary font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </main>
  );
};
