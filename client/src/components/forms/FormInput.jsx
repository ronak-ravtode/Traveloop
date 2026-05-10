import { forwardRef } from 'react';

const FormInput = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
            text-gray-900 placeholder:text-gray-400
            transition-all duration-200
            focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
            ${Icon ? 'pl-12' : ''}
            ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;