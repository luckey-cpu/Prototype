import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, GitFork, Bot, FileText, Activity } from 'lucide-react';

// Animation variants for the grid and cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  }
};

// Feature Data
const initialFeatures = [
  {
    id: 'TRACE_ENGINE',
    title: 'REAL-TIME TRACING',
    desc: 'Instant EVM and UTXO transaction graph traversal mapping suspect fund dispersal within seconds to aid rapid investigation.',
    icon: Search,
    status: 'READY',
    metricLabel: 'GRAPH DEPTH',
    metricValue: '12 HOPS',
    theme: 'cyan'
  },
  {
    id: 'VASP_INTELL',
    title: 'VASP ATTRIBUTION',
    desc: 'Probabilistic exchange attribution identifying likely cashing-out deposit clusters with evidence verification.',
    icon: Building2,
    status: 'ACTIVE',
    metricLabel: 'ENTITIES',
    metricValue: '4,208',
    theme: 'emerald'
  },
  {
    id: 'XCHAIN_MONITOR',
    title: 'CROSS-CHAIN ANALYSIS',
    desc: 'Relayer-level tracking of cross-chain bridge hops across Ethereum, Polygon, and Arbitrum breaking chain-hopping obfuscation.',
    icon: GitFork,
    status: 'LIVE_FEED',
    metricLabel: 'LATENCY',
    metricValue: '2.1ms',
    theme: 'blue'
  },
  {
    id: 'RISK_ENGINE',
    title: 'AI RISK DETECTION',
    desc: 'Explainable rule-based and ML risk engine detecting rapid forwarding, peel chains, and mule feeder patterns.',
    icon: Bot,
    status: 'READY',
    metricLabel: 'ACCURACY',
    metricValue: '99.4%',
    theme: 'cyan'
  },
  {
    id: 'LEGAL_COMPLIANCE',
    title: 'STATUTORY REPORTING',
    desc: 'Automated Section 65B forensic reports ready for statutory notices under Section 91 and 102 CrPC and BNSS court dockets.',
    icon: FileText,
    status: 'READY',
    metricLabel: 'FORMATS',
    metricValue: 'SEC 65B',
    theme: 'emerald'
  }
];

export const ForensicModulesGrid: React.FC = () => {
  const [features, setFeatures] = useState(initialFeatures);

  // Simulated live telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFeatures(prev => prev.map(f => {
        if (f.id === 'XCHAIN_MONITOR') {
          const latency = (Math.random() * (4.5 - 1.5) + 1.5).toFixed(1);
          return { ...f, metricValue: `${latency}ms` };
        }
        if (f.id === 'VASP_INTELL') {
          // Slight fluctuation in entity count
          const rand = Math.floor(Math.random() * 5);
          return { ...f, metricValue: `4,20${rand}` };
        }
        return f;
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'emerald': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
      case 'blue': return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' };
      case 'cyan':
      default: return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' };
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="mt-16 mb-24 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left relative z-10"
    >
      {features.map((f, idx) => {
        const Icon = f.icon;
        const colors = getThemeColors(f.theme);

        return (
          <motion.article
            key={f.id}
            variants={cardVariants}
            whileHover={{ y: -4 }}
            className="group relative bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800/80 rounded-xl flex flex-col h-full overflow-hidden transition-all duration-300 dark:hover:border-blue-500/50 hover:border-blue-500 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] dark:hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] dark:backdrop-blur-md"
          >
            {/* Dynamic Hover Gradient overlay in dark mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden dark:block" />

            {/* Corner HUD Brackets on Hover */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-blue-500/0 group-hover:border-blue-500/50 transition-colors duration-300 pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-blue-500/0 group-hover:border-blue-500/50 transition-colors duration-300 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-blue-500/0 group-hover:border-blue-500/50 transition-colors duration-300 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-blue-500/0 group-hover:border-blue-500/50 transition-colors duration-300 pointer-events-none" />

            {/* Terminal Header */}
            <header className="px-5 py-3 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono tracking-wider">
              <span className="text-slate-500 dark:text-slate-400 font-semibold uppercase flex items-center gap-2">
                MOD_{(idx + 1).toString().padStart(2, '0')} // {f.id}
              </span>
              <span className={`px-2 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
                {f.status}
              </span>
            </header>

            <div className="p-6 flex flex-col flex-1 relative z-10">
              {/* Tactical Icon Badge */}
              <div className={`relative w-12 h-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center mb-5 shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-5 h-5 ${colors.text} relative z-10`} aria-hidden="true" />
                {/* Glowing ring */}
                <div className="absolute inset-0 rounded-lg bg-transparent border border-white/0 group-hover:border-white/20 transition-colors duration-500" />
                {f.status === 'LIVE_FEED' && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse border border-[#0f172a]" />
                )}
              </div>

              {/* Title & Description */}
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                {f.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                {f.desc}
              </p>

              {/* Mini Data Preview Footer */}
              <footer className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500 dark:text-slate-400">{f.metricLabel}</span>
                <span className={`font-semibold ${colors.text} flex items-center gap-1.5`}>
                  {f.status === 'LIVE_FEED' && <Activity className="w-3 h-3 animate-pulse" />}
                  {f.metricValue}
                </span>
              </footer>
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
};
