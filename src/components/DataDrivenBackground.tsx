import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback, forwardRef } from 'react';
import { useHotspots, useAlerts } from '@/hooks/useHotspots';
import { Thermometer, Droplets, Wind, AlertTriangle, Activity, Zap } from 'lucide-react';

interface HeatDataPoint {
  id: string;
  x: number;
  y: number;
  intensity: number;
  temp: number;
  humidity: number;
  risk: number;
  type: 'hotspot' | 'alert' | 'resolved';
}

interface BackgroundParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  delay: number;
  intensity: number;
}

function HeatWaveRipple({ dataPoint, index }: { dataPoint: HeatDataPoint; index: number }) {
  const intensity = dataPoint.intensity;
  const color = intensity > 0.7 ? 'hsl(0, 84%, 60%)' : 
                intensity > 0.4 ? 'hsl(38, 95%, 54%)' : 
                'hsl(152, 68%, 38%)';

  return (
    <motion.div
      key={dataPoint.id}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.3, 0.1, 0],
        scale: [0.5, 2, 3, 4],
      }}
      transition={{
        duration: 4 + index * 0.5,
        repeat: Infinity,
        repeatDelay: 2,
        ease: 'easeOut',
      }}
      className="absolute rounded-full pointer-events-none"
      style={{
        width: '60px',
        height: '60px',
        left: `${dataPoint.x}%`,
        top: `${dataPoint.y}%`,
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
        filter: 'blur(2px)',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
}

function DataParticle({ particle }: { particle: BackgroundParticle }) {
  return (
    <motion.div
      key={particle.id}
      initial={{ 
        opacity: 0, 
        x: `${particle.x}%`, 
        y: `${particle.y}%`,
        scale: 0 
      }}
      animate={{
        opacity: [0, particle.intensity * 0.6, particle.intensity * 0.3, 0],
        x: [`${particle.x}%`, `${particle.x + 10}%`, `${particle.x - 5}%`, `${particle.x}%`],
        y: [`${particle.y}%`, `${particle.y - 15}%`, `${particle.y + 8}%`, `${particle.y}%`],
        scale: [0, 1, 0.8, 0],
      }}
      transition={{
        duration: particle.speed,
        delay: particle.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="absolute rounded-full pointer-events-none"
      style={{
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        background: `radial-gradient(circle, ${particle.color}, transparent 70%)`,
        filter: 'blur(1px)',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
}

const DataDrivenBackground = forwardRef<HTMLDivElement>(function DataDrivenBackground(_props, ref) {
  const { data: hotspots = [] } = useHotspots();
  const { data: alerts = [] } = useAlerts();
  
  // Process data into heat points
  const [heatDataPoints, setHeatDataPoints] = useState<HeatDataPoint[]>([]);
  const [particles, setParticles] = useState<BackgroundParticle[]>([]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  // Generate heat data points from real data
  useEffect(() => {
    const points: HeatDataPoint[] = [];
    
    // Add hotspots
    hotspots.forEach((hotspot, index) => {
      points.push({
        id: `hotspot-${hotspot.id}`,
        x: 20 + (index * 15) % 60, // Distribute across screen
        y: 20 + (index * 25) % 60,
        intensity: hotspot.risk_score,
        temp: hotspot.temp || 35,
        humidity: hotspot.humidity || 60,
        risk: hotspot.risk_score,
        type: hotspot.risk_score >= 0.7 ? 'alert' : 'hotspot'
      });
    });
    
    // Add alerts
    alerts.filter(a => a.status === 'active').forEach((alert, index) => {
      points.push({
        id: `alert-${alert.id}`,
        x: 70 + (index * 10) % 20,
        y: 30 + (index * 15) % 40,
        intensity: 0.9,
        temp: 40,
        humidity: 80,
        risk: 0.9,
        type: 'alert'
      });
    });
    
    setHeatDataPoints(points);
  }, [hotspots, alerts]);

  // Generate particles based on data intensity
  useEffect(() => {
    const baseParticles = 15;
    const intensityMultiplier = Math.max(1, heatDataPoints.length * 2);
    const particleCount = baseParticles + intensityMultiplier;
    
    const newParticles: BackgroundParticle[] = Array.from({ length: particleCount }, (_, i) => {
      const intensity = Math.random() * 0.5 + 0.3;
      const avgRisk = heatDataPoints.length > 0 
        ? heatDataPoints.reduce((sum, p) => sum + p.risk, 0) / heatDataPoints.length 
        : 0.3;
      
      // Color based on overall risk level
      const color = avgRisk > 0.7 ? 'hsl(0, 84%, 60%)' : 
                   avgRisk > 0.4 ? 'hsl(38, 95%, 54%)' : 
                   'hsl(152, 68%, 38%)';
      
      return {
        id: `particle-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3 + Math.random() * 6,
        color,
        speed: 6 + Math.random() * 8,
        delay: Math.random() * 5,
        intensity
      };
    });
    
    setParticles(newParticles);
  }, [heatDataPoints]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Calculate overall metrics for background
  const avgRisk = heatDataPoints.length > 0 
    ? heatDataPoints.reduce((sum, p) => sum + p.risk, 0) / heatDataPoints.length 
    : 0;
  
  const avgTemp = heatDataPoints.length > 0
    ? heatDataPoints.reduce((sum, p) => sum + p.temp, 0) / heatDataPoints.length
    : 30;

  // Dynamic background gradient based on data
  const backgroundGradient = avgRisk > 0.7 
    ? 'linear-gradient(135deg, hsl(0, 84%, 15%) 0%, hsl(38, 95%, 20%) 50%, hsl(200, 75%, 15%) 100%)'
    : avgRisk > 0.4
    ? 'linear-gradient(135deg, hsl(38, 95%, 18%) 0%, hsl(152, 68%, 20%) 50%, hsl(200, 75%, 18%) 100%)'
    : 'linear-gradient(135deg, hsl(152, 68%, 20%) 0%, hsl(200, 75%, 22%) 50%, hsl(168, 72%, 20%) 100%)';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Dynamic background based on data */}
      <div 
        className="absolute inset-0 transition-all duration-3000"
        style={{ background: backgroundGradient }}
      />
      
      {/* Data-driven aurora effects */}
      <AnimatePresence>
        {avgRisk > 0.5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.02, 0.08, 0.02],
              rotate: [0, 2, -1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-1/2 -left-1/4 w-[150%] h-[100%]"
            style={{
              background: `linear-gradient(135deg, transparent 30%, hsl(0, 84%, 60%, ${avgRisk * 0.1}) 45%, hsl(38, 95%, 54%, ${avgRisk * 0.08}) 55%, transparent 70%)`,
              filter: 'blur(60px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Heat ripples from data points */}
      {heatDataPoints.map((point, index) => (
        <HeatWaveRipple key={point.id} dataPoint={point} index={index} />
      ))}

      {/* Data particles */}
      {particles.map((particle) => (
        <DataParticle key={particle.id} particle={particle} />
      ))}

      {/* Mouse-following data glow */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none hidden md:block"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          background: `radial-gradient(circle, hsl(38, 95%, 54%, ${avgRisk * 0.08}), transparent 60%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Data visualization orbs */}
      <motion.div
        animate={{ 
          y: [-20, 20, -20], 
          x: [-10, 10, -10], 
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-[15%] w-72 h-72 rounded-full opacity-[0.04]"
        style={{ 
          background: `radial-gradient(circle, hsl(0, 84%, 60%), transparent 70%)`,
          opacity: avgRisk * 0.06
        }}
      />
      <motion.div
        animate={{ 
          y: [15, -25, 15], 
          x: [8, -12, 8], 
          scale: [1, 1.15, 1] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-40 right-[10%] w-96 h-96 rounded-full opacity-[0.03]"
        style={{ 
          background: `radial-gradient(circle, hsl(38, 95%, 54%), transparent 70%)`,
          opacity: avgTemp > 35 ? 0.05 : 0.02
        }}
      />
      <motion.div
        animate={{ 
          y: [10, -15, 10] 
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-20 left-[40%] w-64 h-64 rounded-full opacity-[0.04]"
        style={{ 
          background: `radial-gradient(circle, hsl(152, 68%, 38%), transparent 70%)`,
          opacity: (1 - avgRisk) * 0.06
        }}
      />

      {/* Data overlay grid */}
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

      {/* Floating data indicators */}
      <div className="absolute top-4 left-4 text-white/20 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <Thermometer className="w-3 h-3" />
          <span>Avg: {avgTemp.toFixed(1)}°C</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3 h-3" />
          <span>Risk: {(avgRisk * 100).toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3" />
          <span>Points: {heatDataPoints.length}</span>
        </div>
      </div>
    </div>
  );
});

export default DataDrivenBackground;
