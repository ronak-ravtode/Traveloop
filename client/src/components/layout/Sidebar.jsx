import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PlaneTakeoff, Search, MapPin, Activity, DollarSign,
  Package, BookOpen, User, Shield, X, Compass, Calendar, Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../firebase/auth';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/trips', icon: PlaneTakeoff, label: 'My Trips' },
  { path: '/search/cities', icon: MapPin, label: 'City Search' },
  { path: '/search/activities', icon: Activity, label: 'Activities' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const adminItems = [
  { path: '/admin', icon: Shield, label: 'Admin' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-dark-lighter/10 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-5 border-b border-dark-lighter/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-dark leading-tight">Traveloop</h1>
                <p className="text-[10px] text-dark-lighter/60 uppercase tracking-wider">Plan your journey</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-surface-alt text-dark-lighter">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <div className="mb-4">
              <p className="px-3 mb-2 text-[10px] font-semibold text-dark-lighter/50 uppercase tracking-wider">Main</p>
              {navItems.map(({ path, icon: Icon, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-dark-lighter hover:bg-surface-alt hover:text-dark'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </NavLink>
              ))}
            </div>

            {user?.email === 'admin@traveloop.com' && (
              <div className="mb-4">
                <p className="px-3 mb-2 text-[10px] font-semibold text-dark-lighter/50 uppercase tracking-wider">Admin</p>
                {adminItems.map(({ path, icon: Icon, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-dark-lighter hover:bg-surface-alt hover:text-dark'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </nav>

          <div className="px-3 py-4 border-t border-dark-lighter/10">
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-medium text-dark truncate">{user?.displayName || 'Traveler'}</p>
              <p className="text-xs text-dark-lighter/60 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <X className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
