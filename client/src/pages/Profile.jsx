import { useState, useEffect } from 'react';
import { User, Mail, Camera, Save, Globe, DollarSign, MapPin, Heart, Shield, Lock, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../data/mockTripService';
import { mockCities } from '../data/mockCities';

const Profile = () => {
  const { user, isDemoMode, logout } = useAuth();

  // Profile state - start with Firebase user or demo defaults
  const [profile, setProfile] = useState({
    displayName: user?.displayName || 'Alex Johnson',
    email: user?.email || 'demo@traveloop.com',
    photoURL: user?.photoURL || '',
  });

  // Settings state - local preferences
  const [settings, setSettings] = useState({
    language: 'en',
    currency: 'USD',
    travelStyle: 'comfort',
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    allowTripSharing: true,
  });

  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Saved destinations - derived from user's trips
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [saveStatus, setSaveStatus] = useState('');

  // Load saved destinations from user's trips
  useEffect(() => {
    const userTrips = tripService.getAll();
    const destinations = new Map();

    userTrips.forEach(trip => {
      if (trip.cities) {
        trip.cities.forEach(city => {
          const cityData = mockCities.find(c => c.id === city.cityId);
          if (cityData && !destinations.has(cityData.id)) {
            destinations.set(cityData.id, {
              ...cityData,
              tripCount: 1,
              lastVisited: trip.endDate
            });
          } else if (destinations.has(cityData.id)) {
            const existing = destinations.get(cityData.id);
            existing.tripCount += 1;
            if (trip.endDate > existing.lastVisited) {
              existing.lastVisited = trip.endDate;
            }
          }
        });
      }
    });

    setSavedDestinations(Array.from(destinations.values()).slice(0, 6));
  }, []);

  // Handle save
  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 500);
  };

  // Travel style options
  const travelStyles = [
    { value: 'budget', label: 'Budget', desc: 'Backpacker friendly, hostels, local food' },
    { value: 'comfort', label: 'Comfort', desc: 'Mid-range hotels, good restaurants' },
    { value: 'luxury', label: 'Luxury', desc: 'Premium hotels, fine dining experiences' },
  ];

  // Language options
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'ja', label: '日本語' },
    { value: 'zh', label: '中文' },
  ];

  // Currency options
  const currencies = [
    { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
    { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
    { value: 'GBP', label: 'GBP - British Pound', symbol: '£' },
    { value: 'JPY', label: 'JPY - Japanese Yen', symbol: '¥' },
    { value: 'AUD', label: 'AUD - Australian Dollar', symbol: 'A$' },
    { value: 'CAD', label: 'CAD - Canadian Dollar', symbol: 'C$' },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Profile & Settings</h1>
        <p className="text-dark-lighter/60 mt-1">Manage your account, preferences, and privacy</p>
      </div>

      {/* Profile Card */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-dark mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Profile Information
        </h2>

        <div className="flex items-start gap-6 mb-8">
          {/* Avatar */}
          <div className="relative">
            {profile.photoURL ? (
              <img
                src={profile.photoURL}
                alt={profile.displayName}
                className="w-24 h-24 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-3xl font-bold">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border border-dark-lighter/20 flex items-center justify-center shadow-sm hover:bg-surface-alt transition-colors">
              <Camera className="w-4 h-4 text-dark" />
            </button>
          </div>

          <div className="flex-1 space-y-3">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Display Name</label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => setProfile(p => ({ ...p, displayName: e.target.value }))}
                className="input-field"
              />
            </div>

            {/* Email (read-only if from Firebase) */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-lighter/40" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                  className="input-field pl-10"
                />
              </div>
              {isDemoMode && (
                <p className="text-xs text-amber-600 mt-1">Demo mode - email is read-only</p>
              )}
            </div>
          </div>
        </div>

        {/* Photo URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-dark mb-1">Photo URL</label>
          <input
            type="url"
            value={profile.photoURL}
            onChange={(e) => setProfile(p => ({ ...p, photoURL: e.target.value }))}
            placeholder="https://example.com/avatar.jpg"
            className="input-field"
          />
          <p className="text-xs text-dark-lighter/60 mt-1">Enter a URL to your profile picture</p>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary"
        >
          <Save className="w-5 h-5" />
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Preferences */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-dark mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Travel Preferences
        </h2>

        <div className="space-y-6">
          {/* Language */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-dark mb-2">
              <Globe className="w-4 h-4 text-dark-lighter/60" />
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings(s => ({ ...s, language: e.target.value }))}
              className="input-field"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>

          {/* Currency */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-dark mb-2">
              <DollarSign className="w-4 h-4 text-dark-lighter/60" />
              Preferred Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings(s => ({ ...s, currency: e.target.value }))}
              className="input-field"
            >
              {currencies.map(curr => (
                <option key={curr.value} value={curr.value}>{curr.label}</option>
              ))}
            </select>
          </div>

          {/* Travel Style */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-dark mb-3">
              <MapPin className="w-4 h-4 text-dark-lighter/60" />
              Travel Style
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              {travelStyles.map(style => (
                <button
                  key={style.value}
                  onClick={() => setSettings(s => ({ ...s, travelStyle: style.value }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    settings.travelStyle === style.value
                      ? 'border-primary bg-primary/5'
                      : 'border-dark-lighter/10 hover:border-primary/50'
                  }`}
                >
                  <span className={`font-medium ${
                    settings.travelStyle === style.value ? 'text-primary' : 'text-dark'
                  }`}>
                    {style.label}
                  </span>
                  <p className="text-xs text-dark-lighter/60 mt-1">{style.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Destinations */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-dark mb-6 flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Saved Destinations
        </h2>

        {savedDestinations.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {savedDestinations.map(city => (
              <div
                key={city.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-surface-alt hover:bg-surface-alt/80 transition-colors cursor-pointer"
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-medium text-dark">{city.name}</h3>
                  <p className="text-sm text-dark-lighter/60">{city.country}</p>
                  <p className="text-xs text-primary mt-1">{city.tripCount} trip{city.tripCount > 1 ? 's' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-dark-lighter/60">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No saved destinations yet</p>
            <p className="text-sm mt-1">Create a trip to add destinations to your list</p>
          </div>
        )}
      </div>

      {/* Privacy */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-dark mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Privacy Settings
        </h2>

        <div className="space-y-4">
          {/* Public Profile Toggle */}
          <div className="flex items-center justify-between p-4 bg-surface-alt rounded-xl">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-dark-lighter/60" />
              <div>
                <p className="font-medium text-dark">Public Profile</p>
                <p className="text-sm text-dark-lighter/60">Allow others to view your profile</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={privacy.publicProfile}
                onChange={(e) => setPrivacy(p => ({ ...p, publicProfile: e.target.checked }))}
              />
              <div className="w-11 h-6 bg-dark-lighter/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Allow Trip Sharing Toggle */}
          <div className="flex items-center justify-between p-4 bg-surface-alt rounded-xl">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-dark-lighter/60" />
              <div>
                <p className="font-medium text-dark">Allow Trip Sharing</p>
                <p className="text-sm text-dark-lighter/60">Let others view your shared trips</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={privacy.allowTripSharing}
                onChange={(e) => setPrivacy(p => ({ ...p, allowTripSharing: e.target.checked }))}
              />
              <div className="w-11 h-6 bg-dark-lighter/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-red-200">
        <h2 className="font-display font-semibold text-red-600 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-dark-lighter/60 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors border border-red-200"
          >
          Delete Account
        </button>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-dark">Delete Account</h3>
                <p className="text-sm text-dark-lighter/60">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-dark-lighter/70 mb-4">
              Are you sure you want to delete your account? All your trips, data, and preferences will be permanently removed.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-dark mb-2">
                Type <span className="font-mono bg-surface-alt px-1 rounded">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="input-field"
                placeholder="DELETE"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="flex-1 btn-ghost"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmText !== 'DELETE'}
                onClick={() => {
                  // In a real app, this would call an API to delete the user account
                  // For demo mode, we just log out
                  logout();
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;