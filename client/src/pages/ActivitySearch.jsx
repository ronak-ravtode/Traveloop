import { useState } from 'react';
import { Search, Filter, Clock, DollarSign, Star, X } from 'lucide-react';
import ActivityCard from '../components/trip/ActivityCard';
import { mockActivities } from '../data/mockActivities';

const ActivitySearch = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'sightseeing', 'cultural', 'museum', 'outdoor', 'historical', 'water'];

  const filteredActivities = mockActivities.filter(act => {
    const matchesCategory = selectedCategory === 'all' || act.category === selectedCategory;
    const matchesSearch = search === '' ||
      act.name.toLowerCase().includes(search.toLowerCase()) ||
      act.city.toLowerCase().includes(search.toLowerCase()) ||
      act.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Activity Search</h1>
        <p className="text-dark-lighter/60 mt-1">Find the best experiences for your trip</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities, cities, or tags..."
            className="input-field pl-12"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === c
                ? 'bg-primary text-white'
                : 'bg-white text-dark-lighter hover:bg-surface-alt'
            }`}
          >
            {c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {filteredActivities.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredActivities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Filter className="w-12 h-12 text-dark-lighter/30 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-dark mb-2">No activities found</h3>
          <p className="text-sm text-dark-lighter/60">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ActivitySearch;
