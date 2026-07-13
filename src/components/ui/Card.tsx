import type { ReactNode } from 'react';

interface CardProps {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

export default function Card({ className = '', onClick, children }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-white shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 ${onClick ? 'hover:shadow-md cursor-pointer transition-all duration-200' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
