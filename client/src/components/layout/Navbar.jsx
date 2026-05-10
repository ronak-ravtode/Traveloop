import { Link } from 'react-router-dom';
import { Menu, Bell, Search, Plus } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-dark-lighter/10">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-surface-alt text-dark-lighter lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md-flex items-center gap-2 px-4 py-2 bg-surface-alt rounded-xl border border-dark-lighter/10 w-64">
            <Search className="w-4 h-4 text-dark-lighter/50" />
            <input
              type="text"
              placeholder="Search trips, cities..."
              className="flex-1 bg-transparent text-sm text-dark placeholder:text-dark-lighter/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/trips/create"
            className="btn-primary text-sm py-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Trip</span>
          </Link>

          <button className="relative p-2.5 rounded-xl hover:bg-surface-alt text-dark-lighter transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-white" />
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center text-white font-semibold text-sm">
            U
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
