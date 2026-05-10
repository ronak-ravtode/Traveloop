import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Clock, Users, ArrowLeft, Copy, Check, Share2, Globe, Plane, Loader2, AlertCircle } from 'lucide-react';
import { tripService } from '../data/mockTripService';
import { publicAPI } from '../services/api';

const PublicItinerary = () => {
  const { shareCode } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        // Try to get via public API first, then fallback to local search
        try {
          const response = await publicAPI.getById(shareCode);
          if (response.success && response.data) {
            setTrip(response.data);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.log('Public API not available, trying local search');
        }

        // Fallback to local search
        const localTrip = await tripService.getByShareCode(shareCode);
        if (localTrip) {
          setTrip(localTrip);
        } else {
          setError('Itinerary not found');
        }
      } catch (err) {
        setError('Failed to load itinerary');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [shareCode]);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const shortDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDuration = () => {
    if (!trip?.startDate || !trip?.endDate) return 0;
    return Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = `Check out this travel itinerary: ${trip?.title}\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleTwitter = () => {
    const text = `Check out this travel itinerary: ${trip?.title}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const handleCopyTrip = async () => {
    try {
      await publicAPI.copy(shareCode);
      alert('Trip copied to your account!');
    } catch (err) {
      alert('Failed to copy trip. Please login first.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="card p-12 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-dark mb-2">Itinerary Not Found</h2>
          <p className="text-dark-lighter/60 mb-6">This shared itinerary doesn't exist or has been removed.</p>
          <Link to="/login" className="btn-primary">Start Planning Your Trip</Link>
        </div>
      </div>
    );
  }

  const stops = trip.stops || trip.cities || [];
  const activities = trip.activities || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <span className="text-xl font-display font-bold text-dark">Traveloop</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary">Sign In</Link>
            <Link to="/signup" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <img
          src={trip.coverImage || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200'}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 max-w-5xl mx-auto">
          <span className="badge bg-white/20 text-white mb-3">Public Itinerary</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{trip.title}</h1>
          <p className="text-white/80">{trip.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 text-center">
            <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-display font-bold text-dark">{getDuration()}</p>
            <p className="text-sm text-dark-lighter/60">Days</p>
          </div>
          <div className="card p-4 text-center">
            <MapPin className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-display font-bold text-dark">{stops.length}</p>
            <p className="text-sm text-dark-lighter/60">Cities</p>
          </div>
          <div className="card p-4 text-center">
            <Plane className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-display font-bold text-dark">{activities.length}</p>
            <p className="text-sm text-dark-lighter/60">Activities</p>
          </div>
          <div className="card p-4 text-center">
            <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-display font-bold text-dark">${trip.budget?.total?.toLocaleString() || 0}</p>
            <p className="text-sm text-dark-lighter/60">Budget</p>
          </div>
        </div>

        {/* Dates */}
        <div className="card p-6 mb-8">
          <h2 className="font-display font-semibold text-dark mb-4">Trip Dates</h2>
          <p className="text-dark-lighter/70">
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </p>
        </div>

        {/* Destinations */}
        {stops.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="font-display font-semibold text-dark mb-4">Destinations</h2>
            <div className="space-y-4">
              {stops.map((stop, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-surface-alt rounded-xl">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-dark">{stop.city || stop.name}</p>
                    <p className="text-sm text-dark-lighter/60">
                      {shortDate(stop.startDate)} - {shortDate(stop.endDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-dark mb-4">Share this Itinerary</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleCopyLink} className="btn-secondary flex items-center gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button onClick={handleWhatsApp} className="btn-secondary flex items-center gap-2">
              WhatsApp
            </button>
            <button onClick={handleTwitter} className="btn-secondary flex items-center gap-2">
              Twitter
            </button>
          </div>
          <button onClick={handleCopyTrip} className="btn-primary mt-4 w-full">
            Copy This Trip to My Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicItinerary;