import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, Activity, Plus, Zap, TrendingUp, Sparkles } from 'lucide-react';
import HeatMap from '@/components/HeatMap';
import StatsCard from '@/components/StatsCard';
import RiskGauge from '@/components/RiskGauge';
import RiskPulseOrb from '@/components/RiskPulseOrb';
import TypewriterText from '@/components/TypewriterText';
import CountUpNumber from '@/components/CountUpNumber';
import DataDrivenBackground from '@/components/DataDrivenBackground';
import ThermalGrid from '@/components/ThermalGrid';
import VectorFlowField from '@/components/VectorFlowField';
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
      <DataDrivenBackground />
      <div className="container py-8 space-y-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative text-center space-y-6 py-12 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/90 via-indigo-900/90 to-purple-900/90 backdrop-blur-xl border border-blue-300/30 shadow-2xl"
        >
          {/* Government-Grade Background Elements */}
          <div className="absolute inset-0">
            <motion.div
              animate={{ 
                background: [
                  'linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                  'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                  'linear-gradient(225deg, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                  'linear-gradient(315deg, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0"
            />
            
            {/* Professional Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-12 gap-px h-full">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-blue-300/30"></div>
                ))}
              </div>
              <div className="grid grid-rows-8 gap-px h-full absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-blue-300/30"></div>
                ))}
              </div>
            </div>
            
            {/* Floating Professional Icons */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.4, 0.2, 0.4, 0],
                  scale: [0.5, 1, 0.8, 1, 0.8],
                  y: [0, -30, 10, -20, 0],
                  x: [0, 15, -10, 5, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 6 + i * 0.5, 
                  delay: i * 0.3, 
                  repeat: Infinity 
                }}
                className="absolute text-2xl opacity-60"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${10 + (i % 2) * 60}%`,
                }}
              >
                {i % 2 === 0 ? '🛡️' : '🏛️'}
              </motion.div>
            ))}
            
            {/* Professional Pulse Rings */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full border-2 border-blue-400/30"
              style={{ transform: 'translate(-50%, -50%)' }}
            />
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.05, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full border border-blue-300/20"
              style={{ transform: 'translate(-50%, -50%)' }}
            />
          </div>

          {/* Government Status Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg border-2 border-white/20 backdrop-blur-sm"
          >
            <div className="relative">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
            GOVERNMENT APPROVED SYSTEM
          </motion.div>

          {/* Professional Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-5xl md:text-7xl font-black tracking-tight"
          >
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
              Karnataka HeatWave AI
            </span>
          </motion.h1>

          {/* Government Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 font-semibold max-w-3xl mx-auto leading-relaxed"
          >
            �️ Government of Karnataka - Official Heatwave Risk Management System
            <br />
            <span className="text-lg text-white/80">�️ Protecting 70+ Million Citizens with AI-Powered Early Warning Technology</span>
          </motion.p>

          {/* Professional Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border border-white/30">
              <div className="text-2xl font-bold text-blue-300">38.5°C</div>
              <div className="text-sm text-white/80">Current Temperature</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border border-white/30">
              <div className="text-2xl font-bold text-red-300">HIGH</div>
              <div className="text-sm text-white/80">Risk Level</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border border-white/30">
              <div className="text-2xl font-bold text-green-300">12</div>
              <div className="text-sm text-white/80">Active Districts</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border border-white/30">
              <div className="text-2xl font-bold text-purple-300">70M+</div>
              <div className="text-sm text-white/80">Protected Citizens</div>
            </div>
          </motion.div>

          {/* Government CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <Link to="/report">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-white/20"
              >
                📸 Report Emergency
              </motion.button>
            </Link>
            <Link to="/timeline">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-white/20"
              >
                📊 Command Center
              </motion.button>
            </Link>
          </motion.div>

          {/* Government Authority Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">GOV</span>
            </div>
            <div className="text-left">
              <div className="text-white font-semibold text-sm">Official State System</div>
              <div className="text-white/70 text-xs">Department of Disaster Management</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Government Stats Dashboard */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div variants={item} className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">Active Zones</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{hotspots.length}</div>
            <div className="text-xs text-blue-700">Monitored Districts</div>
          </motion.div>
          <motion.div variants={item} className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-semibold text-red-900">Critical Alerts</span>
            </div>
            <div className="text-2xl font-bold text-red-900">{high}</div>
            <div className="text-xs text-red-700">Immediate Action Required</div>
          </motion.div>
          <motion.div variants={item} className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-900">Active Response</span>
            </div>
            <div className="text-2xl font-bold text-yellow-900">{active}</div>
            <div className="text-xs text-yellow-700">Teams Deployed</div>
          </motion.div>
          <motion.div variants={item} className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-900">System Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-green-900">{(avgRisk * 100).toFixed(0)}%</div>
            <div className="text-xs text-green-700">Prediction Success Rate</div>
          </motion.div>
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

            {/* Government Action Panel */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/report"
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base shadow-elevated glow transition-all"
              >
                <Plus className="w-5 h-5" />
                Report Emergency
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/timeline"
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base shadow-elevated glow transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Command Center
              </Link>
            </motion.div>

            {/* Government Authority Statement */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">GOV</span>
                </div>
                <span className="text-sm font-bold text-blue-900">Official State Authority</span>
              </div>
              <p className="text-xs text-blue-700">Department of Disaster Management - Government of Karnataka</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
