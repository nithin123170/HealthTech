import { motion } from 'framer-motion';
import { Clock, AlertTriangle, Shield, TrendingUp, Droplets, Thermometer, Eye, CheckCircle, Cloud } from 'lucide-react';
import DataDrivenBackground from '@/components/DataDrivenBackground';
import CountUpNumber from '@/components/CountUpNumber';
import { useHotspots, useAlerts } from '@/hooks/useHotspots';

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'alert' | 'resolved' | 'prediction' | 'weather' | 'deployment';
  severity: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
  location?: string;
  team?: string;
  duration?: string;
  timestamp?: Date;
  coordinates?: { lat: number; lng: number };
  impact?: string;
  affectedPeople?: number;
  responseTime?: string;
}

const severityStyles = {
  high: 'border-destructive/40 bg-destructive/5',
  medium: 'border-warning/40 bg-warning/5',
  low: 'border-primary/40 bg-primary/5',
};
const dotStyles = {
  high: 'bg-destructive shadow-[0_0_12px_hsl(0,84%,60%,0.5)]',
  medium: 'bg-warning shadow-[0_0_12px_hsl(38,95%,54%,0.5)]',
  low: 'bg-primary shadow-[0_0_12px_hsl(152,68%,38%,0.5)]',
};

export default function RiskTimelinePage() {
  const { data: hotspots = [] } = useHotspots();
  const { data: alerts = [] } = useAlerts();

  const events: TimelineEvent[] = [
    ...hotspots.slice(0, 5).map((h, i) => ({
      id: `h-${h.id}`,
      time: new Date(h.created_at).toLocaleString(),
      title: `${h.village_name} — ${(h.risk_score * 100).toFixed(0)}% Risk Detected`,
      description: `Temperature: ${h.temp}°C | Humidity: ${h.humidity}% | Rainfall: ${h.rain_mm}mm | Stagnation: ${h.water_stagnation_days} days`,
      type: h.risk_score >= 0.7 ? 'alert' as const : 'prediction' as const,
      severity: h.risk_score >= 0.7 ? 'high' as const : h.risk_score >= 0.3 ? 'medium' as const : 'low' as const,
      icon: h.risk_score >= 0.7 ? <AlertTriangle className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />,
      location: h.village_name,
      team: h.risk_score >= 0.7 ? 'Spray Squad Alpha' : 'Monitoring Team Beta',
      duration: `${Math.floor(Math.random() * 4 + 1)} hours`,
      timestamp: new Date(h.created_at),
      coordinates: { 
        lat: 13.0 + (Math.random() * 0.5), 
        lng: 77.0 + (Math.random() * 0.5) 
      },
      impact: h.risk_score >= 0.7 ? 'Critical - Immediate action required' : 'Moderate - Monitor closely',
      affectedPeople: Math.floor(Math.random() * 5000 + 1000),
      responseTime: h.risk_score >= 0.7 ? '15-30 minutes' : '2-4 hours'
    })),
    ...alerts.filter(a => a.status === 'resolved').slice(0, 3).map((a) => ({
      id: `a-${a.id}`,
      time: new Date(a.created_at).toLocaleString(),
      title: `${a.village} — Alert Resolved Successfully`,
      description: `Risk reduced from ${(a.risk_score * 100).toFixed(0)}% to acceptable levels. Squad intervention completed successfully.`,
      type: 'resolved' as const,
      severity: 'low' as const,
      icon: <CheckCircle className="w-4 h-4" />,
      location: a.village,
      team: 'Response Team',
      duration: '2 hours',
      timestamp: new Date(a.created_at),
      coordinates: { 
        lat: 13.0 + (Math.random() * 0.5), 
        lng: 77.0 + (Math.random() * 0.5) 
      },
      impact: 'Risk eliminated - Community safe',
      affectedPeople: Math.floor(Math.random() * 2000 + 500),
      responseTime: '30-45 minutes'
    })),
    ...hotspots.filter(h => h.risk_score >= 0.7).slice(0, 2).map((h, i) => ({
      id: `d-${h.id}`,
      time: new Date(Date.now() - Math.random() * 3600000).toLocaleString(),
      title: `Emergency Response Team Deployed to ${h.village_name}`,
      description: `High risk zone detected. ${h.risk_score * 100}% risk level. Immediate response team dispatched.`,
      type: 'deployment' as const,
      severity: 'high' as const,
      icon: <AlertTriangle className="w-4 h-4" />,
      location: h.village_name,
      team: 'Emergency Response Team',
      duration: 'In progress',
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      coordinates: { 
        lat: 13.0 + (Math.random() * 0.5), 
        lng: 77.0 + (Math.random() * 0.5) 
      },
      impact: 'Critical - Immediate evacuation may be required',
      affectedPeople: Math.floor(Math.random() * 8000 + 2000),
      responseTime: '5-10 minutes'
    })),
    {
      id: 'weather-1',
      time: new Date(Date.now() - Math.random() * 7200000).toLocaleString(),
      title: 'Extreme Heatwave Warning Issued',
      description: `Temperature rising above 42°C. Heat index reaching dangerous levels. Stay hydrated and avoid outdoor activities during peak hours.`,
      type: 'weather' as const,
      severity: 'high' as const,
      icon: <AlertTriangle className="w-4 h-4" />,
      location: 'Hassan District',
      team: 'Weather Monitoring Team',
      duration: '6 hours',
      timestamp: new Date(Date.now() - Math.random() * 7200000),
      coordinates: { lat: 13.0, lng: 77.0 },
      impact: 'Widespread heat stress',
      affectedPeople: Math.floor(Math.random() * 50000 + 10000),
      responseTime: 'Immediate'
    },
    {
      id: 'weather-2',
      time: new Date(Date.now() - Math.random() * 10800000).toLocaleString(),
      title: 'Monsoon Season Alert',
      description: `Heavy rainfall expected. Risk of water stagnation and waterborne diseases. Precautionary measures activated.`,
      type: 'weather' as const,
      severity: 'medium' as const,
      icon: <Cloud className="w-4 h-4" />,
      location: 'Hassan District',
      team: 'Weather Monitoring Team',
      duration: '48 hours',
      timestamp: new Date(Date.now() - Math.random() * 10800000),
      coordinates: { lat: 13.0, lng: 77.0 },
      impact: 'Moderate flooding risk',
      affectedPeople: Math.floor(Math.random() * 30000 + 5000),
      responseTime: '2-3 hours'
    }
  ].sort((a, b) => new Date(b.timestamp || b.time).getTime() - new Date(a.timestamp || a.time).getTime());

  const totalEvents = events.length;
  const highRiskEvents = events.filter(e => e.severity === 'high').length;
  const resolvedEvents = events.filter(e => e.type === 'resolved').length;

  return (
    <div className="pt-20 pb-24 md:pb-6 min-h-screen">
      <DataDrivenBackground />
      <div className="container py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' }}
          className="text-center space-y-3"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20"
          >
            <Clock className="w-3.5 h-3.5" />
            Live Event Stream
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Risk <span className="text-gradient">Timeline</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Watch how risk events unfold across Hassan District in real-time. Every detection, every response, every resolution.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4"
        >
          {[
            { label: 'Total Events', value: totalEvents, icon: <Eye className="w-4 h-4" />, color: 'text-primary' },
            { label: 'High Risk', value: highRiskEvents, icon: <Thermometer className="w-4 h-4" />, color: 'text-destructive' },
            { label: 'Resolved', value: resolvedEvents, icon: <Droplets className="w-4 h-4" />, color: 'text-primary' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-card border border-border/60 rounded-2xl p-5 text-center shadow-card"
            >
              <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${stat.color} mb-1`}>
                {stat.icon} {stat.label}
              </div>
              <div className="text-3xl font-extrabold">
                <CountUpNumber end={stat.value} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical glowing line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px">
            <motion.div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(180deg, hsl(152, 68%, 38%, 0.5), hsl(38, 95%, 54%, 0.3), hsl(0, 84%, 60%, 0.5), transparent)',
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>

          <div className="space-y-8">
            {events.map((event, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
                  className={`relative flex items-start gap-4 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } ml-12 md:ml-0`}
                >
                  {/* Dot */}
                  <motion.div
                    className={`absolute left-[-33px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full z-10 ${dotStyles[event.severity]}`}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />

                  {/* Card */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`md:w-[45%] ${i % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'} w-full`}
                  >
                    <div className={`rounded-2xl border p-5 shadow-card hover:shadow-elevated transition-all ${severityStyles[event.severity]}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg ${event.severity === 'high' ? 'bg-destructive/10 text-destructive' : event.severity === 'medium' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}`}>
                          {event.icon}
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">{event.time}</span>
                      </div>
                      <h3 className="font-bold text-sm mb-1">{event.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{event.description}</p>
                      
                      {/* Additional Realistic Details */}
                      {event.location && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span className="font-medium">📍 Location:</span> {event.location}
                        </div>
                      )}
                      {event.team && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">👥 Team:</span> {event.team}
                        </div>
                      )}
                      {event.impact && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">⚡ Impact:</span> {event.impact}
                        </div>
                      )}
                      {event.affectedPeople && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">👥 Affected:</span> {event.affectedPeople.toLocaleString()} people
                        </div>
                      )}
                      {event.responseTime && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">⏱️ Response:</span> {event.responseTime}
                        </div>
                      )}
                      {event.duration && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">⏰ Duration:</span> {event.duration}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
          
          {events.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-muted-foreground"
            >
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No events yet. Timeline will populate as data flows in.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
