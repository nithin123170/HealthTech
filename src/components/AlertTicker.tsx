import { motion } from 'framer-motion';
import { AlertTriangle, Radio } from 'lucide-react';
import { useAlerts } from '@/hooks/useHotspots';
import { format } from 'date-fns';

export default function AlertTicker() {
  const { data: alerts = [] } = useAlerts();
  const recent = alerts.filter(a => a.status !== 'resolved').slice(0, 5);

  if (recent.length === 0) return null;

  const tickerText = recent
    .map(a => `⚠️ ${a.village} — ${(a.risk_score * 100).toFixed(0)}% risk`)
    .join('   •   ');

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full overflow-hidden bg-destructive/10 border-b border-destructive/20 py-2"
    >
      <div className="container flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0">
          <Radio className="w-3.5 h-3.5 text-destructive animate-pulse" />
          <span className="text-xs font-bold text-destructive uppercase tracking-wider">Live</span>
        </div>
        <div className="overflow-hidden flex-1">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="flex whitespace-nowrap"
          >
            <span className="text-xs font-medium text-destructive/80 pr-8">
              {tickerText}   •   {tickerText}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
