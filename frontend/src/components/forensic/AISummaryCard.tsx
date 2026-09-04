import React, { useState } from 'react';
import { Bot, Sparkles, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';
import { DEMO_AI_FINDINGS } from '../../data/demoData';

export const AISummaryCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'facts' | 'inferences' | 'directives'>('facts');
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const text = `TxSentinel AI FORENSIC SUMMARY:\n\nOBSERVED FACTS:\n${DEMO_AI_FINDINGS.observed_facts.join('\n')}\n\nINFERRED PATTERNS:\n${DEMO_AI_FINDINGS.inferred_patterns.join('\n')}\n\nRECOMMENDATIONS:\n${DEMO_AI_FINDINGS.recommendations.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const formatText = (text: string) => {
    // Regex for EVM addresses
    const regex = /(0x[a-fA-F0-9]{40})/g;
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (part.match(regex)) {
        return (
          <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[9px] cursor-pointer hover:bg-blue-100 hover:text-blue-800 transition-colors mx-0.5" title="Highlight on canvas">
            {part.slice(0, 6)}...{part.slice(-4)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-blue-600" />
          <h3 className="font-mono text-xs font-bold text-slate-800 tracking-wider">
            AI Investigative Summary
          </h3>
        </div>

        <button
          onClick={handleCopySummary}
          className="text-[10px] font-mono text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
          title="Copy AI Summary to Clipboard"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'COPIED' : 'COPY'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-50 border border-slate-200 mb-3 text-[10px] font-mono">
        <button
          onClick={() => setActiveTab('facts')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer text-center ${
            activeTab === 'facts'
              ? 'bg-blue-100 text-blue-700 border border-blue-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Facts ({DEMO_AI_FINDINGS.observed_facts.length})
        </button>

        <button
          onClick={() => setActiveTab('inferences')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer text-center ${
            activeTab === 'inferences'
              ? 'bg-amber-100 text-amber-700 border border-amber-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Inferences ({DEMO_AI_FINDINGS.inferred_patterns.length})
        </button>

        <button
          onClick={() => setActiveTab('directives')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer text-center ${
            activeTab === 'directives'
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Directives ({DEMO_AI_FINDINGS.recommendations.length})
        </button>
      </div>

      {/* Tab Content List */}
      <div className="space-y-2 flex-1 overflow-y-auto pr-1 text-xs font-mono custom-scrollbar">
        {activeTab === 'facts' &&
          DEMO_AI_FINDINGS.observed_facts.map((fact, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
              <span className="text-[11px] leading-relaxed">{formatText(fact)}</span>
            </div>
          ))}

        {activeTab === 'inferences' &&
          DEMO_AI_FINDINGS.inferred_patterns.map((inf, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
              <span className="text-[11px] leading-relaxed">{formatText(inf)}</span>
            </div>
          ))}

        {activeTab === 'directives' &&
          DEMO_AI_FINDINGS.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
              <span className="text-[11px] leading-relaxed font-semibold">{formatText(rec)}</span>
            </div>
          ))}
      </div>

      {/* Primary Action Button */}
      <div className="mt-2 pt-2 border-t border-slate-200 shrink-0">
        <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 transition-all text-xs font-mono font-bold cursor-pointer group shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500">
          <Sparkles className="w-4 h-4 text-blue-600 group-hover:animate-pulse" />
          ASK AI ASSISTANT
        </button>
      </div>
    </div>
  );
};
