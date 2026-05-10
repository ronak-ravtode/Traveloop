import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PlaneTakeoff, PlusCircle, MapPin, Activity, User, Shield,
  X, Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/trips', icon: PlaneTakeoff, label: 'My Trips' },
  { path: '/cities', icon: MapPin, label: 'Cities' },
  { path: '/activities', icon: Activity, label: 'Activities' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const adminItems = [
  { path: '/admin', icon: Shield, label: 'Admin' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white
        border-r border-gray-100 z-50
        transform transition-transform duration-300 ease-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-amber-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">Traveloop</h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Plan your journey</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            <div className="mb-6">
              <p className="px-3 mb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Main Menu</p>
              {navItems.map(({ path, icon: Icon, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    font-medium text-sm transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-teal-50 to-teal-50/50 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <div className={`
                        w-9 h-9 rounded-xl flex items-center justify-center
                        ${isActive
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-100 text-gray-500'
                        }
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {user?.email?.toLowerCase().includes('admin') && (
              <div className="mb-4">
                <p className="px-3 mb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Admin</p>
                {adminItems.map(({ path, icon: Icon, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-xl
                      font-medium text-sm transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-amber-50 to-amber-50/50 text-amber-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`
                          w-9 h-9 rounded-xl flex items-center justify-center
                          ${isActive
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 text-gray-500'
                          }
                        `}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </nav>

          {/* User Section */}
          <div className="px-4 py-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  user?.displayName?.charAt(0) || 'U'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{user?.displayName || 'Traveler'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                <X className="w-5 h-5" />
              </div>
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;