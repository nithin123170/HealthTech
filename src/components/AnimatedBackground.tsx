import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState, useCallback, forwardRef } from 'react';

function FloatingParticle({ delay, size, x, y, color }: { delay: number; size: number; x: string; y: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0.3, 0.6, 0],
        scale: [0.5, 1.2, 0.8, 1, 0.5],
        y: [0, -30, 10, -20, 0],
        x: [0, 15, -10, 5, 0],
      }}
      transition={{
        duration: 8 + Math.random() * 6,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
        filter: 'blur(1px)',
      }}
    />
  );
}

const AnimatedBackground = forwardRef<HTMLDivElement>(function AnimatedBackground(_props, ref) {
  const [particles] = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      size: 4 + Math.random() * 8,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      color: [
        'hsl(152, 68%, 38%)',
        'hsl(200, 75%, 42%)',
        'hsl(38, 95%, 54%)',
        'hsl(168, 72%, 32%)',
        'hsl(280, 60%, 50%)',
      ][Math.floor(Math.random() * 5)],
    }))
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="gradient-mesh absolute inset-0" />
      
      {/* Aurora bands */}
      <motion.div
        animate={{ 
          opacity: [0.03, 0.07, 0.03],
          rotate: [0, 3, -2, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-1/2 -left-1/4 w-[150%] h-[100%]"
        style={{
          background: 'linear-gradient(135deg, transparent 30%, hsl(152, 68%, 38%, 0.08) 45%, hsl(200, 75%, 42%, 0.05) 55%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <motion.div
        animate={{ 
          opacity: [0.02, 0.05, 0.02],
          rotate: [0, -2, 3, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute -bottom-1/2 -right-1/4 w-[150%] h-[100%]"
        style={{
          background: 'linear-gradient(225deg, transparent 30%, hsl(280, 60%, 50%, 0.05) 45%, hsl(38, 95%, 54%, 0.04) 55%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <FloatingParticle key={p.id} {...p} />
      ))}

      {/* Mouse-following glow */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none hidden md:block"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, hsl(152, 68%, 38%, 0.06), transparent 60%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-[15%] w-72 h-72 rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, hsl(152, 68%, 38%), transparent 70%)' }}
      />
      <motion.div
        animate={{ y: [15, -25, 15], x: [8, -12, 8], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-40 right-[10%] w-96 h-96 rounded-full opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, hsl(200, 75%, 42%), transparent 70%)' }}
      />
      <motion.div
        animate={{ y: [10, -15, 10] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-20 left-[40%] w-64 h-64 rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, hsl(38, 95%, 54%), transparent 70%)' }}
      />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
});

export default AnimatedBackground;
