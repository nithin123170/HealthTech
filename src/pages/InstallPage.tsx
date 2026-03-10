import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, CheckCircle, Share, MoreVertical, Plus } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setDeferredPrompt(null);
  };

  if (isStandalone) {
    return (
      <div className="pt-20 pb-24 md:pb-6 min-h-screen">
        <AnimatedBackground />
        <div className="container max-w-lg py-16 text-center space-y-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight">Already Installed!</h1>
          <p className="text-muted-foreground">You're running HeatWave AI as an app. Enjoy!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 md:pb-6 min-h-screen">
      <AnimatedBackground />
      <div className="container max-w-lg py-12 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' }}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto rounded-2xl gradient-primary glow flex items-center justify-center"
          >
            <Smartphone className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight">Install HeatWave AI</h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Install as an app on your phone for the best experience — works offline, loads instantly.
          </p>
        </motion.div>

        {installed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border/60 rounded-2xl p-8 shadow-elevated text-center space-y-4"
          >
            <CheckCircle className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-xl font-bold">Successfully Installed!</h2>
            <p className="text-sm text-muted-foreground">Find HeatWave AI on your home screen.</p>
          </motion.div>
        ) : deferredPrompt ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <motion.button
              onClick={handleInstall}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 rounded-2xl gradient-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-3 glow shadow-elevated"
            >
              <Download className="w-6 h-6" />
              Install App
            </motion.button>
          </motion.div>
        ) : isIOS ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/60 rounded-2xl p-6 shadow-elevated space-y-5"
          >
            <h2 className="font-bold text-lg text-center">Install on iPhone / iPad</h2>
            <div className="space-y-4">
              {[
                { step: 1, icon: Share, text: 'Tap the Share button in Safari', desc: 'The square with an arrow at the bottom of the screen' },
                { step: 2, icon: Plus, text: 'Tap "Add to Home Screen"', desc: 'Scroll down in the share menu to find it' },
                { step: 3, icon: CheckCircle, text: 'Tap "Add" to confirm', desc: 'The app icon will appear on your home screen' },
              ].map(({ step, icon: Icon, text, desc }) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: step * 0.15 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                    <span className="text-primary-foreground font-bold text-sm">{step}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" /> {text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/60 rounded-2xl p-6 shadow-elevated space-y-5"
          >
            <h2 className="font-bold text-lg text-center">Install on Android</h2>
            <div className="space-y-4">
              {[
                { step: 1, icon: MoreVertical, text: 'Tap the menu button (⋮)', desc: 'Three dots at the top-right of Chrome' },
                { step: 2, icon: Download, text: 'Tap "Install app" or "Add to Home Screen"', desc: 'This option appears in the menu' },
                { step: 3, icon: CheckCircle, text: 'Tap "Install" to confirm', desc: 'The app will be added to your home screen' },
              ].map(({ step, icon: Icon, text, desc }) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: step * 0.15 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                    <span className="text-primary-foreground font-bold text-sm">{step}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" /> {text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Features */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { emoji: '⚡', title: 'Instant Load', desc: 'Opens in under 1 second' },
            { emoji: '📡', title: 'Works Offline', desc: 'View cached data anytime' },
            { emoji: '🔔', title: 'Notifications', desc: 'Get real-time alerts' },
            { emoji: '📱', title: 'Native Feel', desc: 'Full-screen, no browser UI' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-card border border-border/60 rounded-2xl p-4 shadow-card text-center"
            >
              <p className="text-2xl mb-2">{f.emoji}</p>
              <p className="font-bold text-sm">{f.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
