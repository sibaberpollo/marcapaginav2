interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

// Generate a consistent color based on the name
function getColorFromName(name: string): string {
  // Special case for Redacción Marcapágina - use brand yellow
  if (name.toLowerCase().includes('redacción') || name.toLowerCase().includes('marcapágina') || name.toLowerCase().includes('marcapagina')) {
    return 'bg-brand-yellow text-brand-black-static';
  }

  const colors = [
    'bg-amber-500',
    'bg-rose-500',
    'bg-violet-500',
    'bg-blue-500',
    'bg-teal-500',
    'bg-emerald-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-cyan-500',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const initials = getInitials(name);
  const colorClass = getColorFromName(name);
  const sizeClass = sizeClasses[size];
  const isYellow = colorClass.includes('brand-yellow');

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${isYellow ? '' : 'text-white'} ${className}`}
    >
      {initials}
    </div>
  );
}
