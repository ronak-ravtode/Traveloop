const PageHeader = ({
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={`
      flex flex-col sm:flex-row sm:items-center sm:justify-between
      gap-4 mb-8
      ${className}
    `}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;