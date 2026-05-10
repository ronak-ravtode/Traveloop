import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import CreateTrip from '../pages/CreateTrip';
import MyTrips from '../pages/MyTrips';
import ItineraryBuilder from '../pages/ItineraryBuilder';
import ItineraryView from '../pages/ItineraryView';
import CitySearch from '../pages/CitySearch';
import ActivitySearch from '../pages/ActivitySearch';
import BudgetBreakdown from '../pages/BudgetBreakdown';
import PackingChecklist from '../pages/PackingChecklist';
import PublicItinerary from '../pages/PublicItinerary';
import Profile from '../pages/Profile';
import TripNotes from '../pages/TripNotes';
import AdminAnalytics from '../pages/AdminAnalytics';
import NotFound from '../pages/NotFound';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => (
  <div className="min-h-screen bg-surface-alt flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-dark-lighter/60 font-medium">Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/shared/:shareCode" element={<PublicRoute><PublicItinerary /></PublicRoute>} />

        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/trips/create" element={<CreateTrip />} />
          <Route path="/trips/:tripId" element={<ItineraryView />} />
          <Route path="/trips/:tripId/edit" element={<ItineraryBuilder />} />
          <Route path="/trips/:tripId/budget" element={<BudgetBreakdown />} />
          <Route path="/trips/:tripId/packing" element={<PackingChecklist />} />
          <Route path="/trips/:tripId/notes" element={<TripNotes />} />
          <Route path="/search/cities" element={<CitySearch />} />
          <Route path="/search/activities" element={<ActivitySearch />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminAnalytics />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
