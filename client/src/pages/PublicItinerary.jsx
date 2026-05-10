import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Clock, Users, ArrowLeft, Copy, Check, Share2, Globe, Plane } from 'lucide-react';
import { tripService } from '../data/mockTripService';

const PublicItinerary = () => {
  const { shareCode } = useParams();
  const trip = tripService.getByShareCode(shareCode);
  const [copied, setCopied] = useState(false);

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="card p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-dark mb-2">Itinerary Not Found</h2>
          <p className="text-dark-lighter/60 mb-6">This shared itinerary doesn't exist or has been removed.</p>
          <Link to="/login" className="btn-primary">Start Planning Your Trip</Link>
        </div>
      </div>
    );
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const shortDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const getDuration = () => {
    if (!trip.startDate || !trip.endDate) return 0;
    return Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = `Check out this travel itinerary: ${trip.title}\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleTwitter = () => {
    const text = `Check out this travel itinerary: ${trip.title}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const handleCopyTrip = () => {
    const tripData = JSON.stringify(trip, null, 2);
    navigator.clipboard.writeText(tripData);
    alert('Trip data copied to clipboard!');
  };

  // Group activities by day
  const getDayActivities = () => {
    const days = [];
    if (!trip.activities || trip.activities.length === 0) return days;

    const sortedActivities = [...trip.activities].sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );

    let currentDate = null;
    let currentDay = null;

    sortedActivities.forEach((act) => {
      if (act.date !== currentDate) {
        currentDate = act.date;
        currentDay = {
          date: act.date,
          dayNum: days.length + 1,
          activities: [],
        };
        days.push(currentDay);
      }
      currentDay.activities.push(act);
    });

    return days;
  };

  const dayActivities = getDayActivities();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Hero Cover */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg">Traveloop</span>
            </div>
            <Link
              to="/login"
              className="px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl text-sm text-white hover:bg-white/30 transition-colors font-medium"
            >
              Plan Your Trip
            </Link>
          </div>
        </div>

        {/* Trip Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-green-500/20 backdrop-blur-sm text-green-300 text-sm font-medium rounded-full flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Public Itinerary
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white/80 text-sm rounded-full">
                {getDuration()} days
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3 leading-tight">
              {trip.title}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl">{trip.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-20 relative z-10">
          <div className="card p-5 text-center">
            <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-dark-lighter/60 uppercase tracking-wide">Dates</p>
            <p className="font-semibold text-dark">{shortDate(trip.startDate)} - {shortDate(trip.endDate)}</p>
          </div>
          <div className="card p-5 text-center">
            <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-dark-lighter/60 uppercase tracking-wide">Cities</p>
            <p className="font-semibold text-dark">{trip.cities?.length || 0} destinations</p>
          </div>
          <div className="card p-5 text-center">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-dark-lighter/60 uppercase tracking-wide">Duration</p>
            <p className="font-semibold text-dark">{getDuration()} days</p>
          </div>
          <div className="card p-5 text-center">
            <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-xs text-dark-lighter/60 uppercase tracking-wide">Budget</p>
            <p className="font-semibold text-dark">${(trip.budget?.total || 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Share Actions */}
        <div className="card p-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold text-dark">Share this itinerary</h3>
              <p className="text-sm text-dark-lighter/60">Let others discover this amazing trip</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCopyLink}
                className="btn-secondary flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={handleWhatsApp}
                className="btn-secondary flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                onClick={handleTwitter}
                className="btn-secondary flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter/X
              </button>
              <button
                onClick={handleCopyTrip}
                className="btn-primary flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Trip
              </button>
            </div>
          </div>
        </div>

        {/* Cities Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-display font-bold text-dark mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </span>
            Destinations
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {trip.cities?.map((cityStop, index) => (
              <div key={cityStop.cityId} className="card overflow-hidden group">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={cityStop.city?.image || cityStop.city?.image}
                    alt={cityStop.city?.name || cityStop.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                  <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center font-semibold text-dark text-sm">
                    {index + 1}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-display font-bold text-white text-lg">{cityStop.city?.name || cityStop.city}</p>
                    <p className="text-white/80 text-sm">{cityStop.city?.country}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-dark-lighter/60">
                    <Calendar className="w-4 h-4" />
                    <span>{shortDate(cityStop.startDate)} - {shortDate(cityStop.endDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary Timeline */}
        {dayActivities.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-display font-bold text-dark mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </span>
              Day-by-Day Itinerary
            </h2>
            <div className="space-y-6">
              {dayActivities.map((day, idx) => (
                <div key={day.date} className="card overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/5 to-transparent p-4 border-b border-dark-lighter/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold">
                        {day.dayNum}
                      </div>
                      <div>
                        <p className="font-semibold text-dark">Day {day.dayNum}</p>
                        <p className="text-sm text-dark-lighter/60">{formatDate(day.date)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-dark-lighter/5">
                    {day.activities.map((act, actIdx) => (
                      <div key={actIdx} className="p-4 flex items-start gap-4 hover:bg-surface-alt/50 transition-colors">
                        <div className="w-16 text-center flex-shrink-0">
                          <p className="text-sm font-medium text-primary">{act.time}</p>
                        </div>
                        <img
                          src={act.activity?.image}
                          alt={act.activity?.name}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-dark">{act.activity?.name}</p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-dark-lighter/60">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {act.activity?.city || 'Various'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {act.activity?.duration}h
                            </span>
                          </div>
                          {act.notes && (
                            <p className="text-sm text-dark-lighter/60 mt-2">{act.notes}</p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <span className="badge bg-green-100 text-green-700">
                            ${act.activity?.cost || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget Overview */}
        {trip.budget && (
          <div className="mt-10">
            <h2 className="text-2xl font-display font-bold text-dark mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </span>
              Budget Breakdown
            </h2>
            <div className="card overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-dark-lighter/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dark-lighter/60">Total Budget</p>
                    <p className="text-3xl font-display font-bold text-dark">${trip.budget.total?.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-dark-lighter/60">Spent</p>
                    <p className="text-2xl font-semibold text-accent">${trip.budget.spent?.toLocaleString() || 0}</p>
                  </div>
                </div>
                <div className="mt-4 h-3 bg-surface-alt rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                    style={{ width: `${((trip.budget.spent || 0) / trip.budget.total) * 100}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-dark-lighter/10">
                {Object.entries(trip.budget.categories || {}).map(([key, value]) => (
                  <div key={key} className="p-4 text-center">
                    <p className="text-xs text-dark-lighter/60 uppercase tracking-wide mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </p>
                    <p className="font-semibold text-dark">${value?.toLocaleString() || 0}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 card p-8 text-center bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
          <h3 className="text-2xl font-display font-bold text-dark mb-2">Plan Your Own Adventure</h3>
          <p className="text-dark-lighter/60 mb-6 max-w-lg mx-auto">
            Create beautiful itineraries like this one with Traveloop. Track your budget, organize activities, and share with friends.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/signup" className="btn-primary px-8">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary px-8">
              Sign In
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-dark-lighter/40">
          <p>Shared via Traveloop — Plan your perfect journey</p>
        </div>
      </div>
    </div>
  );
};

export default PublicItinerary;