import { motion } from 'framer-motion';

interface RiskPulseOrbProps {
  riskScore: number;
  size?: number;
}

export default function RiskPulseOrb({ riskScore, size = 180 }: RiskPulseOrbProps) {
  const color = riskScore >= 0.7
    ? { h: 0, s: 84, l: 60 }
    : riskScore >= 0.3
    ? { h: 38, s: 95, l: 54 }
    : { h: 152, s: 68, l: 38 };

  const hsl = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
  const hslDim = `hsl(${color.h}, ${color.s}%, ${color.l}%, 0.3)`;
  const hslGlow = `hsl(${color.h}, ${color.s}%, ${color.l}%, 0.15)`;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            border: `1px solid ${hslDim}`,
          }}
          animate={{
            scale: [1, 1.5 + i * 0.3],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2.5,
            delay: i * 0.8,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Glow backdrop */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.8,
          height: size * 0.8,
          background: `radial-gradient(circle, ${hslGlow}, transparent 70%)`,
          filter: 'blur(20px)',
        }}
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Core orb */}
      <motion.div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: size * 0.45,
          height: size * 0.45,
          background: `radial-gradient(circle at 35% 35%, hsl(${color.h}, ${color.s}%, ${color.l + 15}%), ${hsl}, hsl(${color.h}, ${color.s}%, ${color.l - 10}%))`,
          boxShadow: `
            0 0 30px ${hslDim},
            0 0 60px ${hslGlow},
            inset 0 -4px 12px hsl(${color.h}, ${color.s}%, ${color.l - 20}%, 0.4),
            inset 0 4px 12px hsl(${color.h}, ${color.s}%, ${color.l + 20}%, 0.3)
          `,
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Specular highlight */}
        <div
          className="absolute rounded-full"
          style={{
            width: '30%',
            height: '20%',
            top: '18%',
            left: '22%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.5), transparent)',
            borderRadius: '50%',
            filter: 'blur(3px)',
          }}
        />
        <span className="text-xl font-extrabold text-white drop-shadow-lg">
          {(riskScore * 100).toFixed(0)}%
        </span>
      </motion.div>
    </div>
  );
}
