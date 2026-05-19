import { cn } from '@utils/helpers';

interface ProgressBarProps {
  progress: number;
  className?: string;
  color?: string;
  showLabel?: boolean;
}

export function ProgressBar({ 
  progress, 
  className, 
  color = 'bg-forest-500',
  showLabel = false 
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={cn('w-full bg-gray-200 rounded-full h-2 overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500 ease-out', color)}
        style={{ width: `${clampedProgress}%` }}
      >
        {showLabel && (
          <span className="text-xs text-white px-2">{clampedProgress}%</span>
        )}
      </div>
    </div>
  );
}
