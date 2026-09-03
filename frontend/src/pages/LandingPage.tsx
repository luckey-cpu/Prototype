import React, { useState, useEffect } from 'react';
import {
  Shield,
  Search,
  Network,
  Building2,
  GitFork,
  Bot,
  FileText,
  ArrowRight,
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
  // Mock live ticker state
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
      desc: 'Instant EVM & UTXO transaction graph traversal mapping suspect fund dispersal within seconds.',
      icon: Search,
    },
    {
      title: 'VASP ATTRIBUTION',
      desc: 'Probabilistic exchange attribution identifying likely cashing-out deposit clusters with evidence verification.',
      icon: Building2,
    },
    {
      title: 'CROSS-CHAIN ANALYSIS',
      desc: 'Relayer-level tracking of cross-chain bridge hops (Ethereum, Polygon, Arbitrum) breaking chain-hopping obfuscation.',
      icon: GitFork,
    },
    {
      title: 'AI RISK DETECTION',
      desc: 'Explainable rule-based & ML risk engine detecting rapid forwarding, peel chains, and mule feeder patterns.',
      icon: Bot,
    },
    {
      title: 'STATUTORY REPORTING',
      desc: 'Automated Section 65B forensic reports ready for statutory notices (Section 91 / 102 CrPC & BNSS) & court dockets.',
      icon: FileText,
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-200">
      
      {/* 1. Top National Banner (GIGW Compliant) */}
      <div className="w-full bg-slate-900 text-slate-300 text-[11px] py-1.5 px-6 flex justify-between items-center border-b border-slate-800 tracking-wide">
        <div className="flex items-center gap-3">
          <Landmark className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-200">MINISTRY OF HOME AFFAIRS • INDIAN CYBERCRIME COORDINATION CENTRE (I4C)</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
            <button className="hover:text-white transition-colors cursor-pointer" title="Decrease Font Size">A-</button>
            <button className="hover:text-white transition-colors font-bold cursor-pointer" title="Normal Font Size">A</button>
            <button className="hover:text-white transition-colors cursor-pointer" title="Increase Font Size">A+</button>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
            <Globe className="w-3.5 h-3.5" />
            <span>English | हिंदी</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-700 text-white shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-slate-900">
                BLUCE LOCK
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                NCRP-INTEGRATED LEA WORKSTATION
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Cybercrime Forensic Intelligence Engine</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onLoadSample}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-sm cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>CASE LOOKUP (NCRP-2026-88912)</span>
          </button>
          <button
            onClick={onLaunchConsole}
            className="flex items-center gap-2 px-5 py-2 rounded-md text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-md transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>GOVT SSO LOGIN (NIC / Parichay)</span>
          </button>
        </div>
      </header>

      {/* 4. Live Operational Metrics Bar */}
      <div className="w-full bg-slate-100 border-b border-slate-200 py-2.5 px-6 flex items-center justify-center gap-8 text-xs font-medium text-slate-600 shadow-inner overflow-hidden">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>Active Cases Monitored: <strong className="text-slate-900">{activeCases.toLocaleString()}</strong></span>
        </div>
        <div className="h-4 w-px bg-slate-300"></div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>VASP Freeze Notices (Sec 91): <strong className="text-slate-900">₹{freezeAmount.toFixed(1)} Cr</strong></span>
        </div>
        <div className="h-4 w-px bg-slate-300"></div>
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-blue-600" />
          <span>NCRP Fraud API Sync: <strong className="text-emerald-700">ONLINE (14ms Latency)</strong></span>
        </div>
        <div className="h-4 w-px bg-slate-300"></div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Supported Chains: <strong className="text-slate-900">EVM, Bitcoin, Solana</strong></span>
        </div>
      </div>

      {/* 3. Hero Section & Primary Actions */}
      <main className="flex-1 flex flex-col items-center pt-20 pb-16 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 mb-8 shadow-sm">
          <Shield className="w-3.5 h-3.5" />
          <span>OFFICIAL DIGITAL EVIDENCE GENERATOR (SEC 63 BSA / SEC 65B IEA)</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Advanced Cryptocurrency <br />
          <span className="text-blue-700">
            Forensic Intelligence.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl font-medium leading-relaxed">
          Empowering Indian Law Enforcement Agencies with real-time fund-flow mapping, cross-chain bridge de-anonymization, and automated CrPC Section 91/102 statutory notice generation.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onLaunchConsole}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            <span>Launch Forensic Console</span>
          </button>

          <button
            onClick={onLoadSample}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>View Live Demo Investigation</span>
          </button>
        </div>

        {/* 5. Statutory Module Cards Grid */}
        <div className="mt-24 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all shadow-sm p-5 rounded-xl flex flex-col"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4 border border-blue-100">
                  <Icon className="w-5 h-5 text-blue-700" />
                </div>
                <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide mb-2">
                  {f.title}
                </h4>
                <p className="text-[12px] text-slate-600 leading-relaxed flex-1">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 px-6 text-center text-[11px] font-medium text-slate-500">
        <p>BLUCE LOCK • Designed for Indian Law Enforcement Agencies • Compliant with GIGW & WCAG 2.1 AA Standards</p>
        <p className="mt-1">For official use by authorized officers under the Ministry of Home Affairs, Government of India.</p>
      </footer>
    </div>
  );
};
