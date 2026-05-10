import { forwardRef } from 'react';
import { Calendar } from 'lucide-react';

const DateInput = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-dark">
          {label}
        </label>
      )}
      <div className="relative">
        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40 pointer-events-none" />
        <input
          ref={ref}
          type="date"
          className={`input-field pl-12 ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

DateInput.displayName = 'DateInput';

export default DateInput;