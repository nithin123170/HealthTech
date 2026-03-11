import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Flame, Thermometer, Wind, Droplets } from 'lucide-react';

interface ThermalCell {
  x: number;
  y: number;
  temperature: number;
  heatFlow: { vx: number; vy: number };
  flux: number;
}

interface ThermalGridProps {
  width?: number;
  height?: number;
  cellSize?: number;
  hotspots?: Array<{ lat: number; lng: number; risk_score: number; temp: number }>;
  className?: string;
}

export default function ThermalGrid({ 
  width = 800, 
  height = 600, 
  cellSize = 20,
  hotspots = [],
  className = '' 
}: ThermalGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<ThermalCell[][]>([]);
  const [hoveredCell, setHoveredCell] = useState<ThermalCell | null>(null);
  const animationRef = useRef<number>();

  // Initialize thermal grid
  const initializeGrid = useCallback(() => {
    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);
    const newGrid: ThermalCell[][] = [];

    for (let y = 0; y < rows; y++) {
      newGrid[y] = [];
      for (let x = 0; x < cols; x++) {
        newGrid[y][x] = {
          x: x * cellSize,
          y: y * cellSize,
          temperature: 25 + Math.random() * 10, // Base temp 25-35°C
          heatFlow: { vx: 0, vy: 0 },
          flux: 0
        };
      }
    }

    // Apply hotspot heat sources
    hotspots.forEach(hotspot => {
      const gridX = Math.floor((hotspot.lng + 180) / 360 * (width / cellSize));
      const gridY = Math.floor((90 - hotspot.lat) / 180 * (height / cellSize));
      
      for (let dy = -5; dy <= 5; dy++) {
        for (let dx = -5; dx <= 5; dx++) {
          const x = gridX + dx;
          const y = gridY + dy;
          
          if (x >= 0 && x < newGrid[0].length && y >= 0 && y < newGrid.length) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            const heatInfluence = (hotspot.temp * hotspot.risk_score) / (distance + 1);
            newGrid[y][x].temperature += heatInfluence;
            newGrid[y][x].flux = heatInfluence;
          }
        }
      }
    });

    return newGrid;
  }, [width, height, cellSize, hotspots]);

  // Calculate heat flow vectors
  const calculateHeatFlow = useCallback((grid: ThermalCell[][]) => {
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    
    for (let y = 1; y < newGrid.length - 1; y++) {
      for (let x = 1; x < newGrid[0].length - 1; x++) {
        const temp = newGrid[y][x].temperature;
        const tempLeft = newGrid[y][x - 1].temperature;
        const tempRight = newGrid[y][x + 1].temperature;
        const tempUp = newGrid[y - 1][x].temperature;
        const tempDown = newGrid[y + 1][x].temperature;
        
        // Calculate heat gradient
        const dx = (tempRight - tempLeft) / 2;
        const dy = (tempDown - tempUp) / 2;
        
        // Heat flows from hot to cold (negative gradient)
        newGrid[y][x].heatFlow = {
          vx: -dx * 0.1,
          vy: -dy * 0.1
        };
      }
    }
    
    return newGrid;
  }, []);

  // Render thermal grid
  const renderGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Draw thermal cells
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        // Color based on temperature
        const temp = cell.temperature;
        const normalizedTemp = Math.min(Math.max((temp - 20) / 30, 0), 1);
        
        // Thermal gradient: blue -> green -> yellow -> red
        let r, g, b;
        if (normalizedTemp < 0.33) {
          r = 0;
          g = Math.floor(normalizedTemp * 3 * 255);
          b = 255;
        } else if (normalizedTemp < 0.67) {
          r = Math.floor((normalizedTemp - 0.33) * 3 * 255);
          g = 255;
          b = Math.floor((1 - (normalizedTemp - 0.33) * 3) * 255);
        } else {
          r = 255;
          g = Math.floor((1 - (normalizedTemp - 0.67) * 3) * 255);
          b = 0;
        }

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
        ctx.fillRect(cell.x, cell.y, cellSize - 1, cellSize - 1);

        // Draw heat flow vectors
        if (Math.abs(cell.heatFlow.vx) > 0.01 || Math.abs(cell.heatFlow.vy) > 0.01) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cell.x + cellSize/2, cell.y + cellSize/2);
          ctx.lineTo(
            cell.x + cellSize/2 + cell.heatFlow.vx * 50,
            cell.y + cellSize/2 + cell.heatFlow.vy * 50
          );
          ctx.stroke();
        }

        // Draw flux points
        if (cell.flux > 5) {
          ctx.fillStyle = 'rgba(255, 100, 0, 0.8)';
          ctx.beginPath();
          ctx.arc(cell.x + cellSize/2, cell.y + cellSize/2, Math.min(cell.flux / 2, 5), 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= width; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, [grid, width, height, cellSize]);

  // Animation loop
  const animate = useCallback(() => {
    setGrid(prevGrid => {
      const newGrid = calculateHeatFlow(prevGrid);
      
      // Apply heat diffusion
      for (let y = 1; y < newGrid.length - 1; y++) {
        for (let x = 1; x < newGrid[0].length - 1; x++) {
          const avgTemp = (
            prevGrid[y-1][x].temperature +
            prevGrid[y+1][x].temperature +
            prevGrid[y][x-1].temperature +
            prevGrid[y][x+1].temperature
          ) / 4;
          
          newGrid[y][x].temperature = newGrid[y][x].temperature * 0.9 + avgTemp * 0.1;
        }
      }
      
      return newGrid;
    });
    
    animationRef.current = requestAnimationFrame(animate);
  }, [calculateHeatFlow]);

  // Initialize grid on mount
  useEffect(() => {
    const initialGrid = initializeGrid();
    setGrid(initialGrid);
  }, [initializeGrid]);

  // Start animation
  useEffect(() => {
    if (grid.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, grid.length]);

  // Render on grid update
  useEffect(() => {
    renderGrid();
  }, [renderGrid]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    
    if (grid[gridY] && grid[gridY][gridX]) {
      setHoveredCell(grid[gridY][gridX]);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-border rounded-lg bg-black/50"
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={() => setHoveredCell(null)}
      />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-4 space-y-2">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          Thermal Analysis
        </h4>
        
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            <span>Cold (&lt;25°C)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span>Moderate (25-35°C)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded" />
            <span>Warm (35-45°C)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span>Hot (&gt;45°C)</span>
          </div>
        </div>
        
        <div className="space-y-1 text-xs pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Wind className="w-3 h-3 text-blue-400" />
            <span>White lines: Heat flow</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-3 h-3 text-orange-400" />
            <span>Orange dots: Flux points</span>
          </div>
        </div>
      </div>

      {/* Hover info */}
      {hoveredCell && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 text-xs space-y-1 pointer-events-none"
          style={{
            left: Math.min(hoveredCell.x + cellSize, width - 150),
            top: Math.min(hoveredCell.y + cellSize, height - 100)
          }}
        >
          <div className="flex items-center gap-2">
            <Thermometer className="w-3 h-3" />
            <span>Temp: {hoveredCell.temperature.toFixed(1)}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-3 h-3" />
            <span>Flow: ({hoveredCell.heatFlow.vx.toFixed(2)}, {hoveredCell.heatFlow.vy.toFixed(2)})</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-3 h-3" />
            <span>Flux: {hoveredCell.flux.toFixed(1)}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
