import { useState, useEffect } from 'react';
import { User, Mail, Camera, Save, Globe, DollarSign, MapPin, Heart, Shield, Lock, AlertTriangle, X, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../data/mockTripService';
import { cityAPI } from '../services/api';

const Profile = () => {
  const { user, isDemoMode, logout, isAuthenticated } = useAuth();
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tripsData, citiesData] = await Promise.all([
          tripService.getAll(),
          cityAPI.getAll({ limit: 50 })
        ]);
        setTrips(tripsData);
        setCities(citiesData.data || []);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [profile, setProfile] = useState({
    displayName: user?.displayName || 'Demo User',
    email: user?.email || 'demo@traveloop.com',
    photoURL: user?.photoURL || '',
  });

  const [settings, setSettings] = useState({
    language: 'en',
    currency: 'USD',
    travelStyle: 'comfort',
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    allowTripSharing: true,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  // Get saved destinations from trips
  const savedDestinations = [];
  const destinationMap = new Map();

  trips.forEach(trip => {
    const stops = trip.stops || trip.cities || [];
    stops.forEach(stop => {
      const cityName = stop.city || stop.name;
      if (cityName && !destinationMap.has(cityName)) {
        destinationMap.set(cityName, {
          id: stop.cityId || stop._id || cityName,
          name: cityName,
          country: stop.country,
          image: stop.image,
          tripCount: 1,
          lastVisited: trip.endDate
        });
      } else if (cityName) {
        const existing = destinationMap.get(cityName);
        existing.tripCount += 1;
      }
    });
  });
  destinationMap.forEach(value => savedDestinations.push(value));

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setSaveStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center text-white text-3xl font-bold">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-dark">{profile.displayName}</h1>
            <p className="text-dark-lighter/60 flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4" />
              {profile.email}
            </p>
            {isDemoMode && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                <AlertTriangle className="w-3 h-3" />
                Demo Mode
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-3xl font-display font-bold text-primary">{trips.length}</p>
          <p className="text-sm text-dark-lighter/60">Total Trips</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-display font-bold text-secondary">{savedDestinations.length}</p>
          <p className="text-sm text-dark-lighter/60">Destinations</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-display font-bold text-accent">{trips.filter(t => t.status === 'completed').length}</p>
          <p className="text-sm text-dark-lighter/60">Completed</p>
        </div>
      </div>

      {/* Settings */}
      <div className="card p-6">
        <h2 className="text-lg font-display font-semibold text-dark mb-4">Preferences</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-dark-lighter/60 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              className="input-field"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-dark-lighter/60 mb-2">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
              className="input-field"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-dark-lighter/60 mb-2">Travel Style</label>
            <select
              value={settings.travelStyle}
              onChange={(e) => setSettings(prev => ({ ...prev, travelStyle: e.target.value }))}
              className="input-field"
            >
              <option value="budget">Budget</option>
              <option value="comfort">Comfort</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
        </div>
      </div>

      {/* Saved Destinations */}
      {savedDestinations.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-display font-semibold text-dark mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Visited Destinations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {savedDestinations.slice(0, 8).map(dest => (
              <div key={dest.id} className="group relative aspect-square rounded-xl overflow-hidden">
                <img
                  src={dest.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200'}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white font-medium text-sm">{dest.name}</p>
                  <p className="text-white/70 text-xs">{dest.tripCount} trips</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy */}
      <div className="card p-6">
        <h2 className="text-lg font-display font-semibold text-dark mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Privacy
        </h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 bg-surface-alt rounded-xl cursor-pointer">
            <span className="text-dark">Public Profile</span>
            <input
              type="checkbox"
              checked={privacy.publicProfile}
              onChange={(e) => setPrivacy(prev => ({ ...prev, publicProfile: e.target.checked }))}
              className="w-5 h-5 text-primary rounded"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-surface-alt rounded-xl cursor-pointer">
            <span className="text-dark">Allow Trip Sharing</span>
            <input
              type="checkbox"
              checked={privacy.allowTripSharing}
              onChange={(e) => setPrivacy(prev => ({ ...prev, allowTripSharing: e.target.checked }))}
              className="w-5 h-5 text-primary rounded"
            />
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="btn-primary flex items-center gap-2"
        >
          {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
        </button>
        <button
          onClick={logout}
          className="btn-secondary"
        >
          Logout
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="btn-ghost text-red-500 hover:bg-red-50"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-dark">Delete Account</h3>
                <p className="text-sm text-dark-lighter/60">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-dark-lighter/70 mb-4">
              Type <strong>DELETE</strong> to confirm account deletion
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="input-field mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (deleteConfirmText === 'DELETE') {
                    alert('Account deleted (demo)');
                    setShowDeleteModal(false);
                  }
                }}
                disabled={deleteConfirmText !== 'DELETE'}
                className="btn-primary bg-red-500 hover:bg-red-600 disabled:opacity-50"
              >
                Delete Account
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;