import React from 'react';

export const Input = ({ className, ...props }) => (
  <input
    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);