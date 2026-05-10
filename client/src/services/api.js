import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  cache: false
});

/**
 * Request Interceptor - Add User Info Headers
 *
 * IMPORTANT: This is hackathon/demo auth approach.
 * For production, use Firebase Admin SDK with proper token verification.
 *
 * Instead of Firebase ID token, we send user info from Firebase Auth directly:
 * - x-user-uid: Firebase user UID
 * - x-user-email: User email
 * - x-user-name: Display name
 * - x-user-photo: Photo URL (optional)
 *
 * Backend mockAuthMiddleware reads these headers and finds/creates user in MongoDB.
 */
api.interceptors.request.use(
  async (config) => {
    try {
      // Get user from localStorage (set by AuthContext after Firebase login)
      const storedUser = localStorage.getItem('traveloop_user');

      if (storedUser) {
        const currentUser = JSON.parse(storedUser);
        // Attach user info to custom headers for backend mock auth
        config.headers['x-user-uid'] = currentUser.uid || '';
        config.headers['x-user-email'] = currentUser.email || '';
        config.headers['x-user-name'] = currentUser.displayName || currentUser.email?.split('@')[0] || '';
        config.headers['x-user-photo'] = currentUser.photoURL || '';
      }
    } catch (e) {
      // Continue without auth headers if unable to get user
      console.warn('[API] Unable to get current user:', e.message);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('firebaseIdToken');
      localStorage.removeItem('traveloop_user');
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Helper to handle API errors gracefully
export const handleApiError = (error, fallbackMessage = 'An error occurred') => {
  if (error.response) {
    return error.response.data.message || fallbackMessage;
  } else if (error.request) {
    return 'Unable to connect to server. Please check your connection.';
  } else {
    return error.message || fallbackMessage;
  }
};

// ==================== USER API ====================
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },
};

// ==================== TRIP API ====================
export const tripAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/trips', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },
  create: async (tripData) => {
    const response = await api.post('/trips', tripData);
    return response.data;
  },
  update: async (id, updates) => {
    const response = await api.put(`/trips/${id}`, updates);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  },
};

// ==================== CITY API ====================
export const cityAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/cities', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/cities/${id}`);
    return response.data;
  },
  search: async (query) => {
    const response = await api.get('/cities', { params: { search: query } });
    return response.data;
  },
};

// ==================== ACTIVITY API ====================
export const activityAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/activities', { params });
    return response.data;
  },
  getByCity: async (cityId, params = {}) => {
    const response = await api.get(`/activities`, { params: { city: cityId, ...params } });
    return response.data;
  },
  search: async (query) => {
    const response = await api.get('/activities', { params: { search: query } });
    return response.data;
  },
};

// ==================== BUDGET API ====================
export const budgetAPI = {
  get: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/budget`);
    return response.data;
  },
  update: async (tripId, budgetData) => {
    const response = await api.put(`/trips/${tripId}/budget`, budgetData);
    return response.data;
  },
  addItem: async (tripId, item) => {
    const response = await api.post(`/trips/${tripId}/budget/items`, item);
    return response.data;
  },
  updateItem: async (tripId, itemId, updates) => {
    const response = await api.put(`/trips/${tripId}/budget/items/${itemId}`, updates);
    return response.data;
  },
  deleteItem: async (tripId, itemId) => {
    const response = await api.delete(`/trips/${tripId}/budget/items/${itemId}`);
    return response.data;
  },
};

// ==================== CHECKLIST API ====================
export const checklistAPI = {
  get: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/checklist`);
    return response.data;
  },
  addItem: async (tripId, item) => {
    const response = await api.post(`/trips/${tripId}/checklist/items`, item);
    return response.data;
  },
  updateItem: async (tripId, itemId, updates) => {
    const response = await api.put(`/trips/${tripId}/checklist/items/${itemId}`, updates);
    return response.data;
  },
  deleteItem: async (tripId, itemId) => {
    const response = await api.delete(`/trips/${tripId}/checklist/items/${itemId}`);
    return response.data;
  },
  toggleItem: async (tripId, itemId) => {
    const response = await api.put(`/trips/${tripId}/checklist/items/${itemId}/toggle`);
    return response.data;
  },
};

// ==================== NOTE API ====================
export const noteAPI = {
  getAll: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/notes`);
    return response.data;
  },
  create: async (tripId, noteData) => {
    const response = await api.post(`/trips/${tripId}/notes`, noteData);
    return response.data;
  },
  update: async (tripId, noteId, updates) => {
    const response = await api.put(`/trips/${tripId}/notes/${noteId}`, updates);
    return response.data;
  },
  delete: async (tripId, noteId) => {
    const response = await api.delete(`/trips/${tripId}/notes/${noteId}`);
    return response.data;
  },
};

// ==================== PUBLIC API ====================
export const publicAPI = {
  getById: async (publicId) => {
    const response = await api.get(`/public/${publicId}`);
    return response.data;
  },
  copy: async (publicId) => {
    const response = await api.post(`/public/${publicId}/copy`);
    return response.data;
  },
};

// ==================== ADMIN API ====================
export const adminAPI = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  getTrips: async (params = {}) => {
    const response = await api.get('/admin/trips', { params });
    return response.data;
  },
};

// ==================== UPLOAD API ====================
export const uploadAPI = {
  profileImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  tripCover: async (tripId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(`/upload/trip-cover/${tripId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default api;