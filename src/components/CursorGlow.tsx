import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useCallback } from 'react';

export default function CursorGlow() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMove = useCallback((e: MouseEvent) => {
    x.set(e.clientX);
    y.set(e.clientY);
  }, [x, y]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [handleMove]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-screen"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        background: 'radial-gradient(circle, hsl(152, 68%, 50%, 0.4), hsl(200, 75%, 42%, 0.1), transparent 70%)',
        boxShadow: '0 0 20px hsl(152, 68%, 38%, 0.3), 0 0 60px hsl(152, 68%, 38%, 0.1)',
      }}
    />
  );
}
