import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus } from 'lucide-react';
import { API_BASE_URL } from '../../config';


export const SignupPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Register User
      const registerRes = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName || undefined,
          company_name: companyName || undefined,
          email,
          password
        }),
      });

      if (!registerRes.ok) {
        const errData = await registerRes.json();
        throw new Error(errData.detail || 'Registration failed');
      }

      // 2. Auto Login after Registration
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!loginRes.ok) throw new Error('Auto-login failed. Please login manually.');

      const loginData = await loginRes.json();
      const token = loginData.access_token;

      // 3. Fetch user profile
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
        navigate('/portal');
      }

    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop py-12 flex justify-center items-center min-h-[calc(100vh-100px)] animate-fade-in">
      <div className="neo-extruded bg-surface p-8 md:p-12 rounded-[40px] w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="neo-recessed p-4 rounded-2xl bg-surface-container-low mb-6">
            <UserPlus size={32} className="text-secondary" />
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2 text-center">Create an Account</h1>
          <p className="text-on-surface-variant font-body-md text-body-md text-center">
            Join SquadWear to manage your custom gear orders.
          </p>
        </div>
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-6 text-center font-body-md text-body-md font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className="font-label-md text-label-sm text-on-surface-variant uppercase tracking-widest">First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="neo-recessed bg-surface w-full p-4 rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="font-label-md text-label-sm text-on-surface-variant uppercase tracking-widest">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="neo-recessed bg-surface w-full p-4 rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="companyName" className="font-label-md text-label-sm text-on-surface-variant uppercase tracking-widest">Company / Team Name (Optional)</label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="neo-recessed bg-surface w-full p-4 rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
            />
          </div>

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
              minLength={6}
              className="neo-recessed bg-surface w-full p-4 rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
            />
          </div>
          
          <button 
            type="submit" 
            className="neo-extruded-sm neo-interactive w-full py-4 mt-2 rounded-xl bg-on-surface text-surface font-label-md font-bold"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-8 text-center text-on-surface-variant font-body-md text-body-md">
          Already have an account? <Link to="/portal/login" className="text-secondary font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
};
