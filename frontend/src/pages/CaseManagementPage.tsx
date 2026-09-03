import React, { useState } from 'react';
import { FolderLock, Search, Plus, Filter } from 'lucide-react';
import { CaseTable } from '../components/cases/CaseTable';
import { CreateCaseModal } from '../components/cases/CreateCaseModal';
import { DEMO_CASES } from '../data/demoData';
import { CaseData } from '../types';

interface CaseManagementPageProps {
  onSelectCase: (c: CaseData) => void;
}

export const CaseManagementPage: React.FC<CaseManagementPageProps> = ({
  onSelectCase
}) => {
  const [cases, setCases] = useState<CaseData[]>(DEMO_CASES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const handleCreateCase = (newCase: CaseData) => {
    setCases((prev) => [newCase, ...prev]);
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.case_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.complaint_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.complainant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.suspect_wallet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.fraud_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || c.status.toLowerCase().includes(statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Create Case Modal */}
      <CreateCaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCase}
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl glass-panel border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases by Case ID, Complainant, Wallet, or Fraud type..."
            className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter cases by status"
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active Investigation</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Section 91">Section 91 Issued</option>
          </select>
        </div>
      </div>

      {/* Cases Registry Table */}
      <CaseTable
        cases={filteredCases}
        onSelectCase={onSelectCase}
        onCreateNew={() => setIsModalOpen(true)}
      />
    </div>
  );
};
