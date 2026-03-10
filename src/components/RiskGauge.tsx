import { motion } from 'framer-motion';
import { getRiskLabel } from '@/hooks/useHotspots';

interface RiskGaugeProps {
  score: number;
  size?: number;
}

export default function RiskGauge({ score, size = 160 }: RiskGaugeProps) {
  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius;
  const filled = circumference * score;
  const color = score >= 0.7 ? 'hsl(0, 84%, 60%)' : score >= 0.3 ? 'hsl(38, 95%, 54%)' : 'hsl(152, 68%, 38%)';
  const glowColor = score >= 0.7 ? 'hsl(0, 84%, 60%)' : score >= 0.3 ? 'hsl(38, 95%, 54%)' : 'hsl(152, 68%, 38%)';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        <defs>
          <filter id={`glow-${score}`}>
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path
          d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <motion.path
          d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - filled }}
          transition={{ duration: 1.8, ease: [0.34, 1.56, 0.64, 1] }}
          filter={`url(#glow-${score})`}
        />
      </svg>
      <div className="text-center -mt-8">
        <motion.span
          className="text-4xl font-extrabold tracking-tight"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
        >
          {(score * 100).toFixed(0)}%
        </motion.span>
        <p className="text-sm text-muted-foreground font-semibold mt-0.5">{getRiskLabel(score)}</p>
      </div>
    </div>
  );
}
