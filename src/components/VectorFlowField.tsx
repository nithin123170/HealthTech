import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Wind, ArrowRight, Activity } from 'lucide-react';

interface VectorPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  magnitude: number;
  angle: number;
}

interface VectorFlowFieldProps {
  width?: number;
  height?: number;
  density?: number;
  flowData?: Array<{ x: number; y: number; strength: number; direction: number }>;
  className?: string;
}

export default function VectorFlowField({ 
  width = 800, 
  height = 600, 
  density = 30,
  flowData = [],
  className = '' 
}: VectorFlowFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [vectors, setVectors] = useState<VectorPoint[]>([]);
  const [hoveredVector, setHoveredVector] = useState<VectorPoint | null>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  // Generate vector field from flow data
  const generateVectorField = useCallback(() => {
    const newVectors: VectorPoint[] = [];
    const step = 100 / density;

    for (let x = step; x < width; x += step) {
      for (let y = step; y < height; y += step) {
        let vx = 0, vy = 0;

        // Calculate influence from all flow sources
        flowData.forEach(source => {
          const dx = x - source.x;
          const dy = y - source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0 && distance < 200) {
            const influence = source.strength / (distance * distance);
            const sourceVx = Math.cos(source.direction) * influence;
            const sourceVy = Math.sin(source.direction) * influence;
            
            vx += sourceVx;
            vy += sourceVy;
          }
        });

        // Add some turbulence
        vx += Math.sin(x * 0.01 + timeRef.current) * 0.5;
        vy += Math.cos(y * 0.01 + timeRef.current) * 0.5;

        const magnitude = Math.sqrt(vx * vx + vy * vy);
        const angle = Math.atan2(vy, vx);

        newVectors.push({ x, y, vx, vy, magnitude, angle });
      }
    }

    return newVectors;
  }, [width, height, density, flowData]);

  // Render vector field
  const renderVectorField = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Draw background gradient
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
    gradient.addColorStop(1, 'rgba(30, 58, 138, 0.02)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw vectors
    vectors.forEach(vector => {
      const { x, y, vx, vy, magnitude, angle } = vector;
      
      // Color based on magnitude
      const normalizedMag = Math.min(magnitude * 20, 1);
      const r = Math.floor(255 * normalizedMag);
      const g = Math.floor(100 * (1 - normalizedMag));
      const b = Math.floor(200 * (1 - normalizedMag));
      
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
      ctx.lineWidth = Math.max(1, magnitude * 3);

      // Draw vector line
      ctx.beginPath();
      ctx.moveTo(x, y);
      const endX = x + vx * 30;
      const endY = y + vy * 30;
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Draw arrowhead
      if (magnitude > 0.1) {
        ctx.save();
        ctx.translate(endX, endY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-8, -4);
        ctx.lineTo(-8, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Draw origin point
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw flow lines (streamlines)
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 20; i++) {
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      let currentX = startX;
      let currentY = startY;
      
      for (let step = 0; step < 50; step++) {
        const vector = vectors.find(v => 
          Math.abs(v.x - currentX) < 20 && Math.abs(v.y - currentY) < 20
        );
        
        if (vector) {
          currentX += vector.vx * 5;
          currentY += vector.vy * 5;
          ctx.lineTo(currentX, currentY);
        } else {
          break;
        }
        
        if (currentX < 0 || currentX > width || currentY < 0 || currentY > height) {
          break;
        }
      }
      
      ctx.stroke();
    }
  }, [vectors, width, height]);

  // Animation loop
  const animate = useCallback(() => {
    timeRef.current += 0.05;
    setVectors(generateVectorField());
    animationRef.current = requestAnimationFrame(animate);
  }, [generateVectorField]);

  // Initialize on mount
  useEffect(() => {
    setVectors(generateVectorField());
  }, [generateVectorField]);

  // Start animation
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Render on vectors update
  useEffect(() => {
    renderVectorField();
  }, [renderVectorField]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const nearestVector = vectors.find(v => 
      Math.abs(v.x - x) < 20 && Math.abs(v.y - y) < 20
    );
    
    setHoveredVector(nearestVector || null);
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-border rounded-lg bg-slate-900/50"
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={() => setHoveredVector(null)}
      />
      
      {/* Controls */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Wind className="w-4 h-4 text-blue-500" />
          Vector Flow Field
        </h4>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>Low flow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span>Medium flow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>High flow</span>
          </div>
        </div>
        
        <div className="space-y-1 text-xs pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-3 h-3 text-blue-400" />
            <span>Arrows: Flow direction</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>Lines: Streamlines</span>
          </div>
        </div>
      </div>

      {/* Hover info */}
      {hoveredVector && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 text-xs space-y-1 pointer-events-none"
          style={{
            left: Math.min(hoveredVector.x, width - 150),
            top: Math.min(hoveredVector.y, height - 80)
          }}
        >
          <div className="flex items-center gap-2">
            <Wind className="w-3 h-3" />
            <span>Magnitude: {hoveredVector.magnitude.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-3 h-3" />
            <span>Angle: {(hoveredVector.angle * 180 / Math.PI).toFixed(0)}°</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3" />
            <span>Flow: ({hoveredVector.vx.toFixed(2)}, {hoveredVector.vy.toFixed(2)})</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
