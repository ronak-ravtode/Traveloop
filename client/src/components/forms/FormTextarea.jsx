import { forwardRef } from 'react';

const FormTextarea = forwardRef(({ label, error, className = '', rows = 4, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-dark">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`input-field resize-none ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;