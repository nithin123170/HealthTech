import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Bell, Users, CheckCircle, Clock, Send, AlertTriangle, Loader2, MapPin, Calendar, Plus, X, UserPlus, Building } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useHotspots, useAlerts, useUpdateAlert, useInsertAlert } from '@/hooks/useHotspots';
import { useSquadAssignments } from '@/hooks/useSquadAssignments';
import { useAshaWorkers, useInsertAshaWorker, useVillages, useInsertVillage } from '@/hooks/useAshaWorkers';
import { toast } from 'sonner';
import { format } from 'date-fns';

function AddAshaWorkerForm({ villages, onClose }: { villages: string[]; onClose: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [area, setArea] = useState('');
  const insert = useInsertAshaWorker();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !village.trim()) {
      toast.error('Name and village are required');
      return;
    }
    insert.mutate(
      { name: name.trim(), phone: phone.trim(), village_name: village, area: area.trim(), status: 'active' },
      {
        onSuccess: () => { toast.success('ASHA worker added'); onClose(); },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      onSubmit={handleSubmit}
      className="bg-muted/50 border border-border/40 rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2"><UserPlus className="w-4 h-4 text-primary" /> Add ASHA Worker</h3>
        <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name *" maxLength={100}
          className="px-4 py-2.5 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" maxLength={15}
          className="px-4 py-2.5 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        <select value={village} onChange={e => setVillage(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">Select Village *</option>
          {villages.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        <input value={area} onChange={e => setArea(e.target.value)} placeholder="Area / Ward" maxLength={100}
          className="px-4 py-2.5 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={insert.isPending}
        className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-bold text-sm glow disabled:opacity-50">
        {insert.isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Add Worker'}
      </motion.button>
    </motion.form>
  );
}

function AddVillageForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [taluk, setTaluk] = useState('Hassan');
  const insert = useInsertVillage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Village name is required'); return; }
    insert.mutate(
      { name: name.trim(), taluk: taluk.trim() },
      {
        onSuccess: () => { toast.success('Village added'); onClose(); },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      onSubmit={handleSubmit}
      className="bg-muted/50 border border-border/40 rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2"><Building className="w-4 h-4 text-primary" /> Add Village</h3>
        <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Village Name *" maxLength={100}
          className="px-4 py-2.5 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        <input value={taluk} onChange={e => setTaluk(e.target.value)} placeholder="Taluk" maxLength={100}
          className="px-4 py-2.5 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={insert.isPending}
        className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-bold text-sm glow disabled:opacity-50">
        {insert.isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Add Village'}
      </motion.button>
    </motion.form>
  );
}

export default function AdminPage() {
  const { data: hotspots = [] } = useHotspots();
  const { data: alerts = [], isLoading } = useAlerts();
  const { data: squads = [], isLoading: squadsLoading } = useSquadAssignments();
  const { data: ashaWorkers = [], isLoading: ashaLoading } = useAshaWorkers();
  const { data: villagesList = [] } = useVillages();
  const updateAlert = useUpdateAlert();
  const insertAlert = useInsertAlert();

  const [showAddWorker, setShowAddWorker] = useState(false);
  const [showAddVillage, setShowAddVillage] = useState(false);

  const highRiskHotspots = hotspots.filter(v => v.risk_score >= 0.7).slice(0, 4);

  // Combine hotspot village names + master villages list
  const allVillageNames = Array.from(new Set([
    ...hotspots.map(h => h.village_name),
    ...villagesList.map(v => v.name),
  ])).sort();

  const markResolved = (id: string) => {
    updateAlert.mutate({ id, status: 'resolved' }, {
      onSuccess: () => toast.success('Alert marked as resolved'),
    });
  };

  const sendAlert = (hotspot: typeof hotspots[0]) => {
    insertAlert.mutate({
      hotspot_id: hotspot.id,
      village: hotspot.village_name,
      sent_to: '+91 98765 00000',
      risk_score: hotspot.risk_score,
      status: 'sent',
    }, {
      onSuccess: () => toast.success(`Alert sent for ${hotspot.village_name}`),
    });
  };

  return (
    <div className="pt-20 pb-24 md:pb-6 min-h-screen">
      <AnimatedBackground />
      <div className="container py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring' }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl gradient-primary glow">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Admin Panel</h1>
              <p className="text-sm text-muted-foreground font-medium">Manage alerts, workers, and villages</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highRiskHotspots.map((v, i) => (
            <motion.button
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => sendAlert(v)}
              className="bg-card border border-border/60 rounded-2xl p-5 shadow-card text-left hover:border-primary/50 hover:shadow-elevated transition-all group"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                  <Send className="w-3.5 h-3.5 text-destructive" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Send Alert</span>
              </div>
              <p className="font-bold text-sm">{v.village_name}</p>
              <p className="text-xs text-destructive font-bold mt-1">{(v.risk_score * 100).toFixed(0)}% risk</p>
            </motion.button>
          ))}
        </div>

        {/* ASHA Workers Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border/60 rounded-2xl shadow-card overflow-hidden"
        >
          <div className="p-6 border-b border-border/60 flex items-center justify-between">
            <h2 className="font-bold text-lg flex items-center gap-2 tracking-tight">
              <UserPlus className="w-5 h-5 text-primary" /> ASHA Workers
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground font-semibold">{ashaWorkers.length} workers</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddWorker(!showAddWorker)}
                className="p-2 rounded-xl gradient-primary text-primary-foreground glow"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <AnimatePresence>
              {showAddWorker && <AddAshaWorkerForm villages={allVillageNames} onClose={() => setShowAddWorker(false)} />}
            </AnimatePresence>

            {ashaLoading ? (
              <div className="p-12 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : ashaWorkers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No ASHA workers added yet. Click + to add one.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ashaWorkers.map((worker, i) => (
                  <motion.div
                    key={worker.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-muted/50 rounded-xl p-4 border border-border/30 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-sm">{worker.name}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                        worker.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${worker.status === 'active' ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
                        {worker.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-primary" /> {worker.village_name}</p>
                      {worker.phone && <p className="font-mono">{worker.phone}</p>}
                      {worker.area && <p>{worker.area}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Villages Management */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border/60 rounded-2xl shadow-card overflow-hidden"
        >
          <div className="p-6 border-b border-border/60 flex items-center justify-between">
            <h2 className="font-bold text-lg flex items-center gap-2 tracking-tight">
              <Building className="w-5 h-5 text-primary" /> Villages
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground font-semibold">{villagesList.length} villages</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddVillage(!showAddVillage)}
                className="p-2 rounded-xl gradient-primary text-primary-foreground glow"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <AnimatePresence>
              {showAddVillage && <AddVillageForm onClose={() => setShowAddVillage(false)} />}
            </AnimatePresence>

            {villagesList.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Building className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No villages added yet. Click + to add one.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {villagesList.map((v, i) => (
                  <motion.span
                    key={v.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/50 border border-border/30 text-sm font-medium hover:border-primary/30 transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-primary" />
                    {v.name}
                    <span className="text-xs text-muted-foreground">• {v.taluk}</span>
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Alerts Table */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/60 rounded-2xl shadow-card overflow-hidden"
        >
          <div className="p-6 border-b border-border/60 flex items-center justify-between">
            <h2 className="font-bold text-lg flex items-center gap-2 tracking-tight">
              <Bell className="w-5 h-5 text-primary" /> Alert History
            </h2>
            <span className="text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground font-semibold">{alerts.length} alerts</span>
          </div>
          {isLoading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No alerts yet. Send one from the quick actions above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Village</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Sent To</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Risk</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Time</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((a, i) => (
                    <motion.tr 
                      key={a.id} 
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4 font-semibold">{a.village}</td>
                      <td className="p-4 text-muted-foreground font-mono text-xs">{a.sent_to}</td>
                      <td className="p-4">
                        <span className="font-extrabold" style={{ color: a.risk_score >= 0.7 ? 'hsl(0,84%,60%)' : 'hsl(38,95%,54%)' }}>
                          {(a.risk_score * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          a.status === 'resolved'
                            ? 'bg-accent text-accent-foreground'
                            : a.status === 'read'
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                          {a.status === 'resolved' ? <CheckCircle className="w-3 h-3" /> : a.status === 'read' ? <Clock className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {a.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        {format(new Date(a.created_at), 'MMM d, h:mm a')}
                      </td>
                      <td className="p-4">
                        {a.status !== 'resolved' && (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => markResolved(a.id)} 
                            className="text-xs text-primary font-bold hover:underline px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                          >
                            Resolve
                          </motion.button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Squad Assignments */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }} 
          className="bg-card border border-border/60 rounded-2xl shadow-card overflow-hidden"
        >
          <div className="p-6 border-b border-border/60 flex items-center justify-between">
            <h2 className="font-bold text-lg flex items-center gap-2 tracking-tight">
              <Users className="w-5 h-5 text-primary" /> Spray Squad Assignments
            </h2>
            <span className="text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground font-semibold">
              {squads.length} squads
            </span>
          </div>

          {squadsLoading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : squads.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No squad assignments yet.</p>
            </div>
          ) : (
            <div className="p-6 grid md:grid-cols-3 gap-4">
              {squads.map((squad, i) => (
                <motion.div
                  key={squad.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-muted/50 rounded-xl p-5 border border-border/30 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-sm">{squad.squad_name}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                      squad.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${squad.status === 'active' ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
                      {squad.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(squad.villages as string[]).map((v) => (
                      <span key={v} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-background border border-border/40 text-xs font-medium">
                        <MapPin className="w-3 h-3 text-primary" />
                        {v}
                      </span>
                    ))}
                  </div>
                  {squad.notes && <p className="text-xs text-muted-foreground">{squad.notes}</p>}
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(squad.created_at), 'MMM d, yyyy h:mm a')}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
