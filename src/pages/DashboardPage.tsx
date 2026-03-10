import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, MapPin, AlertTriangle, Activity, Shield, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import StatsCard from '@/components/StatsCard';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useHotspots, useAlerts } from '@/hooks/useHotspots';
import { MOCK_FORECASTS } from '@/utils/mockData';

const COLORS = ['hsl(152,68%,38%)', 'hsl(38,95%,54%)', 'hsl(0,84%,60%)'];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, type: 'spring' as const, stiffness: 260, damping: 20 },
  }),
};

export default function DashboardPage() {
  const { data: hotspots = [] } = useHotspots();
  const { data: alerts = [] } = useAlerts();

  const high = hotspots.filter(v => v.risk_score >= 0.7).length;
  const med = hotspots.filter(v => v.risk_score >= 0.3 && v.risk_score < 0.7).length;
  const low = hotspots.filter(v => v.risk_score < 0.3).length;
  const pieData = [
    { name: 'Low', value: low },
    { name: 'Medium', value: med },
    { name: 'High', value: high },
  ];

  const topVillages = [...hotspots].sort((a, b) => b.risk_score - a.risk_score).slice(0, 5);

  const accuracyData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    accuracy: +(78 + Math.random() * 15).toFixed(1),
  }));

  return (
    <div className="pt-20 pb-24 md:pb-6 min-h-screen">
      <AnimatedBackground />
      <div className="container py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl gradient-primary glow">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground font-medium">Hassan District Analytics</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const csv = ['Village,Risk Score,Temp,Humidity,Rain,Stagnation,Status', ...hotspots.map(h => `${h.village_name},${(h.risk_score*100).toFixed(0)}%,${h.temp}°C,${h.humidity}%,${h.rain_mm}mm,${h.water_stagnation_days}d,${h.status}`)].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `heatwave-data-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/60 text-sm font-semibold hover:shadow-elevated transition-all"
            >
              <Download className="w-4 h-4 text-primary" />
              Export CSV
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard title="Total Hotspots" value={hotspots.length} icon={MapPin} delay={0.05} />
          <StatsCard title="High Risk" value={high} icon={AlertTriangle} variant="danger" delay={0.1} />
          <StatsCard title="Alerts" value={alerts.length} icon={Activity} variant="warning" delay={0.15} />
          <StatsCard title="Resolved" value={alerts.filter(a => a.status === 'resolved').length} icon={Shield} variant="success" delay={0.2} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              i: 0,
              title: '7-Day Risk Forecast',
              icon: <TrendingUp className="w-4 h-4 text-primary" />,
              content: (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={MOCK_FORECASTS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                    <Line type="monotone" dataKey="risk_level" stroke="hsl(0,84%,60%)" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="confidence" stroke="hsl(152,68%,38%)" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              ),
            },
            {
              i: 1,
              title: 'Risk Distribution',
              icon: null,
              content: (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" label={({ name, value }) => `${name}: ${value}`} paddingAngle={3}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                  </PieChart>
                </ResponsiveContainer>
              ),
            },
            {
              i: 2,
              title: 'Prediction Accuracy',
              icon: null,
              content: (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={accuracyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                    <Bar dataKey="accuracy" fill="hsl(152,68%,38%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ),
            },
            {
              i: 3,
              title: 'Top 5 High-Risk Villages',
              icon: null,
              content: (
                <div className="space-y-4">
                  {topVillages.map((v, i) => (
                    <div key={v.id} className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-muted-foreground w-6 text-center">{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{v.village_name}</p>
                        <div className="h-2.5 rounded-full bg-muted mt-1.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${v.risk_score * 100}%` }}
                            transition={{ duration: 1.2, delay: 0.5 + i * 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                            className="h-full rounded-full"
                            style={{ background: v.risk_score >= 0.7 ? 'hsl(0,84%,60%)' : v.risk_score >= 0.3 ? 'hsl(38,95%,54%)' : 'hsl(152,68%,38%)' }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-extrabold min-w-[40px] text-right" style={{ color: v.risk_score >= 0.7 ? 'hsl(0,84%,60%)' : 'hsl(38,95%,54%)' }}>
                        {(v.risk_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              ),
            },
          ].map(({ i, title, icon, content }) => (
            <motion.div
              key={title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-card border border-border/60 rounded-2xl p-6 shadow-card hover:shadow-elevated transition-shadow"
            >
              <h2 className="font-bold text-lg mb-5 flex items-center gap-2 tracking-tight">{icon} {title}</h2>
              {content}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
