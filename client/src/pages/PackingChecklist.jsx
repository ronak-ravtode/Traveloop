import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Check, X, RotateCcw, Package, Filter, CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';
import { tripService } from '../data/mockTripService';

const CATEGORIES = [
  { id: 'clothing', label: 'Clothing', icon: '👕', color: 'bg-blue-100 text-blue-700' },
  { id: 'documents', label: 'Documents', icon: '📄', color: 'bg-amber-100 text-amber-700' },
  { id: 'electronics', label: 'Electronics', icon: '🔌', color: 'bg-purple-100 text-purple-700' },
  { id: 'toiletries', label: 'Toiletries', icon: '🧴', color: 'bg-pink-100 text-pink-700' },
  { id: 'medicines', label: 'Medicines', icon: '💊', color: 'bg-red-100 text-red-700' },
  { id: 'miscellaneous', label: 'Miscellaneous', icon: '📦', color: 'bg-gray-100 text-gray-700' },
];

const DEFAULT_ITEMS = [
  { name: 'T-shirts', category: 'clothing' },
  { name: 'Pants/Shorts', category: 'clothing' },
  { name: 'Underwear', category: 'clothing' },
  { name: 'Socks', category: 'clothing' },
  { name: 'Pajamas', category: 'clothing' },
  { name: 'Comfortable shoes', category: 'clothing' },
  { name: 'Passport', category: 'documents' },
  { name: 'Travel insurance', category: 'documents' },
  { name: 'Flight tickets', category: 'documents' },
  { name: 'Hotel reservations', category: 'documents' },
  { name: 'ID Card', category: 'documents' },
  { name: 'Phone charger', category: 'electronics' },
  { name: 'Power adapter', category: 'electronics' },
  { name: 'Camera', category: 'electronics' },
  { name: 'Laptop/Tablet', category: 'electronics' },
  { name: 'Headphones', category: 'electronics' },
  { name: 'Toothbrush', category: 'toiletries' },
  { name: 'Toothpaste', category: 'toiletries' },
  { name: 'Shampoo', category: 'toiletries' },
  { name: 'Sunscreen', category: 'toiletries' },
  { name: 'Deodorant', category: 'toiletries' },
  { name: 'Prescription medicines', category: 'medicines' },
  { name: 'Pain relievers', category: 'medicines' },
  { name: 'First aid kit', category: 'medicines' },
  { name: 'Travel pillow', category: 'miscellaneous' },
  { name: 'Reusable water bottle', category: 'miscellaneous' },
  { name: 'Snacks', category: 'miscellaneous' },
];

const PackingChecklistPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const data = await tripService.getById(tripId);
        setTrip(data);
      } catch (err) {
        setError('Failed to load trip');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  // Initialize items from trip data or use defaults
  const [items, setItems] = useState(() => {
    return DEFAULT_ITEMS.map((item, idx) => ({
      id: `default-${idx}`,
      name: item.name,
      category: item.category,
      packed: false,
    }));
  });

  const [newItemName, setNewItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addCategory, setAddCategory] = useState('miscellaneous');

  // Sync items with trip data when loaded
  useEffect(() => {
    if (trip?.packingList && trip.packingList.length > 0) {
      setItems(trip.packingList);
    }
  }, [trip]);

  const stats = useMemo(() => {
    const total = items.length;
    const packed = items.filter(i => i.packed).length;
    const percentage = total > 0 ? Math.round((packed / total) * 100) : 0;

    const byCategory = {};
    CATEGORIES.forEach(cat => {
      const categoryItems = items.filter(i => i.category === cat.id);
      byCategory[cat.id] = {
        total: categoryItems.length,
        packed: categoryItems.filter(i => i.packed).length,
      };
    });

    return { total, packed, percentage, byCategory };
  }, [items]);

  const toggleItem = (id) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, packed: !item.packed } : item
    ));
  };

  const addItem = () => {
    if (!newItemName.trim()) return;
    setItems(prev => [...prev, {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      category: addCategory,
      packed: false,
    }]);
    setNewItemName('');
    setShowAddForm(false);
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const resetList = () => {
    setItems(DEFAULT_ITEMS.map((item, idx) => ({
      id: `default-${idx}`,
      name: item.name,
      category: item.category,
      packed: false,
    })));
  };

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(i => i.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="card p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 mb-4">{error || 'Trip not found'}</p>
        <Link to="/trips" className="btn-primary">Back to Trips</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/trips/${tripId}/itinerary`} className="btn-ghost -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-dark">Packing Checklist</h1>
          <p className="text-dark-lighter/60">{trip.name || trip.title}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-dark-lighter/60">Packing Progress</p>
              <p className="text-2xl font-display font-bold text-dark">{stats.percentage}%</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-dark-lighter/60">{stats.packed} of {stats.total} items</p>
          </div>
        </div>
        <div className="h-3 bg-surface-alt rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-primary text-white'
              : 'bg-surface-alt text-dark-lighter hover:bg-primary/10'
          }`}
        >
          All ({stats.total})
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-primary text-white'
                : 'bg-surface-alt text-dark-lighter hover:bg-primary/10'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label} ({stats.byCategory[cat.id]?.packed || 0}/{stats.byCategory[cat.id]?.total || 0})
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="card divide-y divide-dark-lighter/10">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-surface-alt/50 transition-colors">
              <button
                onClick={() => toggleItem(item.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  item.packed
                    ? 'bg-primary border-primary'
                    : 'border-dark-lighter/30 hover:border-primary'
                }`}
              >
                {item.packed && <Check className="w-4 h-4 text-white" />}
              </button>
              <span className={`flex-1 ${item.packed ? 'text-dark-lighter/50 line-through' : 'text-dark'}`}>
                {item.name}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${CATEGORIES.find(c => c.id === item.category)?.color || 'bg-gray-100'}`}>
                {CATEGORIES.find(c => c.id === item.category)?.label || item.category}
              </span>
              <button
                onClick={() => deleteItem(item.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-dark-lighter/60">
            No items in this category
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
        <button
          onClick={resetList}
          className="btn-secondary"
        >
          <RotateCcw className="w-5 h-5" />
          Reset List
        </button>
      </div>

      {/* Add Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-6">
            <h3 className="font-display font-semibold text-dark mb-4">Add New Item</h3>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name"
              className="input-field mb-4"
              autoFocus
            />
            <select
              value={addCategory}
              onChange={(e) => setAddCategory(e.target.value)}
              className="input-field mb-4"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button onClick={addItem} className="btn-primary flex-1">Add</button>
              <button onClick={() => setShowAddForm(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackingChecklistPage;