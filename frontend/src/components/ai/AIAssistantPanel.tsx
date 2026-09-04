import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  CheckCircle2,
  Brain,
  FileText,
  Send,
  Loader2,
  Copy,
  Check,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { DEMO_AI_FINDINGS } from '../../data/demoData';
import { api } from '../../services/api';

interface AIAssistantPanelProps {
  walletAddress?: string;
  onGenerateReport?: () => void;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  walletAddress = '0x7A2F8C91F0328b9c24090954e3d389a91f',
  onGenerateReport
}) => {
  const [activeTab, setActiveTab] = useState<'findings' | 'notice' | 'query'>('findings');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(DEMO_AI_FINDINGS);
  const [customQuery, setCustomQuery] = useState('');
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Forensic evaluation complete. I have categorized the fund flow into verified blockchain facts, heuristic inferences, and recommended statutory actions.'
    }
  ]);

  const handleRunDeeperAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await api.analyzeWithAI(walletAddress, 'Deeper analysis');
      setData(res as typeof DEMO_AI_FINDINGS);
    } catch {
      // Fallback
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    const userText = customQuery;
    setCustomQuery('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    setTimeout(() => {
      let reply = 'Based on the cross-chain transaction topology, the funds moved from Ethereum through Stargate to Polygon and terminated at Binance Hot Wallet #14.';
      if (userText.toLowerCase().includes('subpoena') || userText.toLowerCase().includes('notice') || userText.toLowerCase().includes('crpc')) {
        reply = 'Section 91 CrPC notice should be served directly upon the designated Indian Law Enforcement Nodal Officer for Binance Services, specifying Polygon Deposit Cluster 0x28C6c...1d60.';
      } else if (userText.toLowerCase().includes('freeze') || userText.toLowerCase().includes('102')) {
        reply = 'Section 102 CrPC requires reasonable suspicion of stolen property. The direct fund linkage from Complaint CC-MAH-2026-88912 satisfies threshold requirements for immediate preservation.';
      }
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setIsLoading(false);
    }, 700);
  };

  const copyNoticeToClipboard = () => {
    if (data.procedural_notice_draft) {
      navigator.clipboard.writeText(data.procedural_notice_draft);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 1800);
    }
  };

  return (
    <div className="glass-panel-glow rounded-2xl border-cyan-500/30 overflow-hidden flex flex-col min-h-[550px] h-[760px] max-h-[90vh]">
      {/* Panel Top Header */}
      <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#070c18]/90">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-base font-bold text-white tracking-wide">
                TxSentinel AI &mdash; Investigation Assistant
              </h2>
              <span className="cyber-badge bg-cyan-950 text-cyan-300 border-cyan-700/60 text-[10px]">
                FORENSICS ENGINE v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Target: {walletAddress.slice(0, 16)}... | Status: <span className="text-emerald-400 font-semibold">Analysis complete.</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunDeeperAnalysis}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5" />}
            <span>RUN DEEPER ANALYSIS</span>
          </button>

          {onGenerateReport && (
            <button
              onClick={onGenerateReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>GENERATE INVESTIGATIVE SUMMARY</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 gap-4 text-xs font-mono">
        <button
          onClick={() => setActiveTab('findings')}
          className={`py-3 font-semibold transition-colors cursor-pointer border-b-2 ${
            activeTab === 'findings'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Structured Findings &amp; Evidence
        </button>
        <button
          onClick={() => setActiveTab('notice')}
          className={`py-3 font-semibold transition-colors cursor-pointer border-b-2 ${
            activeTab === 'notice'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Section 91 CrPC Notice Draft
        </button>
        <button
          onClick={() => setActiveTab('query')}
          className={`py-3 font-semibold transition-colors cursor-pointer border-b-2 ${
            activeTab === 'query'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Interactive Case Inquiry
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeTab === 'findings' && (
          <>
            {/* Category 1: Observed Facts */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  1. Observed Blockchain Facts (Hard Ledger Evidence)
                </h3>
              </div>
              <div className="space-y-2 text-xs font-sans text-slate-300">
                {data.observed_facts.map((fact, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/40 border border-slate-850">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 2: Inferred Patterns */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  2. Inferred Behavioral Patterns (Forensic Heuristics)
                </h3>
              </div>
              <div className="space-y-2 text-xs font-sans text-slate-300">
                {data.inferred_patterns.map((pattern, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/40 border border-slate-850">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{pattern}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 3: Actionable Recommendations */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  3. Actionable Investigative Directives &amp; Statutory Steps
                </h3>
              </div>
              <div className="space-y-2.5 text-xs font-sans text-slate-200">
                {data.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-cyan-500/20 flex items-start gap-2.5">
                    <span className="font-mono font-bold text-cyan-400 shrink-0">#{idx + 1}</span>
                    <span className="leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'notice' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Automated Statutory Requisition Draft (Section 91 CrPC / IT Act 66D)
              </span>
              <button
                onClick={copyNoticeToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 cursor-pointer"
              >
                {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNotice ? 'Notice Copied' : 'Copy Notice'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
              {data.procedural_notice_draft}
            </pre>
          </div>
        )}

        {activeTab === 'query' && (
          <div className="flex flex-col h-full space-y-4">
            <div className="flex-1 space-y-3 overflow-y-auto">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xl p-3.5 rounded-xl text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-cyan-500 text-black font-semibold'
                        : 'bg-slate-900 text-slate-200 border border-slate-800 font-mono'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Inquiry Input */}
            <form onSubmit={handleSendQuery} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Ask TxSentinel AI (e.g. 'Explain Wallet C layering pattern', 'Draft freeze order')..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={isLoading || !customQuery.trim()}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>INQUIRE</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
