import dotenv from 'dotenv';
dotenv.config();

import City from '../models/City.js';
import connectDB from '../config/db.js';

const cities = [
  {
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    description: 'The City of Light - iconic landmarks, world-class art, and exceptional cuisine',
    costIndex: 3,
    costLevel: 'high',
    popularity: 95,
    tags: ['romance', 'art', 'food', 'history', 'fashion']
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    description: 'A fascinating blend of ultra-modern and traditional - neon lights and ancient temples',
    costIndex: 3,
    costLevel: 'high',
    popularity: 98,
    tags: ['culture', 'technology', 'food', 'shopping', 'modern']
  },
  {
    name: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    description: 'Luxury shopping, ultramodern architecture, and vibrant nightlife',
    costIndex: 4,
    costLevel: 'high',
    popularity: 92,
    tags: ['shopping', 'luxury', 'modern', 'desert', 'skyline']
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389ff7?w=800',
    description: 'Garden city-state with futuristic architecture and incredible food',
    costIndex: 3,
    costLevel: 'high',
    popularity: 90,
    tags: ['food', 'urban', 'nature', 'clean', 'shopping']
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
    description: 'Grand palaces, ornate temples, and vibrant street life',
    costIndex: 1,
    costLevel: 'low',
    popularity: 93,
    tags: ['culture', 'food', 'temples', 'shopping', 'nightlife']
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    description: 'Tropical paradise with spiritual temples, rice terraces, and stunning beaches',
    costIndex: 1,
    costLevel: 'low',
    popularity: 94,
    tags: ['beach', 'nature', 'spiritual', 'surfing', 'yoga']
  },
  {
    name: 'London',
    country: 'UK',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
    description: 'Historic landmarks, royal palaces, and world-class museums',
    costIndex: 3,
    costLevel: 'high',
    popularity: 94,
    tags: ['history', 'culture', 'shopping', 'theater', 'royal']
  },
  {
    name: 'New York',
    country: 'USA',
    region: 'North America',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    description: 'The Big Apple - iconic skyline, Broadway shows, and diverse neighborhoods',
    costIndex: 4,
    costLevel: 'high',
    popularity: 97,
    tags: ['urban', 'shopping', 'entertainment', 'food', 'arts']
  },
  {
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    description: 'The Eternal City - ancient ruins, Vatican treasures, and Italian cuisine',
    costIndex: 2,
    costLevel: 'medium',
    popularity: 93,
    tags: ['history', 'food', 'art', 'ancient', 'vatican']
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    description: 'Gaudi architecture, Mediterranean beaches, and vibrant nightlife',
    costIndex: 2,
    costLevel: 'medium',
    popularity: 91,
    tags: ['beach', 'architecture', 'nightlife', 'gaudi', 'food']
  },
  {
    name: 'Jaipur',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
    description: 'The Pink City - royal palaces, vibrant bazaars, and rich heritage',
    costIndex: 1,
    costLevel: 'low',
    popularity: 88,
    tags: ['heritage', 'palace', 'shopping', 'food', 'desert']
  },
  {
    name: 'Goa',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1512743680539-1387b4e95347?w=800',
    description: 'Beach paradise with Portuguese heritage and vibrant party scene',
    costIndex: 1,
    costLevel: 'low',
    popularity: 86,
    tags: ['beach', 'party', 'heritage', 'food', 'sunset']
  },
  {
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
    description: 'Harbor city with iconic opera house and beautiful beaches',
    costIndex: 3,
    costLevel: 'high',
    popularity: 89,
    tags: ['beach', 'harbor', 'culture', 'food', 'nature']
  },
  {
    name: 'Istanbul',
    country: 'Turkey',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800',
    description: 'Crossroads of cultures with stunning mosques and bazaars',
    costIndex: 2,
    costLevel: 'medium',
    popularity: 87,
    tags: ['history', 'culture', 'food', 'shopping', 'architecture']
  },
  {
    name: 'Seoul',
    country: 'South Korea',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800',
    description: 'Dynamic city blending ancient palaces with cutting-edge technology',
    costIndex: 2,
    costLevel: 'medium',
    popularity: 91,
    tags: ['culture', 'shopping', 'food', 'technology', 'k-pop']
  },
  {
    name: 'Maldives',
    country: 'Maldives',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    description: 'Luxury tropical paradise with crystal clear waters',
    costIndex: 5,
    costLevel: 'high',
    popularity: 85,
    tags: ['beach', 'luxury', 'honeymoon', 'diving', 'resort']
  },
  {
    name: 'Lisbon',
    country: 'Portugal',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800',
    description: 'Charming coastal city with colorful neighborhoods and fado music',
    costIndex: 2,
    costLevel: 'medium',
    popularity: 88,
    tags: ['beach', 'culture', 'food', 'architecture', 'music']
  },
  {
    name: 'Phuket',
    country: 'Thailand',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
    description: 'Thailand\'s largest island with stunning beaches and nightlife',
    costIndex: 1,
    costLevel: 'low',
    popularity: 89,
    tags: ['beach', 'party', 'island', 'water-sports', 'nightlife']
  },
  {
    name: 'Berlin',
    country: 'Germany',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800',
    description: 'Vibrant capital with fascinating history and creative scene',
    costIndex: 2,
    costLevel: 'medium',
    popularity: 86,
    tags: ['history', 'art', 'nightlife', 'culture', 'music']
  },
  {
    name: 'Amsterdam',
    country: 'Netherlands',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800',
    description: 'Charming city with iconic canals and artistic heritage',
    costIndex: 3,
    costLevel: 'high',
    popularity: 84,
    tags: ['canals', 'culture', 'cycling', 'museums', 'nightlife']
  }
];

const seedCities = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    await City.deleteMany({});
    console.log('Cleared existing cities');

    const seededCities = await City.insertMany(cities);
    console.log(`Seeded ${seededCities.length} cities successfully`);

    // Log city IDs for reference
    console.log('\nCity IDs for reference:');
    seededCities.forEach(city => {
      console.log(`${city.name}: ${city._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding cities:', error.message);
    process.exit(1);
  }
};

seedCities();