import React, { useState } from 'react';
import { X, FolderPlus, ShieldCheck, AlertCircle } from 'lucide-react';
import { CaseData, Blockchain, RiskLevel } from '../../types';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newCase: CaseData) => void;
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [caseId, setCaseId] = useState(`NCRP-2026-${Math.floor(10000 + Math.random() * 90000)}`);
  const [complaintRef, setComplaintRef] = useState(`CC-CYB-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [complainantName, setComplainantName] = useState('');
  const [fraudType, setFraudType] = useState('Investment Scam');
  const [suspectWallet, setSuspectWallet] = useState('');
  const [blockchain, setBlockchain] = useState<Blockchain>('Ethereum');
  const [reportedLoss, setReportedLoss] = useState('500000');
  const [leUnit, setLeUnit] = useState('Cyber Crime Police Station (HQ)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: CaseData = {
      case_id: caseId,
      complaint_ref: complaintRef,
      complainant_name: complainantName || 'Victim Complainant',
      law_enforcement_unit: leUnit,
      fraud_type: fraudType,
      suspect_wallet: suspectWallet || '0x7A2F8C91F0328b9c24090954e3d389a91f',
      blockchain: blockchain,
      amount_reported_inr: parseFloat(reportedLoss) || 500000,
      amount_traced_inr: parseFloat(reportedLoss) || 500000,
      risk_level: 'HIGH' as RiskLevel,
      status: 'Active Investigation',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      last_updated: 'Just now',
      assigned_officer: 'Insp. V. K. Deshmukh'
    };
    onSubmit(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-cyan-500/30 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono text-base font-bold text-white uppercase tracking-wide">
              Create New NCRP Investigation Docket
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 mb-1 block">Case ID</label>
              <input
                type="text"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 mb-1 block">Complaint Ref No.</label>
              <input
                type="text"
                value={complaintRef}
                onChange={(e) => setComplaintRef(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 mb-1 block">Complainant / Victim Name</label>
            <input
              type="text"
              value={complainantName}
              onChange={(e) => setComplainantName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 mb-1 block">Reported Suspect Cryptocurrency Address</label>
            <input
              type="text"
              value={suspectWallet}
              onChange={(e) => setSuspectWallet(e.target.value)}
              placeholder="0x..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 mb-1 block">Blockchain</label>
              <select
                value={blockchain}
                onChange={(e) => setBlockchain(e.target.value as Blockchain)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value="Ethereum">Ethereum (ERC-20)</option>
                <option value="Polygon">Polygon (PoS)</option>
                <option value="BNB Chain">BNB Chain</option>
                <option value="Bitcoin">Bitcoin (UTXO)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 mb-1 block">Fraud Category</label>
              <select
                value={fraudType}
                onChange={(e) => setFraudType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value="Investment Scam">Investment Scam</option>
                <option value="Phishing">Phishing / Drainer</option>
                <option value="Task-Based Fraud">Task-Based Job Scam</option>
                <option value="Extortion">Crypto Extortion</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 mb-1 block">Reported Loss Amount (&#8377; INR)</label>
              <input
                type="number"
                value={reportedLoss}
                onChange={(e) => setReportedLoss(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 mb-1 block">Law Enforcement Unit</label>
              <input
                type="text"
                value={leUnit}
                onChange={(e) => setLeUnit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              REGISTER CASE &amp; TRACE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
