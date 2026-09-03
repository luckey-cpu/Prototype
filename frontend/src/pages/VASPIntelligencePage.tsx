import React, { useState, useEffect } from 'react';
import { Building2, ShieldAlert, Sparkles, FileText, Network, ExternalLink } from 'lucide-react';
import { ConfidenceMeter } from '../components/vasp/ConfidenceMeter';
import { EvidenceChecklist } from '../components/vasp/EvidenceChecklist';
import { VASPTable } from '../components/vasp/VASPTable';
import { DEMO_VASP_ATTRIBUTION, DEMO_SUSPECT_ADDRESS } from '../data/demoData';
import { vaspService } from '../services/vaspService';
import { VASPAttribution } from '../types';

interface VASPIntelligencePageProps {
  walletAddress?: string;
  onViewGraph: () => void;
  onGenerateReport: () => void;
}

export const VASPIntelligencePage: React.FC<VASPIntelligencePageProps> = ({
  walletAddress = DEMO_SUSPECT_ADDRESS,
  onViewGraph,
  onGenerateReport
}) => {
  const [attribution, setAttribution] = useState<VASPAttribution>(DEMO_VASP_ATTRIBUTION);

  useEffect(() => {
    const fetchAttribution = async () => {
      try {
        const res = await vaspService.getAttribution(walletAddress);
        setAttribution(res);
      } catch {
        // Fallback
      }
    };
    fetchAttribution();
  }, [walletAddress]);

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-mono font-black text-white tracking-tight">
              VASP Intelligence &amp; Exchange Attribution
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Probabilistic heuristics matching intermediary fund convergence to centralized exchange deposit clusters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewGraph}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-colors cursor-pointer"
          >
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>INSPECT IN GRAPH</span>
          </button>

          <button
            onClick={onGenerateReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>GENERATE LE REPORT</span>
          </button>
        </div>
      </div>

      {/* Hero Confidence Meter Card */}
      <ConfidenceMeter
        primaryVASP={attribution.primary_vasp}
        candidates={attribution.candidates}
      />

      {/* Supporting Evidence Checklist */}
      <EvidenceChecklist evidence={attribution.evidence_checklist} />

      {/* Ranked Matrix Table */}
      <VASPTable candidates={attribution.candidates} />
    </div>
  );
};
