import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Image, Globe, Lock, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { FormInput, FormTextarea, DateInput } from '../components/forms';
import { tripService } from '../data/mockTripService';

// Simple toast notification component
const Toast = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
        <CheckCircle className="w-5 h-5" />
        <p className="font-medium">{message}</p>
        <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-lg p-1">
          <span className="sr-only">Close</span>
          ×
        </button>
      </div>
    </div>
  );
};

const CreateTrip = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    startDate: '',
    endDate: '',
    budget: '',
    isPublic: false,
  });
  const [errors, setErrors] = useState({});

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 4000);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Trip name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Create new trip object
    const newTrip = {
      userId: 'user1',
      title: formData.title,
      description: formData.description || 'No description provided',
      coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=400&fit=crop',
      status: 'planning',
      isPublic: formData.isPublic,
      shareCode: formData.isPublic ? `TRIP${Date.now().toString().slice(-6)}` : null,
      startDate: formData.startDate,
      endDate: formData.endDate,
      cities: [],
      activities: [],
      budget: {
        total: parseInt(formData.budget) || 0,
        spent: 0,
        categories: {
          flights: 0,
          accommodation: 0,
          food: 0,
          activities: 0,
          transport: 0,
          other: 0,
        },
      },
      packingList: [],
      notes: [],
    };

    // Save using tripService
    const createdTrip = tripService.create(newTrip);
    console.log('Trip created:', createdTrip);

    showToast('Trip created successfully!');
    setTimeout(() => navigate('/trips'), 1500);
  };

  const formatDate = (date) => {
    if (!date) return 'Select date';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return null;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : null;
  };

  const duration = calculateDuration();

  return (
    <>
      <Toast
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast({ visible: false, message: '' })}
      />

      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost mb-6 -ml-2 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Create New Trip</h1>
          <p className="text-dark-lighter/60 mt-1">Plan your next adventure</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-dark-lighter/10">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-dark">Trip Details</h2>
                  <p className="text-sm text-dark-lighter/60">Fill in your trip information</p>
                </div>
              </div>

              <FormInput
                label="Trip Name"
                name="title"
                placeholder="Summer European Adventure"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                required
              />

              <div className="grid md:grid-cols-2 gap-4">
                <DateInput
                  label="Start Date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  error={errors.startDate}
                  required
                />
                <DateInput
                  label="End Date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  error={errors.endDate}
                  required
                />
              </div>

              <FormTextarea
                label="Description"
                name="description"
                placeholder="What's this trip about? Share your travel plans, goals, or excitement..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />

              <FormInput
                label="Cover Photo URL"
                name="coverImage"
                placeholder="https://images.unsplash.com/..."
                value={formData.coverImage}
                onChange={handleChange}
                icon={Image}
              />

              <FormInput
                label="Estimated Budget"
                name="budget"
                type="number"
                placeholder="2000"
                value={formData.budget}
                onChange={handleChange}
                icon={DollarSign}
              />

              {/* Visibility Toggle */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-dark">Trip Visibility</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      !formData.isPublic
                        ? 'border-primary bg-primary/5'
                        : 'border-dark-lighter/20 hover:border-dark-lighter/40'
                    }`}
                  >
                    <Lock className={`w-5 h-5 ${!formData.isPublic ? 'text-primary' : 'text-dark-lighter/40'}`} />
                    <div className="text-left">
                      <p className="font-medium text-dark">Private</p>
                      <p className="text-xs text-dark-lighter/60">Only you can see</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPublic: true }))}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      formData.isPublic
                        ? 'border-primary bg-primary/5'
                        : 'border-dark-lighter/20 hover:border-dark-lighter/40'
                    }`}
                  >
                    <Globe className={`w-5 h-5 ${formData.isPublic ? 'text-primary' : 'text-dark-lighter/40'}`} />
                    <div className="text-left">
                      <p className="font-medium text-dark">Public</p>
                      <p className="text-xs text-dark-lighter/60">Share with others</p>
                    </div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3.5 text-lg font-semibold"
              >
                Create Trip
              </button>
            </form>
          </div>

          {/* Preview Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="card overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={formData.coverImage || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=400&fit=crop'}
                    alt="Trip cover"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=400&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className={`badge ${formData.isPublic ? 'bg-green-500/80' : 'bg-dark-lighter/50'}`}>
                      {formData.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-xl text-dark line-clamp-2">
                      {formData.title || 'Your Trip Name'}
                    </h3>
                    {formData.description && (
                      <p className="text-sm text-dark-lighter/60 mt-1 line-clamp-2">
                        {formData.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-dark-lighter/70">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{formData.startDate ? formatDate(formData.startDate) : 'Start date'}</span>
                    </div>
                    {formData.startDate && formData.endDate && duration !== null && duration >= 0 && (
                      <>
                        <span>→</span>
                        <span>{duration} days</span>
                      </>
                    )}
                  </div>

                  {formData.budget && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-dark">${parseInt(formData.budget).toLocaleString()}</span>
                      <span className="text-dark-lighter/60">estimated budget</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-dark-lighter/10">
                    <p className="text-xs text-dark-lighter/50 text-center">
                      Preview updates as you type
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTrip;