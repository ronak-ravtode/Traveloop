import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Users, Image, Plus, X, MapPin, ArrowLeft } from 'lucide-react';
import { mockCities } from '../data/mockCities';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [trip, setTrip] = useState({
    title: '',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=400&fit=crop',
    startDate: '',
    endDate: '',
    totalBudget: 2000,
    cities: [],
  });

  const addCity = (city) => {
    if (!trip.cities.find(c => c.cityId === city.id)) {
      setTrip(prev => ({
        ...prev,
        cities: [...prev.cities, { cityId: city.id, city, order: prev.cities.length + 1 }],
      }));
    }
  };

  const removeCity = (cityId) => {
    setTrip(prev => ({
      ...prev,
      cities: prev.cities.filter(c => c.cityId !== cityId).map((c, i) => ({ ...c, order: i + 1 })),
    }));
  };

  const handleSubmit = () => {
    console.log('Creating trip:', trip);
    navigate('/trips');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-6 -ml-2">
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Create New Trip</h1>
        <p className="text-dark-lighter/60 mt-1">Step {step} of 2 — {step === 1 ? 'Basic Info' : 'Add Destinations'}</p>
      </div>

      <div className="mb-8 flex gap-2">
        {[1, 2].map(s => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-dark-lighter/10'}`} />
        ))}
      </div>

      <div className="card p-6 md:p-8 space-y-6">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Trip Name</label>
              <input
                type="text"
                value={trip.title}
                onChange={(e) => setTrip(p => ({ ...p, title: e.target.value }))}
                placeholder="Summer European Adventure"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Description</label>
              <textarea
                value={trip.description}
                onChange={(e) => setTrip(p => ({ ...p, description: e.target.value }))}
                placeholder="A brief description of your trip..."
                className="input-field min-h-[100px] resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40" />
                  <input
                    type="date"
                    value={trip.startDate}
                    onChange={(e) => setTrip(p => ({ ...p, startDate: e.target.value }))}
                    className="input-field pl-12"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-2">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40" />
                  <input
                    type="date"
                    value={trip.endDate}
                    onChange={(e) => setTrip(p => ({ ...p, endDate: e.target.value }))}
                    className="input-field pl-12"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Budget</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40" />
                <input
                  type="number"
                  value={trip.totalBudget}
                  onChange={(e) => setTrip(p => ({ ...p, totalBudget: Number(e.target.value) }))}
                  className="input-field pl-12"
                />
              </div>
            </div>

            <button onClick={() => setStep(2)} className="btn-primary w-full py-3" disabled={!trip.title}>
              Next: Add Destinations
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Selected Cities</label>
              {trip.cities.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {trip.cities.map(c => (
                    <div key={c.cityId} className="flex items-center gap-3 p-3 bg-surface-alt rounded-xl">
                      <img src={c.city.image} alt={c.city.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-dark">{c.city.name}</p>
                        <p className="text-xs text-dark-lighter/60">{c.city.country}</p>
                      </div>
                      <span className="badge bg-surface-alt text-xs">{c.order}</span>
                      <button onClick={() => removeCity(c.cityId)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-dark-lighter/60 mb-4">No cities added yet</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Popular Destinations</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {mockCities.map(city => (
                  <button
                    key={city.id}
                    onClick={() => addCity(city)}
                    disabled={trip.cities.find(c => c.cityId === city.id)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      trip.cities.find(c => c.cityId === city.id)
                        ? 'bg-primary/10 border-primary'
                        : 'bg-surface-alt hover:bg-surface-alt/80'
                    }`}
                  >
                    <img src={city.image} alt={city.name} className="w-full h-20 rounded-lg object-cover mb-2" />
                    <p className="font-medium text-dark text-sm">{city.name}</p>
                    <p className="text-xs text-dark-lighter/60">{city.country}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">Back</button>
              <button onClick={handleSubmit} className="btn-primary flex-1 py-3">
                Create Trip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTrip;
