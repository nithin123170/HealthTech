import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  delay?: number;
}

const variantStyles = {
  default: {
    card: 'bg-card border border-border/60',
    icon: 'bg-muted text-muted-foreground',
    text: '',
    value: '',
  },
  danger: {
    card: 'gradient-danger glow-danger',
    icon: 'bg-primary-foreground/20 text-primary-foreground',
    text: 'text-primary-foreground',
    value: 'text-primary-foreground',
  },
  warning: {
    card: 'gradient-warning glow-warning',
    icon: 'bg-primary-foreground/20 text-foreground',
    text: 'text-foreground',
    value: 'text-foreground',
  },
  success: {
    card: 'gradient-primary glow',
    icon: 'bg-primary-foreground/20 text-primary-foreground',
    text: 'text-primary-foreground',
    value: 'text-primary-foreground',
  },
};

export default function StatsCard({ title, value, subtitle, icon: Icon, variant = 'default', delay = 0 }: StatsCardProps) {
  const s = variantStyles[variant];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`rounded-2xl p-5 shadow-card cursor-default transition-shadow hover:shadow-elevated ${s.card}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${variant === 'default' ? 'text-muted-foreground' : 'opacity-80'} ${s.text}`}>{title}</p>
          <motion.p 
            className={`text-3xl font-extrabold mt-1.5 tracking-tight ${s.value}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring' }}
          >
            {value}
          </motion.p>
          {subtitle && <p className={`text-xs mt-1 ${variant === 'default' ? 'text-muted-foreground' : 'opacity-70'} ${s.text}`}>{subtitle}</p>}
        </div>
        <motion.div 
          whileHover={{ rotate: 12 }}
          className={`p-2.5 rounded-xl ${s.icon}`}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      </div>
    </motion.div>
  );
}
