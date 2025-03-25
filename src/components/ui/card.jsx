import React from 'react';

export const Card = ({ className, children }) => (
  <div className={`border rounded-lg shadow-sm ${className}`}>{children}</div>
);
export const CardHeader = ({ className, children }) => (
  <div className={`p-4 border-b ${className}`}>{children}</div>
);
export const CardTitle = ({ className, children }) => (
  <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
);
export const CardContent = ({ className, children }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);