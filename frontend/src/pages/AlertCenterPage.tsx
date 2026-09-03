import React, { useState } from 'react';
import { AlertTriangle, Filter, CheckCircle2 } from 'lucide-react';
import { AlertFeed } from '../components/alerts/AlertFeed';
import { DEMO_ALERTS } from '../data/demoData';
import { AlertData, RiskLevel } from '../types';

interface AlertCenterPageProps {
  onViewCase: (caseId: string) => void;
  onViewGraph: (walletAddress: string) => void;
  onGenerateReport: (caseId: string) => void;
}

export const AlertCenterPage: React.FC<AlertCenterPageProps> = ({
  onViewCase,
  onViewGraph,
  onGenerateReport
}) => {
  const [alerts, setAlerts] = useState<AlertData[]>(DEMO_ALERTS);
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const handleAcknowledge = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
  };

  const filteredAlerts = alerts.filter((a) => {
    if (priorityFilter === 'ALL') return true;
    return a.priority === priorityFilter;
  });

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h1 className="text-2xl font-mono font-black text-white tracking-tight">
              Real-Time Cyber Forensics Alert Center
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automated notifications triggered by exchange deposit sweeps, bridge exits, and rapid mule forwardings.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter alerts by priority"
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Priorities ({alerts.length})</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MEDIUM">Medium Only</option>
          </select>
        </div>
      </div>

      {/* Alert Feed List */}
      <AlertFeed
        alerts={filteredAlerts}
        onViewCase={onViewCase}
        onViewGraph={onViewGraph}
        onGenerateReport={onGenerateReport}
        onAcknowledgeAlert={handleAcknowledge}
      />
    </div>
  );
};
