import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, PlaneTakeoff, PlusCircle, MapPin, Activity, User,
  Menu, X, Compass
} from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const mobileNavItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/trips', icon: PlaneTakeoff, label: 'Trips' },
  { path: '/trips/create', icon: PlusCircle, label: 'Create', center: true },
  { path: '/cities', icon: MapPin, label: 'Cities' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isCreatePage = location.pathname === '/trips/create';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-72">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-40">
        <div className="flex items-center justify-around py-2 px-4">
          {mobileNavItems.map(({ path, icon: Icon, label, center }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `
                flex flex-col items-center justify-center
                transition-all duration-200
                ${center
                  ? '-mt-8'
                  : ''
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {center ? (
                    <div className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center
                      bg-gradient-to-br from-teal-500 to-teal-600
                      shadow-lg shadow-teal-500/30
                      text-white
                    `}>
                      <Icon className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className={`
                      p-2 rounded-xl
                      ${isActive
                        ? 'text-teal-600'
                        : 'text-gray-400'
                      }
                    `}>
                      <Icon className="w-6 h-6" />
                    </div>
                  )}
                  <span className={`
                    text-[10px] font-medium mt-1
                    ${isActive ? 'text-teal-600' : 'text-gray-400'}
                  `}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;