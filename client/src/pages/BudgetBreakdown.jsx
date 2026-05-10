import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BudgetOverview from '../components/budget/BudgetOverview';
import { mockTrips } from '../data/mockTrips';

const BudgetBreakdown = () => {
  const { tripId } = useParams();
  const trip = mockTrips.find(t => t.id === tripId) || mockTrips[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/trips/${tripId}`} className="btn-ghost -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Budget Breakdown</h1>
          <p className="text-dark-lighter/60">{trip.title}</p>
        </div>
      </div>

      <BudgetOverview budget={trip.budget} />
    </div>
  );
};

export default BudgetBreakdown;
