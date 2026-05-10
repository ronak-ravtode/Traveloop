import { FileQuestion, Package, MapPin, Calendar, Search } from 'lucide-react';

const icons = {
  trip: MapPin,
  package: Package,
  document: FileQuestion,
  calendar: Calendar,
  search: Search,
};

const EmptyState = ({
  type = 'trip',
  title = 'No items found',
  description = 'There\'s nothing to display here yet.',
  action,
  className = '',
}) => {
  const Icon = icons[type] || MapPin;

  return (
    <div className={`
      flex flex-col items-center justify-center py-16 px-4
      ${className}
    `}>
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-50 to-amber-50 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-teal-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;