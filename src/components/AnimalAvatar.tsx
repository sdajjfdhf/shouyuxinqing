import { cn } from '@utils/helpers';
import { Animal } from '@/types';
import { animalImages } from '@/lib/images';

interface AnimalAvatarProps {
  animal: Animal;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  onClick?: () => void;
  className?: string;
  useImage?: boolean;
}

const sizeMap = {
  sm: 'w-10 h-10 text-xl',
  md: 'w-16 h-16 text-3xl',
  lg: 'w-24 h-24 text-5xl',
  xl: 'w-32 h-32 text-6xl',
};

const imageSizeMap = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

export function AnimalAvatar({
  animal,
  size = 'md',
  animate = true,
  onClick,
  className,
  useImage = false,
}: AnimalAvatarProps) {
  const getImagePath = () => {
    const animalName = animal.name.toLowerCase();
    if (animalName.includes('兔') || animalName.includes('rabbit')) return animalImages.rabbit;
    if (animalName.includes('狐') || animalName.includes('fox')) return animalImages.fox;
    if (animalName.includes('熊') || animalName.includes('bear')) return animalImages.bear;
    if (animalName.includes('熊猫') || animalName.includes('panda')) return animalImages.panda;
    if (animalName.includes('鹿') || animalName.includes('deer')) return animalImages.deer;
    return null;
  };

  const imagePath = getImagePath();

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-3xl flex items-center justify-center shadow-inner cursor-pointer',
        'bg-gradient-to-br',
        animal.color,
        animate && 'animate-float',
        'filter drop-shadow-lg hover:scale-105 transition-transform',
        className
      )}
    >
      {useImage && imagePath ? (
        <img
          src={imagePath}
          alt={animal.name}
          className={cn('object-contain', imageSizeMap[size])}
        />
      ) : (
        <span className={sizeMap[size]}>{animal.emoji}</span>
      )}
    </div>
  );
}
