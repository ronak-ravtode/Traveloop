export const mockCities = [
  { id: '1', name: 'Tokyo', country: 'Japan', continent: 'Asia', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop', timezone: 'JST', currency: 'JPY', language: 'Japanese', population: '13.96M' },
  { id: '2', name: 'Paris', country: 'France', continent: 'Europe', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop', timezone: 'CET', currency: 'EUR', language: 'French', population: '2.16M' },
  { id: '3', name: 'New York', country: 'United States', continent: 'North America', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop', timezone: 'EST', currency: 'USD', language: 'English', population: '8.34M' },
  { id: '4', name: 'Barcelona', country: 'Spain', continent: 'Europe', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop', timezone: 'CET', currency: 'EUR', language: 'Spanish', population: '1.62M' },
  { id: '5', name: 'Bali', country: 'Indonesia', continent: 'Asia', image: 'https://images.unsplash.com/photo-1537996194474-e57df31ddbc7?w=400&h=300&fit=crop', timezone: 'WITA', currency: 'IDR', language: 'Indonesian', population: '4.2M' },
  { id: '6', name: 'Santorini', country: 'Greece', continent: 'Europe', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=300&fit=crop', timezone: 'EET', currency: 'EUR', language: 'Greek', population: '15.5K' },
  { id: '7', name: 'Dubai', country: 'UAE', continent: 'Asia', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop', timezone: 'GST', currency: 'AED', language: 'Arabic', population: '3.33M' },
  { id: '8', name: 'Rome', country: 'Italy', continent: 'Europe', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop', timezone: 'CET', currency: 'EUR', language: 'Italian', population: '2.87M' },
];

export const getCityById = (id) => mockCities.find(city => city.id === id);
export const searchCities = (query) => mockCities.filter(city =>
  city.name.toLowerCase().includes(query.toLowerCase()) ||
  city.country.toLowerCase().includes(query.toLowerCase())
);
