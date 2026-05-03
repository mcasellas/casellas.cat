import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const StatusDot = ({ delay = 1.5 }: { delay?: number }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!visible) return <div className="w-2 h-2" />;

  return (
    <motion.span 
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="w-2 h-2 rounded-full bg-[#FFCC00]"
    />
  );
};
