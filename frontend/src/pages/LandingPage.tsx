import React, { useState, useEffect } from 'react';
import {
  Shield,
  Search,
  Network,
  Building2,
  GitFork,
  Bot,
  FileText,
  Lock,
  Landmark,
  Globe,
  Clock,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface LandingPageProps {
  onLaunchConsole: () => void;
  onLoadSample: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchConsole,
  onLoadSample
}) => {
  // Live ticker state
  const [activeCases, setActiveCases] = useState(1482);
  const [freezeAmount, setFreezeAmount] = useState(42.8);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCases(prev => prev + Math.floor(Math.random() * 3));
      setFreezeAmount(prev => +(prev + (Math.random() * 0.5)).toFixed(1));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: 'REAL-TIME TRACING',
      desc: 'Instant EVM and UTXO transaction graph traversal mapping suspect fund dispersal within seconds to aid rapid investigation.',
      icon: Search,
    },
    {
      title: 'VASP ATTRIBUTION',
      desc: 'Probabilistic exchange attribution identifying likely cashing-out deposit clusters with evidence verification.',
      icon: Building2,
    },
    {
      title: 'CROSS-CHAIN ANALYSIS',
      desc: 'Relayer-level tracking of cross-chain bridge hops across Ethereum, Polygon, and Arbitrum breaking chain-hopping obfuscation.',
      icon: GitFork,
    },
    {
      title: 'AI RISK DETECTION',
      desc: 'Explainable rule-based and ML risk engine detecting rapid forwarding, peel chains, and mule feeder patterns.',
      icon: Bot,
    },
    {
      title: 'STATUTORY REPORTING',
      desc: 'Automated Section 65B forensic reports ready for statutory notices under Section 91 and 102 CrPC and BNSS court dockets.',
      icon: FileText,
    }
  ];

  return (
    <div className="bg-cyber-network min-h-screen text-slate-600 font-sans selection:bg-blue-100 selection:text-blue-900 relative">
      
      {/* Optional Dark/Light Overlay layer for additional contrast */}
      <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 pointer-events-none"></div>

      {/* Content Area */}
      <div className="relative z-10 flex flex-col min-h-screen">
      
      {/* Unified Header & Search Bar */}
      <header className="w-full bg-white/95 backdrop-blur border-b border-slate-200/50 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded bg-slate-900 text-white shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-slate-900 leading-none mb-1">BLUE LOCK</span>
              <span className="text-[10px] font-bold text-slate-500 tracking-wider leading-none">FORENSIC INTELLIGENCE</span>
            </div>
          </div>
          {/* Govt Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 backdrop-blur rounded-md border border-slate-200">
            <Landmark className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-semibold text-slate-700 tracking-wide">GOVT OF INDIA • MHA / I4C AUTHORIZED</span>
          </div>
        </div>

        <nav className="flex items-center gap-4" aria-label="Primary navigation">
          {/* Accessibility tools */}
          <div className="hidden md:flex items-center gap-3 border-r border-slate-200 pr-4 text-slate-600 text-[11px] font-medium">
            <button className="hover:text-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 outline-none rounded px-1" aria-label="Decrease text size">A-</button>
            <button className="hover:text-slate-900 transition-colors font-bold focus-visible:ring-2 focus-visible:ring-slate-400 outline-none rounded px-1" aria-label="Normal text size">A</button>
            <button className="hover:text-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 outline-none rounded px-1" aria-label="Increase text size">A+</button>
            <button className="flex items-center gap-1.5 ml-2 hover:text-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 outline-none rounded px-1" aria-label="Toggle language">
              <Globe className="w-3.5 h-3.5" />
              <span>EN | HI</span>
            </button>
          </div>

          {/* CTAs */}
          <button
            onClick={onLoadSample}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 outline-none shadow-sm"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Case Lookup</span>
          </button>
          <button
            onClick={onLaunchConsole}
            className="flex items-center gap-2 px-5 py-2 rounded text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-slate-400 outline-none"
          >
            <Lock className="w-4 h-4" />
            <span>GOVT SSO LOGIN</span>
          </button>
        </nav>
      </header>


      {/* Hero Section */}
      <main className="flex-1 w-full bg-transparent">
        <section className="hero-bg py-20 px-6 text-center min-h-[500px] flex flex-col justify-center items-center">
          
          {/* Sub-header Badge */}
          <p className="text-xs tracking-widest font-mono text-blue-600 dark:text-blue-400 uppercase mb-4">
            DIGITAL EVIDENCE GENERATOR • SEC 63 BSA • SEC 65B IEA
          </p>

          {/* Main Headline */}
          <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mb-6 leading-[1.2]">
            Advanced Cryptocurrency <br className="hidden sm:block" />
            <span className="text-blue-500">Forensic Intelligence.</span>
          </h1>

          {/* Description Text */}
          <p className="hero-subtitle text-[15px] sm:text-lg max-w-2xl mb-10 font-medium leading-relaxed">
            Empowering Indian Law Enforcement Agencies with real-time fund-flow mapping, cross-chain bridge de-anonymization, and automated statutory notice generation.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onLaunchConsole}
              className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 outline-none flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Launch Forensic Console</span>
            </button>

            <button
              onClick={onLoadSample}
              className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold bg-white/10 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-600 hover:bg-white/20 transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 outline-none flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>View Live Investigation</span>
            </button>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-24">

          {/* Structured Feature Grid (CSS Grid) */}
          <div className="mt-24 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <article
                  key={idx}
                  className="bg-white border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all p-6 rounded-xl flex flex-col h-full focus-within:ring-2 focus-within:ring-blue-500"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center mb-5 shrink-0">
                    <Icon className="w-5 h-5 text-blue-900" aria-hidden="true" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
                    {f.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">
                    {f.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {/* Compliant Footer */}
      <footer className="w-full border-t border-slate-200 bg-white/95 backdrop-blur py-8 px-6 text-center text-xs font-normal text-slate-500 leading-relaxed">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          <p className="font-semibold text-slate-600 uppercase tracking-wide">
            BLUE LOCK • Designed for Indian Law Enforcement Agencies • Compliant with GIGW & WCAG 2.1 AA Standards
          </p>
          <p>
            For official use by authorized officers under the Ministry of Home Affairs, Government of India. 
            Unauthorized access or disclosure is strictly prohibited under the Information Technology Act, 2000.
          </p>
        </div>
      </footer>
      
      </div>
    </div>
  );
};

