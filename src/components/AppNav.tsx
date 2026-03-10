import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, FileText, Camera, BarChart3, Shield, Menu, X, Zap, Moon, Sun, LogOut, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const NAV_ITEMS = [
  { path: '/', label: 'Map', icon: MapPin },
  { path: '/timeline', label: 'Timeline', icon: Zap },
  { path: '/report', label: 'Report', icon: FileText },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/admin', label: 'Admin', icon: Shield },
  { path: '/about', label: 'About', icon: Camera },
];

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return [dark, () => setDark(d => !d)] as const;
}

export default function AppNav() {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dark, toggleDark] = useDarkMode();

  const handleAuth = async () => {
    if (user) {
      await signOut();
      navigate('/auth');
    } else {
      navigate('/auth');
    }
  };

  return (
    <>
      {/* Desktop top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 font-bold text-lg group">
            <motion.div 
              whileHover={{ rotate: 12, scale: 1.1 }}
              className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center glow"
            >
              <Zap className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="text-gradient font-extrabold tracking-tight hidden sm:inline text-xl">
              HeatWave AI
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 bg-muted/50 rounded-2xl p-1">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className="relative"
              >
                {pathname === path && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 gradient-primary rounded-xl glow"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  pathname === path
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}>
                  <Icon className="w-4 h-4" />
                  {label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right side: dark mode + mobile toggle */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleAuth}
              className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label={user ? 'Sign out' : 'Sign in'}
              title={user ? 'Sign out' : 'Sign in'}
            >
              {user ? <LogOut className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.85, rotate: 180 }}
              onClick={toggleDark}
              className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                {dark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2.5 rounded-xl hover:bg-muted transition-colors" 
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="fixed top-16 left-4 right-4 z-50 glass-strong rounded-2xl shadow-elevated md:hidden overflow-hidden"
            >
              <div className="p-3 flex flex-col gap-1">
                {NAV_ITEMS.map(({ path, label, icon: Icon }, i) => (
                  <motion.div
                    key={path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={path}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                        pathname === path
                          ? 'gradient-primary text-primary-foreground glow'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom mobile nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="mx-3 mb-3 glass-strong rounded-2xl shadow-elevated">
          <div className="flex items-center justify-around h-16 px-2">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs transition-all"
              >
                {pathname === path && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute -top-1 w-8 h-1 rounded-full gradient-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 transition-colors ${pathname === path ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`font-medium ${pathname === path ? 'text-primary' : 'text-muted-foreground'}`}>
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
