import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'teal',
  className = '',
}) => {
  const colorClasses = {
    teal: 'bg-teal-50 text-teal-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    sky: 'bg-sky-50 text-sky-600',
    violet: 'bg-violet-50 text-violet-600',
  };

  return (
    <div className={`
      bg-white rounded-2xl p-6
      shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]
      border border-gray-100
      ${className}
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className={`
          w-12 h-12 rounded-xl
          flex items-center justify-center
          ${colorClasses[color] || colorClasses.teal}
        `}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        {trend && (
          <div className={`
            flex items-center gap-1 text-sm font-medium
            ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}
          `}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;