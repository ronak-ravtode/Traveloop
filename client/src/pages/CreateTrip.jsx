import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Globe, Lock, ArrowLeft, CheckCircle, Sparkles, Loader2, AlertCircle, Upload, X } from 'lucide-react';
import { FormInput, FormTextarea, DateInput } from '../components/forms';
import { tripService } from '../data/mockTripService';
import { uploadAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Toast = ({ message, isVisible, type = 'success', onClose }) => {
  if (!isVisible) return null;
  const bgColor = type === 'error' ? 'bg-red-600' : 'bg-green-600';
  return (
    <div className="fixed top-6 right-6 z-[100] animate-slide-in">
      <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3`}>
        {type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
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
  const { isAuthenticated } = useAuth();
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    startDate: '',
    endDate: '',
    budget: '',
    isPublic: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 4000);
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

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image must be less than 5MB', 'error');
        return;
      }
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, coverImage: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      let coverImageUrl = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=400&fit=crop';

      // Upload image if file selected and user is authenticated
      if (selectedFile && isAuthenticated) {
        setUploading(true);
        try {
          const response = await uploadAPI.profileImage(selectedFile);
          // Server returns { data: { photoURL: ... } }
          if (response.success && response.data?.photoURL) {
            coverImageUrl = response.data.photoURL;
          } else if (response.data?.url) {
            coverImageUrl = response.data.url;
          }
        } catch (uploadErr) {
          console.error('Image upload failed, using default:', uploadErr.message);
          // Don't use base64 - too large. Just use default.
        } finally {
          setUploading(false);
        }
      }

      const newTrip = {
        name: formData.title,
        description: formData.description || 'No description provided',
        coverImage: coverImageUrl,
        status: 'upcoming',
        visibility: formData.isPublic ? 'public' : 'private',
        startDate: formData.startDate,
        endDate: formData.endDate,
        budgetLimit: parseInt(formData.budget) || 0,
        budget: {
          transport: 0,
          stay: 0,
          activities: 0,
          meals: 0,
          miscellaneous: 0,
        },
      };

      await tripService.create(newTrip);

      showToast('Trip created successfully!', 'success');
      setTimeout(() => navigate('/trips'), 1500);
    } catch (error) {
      console.error('Error creating trip:', error);
      showToast(error.message || 'Failed to create trip. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isUploading = uploading || loading;

  return (
    <>
      <Toast
        message={toast.message}
        isVisible={toast.visible}
        type={toast.type}
        onClose={() => setToast({ visible: false, message: '', type: 'success' })}
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

        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-dark-lighter/10">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-dark">Plan a new trip</h2>
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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark">Cover Photo</label>
              {!imagePreview ? (
                <div className="border-2 border-dashed border-dark-lighter/20 rounded-xl p-6 text-center hover:border-primary hover:bg-primary/5 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="cover-image-upload"
                  />
                  <label htmlFor="cover-image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-dark-lighter/40" />
                      <p className="text-sm text-dark-lighter/60">
                        Click to upload cover image
                      </p>
                      <p className="text-xs text-dark-lighter/40">
                        PNG, JPG up to 5MB {!isAuthenticated && '(login to upload)'}
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {uploading && (
                    <div className="absolute inset-0 bg-dark/50 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
              )}
            </div>

            <FormInput
              label="Estimated Budget"
              name="budget"
              type="number"
              placeholder="2000"
              value={formData.budget}
              onChange={handleChange}
              icon={DollarSign}
            />

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
              disabled={isUploading}
              className="btn-primary w-full py-3.5 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {uploading ? 'Uploading...' : 'Creating...'}
                </>
              ) : (
                'Create Trip'
              )}
            </button>
          </form>

          <div className="card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title">Suggestion for Places to Visit/Activites to preform</h2>
                <p className="section-subtitle mt-1">Curated ideas to help you plan faster</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="card rounded-2xl aspect-[3/4]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTrip;