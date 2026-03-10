import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, Activity, Plus, Zap, TrendingUp, Sparkles } from 'lucide-react';
import HeatMap from '@/components/HeatMap';
import StatsCard from '@/components/StatsCard';
import RiskGauge from '@/components/RiskGauge';
import RiskPulseOrb from '@/components/RiskPulseOrb';
import TypewriterText from '@/components/TypewriterText';
import CountUpNumber from '@/components/CountUpNumber';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useHotspots, type Hotspot, getRiskLabel } from '@/hooks/useHotspots';
import { Link } from 'react-router-dom';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 20 } },
};

export default function HomePage() {
  const { data: hotspots = [], isLoading } = useHotspots();
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const high = hotspots.filter(v => v.risk_score >= 0.7).length;
  const active = hotspots.filter(v => v.status === 'active').length;
  const avgRisk = hotspots.length > 0 
    ? +(hotspots.reduce((a, v) => a + v.risk_score, 0) / hotspots.length).toFixed(2)
    : 0;

  return (
    <div className="pt-20 pb-24 md:pb-6 min-h-screen">
      <AnimatedBackground />
      <div className="container py-8 space-y-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-center space-y-5 py-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Risk Analysis
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            <TypewriterText 
              words={['HeatWave', 'SmartRisk', 'SafeZone', 'PredictAI']}
              className="min-w-[200px]"
            />{' '}
            <span className="text-foreground">Predictor</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            Real-time heatwave risk prediction for Karnataka. Report hotspots, track risks, protect communities.
          </p>
          
          {/* Floating Risk Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="flex justify-center pt-2"
          >
            <div className="relative">
              <RiskPulseOrb riskScore={avgRisk} size={160} />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-xs text-muted-foreground font-semibold mt-2 text-center"
              >
                District Avg Risk
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats with CountUp */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div variants={item}><StatsCard title="Total Hotspots" value={hotspots.length} icon={MapPin} delay={0} /></motion.div>
          <motion.div variants={item}><StatsCard title="High Risk" value={high} icon={AlertTriangle} variant="danger" delay={0.1} /></motion.div>
          <motion.div variants={item}><StatsCard title="Active" value={active} icon={Activity} variant="warning" delay={0.2} /></motion.div>
          <motion.div variants={item}><StatsCard title="Avg Risk" value={`${(avgRisk * 100).toFixed(0)}%`} icon={TrendingUp} variant="success" delay={0.3} /></motion.div>
        </motion.div>

        {/* Map + Detail */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-2">
            {isLoading ? (
              <div className="h-[450px] rounded-2xl bg-muted animate-pulse flex items-center justify-center">
                <div className="text-muted-foreground text-sm">Loading map data...</div>
              </div>
            ) : (
              <HeatMap hotspots={hotspots} onSelectHotspot={setSelected} className="h-[480px]" />
            )}
          </div>
          <div className="space-y-4">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 24, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="bg-card border border-border/60 rounded-2xl p-6 shadow-elevated space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-xl tracking-tight">{selected.village_name}</h2>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    selected.status === 'active' ? 'bg-destructive/10 text-destructive' :
                    selected.status === 'monitoring' ? 'bg-warning/10 text-warning' :
                    'bg-accent text-accent-foreground'
                  }`}>
                    {selected.status}
                  </span>
                </div>
                <RiskGauge score={selected.risk_score} size={150} />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Temperature', value: `${selected.temp}°C`, icon: '🌡️' },
                    { label: 'Humidity', value: `${selected.humidity}%`, icon: '💧' },
                    { label: 'Rain (24h)', value: `${selected.rain_mm}mm`, icon: '🌧️' },
                    { label: 'Stagnation', value: `${selected.water_stagnation_days}d`, icon: '🏊' },
                  ].map((item, i) => (
                    <motion.div 
                      key={item.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="bg-muted/50 rounded-xl p-3 border border-border/30"
                    >
                      <p className="text-muted-foreground text-xs flex items-center gap-1">{item.icon} {item.label}</p>
                      <p className="font-bold text-lg mt-0.5">{item.value}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card border border-border/60 rounded-2xl p-10 shadow-card text-center"
              >
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <MapPin className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                </motion.div>
                <p className="text-sm text-muted-foreground font-medium">Click a marker on the map to view details</p>
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/report"
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-bold text-base shadow-elevated glow transition-all"
              >
                <Plus className="w-5 h-5" />
                Report New Hotspot
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/timeline"
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-card border border-border/60 text-foreground font-bold text-base shadow-card hover:shadow-elevated transition-all"
              >
                <Sparkles className="w-5 h-5 text-primary" />
                View Risk Timeline
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
