import { motion } from 'framer-motion';
import { Camera, AlertTriangle, MapPin, WifiOff } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useHotspots, getRiskColor, getRiskLabel } from '@/hooks/useHotspots';

export default function ARPatrolPage() {
  const { data: hotspots = [] } = useHotspots();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraOn(true);
      }
    } catch {
      setError('Camera access denied. Enable camera permissions to use AR mode.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
      setCameraOn(false);
    }
  };

  useEffect(() => () => stopCamera(), []);

  const highRisk = hotspots.filter(v => v.risk_score >= 0.7);

  return (
    <div className="pt-20 pb-24 md:pb-6 min-h-screen">
      <AnimatedBackground />
      <div className="container max-w-2xl py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring' }}>
          <div className="flex items-center gap-3 justify-center">
            <div className="p-2.5 rounded-xl gradient-primary glow">
              <Camera className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight">AR Patrol Mode</h1>
              <p className="text-sm text-muted-foreground font-medium">Point camera at surroundings to see risk overlays</p>
            </div>
          </div>
        </motion.div>

        {/* Camera view */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden border border-border/60 shadow-elevated bg-muted/30 aspect-video"
        >
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

          {!cameraOn && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Camera className="w-20 h-20 text-muted-foreground/20" />
              </motion.div>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startCamera} 
                className="px-8 py-3.5 rounded-xl gradient-primary text-primary-foreground font-bold glow transition-all text-base"
              >
                Start Camera
              </motion.button>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <WifiOff className="w-12 h-12 text-destructive/40" />
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          {/* AR Overlays */}
          {cameraOn && highRisk.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.2, type: 'spring' }}
              className="absolute pulse-danger rounded-full flex items-center justify-center"
              style={{
                width: 60 + v.risk_score * 40,
                height: 60 + v.risk_score * 40,
                top: `${15 + (i * 18) % 60}%`,
                left: `${10 + (i * 22) % 70}%`,
                background: `${getRiskColor(v.risk_score)}22`,
                border: `2.5px solid ${getRiskColor(v.risk_score)}`,
              }}
            >
              <div className="text-center">
                <AlertTriangle className="w-5 h-5 mx-auto" style={{ color: getRiskColor(v.risk_score) }} />
                <p className="text-[10px] font-extrabold" style={{ color: getRiskColor(v.risk_score) }}>SPRAY HERE</p>
              </div>
            </motion.div>
          ))}

          {cameraOn && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopCamera} 
              className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-xs font-bold shadow-lg"
            >
              Stop
            </motion.button>
          )}
        </motion.div>

        {/* Nearby hotspots */}
        <div className="space-y-4">
          <h2 className="font-bold text-xl tracking-tight">Nearby High-Risk Zones</h2>
          {highRisk.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, type: 'spring' }}
              whileHover={{ x: 4, scale: 1.01 }}
              className="bg-card border border-border/60 rounded-2xl p-5 shadow-card flex items-center gap-4 hover:shadow-elevated transition-all cursor-default"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center pulse-danger" style={{ background: `${getRiskColor(v.risk_score)}15` }}>
                <MapPin className="w-5 h-5" style={{ color: getRiskColor(v.risk_score) }} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{v.village_name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{v.temp}°C · {v.humidity}% humidity</p>
              </div>
              <div className="text-right">
                <p className="text-base font-extrabold" style={{ color: getRiskColor(v.risk_score) }}>{(v.risk_score * 100).toFixed(0)}%</p>
                <p className="text-[10px] text-muted-foreground font-semibold">{getRiskLabel(v.risk_score)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
