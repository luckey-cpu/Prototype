import React, { useEffect, useState } from 'react';
import { ShieldCheck, Loader2, CheckCircle2, Radar } from 'lucide-react';

interface RadarScannerModalProps {
  isOpen: boolean;
  walletAddress: string;
  onComplete: () => void;
}

interface StepItem {
  id: number;
  label: string;
  duration: number;
}

export const RadarScannerModal: React.FC<RadarScannerModalProps> = ({
  isOpen,
  walletAddress,
  onComplete
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(10);

  const steps: StepItem[] = [
    { id: 1, label: 'Scanning blockchain ledger & token contracts...', duration: 400 },
    { id: 2, label: 'Building transaction graph & detecting peel chains...', duration: 500 },
    { id: 3, label: 'Evaluating velocity & explainable risk indicators...', duration: 450 },
    { id: 4, label: 'Matching VASP deposit clusters & exchange sweep heuristics...', duration: 550 },
    { id: 5, label: 'Synthesizing TxSentinel AI investigative intelligence...', duration: 400 },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgress(10);
      return;
    }

    let isCancelled = false;

    const runScanSequence = async () => {
      for (let i = 0; i < steps.length; i++) {
        if (isCancelled) return;
        setCurrentStepIndex(i);
        setProgress(Math.round(((i + 1) / steps.length) * 100));
        await new Promise((resolve) => setTimeout(resolve, steps[i].duration));
      }

      if (!isCancelled) {
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    };

    runScanSequence();

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900/90 border border-cyan-500/40 p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-center overflow-hidden">
        {/* Radar Scanner Visual */}
        <div className="relative mx-auto w-32 h-32 rounded-full border border-cyan-500/30 flex items-center justify-center mb-6 overflow-hidden bg-slate-950/60 shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]">
          {/* Concentric rings */}
          <div className="absolute w-24 h-24 rounded-full border border-cyan-500/20" />
          <div className="absolute w-16 h-16 rounded-full border border-cyan-500/20" />
          <div className="absolute w-8 h-8 rounded-full border border-cyan-500/30" />

          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] bg-cyan-500/20" />
          <div className="absolute h-full w-[1px] bg-cyan-500/20" />

          {/* Radar Sweep Line */}
          <div className="absolute inset-0 animate-radar origin-center">
            <div className="w-1/2 h-1/2 bg-gradient-to-tr from-cyan-400/40 to-transparent" />
          </div>

          <Radar className="w-8 h-8 text-cyan-400 animate-pulse relative z-10" />
        </div>

        {/* Title */}
        <h3 className="font-mono text-lg font-bold text-white tracking-wide mb-1">
          BLOCKCHAIN FORENSIC SCAN IN PROGRESS
        </h3>
        <p className="font-mono text-xs text-cyan-400 mb-6 truncate px-4">
          Target: {walletAddress}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden border border-slate-700">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps List */}
        <div className="space-y-2 text-left text-xs font-mono mb-4">
          {steps.map((step, index) => {
            const isFinished = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
                  isCurrent
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : isFinished
                    ? 'text-slate-400'
                    : 'text-slate-600'
                }`}
              >
                {isFinished ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span className="truncate">{step.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
          <span>Engine: TxSentinel-v2.4 Core</span>
          <span className="text-cyan-400 font-semibold">{progress}% COMPLETE</span>
        </div>
      </div>
    </div>
  );
};
