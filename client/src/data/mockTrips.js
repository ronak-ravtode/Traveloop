import { mockCities } from './mockCities';
import { mockActivities } from './mockActivities';

export const mockTrips = [
  {
    id: '1',
    userId: 'user1',
    title: 'European Summer Adventure',
    description: 'A two-week journey through the highlights of Western Europe',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=400&fit=crop',
    status: 'upcoming',
    isPublic: true,
    shareCode: 'EU2024',
    startDate: '2024-07-01',
    endDate: '2024-07-14',
    cities: [
      { cityId: '2', city: mockCities[1], startDate: '2024-07-01', endDate: '2024-07-05', order: 1 },
      { cityId: '4', city: mockCities[3], startDate: '2024-07-05', endDate: '2024-07-09', order: 2 },
      { cityId: '8', city: mockCities[7], startDate: '2024-07-09', endDate: '2024-07-14', order: 3 },
    ],
    activities: [
      { activityId: '3', activity: mockActivities[2], cityId: '2', date: '2024-07-02', time: '10:00', notes: 'Book tickets in advance' },
      { activityId: '4', activity: mockActivities[3], cityId: '2', date: '2024-07-03', time: '09:00', notes: '' },
      { activityId: '7', activity: mockActivities[6], cityId: '4', date: '2024-07-06', time: '10:00', notes: 'Morning visit to avoid crowds' },
      { activityId: '8', activity: mockActivities[7], cityId: '4', date: '2024-07-07', time: '14:00', notes: '' },
      { activityId: '12', activity: mockActivities[11], cityId: '8', date: '2024-07-10', time: '09:00', notes: 'Guided tour booked' },
    ],
    budget: { total: 3500, spent: 1240, categories: { flights: 800, accommodation: 1200, food: 600, activities: 280, transport: 120, other: 500 } },
    packingList: [
      { id: 'p1', name: 'Passport', packed: true, category: 'documents' },
      { id: 'p2', name: 'Travel adapter', packed: false, category: 'electronics' },
      { id: 'p3', name: 'Comfortable walking shoes', packed: false, category: 'clothing' },
      { id: 'p4', name: 'Sunscreen', packed: true, category: 'toiletries' },
      { id: 'p5', name: 'Camera', packed: false, category: 'electronics' },
    ],
    notes: [
      { id: 'n1', date: '2024-06-15', content: 'Remember to exchange currency before departure.', city: 'Paris' },
      { id: 'n2', date: '2024-06-20', content: 'Book Colosseum tickets online to skip the line.', city: 'Rome' },
    ],
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-20T15:30:00Z',
  },
  {
    id: '2',
    userId: 'user1',
    title: 'Tokyo & Bali Escape',
    description: 'Exploring the contrast of modern Tokyo and serene Bali',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop',
    status: 'planning',
    isPublic: false,
    shareCode: null,
    startDate: '2024-09-15',
    endDate: '2024-09-28',
    cities: [
      { cityId: '1', city: mockCities[0], startDate: '2024-09-15', endDate: '2024-09-21', order: 1 },
      { cityId: '5', city: mockCities[4], startDate: '2024-09-21', endDate: '2024-09-28', order: 2 },
    ],
    activities: [
      { activityId: '1', activity: mockActivities[0], cityId: '1', date: '2024-09-16', time: '10:00', notes: '' },
      { activityId: '2', activity: mockActivities[1], cityId: '1', date: '2024-09-17', time: '09:00', notes: 'Arrive early for fewer crowds' },
      { activityId: '9', activity: mockActivities[8], cityId: '5', date: '2024-09-22', time: '17:00', notes: 'Best sunset spot' },
    ],
    budget: { total: 4000, spent: 0, categories: { flights: 1200, accommodation: 1500, food: 400, activities: 200, transport: 200, other: 500 } },
    packingList: [
      { id: 'p6', name: 'Light clothing', packed: false, category: 'clothing' },
      { id: 'p7', name: 'Insect repellent', packed: false, category: 'toiletries' },
    ],
    notes: [],
    createdAt: '2024-06-10T08:00:00Z',
    updatedAt: '2024-06-10T08:00:00Z',
  },
  {
    id: '3',
    userId: 'user2',
    title: 'NYC Weekend Getaway',
    description: 'Quick urban escape to the city that never sleeps',
    coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=400&fit=crop',
    status: 'completed',
    isPublic: true,
    shareCode: 'NYC3DAY',
    startDate: '2024-03-08',
    endDate: '2024-03-10',
    cities: [
      { cityId: '3', city: mockCities[2], startDate: '2024-03-08', endDate: '2024-03-10', order: 1 },
    ],
    activities: [
      { activityId: '5', activity: mockActivities[4], cityId: '3', date: '2024-03-08', time: '10:00', notes: '' },
      { activityId: '6', activity: mockActivities[5], cityId: '3', date: '2024-03-09', time: '09:00', notes: 'Ferry from Battery Park' },
    ],
    budget: { total: 1200, spent: 1150, categories: { flights: 300, accommodation: 450, food: 200, activities: 80, transport: 60, other: 60 } },
    packingList: [],
    notes: [
      { id: 'n3', date: '2024-03-08', content: 'Central Park is even more beautiful in person!', city: 'New York' },
    ],
    createdAt: '2024-02-20T12:00:00Z',
    updatedAt: '2024-03-10T20:00:00Z',
  },
  {
    id: '4',
    userId: 'user1',
    title: 'Southeast Asia Explorer',
    description: 'Three-week adventure through Bangkok, Singapore, and Bali',
    coverImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=400&fit=crop',
    status: 'upcoming',
    isPublic: true,
    shareCode: 'SEA2024',
    startDate: '2024-11-01',
    endDate: '2024-11-21',
    cities: [
      { cityId: '11', city: mockCities[10], startDate: '2024-11-01', endDate: '2024-11-06', order: 1 },
      { cityId: '15', city: mockCities[14], startDate: '2024-11-06', endDate: '2024-11-11', order: 2 },
      { cityId: '5', city: mockCities[4], startDate: '2024-11-11', endDate: '2024-11-21', order: 3 },
    ],
    activities: [
      { activityId: '34', activity: mockActivities[33], cityId: '11', date: '2024-11-02', time: '18:00', notes: 'Book food tour in advance' },
      { activityId: '35', activity: mockActivities[34], cityId: '11', date: '2024-11-03', time: '09:00', notes: 'Dress code required - cover shoulders and knees' },
      { activityId: '31', activity: mockActivities[30], cityId: '15', date: '2024-11-07', time: '19:00', notes: 'Sunset slot recommended' },
      { activityId: '32', activity: mockActivities[31], cityId: '15', date: '2024-11-08', time: '17:00', notes: 'Come hungry!' },
      { activityId: '9', activity: mockActivities[8], cityId: '5', date: '2024-11-15', time: '17:30', notes: 'Best sunset photography spot' },
      { activityId: '17', activity: mockActivities[16], cityId: '5', date: '2024-11-12', time: '08:00', notes: 'Wear comfortable shoes' },
    ],
    budget: {
      total: 5000,
      spent: 0,
      categories: {
        flights: 1500,
        accommodation: 1800,
        food: 600,
        activities: 350,
        transport: 250,
        other: 500
      }
    },
    packingList: [
      { id: 'p8', name: 'Passport', packed: false, category: 'documents' },
      { id: 'p9', name: 'Travel insurance', packed: false, category: 'documents' },
      { id: 'p10', name: 'Light breathable clothing', packed: false, category: 'clothing' },
      { id: 'p11', name: 'Rain jacket', packed: false, category: 'clothing' },
      { id: 'p12', name: 'Sunscreen SPF 50', packed: false, category: 'toiletries' },
      { id: 'p13', name: 'Insect repellent', packed: false, category: 'toiletries' },
      { id: 'p14', name: 'Power adapter (Type G/M)', packed: false, category: 'electronics' },
      { id: 'p15', name: 'Universal travel adapter', packed: false, category: 'electronics' },
      { id: 'p16', name: 'Camera', packed: false, category: 'electronics' },
      { id: 'p17', name: 'Cash (USD for exchange)', packed: false, category: 'money' },
    ],
    notes: [
      { id: 'n4', date: '2024-10-01', content: 'Book flights early for best prices. November is shoulder season - good deals available.', city: null },
      { id: 'n5', date: '2024-10-05', content: 'Get Thai visa on arrival ready. Bring passport photo.', city: 'Bangkok' },
    ],
    createdAt: '2024-10-01T10:00:00Z',
    updatedAt: '2024-10-05T14:30:00Z',
  },
];

export const getTripById = (id) => mockTrips.find(trip => trip.id === id);
export const getTripsByUser = (userId) => mockTrips.filter(trip => trip.userId === userId);
export const getPublicTrips = () => mockTrips.filter(trip => trip.isPublic);
export const getTripByShareCode = (code) => mockTrips.find(trip => trip.shareCode === code);
