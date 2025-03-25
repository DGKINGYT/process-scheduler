import React from 'react';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        outline: 'border border-gray-300 hover:bg-gray-100',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
      },
    },
    defaultVariants: {
      variant: 'outline',
    },
  }
);

export const Button = ({ className, variant, children, ...props }) => (
  <button className={buttonVariants({ variant, className })} {...props}>
    {children}
  </button>
);