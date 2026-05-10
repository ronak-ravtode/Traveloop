import dotenv from 'dotenv';
dotenv.config();

import Activity from '../models/Activity.js';
import City from '../models/City.js';
import connectDB from '../config/db.js';

const seedActivities = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Get all city ObjectIds
    const cities = await City.find({});
    if (cities.length === 0) {
      console.error('No cities found. Please run seed:cities first.');
      process.exit(1);
    }

    // Create a map for quick lookup
    const cityMap = {};
    cities.forEach(city => {
      cityMap[city.name] = city._id;
    });

    console.log(`Found ${cities.length} cities to link activities to`);

    // Clear existing activities
    await Activity.deleteMany({});
    console.log('Cleared existing activities');

    // Activities array with city references
    const activities = [
      // PARIS (6 activities)
      { city: cityMap['Paris'], title: 'Eiffel Tower', category: 'sightseeing', duration: 2, cost: 26, rating: 4.8, image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=800', description: 'Iconic iron lattice tower with panoramic city views', recommendedTime: 'Morning' },
      { city: cityMap['Paris'], title: 'Louvre Museum', category: 'culture', duration: 3, cost: 17, rating: 4.9, image: 'https://images.unsplash.com/photo-1499426600726-ac1a0f4a254a?w=800', description: "World's largest art museum home to Mona Lisa", recommendedTime: 'All Day' },
      { city: cityMap['Paris'], title: 'Seine River Cruise', category: 'sightseeing', duration: 1.5, cost: 15, rating: 4.6, image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800', description: 'Scenic boat tour past Parisian landmarks', recommendedTime: 'Evening' },
      { city: cityMap['Paris'], title: 'Le Marais Food Tour', category: 'food', duration: 3, cost: 75, rating: 4.7, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', description: 'Explore hidden cafes and bistros in historic Marais', recommendedTime: 'Lunch' },
      { city: cityMap['Paris'], title: 'Montmartre Nightlife', category: 'nightlife', duration: 3, cost: 0, rating: 4.5, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800', description: 'Cabarets, jazz clubs, and artistic atmosphere', recommendedTime: 'Night' },
      { city: cityMap['Paris'], title: 'Luxembourg Gardens', category: 'nature', duration: 1.5, cost: 0, rating: 4.7, image: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800', description: 'Beautiful gardens with fountains and tennis courts', recommendedTime: 'Afternoon' },

      // TOKYO (6 activities)
      { city: cityMap['Tokyo'], title: 'Senso-ji Temple', category: 'culture', duration: 1.5, cost: 0, rating: 4.6, image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800', description: "Tokyo's oldest Buddhist temple in Asakusa", recommendedTime: 'Morning' },
      { city: cityMap['Tokyo'], title: 'Shibuya Crossing', category: 'sightseeing', duration: 0.5, cost: 0, rating: 4.5, image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800', description: "World's busiest pedestrian crossing", recommendedTime: 'Evening' },
      { city: cityMap['Tokyo'], title: 'Tsukiji Fish Market', category: 'food', duration: 2, cost: 0, rating: 4.7, image: 'https://images.unsplash.com/photo-1553621042-f6eccc245876?w=800', description: 'Fresh sushi and seafood at dawn', recommendedTime: 'Morning' },
      { city: cityMap['Tokyo'], title: 'Robot Restaurant', category: 'nightlife', duration: 1.5, cost: 80, rating: 4.3, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', description: 'Futuristic show with robots and neon lights', recommendedTime: 'Night' },
      { city: cityMap['Tokyo'], title: 'Mount Fuji Day Trip', category: 'nature', duration: 8, cost: 50, rating: 4.9, image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800', description: 'Breathtaking views of Japan\'s iconic mountain', recommendedTime: 'All Day' },
      { city: cityMap['Tokyo'], title: 'Akihabara Shopping', category: 'shopping', duration: 2, cost: 0, rating: 4.5, image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800', description: 'Electronics, anime, and gaming paradise', recommendedTime: 'Afternoon' },

      // DUBAI (5 activities)
      { city: cityMap['Dubai'], title: 'Burj Khalifa', category: 'sightseeing', duration: 2, cost: 50, rating: 4.7, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', description: 'World\'s tallest building with observation deck', recommendedTime: 'Evening' },
      { city: cityMap['Dubai'], title: 'Dubai Mall Shopping', category: 'shopping', duration: 4, cost: 0, rating: 4.8, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', description: 'Massive shopping complex with aquarium and fountain', recommendedTime: 'All Day' },
      { city: cityMap['Dubai'], title: 'Desert Safari', category: 'adventure', duration: 6, cost: 80, rating: 4.8, image: 'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?w=800', description: 'Dune bashing, camel riding, and BBQ dinner', recommendedTime: 'Afternoon' },
      { city: cityMap['Dubai'], title: 'Dubai Marina Yacht', category: 'nature', duration: 2, cost: 100, rating: 4.6, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', description: 'Luxury yacht cruise with skyline views', recommendedTime: 'Evening' },
      { city: cityMap['Dubai'], title: 'Dubai Opera Show', category: 'nightlife', duration: 2.5, cost: 150, rating: 4.7, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', description: 'World-class performances in stunning venue', recommendedTime: 'Night' },

      // SINGAPORE (4 activities)
      { city: cityMap['Singapore'], title: 'Marina Bay Sands', category: 'sightseeing', duration: 2, cost: 23, rating: 4.7, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389ff7?w=800', description: 'Iconic hotel with infinity pool and views', recommendedTime: 'Evening' },
      { city: cityMap['Singapore'], title: 'Haw Par Villa', category: 'culture', duration: 1.5, cost: 0, rating: 4.3, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389ff7?w=800', description: 'Bizarre park with vivid sculptures and dioramas', recommendedTime: 'Morning' },
      { city: cityMap['Singapore'], title: 'Chinatown Food Hunt', category: 'food', duration: 2, cost: 20, rating: 4.7, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389ff7?w=800', description: 'Street food tour through historic Chinatown', recommendedTime: 'Lunch' },
      { city: cityMap['Singapore'], title: 'Sentosa Island Beach', category: 'nature', duration: 3, cost: 0, rating: 4.6, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389ff7?w=800', description: 'Beaches, attractions, and resort fun', recommendedTime: 'Afternoon' },

      // BANGKOK (5 activities)
      { city: cityMap['Bangkok'], title: 'Grand Palace', category: 'culture', duration: 2, cost: 15, rating: 4.7, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', description: 'Stunning royal palace and Wat Phra Kaew', recommendedTime: 'Morning' },
      { city: cityMap['Bangkok'], title: 'Khao San Road', category: 'nightlife', duration: 3, cost: 0, rating: 4.4, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', description: 'Backpacker street with bars and street food', recommendedTime: 'Night' },
      { city: cityMap['Bangkok'], title: 'Chatuchak Market', category: 'shopping', duration: 3, cost: 0, rating: 4.6, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', description: 'Huge weekend market with everything', recommendedTime: 'Morning' },
      { city: cityMap['Bangkok'], title: 'Thai Cooking Class', category: 'food', duration: 4, cost: 45, rating: 4.9, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', description: 'Learn to cook authentic Thai cuisine', recommendedTime: 'Morning' },
      { city: cityMap['Bangkok'], title: 'Chao Phraya River', category: 'sightseeing', duration: 2, cost: 15, rating: 4.5, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', description: 'Boat tour past temples and landmarks', recommendedTime: 'Afternoon' },

      // BALI (5 activities)
      { city: cityMap['Bali'], title: 'Uluwatu Temple Sunset', category: 'culture', duration: 2, cost: 15, rating: 4.8, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', description: 'Cliffside temple with Kecak fire dance', recommendedTime: 'Evening' },
      { city: cityMap['Bali'], title: 'Tegallalang Rice Terraces', category: 'nature', duration: 2, cost: 10, rating: 4.6, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', description: 'Stunning terraced rice fields in Ubud', recommendedTime: 'Morning' },
      { city: cityMap['Bali'], title: 'Ubud Food Trail', category: 'food', duration: 3, cost: 35, rating: 4.7, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', description: 'Taste Balinese cuisine in local warungs', recommendedTime: 'Lunch' },
      { city: cityMap['Bali'], title: 'Surf Lesson', category: 'adventure', duration: 2, cost: 40, rating: 4.5, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', description: 'Learn to surf at Kuta Beach', recommendedTime: 'Morning' },
      { city: cityMap['Bali'], title: 'Seminyak Nightclub', category: 'nightlife', duration: 4, cost: 30, rating: 4.4, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', description: 'Beach clubs and live music scene', recommendedTime: 'Night' },

      // LONDON (5 activities)
      { city: cityMap['London'], title: 'Tower of London', category: 'culture', duration: 3, cost: 30, rating: 4.7, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', description: 'Historic castle, crown jewels, and beefeaters', recommendedTime: 'All Day' },
      { city: cityMap['London'], title: 'West End Musical', category: 'nightlife', duration: 2.5, cost: 80, rating: 4.8, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', description: 'World-famous theater district shows', recommendedTime: 'Evening' },
      { city: cityMap['London'], title: 'Hyde Park Cycling', category: 'nature', duration: 2, cost: 5, rating: 4.5, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', description: 'Rent a bike and explore the royal park', recommendedTime: 'Afternoon' },
      { city: cityMap['London'], title: 'Harrods Shopping', category: 'shopping', duration: 2, cost: 0, rating: 4.6, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', description: 'Luxury department store experience', recommendedTime: 'Afternoon' },
      { city: cityMap['London'], title: 'Afternoon Tea', category: 'food', duration: 1.5, cost: 40, rating: 4.7, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', description: 'Traditional British tea with scones and pastries', recommendedTime: 'Afternoon' },

      // NEW YORK (5 activities)
      { city: cityMap['New York'], title: 'Statue of Liberty', category: 'sightseeing', duration: 3, cost: 24, rating: 4.7, image: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=800', description: 'Iconic symbol of freedom and democracy', recommendedTime: 'Morning' },
      { city: cityMap['New York'], title: 'Broadway Show', category: 'nightlife', duration: 2.5, cost: 150, rating: 4.9, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', description: 'World-class theater performances', recommendedTime: 'Evening' },
      { city: cityMap['New York'], title: 'Central Park Picnic', category: 'nature', duration: 2, cost: 20, rating: 4.7, image: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800', description: 'Urban oasis in the heart of Manhattan', recommendedTime: 'Afternoon' },
      { city: cityMap['New York'], title: 'SoHo Shopping', category: 'shopping', duration: 2, cost: 0, rating: 4.5, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', description: 'Trendy boutiques and designer stores', recommendedTime: 'Afternoon' },
      { city: cityMap['New York'], title: 'NYC Food Tour', category: 'food', duration: 3, cost: 65, rating: 4.8, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', description: 'Taste NYC\'s diverse culinary scene', recommendedTime: 'Lunch' },

      // ROME (4 activities)
      { city: cityMap['Rome'], title: 'Colosseum Tour', category: 'culture', duration: 2, cost: 16, rating: 4.8, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', description: 'Ancient Roman amphitheater gladiator history', recommendedTime: 'Morning' },
      { city: cityMap['Rome'], title: 'Trevi Fountain', category: 'sightseeing', duration: 1, cost: 0, rating: 4.7, image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=800', description: 'Iconic Baroque fountain - toss a coin!', recommendedTime: 'Evening' },
      { city: cityMap['Rome'], title: 'Trastevere Food Walk', category: 'food', duration: 3, cost: 50, rating: 4.8, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', description: 'Authentic trattorias in charming neighborhood', recommendedTime: 'Evening' },
      { city: cityMap['Rome'], title: 'Vatican Museums', category: 'culture', duration: 4, cost: 35, rating: 4.9, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', description: 'Sistine Chapel and papal art collection', recommendedTime: 'Morning' },

      // BARCELONA (4 activities)
      { city: cityMap['Barcelona'], title: 'Sagrada Familia', category: 'culture', duration: 2, cost: 26, rating: 4.9, image: 'https://images.unsplash.com/photo-1583779457266-d25a89c1842c?w=800', description: "Gaudi's unfinished masterpiece", recommendedTime: 'Morning' },
      { city: cityMap['Barcelona'], title: 'Park Güell', category: 'nature', duration: 2, cost: 10, rating: 4.7, image: 'https://images.unsplash.com/photo-1562886780-6d1d2cc4a67c?w=800', description: "Gaudi's colorful public park with views", recommendedTime: 'Afternoon' },
      { city: cityMap['Barcelona'], title: 'La Boqueria Market', category: 'food', duration: 1.5, cost: 0, rating: 4.7, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', description: 'Vibrant market with fresh local produce', recommendedTime: 'Morning' },
      { city: cityMap['Barcelona'], title: 'Gothic Bar Crawl', category: 'nightlife', duration: 3, cost: 25, rating: 4.5, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', description: 'Historic bars in the Gothic Quarter', recommendedTime: 'Night' },

      // JAIPUR (4 activities)
      { city: cityMap['Jaipur'], title: 'Hawa Mahal', category: 'sightseeing', duration: 1, cost: 5, rating: 4.6, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', description: 'Stunning pink palace with lattice windows', recommendedTime: 'Morning' },
      { city: cityMap['Jaipur'], title: 'Amber Fort', category: 'culture', duration: 3, cost: 15, rating: 4.8, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', description: 'Majestic hilltop fort with elephant rides', recommendedTime: 'Morning' },
      { city: cityMap['Jaipur'], title: 'Johri Bazaar', category: 'shopping', duration: 2, cost: 0, rating: 4.5, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', description: 'Famous for jewelry and textiles', recommendedTime: 'Afternoon' },
      { city: cityMap['Jaipur'], title: 'Traditional Thali', category: 'food', duration: 1.5, cost: 10, rating: 4.7, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', description: 'Authentic Rajasthani cuisine on a platter', recommendedTime: 'Lunch' },

      // GOA (3 activities)
      { city: cityMap['Goa'], title: 'Baga Beach Party', category: 'nightlife', duration: 4, cost: 0, rating: 4.5, image: 'https://images.unsplash.com/photo-1512743680539-1387b4e95347?w=800', description: 'Famous beach parties and music', recommendedTime: 'Night' },
      { city: cityMap['Goa'], title: 'Dudhsagar Falls', category: 'nature', duration: 4, cost: 20, rating: 4.7, image: 'https://images.unsplash.com/photo-1512743680539-1387b4e95347?w=800', description: 'Majestic waterfall in the jungle', recommendedTime: 'Morning' },
      { city: cityMap['Goa'], title: 'Spice Plantation Tour', category: 'culture', duration: 3, cost: 15, rating: 4.5, image: 'https://images.unsplash.com/photo-1512743680539-1387b4e95347?w=800', description: 'Learn about Goan spices and enjoy lunch', recommendedTime: 'Morning' }
    ];

    await Activity.insertMany(activities);
    console.log(`Seeded ${activities.length} activities successfully`);

    // Group by category
    const categoryCount = {};
    activities.forEach(a => {
      categoryCount[a.category] = (categoryCount[a.category] || 0) + 1;
    });
    console.log('\nActivities by category:');
    Object.entries(categoryCount).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding activities:', error.message);
    process.exit(1);
  }
};

seedActivities();