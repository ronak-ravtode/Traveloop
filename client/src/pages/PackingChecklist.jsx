import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Check, X, RotateCcw, Package, Filter, CheckCircle2, Circle } from 'lucide-react';
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
  const trip = tripService.getById(tripId);

  // Initialize items from trip data or use defaults
  const [items, setItems] = useState(() => {
    if (trip?.packingList && trip.packingList.length > 0) {
      return trip.packingList;
    }
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

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return items;
    return items.filter(item => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const toggleItem = (id) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, packed: !item.packed } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
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

  const resetChecklist = () => {
    if (confirm('Reset all items? This will uncheck all packed items.')) {
      setItems(prev => prev.map(item => ({ ...item, packed: false })));
    }
  };

  const clearAll = () => {
    if (confirm('Clear all items? This cannot be undone.')) {
      setItems([]);
    }
  };

  if (!trip) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/trips" className="btn-ghost">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Packing Checklist</h1>
        </div>
        <div className="card p-12 text-center">
          <p className="text-dark-lighter/60">Trip not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to={`/trips/${tripId}/itinerary`} className="btn-ghost -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Packing Checklist</h1>
            <p className="text-dark-lighter/60">{trip.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetChecklist}
            className="btn-secondary flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${stats.percentage === 100 ? 'bg-green-100' : 'bg-primary/10'}`}>
              <Package className={`w-5 h-5 ${stats.percentage === 100 ? 'text-green-600' : 'text-primary'}`} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-dark">
                {stats.percentage === 100 ? 'All packed!' : `${stats.percentage}% Ready`}
              </h3>
              <p className="text-sm text-dark-lighter/60">
                {stats.packed} of {stats.total} items packed
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="h-3 bg-surface-alt rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              stats.percentage === 100
                ? 'bg-gradient-to-r from-green-400 to-green-500'
                : 'bg-gradient-to-r from-primary to-primary-light'
            }`}
            style={{ width: `${stats.percentage}%` }}
          />
        </div>

        {/* Category Progress */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-4">
          {CATEGORIES.map(cat => {
            const catStats = stats.byCategory[cat.id];
            const catPercentage = catStats.total > 0 ? Math.round((catStats.packed / catStats.total) * 100) : 0;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
                className={`p-3 rounded-xl text-left transition-all ${
                  selectedCategory === cat.id
                    ? 'ring-2 ring-primary ring-offset-2'
                    : 'hover:bg-surface-alt'
                }`}
              >
                <div className="text-lg mb-1">{cat.icon}</div>
                <p className="text-xs font-medium text-dark truncate">{cat.label}</p>
                <p className="text-xs text-dark-lighter/60">
                  {catStats.packed}/{catStats.total}
                </p>
                <div className="h-1.5 bg-surface-alt rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${catPercentage}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="card p-5 animate-in slide-in-from-top-2">
          <h3 className="font-display font-semibold text-dark mb-4">Add New Item</h3>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name..."
              className="input-field flex-1"
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              autoFocus
            />
            <select
              value={addCategory}
              onChange={(e) => setAddCategory(e.target.value)}
              className="input-field md:w-48"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            <button onClick={addItem} className="btn-primary">
              Add
            </button>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
            selectedCategory === 'all'
              ? 'bg-primary text-white'
              : 'bg-white text-dark-lighter hover:bg-surface-alt border border-dark-lighter/10'
          }`}
        >
          <Filter className="w-4 h-4" />
          All ({stats.total})
        </button>
        {CATEGORIES.map(cat => {
          const catStats = stats.byCategory[cat.id];
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-dark-lighter hover:bg-surface-alt border border-dark-lighter/10'
              }`}
            >
              {cat.icon} {cat.label} ({catStats.packed}/{catStats.total})
            </button>
          );
        })}
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="card p-12 text-center">
            <Package className="w-12 h-12 text-dark-lighter/30 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-dark mb-2">No items found</h3>
            <p className="text-sm text-dark-lighter/60">
              {selectedCategory === 'all' ? 'Add some items to get started' : 'No items in this category'}
            </p>
          </div>
        ) : (
          <>
            {/* Packed items first */}
            {filteredItems.some(i => i.packed) && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-dark-lighter/50 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Packed ({filteredItems.filter(i => i.packed).length})
                </h4>
                <div className="space-y-2">
                  {filteredItems.filter(i => i.packed).map(item => (
                    <ChecklistItem key={item.id} item={item} onToggle={toggleItem} onDelete={deleteItem} />
                  ))}
                </div>
              </div>
            )}

            {/* Unpacked items */}
            {filteredItems.some(i => !i.packed) && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-dark-lighter/50 uppercase tracking-wider flex items-center gap-2">
                  <Circle className="w-4 h-4" />
                  To Pack ({filteredItems.filter(i => !i.packed).length})
                </h4>
                <div className="space-y-2">
                  {filteredItems.filter(i => !i.packed).map(item => (
                    <ChecklistItem key={item.id} item={item} onToggle={toggleItem} onDelete={deleteItem} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Empty State CTA */}
      {items.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-dark-lighter/60 mb-4">Your packing list is empty</p>
          <button onClick={() => setShowAddForm(true)} className="btn-primary">
            Add your first item
          </button>
        </div>
      )}
    </div>
  );
};

const ChecklistItem = ({ item, onToggle, onDelete }) => {
  const cat = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[5];

  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-dark-lighter/10 rounded-xl group hover:border-primary/30 transition-all">
      <button
        onClick={() => onToggle?.(item.id)}
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
          item.packed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-dark-lighter/30 hover:border-primary hover:bg-primary/5'
        }`}
      >
        {item.packed && <Check className="w-4 h-4" />}
      </button>

      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium block truncate ${
          item.packed ? 'line-through text-dark-lighter/50' : 'text-dark'
        }`}>
          {item.name}
        </span>
      </div>

      <span className={`text-xs px-2 py-1 rounded-lg flex-shrink-0 ${cat.color}`}>
        {cat.icon} {cat.label}
      </span>

      <button
        onClick={() => onDelete?.(item.id)}
        className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-500 transition-all"
        title="Delete item"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PackingChecklistPage;