/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Thermometer, Droplets, CloudRain, Clock, Send, Mic, MicOff, CheckCircle, Loader2, Camera, X, Image, Download, RotateCcw, WifiOff } from 'lucide-react';
import RiskGauge from '@/components/RiskGauge';
import AnimatedBackground from '@/components/AnimatedBackground';
import { predictRisk, useInsertHotspot } from '@/hooks/useHotspots';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface OfflineReport {
  id: string;
  lat: number;
  lng: number;
  temp: number;
  humidity: number;
  rain_mm: number;
  water_stagnation_days: number;
  risk_score: number;
  village_name: string;
  status: string;
  photo_url: string;
  submittedAt: string;
  synced: boolean;
}

export default function ReportPage() {
  const [form, setForm] = useState({ lat: '13.0068', lng: '76.1004', temp: '36', humidity: '70', rain: '4', stagnation: '3', village: '' });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineReports, setOfflineReports] = useState<OfflineReport[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const insertHotspot = useInsertHotspot();

  useEffect(() => {
    if (showSuccessModal && countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && showSuccessModal) {
      setShowSuccessModal(false);
      setCountdown(10);
    }
  }, [showSuccessModal, countdown]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline reports from localStorage
    const saved = localStorage.getItem('offline-reports');
    if (saved) {
      try {
        setOfflineReports(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse offline reports:', e);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch {
      toast.error('Camera access denied. Please allow camera permission.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setPhoto(dataUrl);
    closeCamera();
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setShowCamera(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveOfflineReport = (reportData: Omit<OfflineReport, 'id' | 'submittedAt' | 'synced'>): OfflineReport => {
    const offlineReport = {
      ...reportData,
      id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: new Date().toISOString(),
      synced: false,
    };

    const updatedReports = [...offlineReports, offlineReport];
    setOfflineReports(updatedReports);
    localStorage.setItem('offline-reports', JSON.stringify(updatedReports));
    return offlineReport;
  };

  const syncOfflineReports = useCallback(async () => {
    if (!isOnline || offlineReports.length === 0) return;

    const unsyncedReports = offlineReports.filter(r => !r.synced);
    let syncedCount = 0;

    for (const report of unsyncedReports) {
      try {
        await insertHotspot.mutateAsync({
          lat: report.lat,
          lng: report.lng,
          temp: report.temp,
          humidity: report.humidity,
          rain_mm: report.rain_mm,
          water_stagnation_days: report.water_stagnation_days,
          risk_score: report.risk_score,
          village_name: report.village_name,
          status: report.status,
          photo_url: report.photo_url,
        });

        // Mark as synced
        report.synced = true;
        syncedCount++;
      } catch (error) {
        console.error('Failed to sync report:', report.id, error);
      }
    }

    if (syncedCount > 0) {
      setOfflineReports(prev => prev.filter(r => !r.synced));
      localStorage.setItem('offline-reports', JSON.stringify(offlineReports.filter(r => !r.synced)));
      toast.success(`Synced ${syncedCount} offline report${syncedCount > 1 ? 's' : ''}!`);
    }
  }, [isOnline, offlineReports, insertHotspot]);

  useEffect(() => {
    if (isOnline && offlineReports.length > 0) {
      syncOfflineReports();
    }
  }, [isOnline, offlineReports.length, syncOfflineReports]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = predictRisk(+form.temp, +form.humidity, +form.rain, +form.stagnation);
    setPrediction(score);

    const reportData = {
      lat: +form.lat,
      lng: +form.lng,
      temp: +form.temp,
      humidity: +form.humidity,
      rain_mm: +form.rain,
      water_stagnation_days: +form.stagnation,
      risk_score: score,
      village_name: form.village || 'Unknown Village',
      status: score >= 0.7 ? 'active' : score >= 0.3 ? 'monitoring' : 'resolved',
      photo_url: photo || '',
    };

    if (!isOnline) {
      // Save offline
      const offlineReport = saveOfflineReport(reportData);
      setSubmittedData(offlineReport);
      setShowSuccessModal(true);
      toast.success('Report saved offline! Will sync when online.');
      return;
    }

    insertHotspot.mutate(reportData, {
      onSuccess: (data) => {
        setSubmittedData(data);
        setShowSuccessModal(true);
        toast.success('Hotspot reported and saved to database!');
      },
      onError: (error) => {
        console.error('Online submission failed:', error);
        // Fallback to offline storage
        const offlineReport = saveOfflineReport(reportData);
        setSubmittedData(offlineReport);
        setShowSuccessModal(true);
        toast.warning('Saved offline due to connection issues. Will sync when online.');
      },
    });
  };

  const recognitionRef = useRef<any>(null);

  const toggleVoice = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'kn-IN'; // Kannada primary, falls back to English
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setForm(f => ({ ...f, village: transcript }));
    };

    recognition.onerror = (event: any) => {
      console.error('Speech error:', event.error);
      if (event.error === 'not-allowed') {
        toast.error('Microphone access denied. Please allow microphone permission.');
      } else {
        toast.error(`Speech error: ${event.error}`);
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  }, [listening]);

  const handleGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setForm(f => ({ ...f, lat: pos.coords.latitude.toFixed(4), lng: pos.coords.longitude.toFixed(4) }));
        toast.success('GPS location detected!');
      });
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    setCountdown(10);
  };

  const submitAnotherReport = () => {
    setForm({ lat: '13.0068', lng: '76.1004', temp: '36', humidity: '70', rain: '4', stagnation: '3', village: '' });
    setPrediction(null);
    setPhoto(null);
    closeModal();
  };

  const downloadReceipt = () => {
    // Placeholder for download receipt functionality
    toast.info('Receipt download feature coming soon!');
  };

  const getTeamAssignment = (score: number) => {
    if (score >= 0.7) return 'Spray Squad Alpha';
    if (score >= 0.3) return 'Monitoring Team Beta';
    return 'General Response Team';
  };

  const inputClass = "w-full px-4 py-3.5 rounded-xl bg-muted/50 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm font-medium";

  return (
    <div className="pt-20 pb-24 md:pb-6 min-h-screen">
      <AnimatedBackground />
      <div className="container max-w-lg py-8 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -24 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
            <MapPin className="w-3.5 h-3.5" />
            Field Report
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Report Hotspot</h1>
          <p className="text-sm text-muted-foreground">Submit environmental data for AI risk prediction</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="bg-card border border-border/60 rounded-2xl p-7 shadow-elevated space-y-5"
        >
          {/* Offline Status */}
          {!isOnline && (
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">Offline Mode</span>
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                Reports will be saved locally and synced when online.
                {offlineReports.length > 0 && ` (${offlineReports.length} pending)`}
              </p>
            </div>
          )}

          {/* Location */}
          <div>
            <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2.5">
              <MapPin className="w-4 h-4 text-primary" /> Location
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" step="0.0001" placeholder="Latitude" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} className={inputClass} />
              <input type="number" step="0.0001" placeholder="Longitude" value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} className={inputClass} />
            </div>
            <motion.button 
              type="button" 
              onClick={handleGPS} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2.5 text-xs text-primary font-bold hover:underline flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <MapPin className="w-3 h-3" /> Auto-detect GPS
            </motion.button>
          </div>

          {/* Village */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2.5 block">Village Name</label>
            <div className="relative">
              <input placeholder="Enter village name" value={form.village} onChange={e => setForm(f => ({ ...f, village: e.target.value }))} className={inputClass} />
              <button type="button" onClick={toggleVoice} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                {listening ? <Mic className="w-4 h-4 text-destructive animate-pulse" /> : <MicOff className="w-4 h-4" />}
              </button>
            </div>
            {listening && <p className="text-xs text-destructive mt-1.5 animate-pulse font-semibold">🎙️ Listening (Kannada/English)...</p>}
          </div>

          {/* Photo Capture */}
          <div>
            <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2.5">
              <Camera className="w-4 h-4 text-primary" /> Photo Evidence
            </label>

            {showCamera ? (
              <div className="relative rounded-xl overflow-hidden border border-border/60 bg-black">
                <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video object-cover" />
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                  <motion.button
                    type="button"
                    onClick={capturePhoto}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-full bg-white border-4 border-primary shadow-lg flex items-center justify-center"
                  >
                    <Camera className="w-6 h-6 text-primary" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={closeCamera}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-destructive/90 text-white flex items-center justify-center self-center"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            ) : photo ? (
              <div className="relative rounded-xl overflow-hidden border border-border/60">
                <img src={photo} alt="Captured" className="w-full aspect-video object-cover" />
                <motion.button
                  type="button"
                  onClick={() => setPhoto(null)}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive/90 text-white flex items-center justify-center shadow-md"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={openCamera}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 text-primary font-semibold text-sm flex items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/10 transition-all"
                >
                  <Camera className="w-4 h-4" /> Open Camera
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl border-2 border-dashed border-border/60 bg-muted/30 text-muted-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:border-border hover:bg-muted/50 transition-all"
                >
                  <Image className="w-4 h-4" /> Upload Photo
                </motion.button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </div>
            )}
          </div>


          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Temp (°C)', icon: Thermometer, key: 'temp' },
              { label: 'Humidity (%)', icon: Droplets, key: 'humidity' },
              { label: 'Rain 24h (mm)', icon: CloudRain, key: 'rain' },
              { label: 'Stagnation (days)', icon: Clock, key: 'stagnation' },
            ].map(({ label, icon: Icon, key }) => (
              <div key={key}>
                <label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1.5 font-semibold">
                  <Icon className="w-3.5 h-3.5 text-primary" /> {label}
                </label>
                <input 
                  type="number" 
                  value={form[key as keyof typeof form]} 
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} 
                  className={inputClass} 
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={insertHotspot.isPending}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl gradient-primary text-primary-foreground font-bold flex items-center justify-center gap-2.5 glow transition-all disabled:opacity-70 text-base"
          >
            {insertHotspot.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {insertHotspot.isPending ? 'Saving...' : 'Submit & Predict'}
          </motion.button>
        </motion.form>

        {/* Prediction Result */}
        {prediction !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-card border border-border/60 rounded-2xl p-8 shadow-elevated text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <CheckCircle className="w-3 h-3" /> AI Analysis Complete
            </div>
            <RiskGauge score={prediction} />
            <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto">
              {prediction >= 0.7
                ? '⚠️ High risk zone detected! Alert sent to spray squad.'
                : prediction >= 0.3
                ? '⚡ Medium risk. Monitoring recommended.'
                : '✅ Low risk area. Keep monitoring.'}
            </p>
          </motion.div>
        )}

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                {submittedData?.id?.startsWith('offline-') ? 'Report Saved Offline' : 'Report Submitted Successfully'}
              </DialogTitle>
              <DialogDescription>
                {submittedData?.id?.startsWith('offline-') 
                  ? 'Your report has been saved locally and will be synced when you\'re back online.'
                  : 'Your hotspot report has been processed and assigned to the appropriate team.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Report ID:</span>
                  <span className="text-sm font-mono bg-background px-2 py-1 rounded">
                    {submittedData?.id?.startsWith('offline-') 
                      ? submittedData.id.slice(-8).toUpperCase()
                      : submittedData?.id?.slice(0, 8).toUpperCase()
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Location:</span>
                  <span className="text-sm">
                    {submittedData?.village_name || 'Unknown Village'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Team Assignment:</span>
                  <span className="text-sm font-semibold text-primary">
                    {submittedData ? getTeamAssignment(submittedData.risk_score) : ''}
                  </span>
                </div>
                {submittedData?.id?.startsWith('offline-') && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status:</span>
                    <span className="text-sm font-semibold text-orange-600">
                      Saved Offline
                    </span>
                  </div>
                )}
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{countdown}</div>
                <p className="text-xs text-muted-foreground">
                  Auto-closing in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={submitAnotherReport}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 rounded-lg border border-primary text-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Submit Another
                </motion.button>
                <motion.button
                  onClick={downloadReceipt}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Receipt
                </motion.button>
              </div>

              <motion.button
                onClick={closeModal}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 rounded-lg bg-muted text-muted-foreground font-semibold text-sm hover:bg-muted/80 transition-colors"
              >
                Close Now
              </motion.button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
