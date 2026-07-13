import { PawPrint } from 'lucide-react';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name: string;
  src?: string;
  size?: Size;
  className?: string;
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
};

const colors = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-sky-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-teal-500',
  'bg-indigo-500',
];

function getColor(name: string) {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function getInitials(name: string) {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return parts[0][0] + parts[parts.length - 1][0];
  return name.slice(0, 2);
}

export default function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  const initials = getInitials(name);
  const color = getColor(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover shrink-0 ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div className={`rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${color} ${sizeClasses[size]} ${className}`}>
      {initials || <PawPrint className="h-1/2 w-1/2" />}
    </div>
  );
}
