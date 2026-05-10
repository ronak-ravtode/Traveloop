export const mockActivities = [
  { id: '1', name: 'Visit Tokyo Skytree', city: 'Tokyo', category: 'sightseeing', duration: 3, cost: 25, rating: 4.8, image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=300&h=200&fit=crop', tags: ['iconic', 'views', 'tower'] },
  { id: '2', name: 'Senso-ji Temple Tour', city: 'Tokyo', category: 'cultural', duration: 2, cost: 0, rating: 4.7, image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=300&h=200&fit=crop', tags: ['temple', 'history', 'free'] },
  { id: '3', name: 'Eiffel Tower Visit', city: 'Paris', category: 'sightseeing', duration: 4, cost: 28, rating: 4.6, image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=300&h=200&fit=crop', tags: ['iconic', 'tower', 'views'] },
  { id: '4', name: 'Louvre Museum', city: 'Paris', category: 'museum', duration: 5, cost: 17, rating: 4.9, image: 'https://images.unsplash.com/photo-1499426600726-ac63e1b6d3a5?w=300&h=200&fit=crop', tags: ['art', 'museum', 'mona lisa'] },
  { id: '5', name: 'Central Park Walk', city: 'New York', category: 'outdoor', duration: 3, cost: 0, rating: 4.8, image: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdbde?w=300&h=200&fit=crop', tags: ['park', 'nature', 'free'] },
  { id: '6', name: 'Statue of Liberty Tour', city: 'New York', category: 'sightseeing', duration: 4, cost: 24, rating: 4.5, image: 'https://images.unsplash.com/photo-1503482525596-1c1fPKsvooI?w=300&h=200&fit=crop', tags: ['iconic', 'history', 'ferry'] },
  { id: '7', name: 'Park Güell', city: 'Barcelona', category: 'cultural', duration: 3, cost: 10, rating: 4.7, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=300&h=200&fit=crop', tags: ['gaudi', 'architecture', 'views'] },
  { id: '8', name: 'Sagrada Família', city: 'Barcelona', category: 'sightseeing', duration: 3, cost: 26, rating: 4.9, image: 'https://images.unsplash.com/photo-1539037116277-4db20889f42d?w=300&h=200&fit=crop', tags: ['gaudi', 'church', 'iconic'] },
  { id: '9', name: 'Tanah Lot Temple', city: 'Bali', category: 'cultural', duration: 2, cost: 10, rating: 4.4, image: 'https://images.unsplash.com/photo-1537996194474-e57df31ddbc7?w=300&h=200&fit=crop', tags: ['temple', 'sunset', 'nature'] },
  { id: '10', name: 'Santorini Sunset Cruise', city: 'Santorini', category: 'water', duration: 4, cost: 85, rating: 4.9, image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=300&h=200&fit=crop', tags: ['sunset', 'cruise', 'romantic'] },
  { id: '11', name: 'Burj Khalifa', city: 'Dubai', category: 'sightseeing', duration: 2, cost: 45, rating: 4.8, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=200&fit=crop', tags: ['tower', 'views', 'iconic'] },
  { id: '12', name: 'Colosseum Tour', city: 'Rome', category: 'historical', duration: 3, cost: 16, rating: 4.7, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=200&fit=crop', tags: ['ancient', 'gladiators', 'iconic'] },
];

export const getActivityById = (id) => mockActivities.find(a => a.id === id);
export const searchActivities = (query) => mockActivities.filter(act =>
  act.name.toLowerCase().includes(query.toLowerCase()) ||
  act.city.toLowerCase().includes(query.toLowerCase()) ||
  act.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
);
export const getActivitiesByCity = (city) => mockActivities.filter(act => act.city === city);
export const getActivitiesByCategory = (category) => mockActivities.filter(act => act.category === category);
