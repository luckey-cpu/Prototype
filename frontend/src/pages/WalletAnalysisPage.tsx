import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Network,
  Building2,
  FileText,
  ShieldAlert,
  Flame,
  Clock,
  Sparkles
} from 'lucide-react';
import { Blockchain, WalletData, RiskIndicator } from '../types';
import { DEMO_SUSPECT_ADDRESS, DEMO_WALLETS, DEMO_RISK_INDICATORS, DEMO_TRANSACTIONS } from '../data/demoData';
import { WalletIntelligenceCard } from '../components/wallet/WalletIntelligenceCard';
import { RiskGauge } from '../components/wallet/RiskGauge';
import { RiskIndicatorCard } from '../components/wallet/RiskIndicatorCard';
import { RadarScannerModal } from '../components/common/RadarScannerModal';
import { blockchainService } from '../services/blockchainService';
import { riskService } from '../services/riskService';

interface WalletAnalysisPageProps {
  initialAddress?: string;
  onViewGraph: (address?: string) => void;
  onViewVASP: (address?: string) => void;
  onGenerateReport: (caseId?: string) => void;
}

export const WalletAnalysisPage: React.FC<WalletAnalysisPageProps> = ({
  initialAddress = DEMO_SUSPECT_ADDRESS,
  onViewGraph,
  onViewVASP,
  onGenerateReport
}) => {
  const [addressInput, setAddressInput] = useState(initialAddress);
  const [selectedChain, setSelectedChain] = useState<Blockchain>('Ethereum');
  const [isScanning, setIsScanning] = useState(false);
  const [currentWallet, setCurrentWallet] = useState<WalletData>(
    DEMO_WALLETS.find((w) => w.address.toLowerCase() === initialAddress.toLowerCase()) || DEMO_WALLETS[3]
  );
  const [indicators, setIndicators] = useState<RiskIndicator[]>(DEMO_RISK_INDICATORS);

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    setIsScanning(true);
  };

  const handleScanComplete = async () => {
    setIsScanning(false);
    try {
      const w = await blockchainService.getWalletDetails(addressInput);
      const r = await riskService.getRiskAssessment(addressInput);
      setCurrentWallet(w);
      setIndicators(r.indicators);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Radar Scanner Modal */}
      <RadarScannerModal
        isOpen={isScanning}
        walletAddress={addressInput}
        onComplete={handleScanComplete}
      />

      {/* Prominent Search Header */}
      <div className="glass-panel-glow rounded-2xl p-6 border-cyan-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-5 h-5 text-cyan-400" />
          <h1 className="font-mono text-xl font-bold text-white uppercase tracking-wider">
            Analyze Suspect Wallet
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-mono mb-4">
          De-anonymize victim-reported addresses, detect layering flows, and uncover destination VASP clusters.
        </p>

        <form onSubmit={handleStartAnalysis} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Enter suspect wallet address (e.g. 0x7A2F8C91F0328b9c24090954e3d389a91f)..."
              className="w-full bg-slate-950/90 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value as Blockchain)}
              aria-label="Select blockchain to analyze"
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-xl px-4 py-3 focus:border-cyan-400 focus:outline-none cursor-pointer"
            >
              <option value="Ethereum">Ethereum</option>
              <option value="Bitcoin">Bitcoin</option>
              <option value="Polygon">Polygon</option>
              <option value="BNB Chain">BNB Chain</option>
            </select>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>ANALYZE WALLET</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Wallet Intelligence & Risk Gauge Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 2 Columns of Wallet Profile */}
        <div className="lg:col-span-2">
          <WalletIntelligenceCard wallet={currentWallet} />
        </div>

        {/* Right: 1 Column Risk Score Gauge */}
        <div className="glass-panel rounded-xl p-6 border-cyan-500/20 flex flex-col items-center justify-between">
          <div className="text-center w-full pb-4 border-b border-slate-800">
            <h3 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
              Explainable Risk Rating
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              Rule-Based ML Evaluation Matrix
            </span>
          </div>

          <div className="py-6">
            <RiskGauge score={currentWallet.risk_score} level={currentWallet.risk_level} />
          </div>

          <div className="w-full pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Aggregated Velocity:</span>
            <span className="text-white font-bold">14.2 tx/hour</span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl glass-panel border border-slate-800">
        <span className="text-xs font-mono text-slate-400">
          Target Action: <b>{currentWallet.address.slice(0, 14)}...</b>
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewGraph(currentWallet.address)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>OPEN IN GRAPH</span>
          </button>

          <button
            onClick={() => onViewVASP(currentWallet.address)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>VIEW VASP ATTRIBUTION</span>
          </button>

          <button
            onClick={() => onGenerateReport('NCRP-2026-00182')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>GENERATE REPORT</span>
          </button>
        </div>
      </div>

      {/* Detected Risk Indicators Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h2 className="font-mono text-base font-bold text-white uppercase tracking-wider">
              Detected Risk Indicators ({indicators.length})
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Explainable Attribution Factors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {indicators.map((ind) => (
            <RiskIndicatorCard key={ind.id} indicator={ind} />
          ))}
        </div>
      </div>
    </div>
  );
};
