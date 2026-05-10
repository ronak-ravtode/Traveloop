import { X, Check } from 'lucide-react';

const ChecklistItem = ({ item, onToggle, onDelete }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-surface-alt rounded-xl group">
      <button
        onClick={() => onToggle?.(item.id)}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
          item.packed
            ? 'bg-primary border-primary text-white'
            : 'border-dark-lighter/30 hover:border-primary'
        }`}
      >
        {item.packed && <Check className="w-3 h-3" />}
      </button>

      <div className="flex-1">
        <span className={`text-sm ${item.packed ? 'line-through text-dark-lighter/50' : 'text-dark'}`}>
          {item.name}
        </span>
        <span className="badge bg-surface-alt text-[10px] ml-2">{item.category}</span>
      </div>

      <button
        onClick={() => onDelete?.(item.id)}
        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-500 transition-all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const PackingChecklist = ({ items, onToggle, onDelete }) => {
  const categories = [...new Set(items.map(i => i.category))];
  const packedCount = items.filter(i => i.packed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-dark">Packing List</h3>
        <span className="text-sm text-dark-lighter/60">
          {packedCount}/{items.length} packed
        </span>
      </div>

      <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500"
          style={{ width: `${(packedCount / items.length) * 100}%` }}
        />
      </div>

      {categories.map(category => (
        <div key={category} className="space-y-2">
          <h4 className="text-xs font-semibold text-dark-lighter/50 uppercase tracking-wider">{category}</h4>
          <div className="space-y-1">
            {items.filter(i => i.category === category).map(item => (
              <ChecklistItem key={item.id} item={item} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PackingChecklist;
