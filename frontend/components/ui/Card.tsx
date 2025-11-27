import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 ${
        hover ? 'hover:shadow-xl hover:border-aviation-blue transition-all duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

