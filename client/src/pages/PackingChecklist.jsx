import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Check } from 'lucide-react';
import PackingChecklist from '../components/budget/PackingChecklist';
import { mockTrips } from '../data/mockTrips';

const PackingChecklistPage = () => {
  const { tripId } = useParams();
  const trip = mockTrips.find(t => t.id === tripId) || mockTrips[0];
  const [items, setItems] = useState(trip.packingList);

  const toggleItem = (id) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, packed: !item.packed } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addItem = (name) => {
    setItems(prev => [...prev, {
      id: `p${Date.now()}`,
      name,
      packed: false,
      category: 'misc',
    }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/trips/${tripId}`} className="btn-ghost -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Packing Checklist</h1>
          <p className="text-dark-lighter/60">{trip.title}</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-dark mb-2">Add new item</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Item name..."
              className="input-field flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  addItem(e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
          </div>
        </div>

        <PackingChecklist items={items} onToggle={toggleItem} onDelete={deleteItem} />
      </div>
    </div>
  );
};

export default PackingChecklistPage;
