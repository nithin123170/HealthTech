import { motion } from 'framer-motion';
import { Brain, Database, Map, Smartphone, Shield, Globe, Zap, Users, Target, BarChart3, Cpu, Layers } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

const TECH_STACK = [
{ name: 'React + TypeScript', desc: 'Modern UI framework', icon: Layers, color: 'hsl(200, 75%, 42%)' },
{ name: 'Supabase', desc: 'Real-time database & auth', icon: Database, color: 'hsl(152, 68%, 38%)' },
{ name: 'XGBoost ML', desc: 'Risk prediction model', icon: Brain, color: 'hsl(280, 70%, 50%)' },
{ name: 'Leaflet Maps', desc: 'Interactive heat mapping', icon: Map, color: 'hsl(38, 95%, 54%)' },
{ name: 'Gemini AI', desc: 'Conversational AI assistant', icon: Cpu, color: 'hsl(0, 84%, 60%)' },
{ name: 'PWA', desc: 'Installable mobile app', icon: Smartphone, color: 'hsl(220, 70%, 50%)' }];


const FEATURES = [
{ icon: Target, title: 'Predictive Risk Scoring', desc: 'XGBoost-powered model analyzing temperature, humidity, rainfall, and water stagnation to predict heatwave risk with 89% accuracy.' },
{ icon: Globe, title: 'Real-time Heat Map', desc: 'Interactive Leaflet map with live risk overlays for 50+ villages in Hassan District, Karnataka.' },
{ icon: Shield, title: 'Admin Alert System', desc: 'One-click SMS alerts to spray squads with risk scores, village data, and squad assignment management.' },
{ icon: BarChart3, title: 'Analytics Dashboard', desc: 'Comprehensive charts for risk distribution, 7-day forecasts, prediction accuracy, and top high-risk zones.' },
{ icon: Smartphone, title: 'AR Patrol Mode', desc: 'Camera-based augmented reality overlay guiding field workers to spray high-risk locations.' },
{ icon: Brain, title: 'AI Chat Assistant', desc: 'Gemini-powered chatbot that answers questions using live database context for instant decision support.' }];


const SDG_GOALS = [
{ number: 3, title: 'Good Health', desc: 'Preventing heat-related illnesses and vector-borne diseases' },
{ number: 11, title: 'Sustainable Cities', desc: 'Building climate-resilient communities' },
{ number: 13, title: 'Climate Action', desc: 'Early warning systems for climate hazards' }];


const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 20 } }
};

export default function AboutPage() {
  return (
    <div className="pt-20 pb-24 md:pb-6 min-h-screen">
      <AnimatedBackground />
      <div className="container py-8 space-y-16 max-w-5xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' }}
          className="text-center space-y-5">
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl gradient-primary glow mx-auto">
            
            <Zap className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            About <span className="text-gradient">HeatWave AI</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            An AI-powered early warning system for heatwave risk prediction in Karnataka, India.
            We combine machine learning, real-time data, and mobile technology to protect vulnerable communities.
          </p>
        </motion.div>

        {/* Problem Statement */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border/60 rounded-2xl p-8 shadow-elevated">
          
          <h2 className="text-2xl font-extrabold tracking-tight mb-4">🎯 Problem Statement</h2>
          <p className="text-muted-foreground leading-relaxed">
            India faces increasing heatwave events due to climate change, particularly affecting rural communities.
            Hassan District in Karnataka has seen rising temperatures, creating conditions for heat-related illnesses
            and vector-borne disease outbreaks. Current monitoring systems are reactive, not predictive. HeatWave AI
            transforms this with proactive, data-driven risk prediction and automated alert systems.
          </p>
        </motion.div>

        {/* Key Features */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-center">✨ Key Features</h2>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {FEATURES.map(({ icon: Icon, title, desc }) =>
            <motion.div
              key={title}
              variants={item}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-card border border-border/60 rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all">
              
                <div className="p-2.5 rounded-xl bg-primary/10 w-fit mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-base mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Tech Stack */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-center">🛠️ Technology Stack</h2>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4">
            
            {TECH_STACK.map(({ name, desc, icon: Icon, color }) =>
            <motion.div
              key={name}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="bg-card border border-border/60 rounded-2xl p-5 shadow-card text-center hover:shadow-elevated transition-all">
              
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <p className="font-bold text-sm">{name}</p>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* SDG Goals */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-center">🌍 UN SDG Alignment</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {SDG_GOALS.map(({ number, title, desc }, i) =>
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border/60 rounded-2xl p-6 shadow-card text-center">
              
                <div className="w-14 h-14 rounded-full gradient-primary mx-auto mb-3 flex items-center justify-center text-primary-foreground font-extrabold text-xl glow">
                  {number}
                </div>
                <h3 className="font-bold text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{desc}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border/60 rounded-2xl p-8 shadow-elevated">
          
          <h2 className="text-2xl font-extrabold tracking-tight mb-4">🏗️ System Architecture</h2>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            {[
            { step: '1', label: 'Data Collection', desc: 'Field workers report via mobile + GPS' },
            { step: '2', label: 'AI Processing', desc: 'XGBoost model predicts risk scores' },
            { step: '3', label: 'Real-time Dashboard', desc: 'Live heat map + analytics' },
            { step: '4', label: 'Alert & Response', desc: 'Auto SMS to spray squads' }].
            map(({ step, label, desc }, i) =>
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-2">
              
                <div className="w-10 h-10 rounded-full gradient-primary mx-auto flex items-center justify-center text-primary-foreground font-extrabold glow">
                  {step}
                </div>
                <p className="font-bold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-3 py-8">
          
          <p className="text-muted-foreground text-sm">
            Built with ❤️ for Karnataka's communities
          </p>
          

          
        </motion.div>
      </div>
    </div>);

}