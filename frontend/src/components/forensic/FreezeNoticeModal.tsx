import React, { useState } from 'react';
import { Shield, FileText, Download, Copy, Printer, Check, X, AlertTriangle, Landmark } from 'lucide-react';
import { DEMO_AI_FINDINGS, DEMO_NCRP_SAHYOG_ID } from '../../data/demoData';

interface FreezeNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetVASP?: string;
  depositCluster?: string;
  suspectAddress?: string;
}

export const FreezeNoticeModal: React.FC<FreezeNoticeModalProps> = ({
  isOpen,
  onClose,
  targetVASP = 'BINANCE',
  depositCluster = '0x28C6c06298d514Db089934071355E5743bf21d60',
  suspectAddress = '0x7A2F8C91F0328b9c24090954e3d389a91f'
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const noticeText = DEMO_AI_FINDINGS.procedural_notice_draft || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(noticeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const blob = new Blob([noticeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SECTION-91-NOTICE-BINANCE-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#121829] border border-[#00F0FF]/30 shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0A0E1A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-950/70 border border-[#FF3366]/40 text-[#FF3366] shadow-[0_0_15px_rgba(255,51,102,0.3)]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-base font-bold text-white tracking-wide">
                  Statutory LEA Asset Freeze &amp; Preservation Notice
                </h3>
                <span className="cyber-badge bg-red-950 text-[#FF3366] border-[#FF3366]/40 text-[10px]">
                  SEC 91 &bull; SEC 102 Cr.P.C. / BNSS 106
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Target: <span className="text-[#00E676] font-semibold">{targetVASP} Compliance</span> &bull; {DEMO_NCRP_SAHYOG_ID}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Callout */}
        <div className="px-6 py-2.5 bg-yellow-950/30 border-b border-yellow-800/40 flex items-center gap-2 text-xs font-mono text-yellow-300">
          <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>
            <b>Official Law Enforcement Notice:</b> Automatically populated with on-chain cryptographic attribution, transaction hashes, and Section 91 Cr.P.C. requisition clauses.
          </span>
        </div>

        {/* Notice Body */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed space-y-4 bg-[#0A0E1A]/60">
          <div className="p-4 rounded-xl bg-[#0A0E1A] border border-slate-800/80 whitespace-pre-wrap font-mono text-[11px] text-slate-200 select-all leading-normal">
            {noticeText}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-[#0A0E1A]">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Landmark className="w-4 h-4 text-[#00E676]" />
            <span>Target Deposit: <span className="text-white font-bold">{depositCluster.slice(0, 14)}...</span></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-[#00F0FF] border border-slate-700 hover:border-[#00F0FF]/40 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY REQUISITION'}</span>
            </button>

            <button
              onClick={handleDownloadText}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD TXT</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-black shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT LEGAL NOTICE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
