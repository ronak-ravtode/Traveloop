import { mockTrips as initialTrips } from './mockTrips';

const STORAGE_KEY = 'traveloop_trips';

// Load trips from localStorage or use initial data
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

// Save trips to localStorage
const saveTrips = (trips) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (e) {
    console.error('Error saving trips to localStorage:', e);
  }
};

// Initialize trips from localStorage
let trips = loadTrips();

export const tripService = {
  // Get all trips
  getAll: () => {
    return [...trips];
  },

  // Get trip by ID
  getById: (id) => {
    return trips.find(trip => trip.id === id) || null;
  },

  // Search trips by name or description
  search: (query) => {
    const lowerQuery = query.toLowerCase();
    return trips.filter(trip =>
      trip.title.toLowerCase().includes(lowerQuery) ||
      trip.description.toLowerCase().includes(lowerQuery)
    );
  },

  // Filter trips by status
  filterByStatus: (status) => {
    if (status === 'all') return trips;
    return trips.filter(trip => trip.status === status);
  },

  // Search and filter trips
  getFiltered: (query = '', status = 'all') => {
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

  // Create a new trip
  create: (tripData) => {
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

  // Update an existing trip
  update: (id, updates) => {
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

  // Delete a trip
  delete: (id) => {
    const index = trips.findIndex(trip => trip.id === id);
    if (index === -1) return false;

    trips = trips.filter(trip => trip.id !== id);
    saveTrips(trips);
    return true;
  },

  // Get trips by user ID
  getByUser: (userId) => {
    return trips.filter(trip => trip.userId === userId);
  },

  // Get upcoming trips
  getUpcoming: () => {
    return trips.filter(trip => trip.status === 'upcoming' || trip.status === 'planning');
  },

  // Get public trips
  getPublic: () => {
    return trips.filter(trip => trip.isPublic);
  },

  // Get trip by share code
  getByShareCode: (code) => {
    return trips.find(trip => trip.shareCode === code) || null;
  },

  // Clear all trips (for testing/reset)
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