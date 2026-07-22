import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User as UserIcon, Package, Settings, ArrowLeft, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';


type PortalView = 'overview' | 'orders' | 'profile' | 'settings';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  date: string;
  items: OrderItem[];
}

export const PortalPage = () => {
  const { user, isAuthenticated, logout, isLoading, token, login } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<PortalView>('overview');
  
  // States for sub-views
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/portal/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!token) return;
    setLoadingOrders(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;
    setIsUpdating(true);
    setUpdateMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ first_name: firstName, company_name: companyName })
      });
      if (res.ok) {
        setUpdateMsg('Profile updated successfully!');
        const updatedUser = await res.json();
        // Update context
        login(token, { ...user, firstName: updatedUser.first_name });
      } else {
        setUpdateMsg('Failed to update profile.');
      }
    } catch (err) {
      setUpdateMsg('An error occurred.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to completely delete your account? This action is irreversible and all your data and orders will be lost.");
    if (!confirmDelete || !token) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        logout();
        navigate('/');
      } else {
        alert("Failed to delete account. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting account.");
    }
  };

  const navigateView = (view: PortalView) => {
    setActiveView(view);
    setUpdateMsg('');
    if (view === 'orders') {
      fetchOrders();
    }
  };

  if (isLoading) {
    return (
      <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop py-12 flex justify-center items-center min-h-[50vh]">
        <div className="font-headline-md text-on-surface">Loading...</div>
      </main>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop py-12 space-y-12 animate-fade-in min-h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          {activeView !== 'overview' && (
            <button onClick={() => setActiveView('overview')} className="neo-extruded-sm p-3 rounded-xl text-on-surface">
              <ArrowLeft size={24} />
            </button>
          )}
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface">
              {activeView === 'overview' ? <>Welcome, <span className="text-secondary">{user.firstName}</span></> : 
               activeView === 'orders' ? 'My Orders' : 
               activeView === 'profile' ? 'Profile Details' : 'Account Settings'}
            </h1>
            <p className="text-on-surface-variant font-body-md text-body-md mt-2">
              {activeView === 'overview' ? 'Manage your custom orders and account settings.' : 
               activeView === 'orders' ? 'View your past and current custom gear orders.' : 
               activeView === 'profile' ? 'Update your personal information.' : 'Manage your account preferences.'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => { logout(); navigate('/'); }}
          className="neo-extruded-sm neo-interactive px-6 py-3 rounded-xl flex items-center gap-2 font-label-md text-label-md text-on-surface bg-surface"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* Views */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          <div className="neo-extruded bg-surface p-8 rounded-[32px] flex flex-col items-start gap-4">
            <div className="neo-recessed p-4 rounded-2xl bg-surface-container-low text-secondary">
              <Package size={28} />
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface">My Orders</h2>
            <p className="text-on-surface-variant font-body-md text-body-md mb-4 flex-grow">
              View your past and current custom gear orders.
            </p>
            <button onClick={() => navigateView('orders')} className="neo-extruded-sm neo-interactive w-full py-4 rounded-xl bg-on-surface text-surface font-label-md font-bold">
              View Orders
            </button>
          </div>
          
          <div className="neo-extruded bg-surface p-8 rounded-[32px] flex flex-col items-start gap-4">
            <div className="neo-recessed p-4 rounded-2xl bg-surface-container-low text-secondary">
              <UserIcon size={28} />
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Profile Details</h2>
            <p className="text-on-surface-variant font-body-md text-body-md mb-4 flex-grow">
              Update your personal information and email.
            </p>
            <button onClick={() => navigateView('profile')} className="neo-extruded-sm neo-interactive w-full py-4 rounded-xl bg-surface text-on-surface font-label-md font-bold">
              Edit Profile
            </button>
          </div>

          <div className="neo-extruded bg-surface p-8 rounded-[32px] flex flex-col items-start gap-4">
            <div className="neo-recessed p-4 rounded-2xl bg-surface-container-low text-on-surface-variant">
              <Settings size={28} />
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Settings</h2>
            <p className="text-on-surface-variant font-body-md text-body-md mb-4 flex-grow">
              Manage your account preferences and notifications.
            </p>
            <button onClick={() => navigateView('settings')} className="neo-extruded-sm neo-interactive w-full py-4 rounded-xl bg-surface text-on-surface font-label-md font-bold">
              Account Settings
            </button>
          </div>
        </div>
      )}

      {activeView === 'orders' && (
        <div className="neo-extruded bg-surface p-8 rounded-[32px]">
          {loadingOrders ? (
            <p className="text-on-surface font-body-md">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-on-surface font-body-md">You haven't placed any orders yet.</p>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="neo-recessed p-6 rounded-2xl bg-surface-container-low flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="font-headline-sm text-on-surface">Order #{order.id.split('-')[0]}</h3>
                    <p className="text-on-surface-variant font-body-sm mt-1">{new Date(order.date).toLocaleDateString()}</p>
                    <div className="mt-4 space-y-2">
                      {order.items.map(item => (
                        <p key={item.id} className="text-on-surface font-body-md">
                          {item.quantity}x {item.productName}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end justify-between">
                    <span className={`px-4 py-2 rounded-full font-label-sm font-bold uppercase tracking-wider ${
                      order.status === 'paid' ? 'bg-primary/20 text-primary' : 
                      order.status === 'pending' ? 'bg-secondary/20 text-secondary' : 
                      'bg-surface-container-highest text-on-surface'
                    }`}>
                      {order.status}
                    </span>
                    <p className="font-headline-md text-on-surface mt-4">
                      R{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeView === 'profile' && (
        <div className="neo-extruded bg-surface p-8 rounded-[32px] max-w-2xl mx-auto">
          {updateMsg && (
            <div className={`p-4 rounded-xl mb-6 text-center font-body-md font-medium ${updateMsg.includes('success') ? 'bg-primary/20 text-primary' : 'bg-error-container text-on-error-container'}`}>
              {updateMsg}
            </div>
          )}
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-label-md text-label-sm text-on-surface-variant uppercase tracking-widest">Email Address</label>
              <input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="neo-recessed bg-surface-container-low w-full p-4 rounded-xl font-body-md text-on-surface-variant cursor-not-allowed opacity-70"
              />
              <p className="text-xs text-on-surface-variant mt-1">Email cannot be changed.</p>
            </div>
            
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
              <label htmlFor="companyName" className="font-label-md text-label-sm text-on-surface-variant uppercase tracking-widest">Company Name</label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Optional"
                className="neo-recessed bg-surface w-full p-4 rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
              />
            </div>

            <button 
              type="submit" 
              className="neo-extruded-sm neo-interactive w-full py-4 mt-4 rounded-xl bg-on-surface text-surface font-label-md font-bold"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {activeView === 'settings' && (
        <div className="neo-extruded bg-surface p-8 rounded-[32px] max-w-2xl mx-auto border border-error-container/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="neo-recessed p-4 rounded-2xl bg-error-container/20 text-on-error-container">
              <Trash2 size={32} />
            </div>
            <div>
              <h2 className="font-headline-md text-on-surface">Delete Account</h2>
              <p className="text-on-surface-variant font-body-sm mt-1">Permanently remove your account and all associated data.</p>
            </div>
          </div>
          
          <div className="bg-error-container/10 p-6 rounded-2xl mb-8">
            <h3 className="font-headline-sm text-on-error-container mb-2">Warning: Irreversible Action</h3>
            <p className="text-on-surface font-body-md">
              Deleting your account will permanently remove all your past orders, profile details, and preferences from our database. You will not be able to recover this information.
            </p>
          </div>

          <button 
            onClick={handleDeleteAccount}
            className="neo-extruded-sm neo-interactive w-full py-4 rounded-xl bg-error-container text-on-error-container font-label-md font-bold flex items-center justify-center gap-2"
          >
            <Trash2 size={20} />
            I understand, delete my account
          </button>
        </div>
      )}
    </main>
  );
};
