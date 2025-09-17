export const Card = ({ className = "", children }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>{children}</div>
);

export const CardHeader = ({ className = "p-6", children }) => (
  <div className={className}>{children}</div>
);

export const CardTitle = ({ children }) => (
  <h3 className="text-xl font-semibold">{children}</h3>
);

export const CardDescription = ({ children }) => (
  <p className="text-gray-600 text-sm">{children}</p>
);

export const CardContent = ({ className = "p-6 pt-0", children }) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ className = "p-6 pt-0", children }) => (
  <div className={`border-t border-gray-100 ${className}`}>{children}</div>
);

export const CardAction = ({ children }) => (
  <div className="mt-2">{children}</div>
);
