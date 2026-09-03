import React, { useState } from 'react';
import { Bot, Sparkles, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';
import { DEMO_AI_FINDINGS } from '../../data/demoData';

export const AISummaryCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'facts' | 'inferences' | 'directives'>('facts');
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const text = `BLUCE AI FORENSIC SUMMARY:\n\nOBSERVED FACTS:\n${DEMO_AI_FINDINGS.observed_facts.join('\n')}\n\nINFERRED PATTERNS:\n${DEMO_AI_FINDINGS.inferred_patterns.join('\n')}\n\nRECOMMENDATIONS:\n${DEMO_AI_FINDINGS.recommendations.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="rounded-2xl bg-[#121829] border border-[#00F0FF]/15 p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#00F0FF]" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            AI Investigative Summary
          </h3>
        </div>

        <button
          onClick={handleCopySummary}
          className="text-[10px] font-mono text-slate-400 hover:text-[#00F0FF] flex items-center gap-1 cursor-pointer"
          title="Copy AI Summary to Clipboard"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'COPIED' : 'COPY'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0A0E1A] border border-slate-800 mb-3 text-[10px] font-mono">
        <button
          onClick={() => setActiveTab('facts')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer text-center ${
            activeTab === 'facts'
              ? 'bg-cyan-500/20 text-[#00F0FF] border border-[#00F0FF]/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Facts ({DEMO_AI_FINDINGS.observed_facts.length})
        </button>

        <button
          onClick={() => setActiveTab('inferences')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer text-center ${
            activeTab === 'inferences'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Inferences ({DEMO_AI_FINDINGS.inferred_patterns.length})
        </button>

        <button
          onClick={() => setActiveTab('directives')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer text-center ${
            activeTab === 'directives'
              ? 'bg-emerald-500/20 text-[#00E676] border border-[#00E676]/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Directives ({DEMO_AI_FINDINGS.recommendations.length})
        </button>
      </div>

      {/* Tab Content List */}
      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 text-xs font-mono">
        {activeTab === 'facts' &&
          DEMO_AI_FINDINGS.observed_facts.map((fact, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-[#0A0E1A]/60 border border-slate-800/80 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] shrink-0 mt-1.5" />
              <span className="text-[11px] leading-relaxed">{fact}</span>
            </div>
          ))}

        {activeTab === 'inferences' &&
          DEMO_AI_FINDINGS.inferred_patterns.map((inf, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-[#0A0E1A]/60 border border-slate-800/80 text-amber-200/90">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
              <span className="text-[11px] leading-relaxed">{inf}</span>
            </div>
          ))}

        {activeTab === 'directives' &&
          DEMO_AI_FINDINGS.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-[#0A0E1A]/60 border border-slate-800/80 text-emerald-200/90">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] shrink-0 mt-1.5" />
              <span className="text-[11px] leading-relaxed font-semibold">{rec}</span>
            </div>
          ))}
      </div>
    </div>
  );
};
