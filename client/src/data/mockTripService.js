import { tripAPI, handleApiError } from '../services/api';
import { mockTrips as initialTrips } from './mockTrips';

const USE_API = true; // Set to false to use mock data
const STORAGE_KEY = 'traveloop_trips';

// Mock implementations (fallback)
const loadTrips = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading trips from localStorage:', e);
  }
  return [...initialTrips];
};

const saveTrips = (trips) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (e) {
    console.error('Error saving trips to localStorage:', e);
  }
};

let trips = loadTrips();

// API-based service
export const tripService = {
  // Get all trips
  getAll: async () => {
    if (USE_API) {
      try {
        const response = await tripAPI.getAll();
        return response.data || [];
      } catch (error) {
        console.error('Error fetching trips:', error.message);
        throw error; // Re-throw so component can handle it
      }
    }
    return [...trips];
  },

  // Get trip by ID
  getById: async (id) => {
    if (USE_API) {
      try {
        const response = await tripAPI.getById(id);
        return response.data || null;
      } catch (error) {
        console.error('Error fetching trip:', error);
        return null;
      }
    }
    return trips.find(trip => trip.id === id) || null;
  },

  // Search trips
  search: async (query) => {
    if (USE_API) {
      try {
        const response = await tripAPI.getAll({ search: query });
        return response.data || [];
      } catch (error) {
        console.error('Error searching trips:', error);
        return [];
      }
    }
    const lowerQuery = query.toLowerCase();
    return trips.filter(trip =>
      trip.title.toLowerCase().includes(lowerQuery) ||
      trip.description.toLowerCase().includes(lowerQuery)
    );
  },

  // Filter by status
  filterByStatus: async (status) => {
    if (USE_API) {
      try {
        const response = await tripAPI.getAll({ status });
        return response.data || [];
      } catch (error) {
        console.error('Error filtering trips:', error);
        return [];
      }
    }
    if (status === 'all') return trips;
    return trips.filter(trip => trip.status === status);
  },

  // Search and filter
  getFiltered: async (query = '', status = 'all') => {
    if (USE_API) {
      try {
        const response = await tripAPI.getAll({ search: query, status });
        return response.data || [];
      } catch (error) {
        console.error('Error getting filtered trips:', error);
        return [];
      }
    }
    let filtered = trips;
    if (status !== 'all') {
      filtered = filtered.filter(trip => trip.status === status);
    }
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(trip =>
        trip.title.toLowerCase().includes(lowerQuery) ||
        trip.description.toLowerCase().includes(lowerQuery)
      );
    }
    return filtered;
  },

  // Create trip
  create: async (tripData) => {
    if (USE_API) {
      try {
        const response = await tripAPI.create(tripData);
        return response.data;
      } catch (error) {
        console.error('Error creating trip:', error);
        throw new Error(handleApiError(error, 'Failed to create trip'));
      }
    }
    const newTrip = {
      id: String(Date.now()),
      userId: 'user1',
      ...tripData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    trips = [newTrip, ...trips];
    saveTrips(trips);
    return newTrip;
  },

  // Update trip
  update: async (id, updates) => {
    if (USE_API) {
      try {
        const response = await tripAPI.update(id, updates);
        return response.data;
      } catch (error) {
        console.error('Error updating trip:', error);
        throw new Error(handleApiError(error, 'Failed to update trip'));
      }
    }
    const index = trips.findIndex(trip => trip.id === id);
    if (index === -1) return null;
    trips[index] = {
      ...trips[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveTrips(trips);
    return trips[index];
  },

  // Delete trip
  delete: async (id) => {
    if (USE_API) {
      try {
        await tripAPI.delete(id);
        return true;
      } catch (error) {
        console.error('Error deleting trip:', error);
        throw new Error(handleApiError(error, 'Failed to delete trip'));
      }
    }
    const index = trips.findIndex(trip => trip.id === id);
    if (index === -1) return false;
    trips = trips.filter(trip => trip.id !== id);
    saveTrips(trips);
    return true;
  },

  // Get user's trips
  getByUser: async (userId) => {
    if (USE_API) {
      try {
        const response = await tripAPI.getAll();
        return response.data || [];
      } catch (error) {
        console.error('Error fetching user trips:', error);
        return [];
      }
    }
    return trips.filter(trip => trip.userId === userId);
  },

  // Get upcoming trips
  getUpcoming: async () => {
    if (USE_API) {
      try {
        const response = await tripAPI.getAll({ status: 'upcoming' });
        return response.data || [];
      } catch (error) {
        console.error('Error fetching upcoming trips:', error);
        return [];
      }
    }
    return trips.filter(trip => trip.status === 'upcoming' || trip.status === 'planning');
  },

  // Get public trips
  getPublic: async () => {
    if (USE_API) {
      try {
        const response = await tripAPI.getAll({ isPublic: true });
        return response.data || [];
      } catch (error) {
        console.error('Error fetching public trips:', error);
        return [];
      }
    }
    return trips.filter(trip => trip.isPublic);
  },

  // Get trip by share code
  getByShareCode: async (code) => {
    if (USE_API) {
      try {
        const response = await tripAPI.getAll();
        return response.data?.find(trip => trip.shareCode === code) || null;
      } catch (error) {
        console.error('Error fetching trip by share code:', error);
        return null;
      }
    }
    return trips.find(trip => trip.shareCode === code) || null;
  },

  // Clear all (for testing/reset)
  clearAll: () => {
    trips = [...initialTrips];
    saveTrips(trips);
  },

  // Reset to initial data
  reset: () => {
    trips = [...initialTrips];
    saveTrips(trips);
  },
};

export default tripService;