import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-sky-blue-600 text-white hover:bg-sky-blue-700 shadow-soft hover:shadow-soft-lg focus:ring-sky-blue-500',
    secondary: 'bg-navy-900 text-white hover:bg-navy-800 shadow-soft hover:shadow-soft-lg focus:ring-navy-500',
    outline: 'border-2 border-sky-blue-600 text-sky-blue-600 hover:bg-sky-blue-50 focus:ring-sky-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-soft hover:shadow-soft-lg focus:ring-red-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}


