import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Leaf {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

export function LeafBackground() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const generateLeaves = () => {
      const newLeaves: Leaf[] = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 15 + Math.random() * 10,
        size: 15 + Math.random() * 10,
        rotation: Math.random() * 360,
      }));
      setLeaves(newLeaves);
    };

    generateLeaves();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{ y: -50, opacity: 0, rotate: 0 }}
          animate={{
            y: '100vh',
            opacity: [0, 1, 1, 0],
            rotate: leaf.rotation + 360,
            x: [0, 30, -30, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: `${leaf.x}%`,
            width: leaf.size,
            height: leaf.size,
            background: 'linear-gradient(45deg, #f293b3, #7aad93)',
            borderRadius: '0 100% 0 100%',
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}
