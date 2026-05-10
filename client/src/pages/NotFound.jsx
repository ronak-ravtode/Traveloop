import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-surface-alt flex items-center justify-center mx-auto mb-6">
          <Compass className="w-10 h-10 text-dark-lighter/30" />
        </div>
        <h1 className="text-4xl font-display font-bold text-dark mb-2">404</h1>
        <p className="text-lg text-dark-lighter/60 mb-6">Page not found</p>
        <Link to="/dashboard" className="btn-primary">
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
