import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mood, MoodType } from '@/types';
import { cn } from '@utils/helpers';

const moods: Mood[] = [
  { type: 'happy', label: '开心', emoji: '😊', color: 'bg-yellow-100 text-yellow-700' },
  { type: 'calm', label: '平静', emoji: '😌', color: 'bg-green-100 text-green-700' },
  { type: 'tired', label: '疲惫', emoji: '😔', color: 'bg-blue-100 text-blue-700' },
  { type: 'anxious', label: '焦虑', emoji: '😰', color: 'bg-purple-100 text-purple-700' },
  { type: 'sad', label: '难过', emoji: '😢', color: 'bg-indigo-100 text-indigo-700' },
  { type: 'excited', label: '兴奋', emoji: '🤗', color: 'bg-pink-100 text-pink-700' },
];

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onSelect: (mood: MoodType) => void;
}

export function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  const [hoveredMood, setHoveredMood] = useState<MoodType | null>(null);

  return (
    <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
      <div className="flex gap-3 min-w-max">
        {moods.map((mood) => (
          <motion.button
            key={mood.type}
            onClick={() => onSelect(mood.type)}
            onHoverStart={() => setHoveredMood(mood.type)}
            onHoverEnd={() => setHoveredMood(null)}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-300 flex-shrink-0 w-16',
              selectedMood === mood.type 
                ? 'bg-white shadow-lg scale-105 ring-2 ring-forest-300' 
                : 'hover:bg-white/50',
              hoveredMood === mood.type && !selectedMood && 'bg-white/30'
            )}
          >
            <motion.span 
              className="text-3xl filter drop-shadow-md"
              animate={selectedMood === mood.type ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {mood.emoji}
            </motion.span>
            <span className={cn(
              'text-xs font-medium',
              selectedMood === mood.type ? 'text-forest-700' : 'text-forest-600'
            )}>
              {mood.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
