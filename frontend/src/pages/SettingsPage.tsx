import React, { useState, useCallback } from 'react';
import {
  Settings,
  Activity,
  Key,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Check,
  Server,
  Database,
  Cpu,
  BarChart2
} from 'lucide-react';

interface ApiKeyFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  hint?: string;
}

const ApiKeyField: React.FC<ApiKeyFieldProps> = ({ id, label, value, onChange, hint }) => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access denied — fail silently in sandboxed env
    }
  }, [value]);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center justify-between text-xs font-medium text-slate-300">
        <span>{label}</span>
        {hint && <span className="text-[10px] font-mono text-slate-500">{hint}</span>}
      </label>
      <div className="relative group">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 pr-20 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? 'Hide API key' : 'Show API key'}
            className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            {visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy API key to clipboard"
            className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

interface StatusCardProps {
  label: string;
  status: string;
  statusColor: 'emerald' | 'amber' | 'red';
  detail: string;
  icon: React.FC<{ className?: string }>;
}

const StatusCard: React.FC<StatusCardProps> = ({ label, status, statusColor, detail, icon: Icon }) => {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const dotMap = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${dotMap[statusColor]} shrink-0`} />
        <span className={`text-xs font-mono font-bold ${colorMap[statusColor].split(' ')[0]}`}>{status}</span>
      </div>
      <span className="text-[11px] text-slate-500 font-mono">{detail}</span>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  const [etherscanKey, setEtherscanKey] = useState('ETH_SCAN_API_DEMO_KEY_9921');
  const [polygonscanKey, setPolygonscanKey] = useState('POLYGON_SCAN_API_DEMO_KEY_4412');
  const [saved, setSaved] = useState(false);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setEtherscanKey('ETH_SCAN_API_DEMO_KEY_9921');
    setPolygonscanKey('POLYGON_SCAN_API_DEMO_KEY_4412');
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto text-slate-100">

      {/* Page Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Settings className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Platform Settings
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            RPC connectivity, forensic API credentials, investigator profile, and legal compliance configuration.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          CONFIG v2.4.1
        </div>
      </div>

      {/* System Health Status Grid */}
      <section aria-labelledby="health-heading">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h2 id="health-heading" className="text-sm font-semibold text-white">
            Engine & Multi-Chain Node Health
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatusCard
            label="FastAPI Analytics Core"
            status="ONLINE"
            statusColor="emerald"
            detail="Port 8000 · NetworkX 3.6"
            icon={Cpu}
          />
          <StatusCard
            label="Ethereum RPC Node"
            status="ACTIVE · 14ms"
            statusColor="emerald"
            detail="Mainnet Block #20,577,240"
            icon={Server}
          />
          <StatusCard
            label="Polygon PoS Gateway"
            status="ACTIVE · 22ms"
            statusColor="emerald"
            detail="Bor Block #61,350,100"
            icon={BarChart2}
          />
          <StatusCard
            label="VASP Cluster Index"
            status="LOADED v2.4"
            statusColor="emerald"
            detail="174 Exchange Clusters"
            icon={Database}
          />
        </div>
      </section>

      {/* API Key Configuration */}
      <section aria-labelledby="api-heading" className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Key className="w-4 h-4 text-blue-400" />
          <h2 id="api-heading" className="text-sm font-semibold text-white">
            Blockchain Indexer API Keys
          </h2>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          Replace synthetic demo mocks with production explorer credentials to enable real-time wallet retrieval and live transaction data.
        </p>

        <form onSubmit={handleSaveKeys} className="space-y-5">
          <ApiKeyField
            id="etherscan-key"
            label="Etherscan API Key"
            value={etherscanKey}
            onChange={setEtherscanKey}
            hint="etherscan.io/myapikey"
          />
          <ApiKeyField
            id="polygonscan-key"
            label="Polygonscan API Key"
            value={polygonscanKey}
            onChange={setPolygonscanKey}
            hint="polygonscan.com/myapikey"
          />

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="h-5">
              {saved && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Configuration saved successfully
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 rounded-lg border border-slate-700 text-xs font-medium text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                Reset to Defaults
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-blue-600/20 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none active:scale-95"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Investigator Profile */}
      <section aria-labelledby="profile-heading" className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-4">
          <UserCheck className="w-4 h-4 text-blue-400" />
          <h2 id="profile-heading" className="text-sm font-semibold text-white">
            Investigator Profile & Clearance
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Officer Name & Rank', primary: 'Insp. V. K. Deshmukh', secondary: 'Cyber Crime Spl. Cell', accent: 'text-slate-100' },
            { label: 'Assigned System Role', primary: 'LEAD INVESTIGATOR', secondary: 'Level 3 — Requisition Authorized', accent: 'text-emerald-400' },
            { label: 'Official Badge Number', primary: 'CY-7819', secondary: 'NCRP Verified Token', accent: 'text-slate-100' },
          ].map(({ label, primary, secondary, accent }) => (
            <div key={label} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block mb-1.5">{label}</span>
              <span className={`font-bold text-sm font-mono block ${accent}`}>{primary}</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">{secondary}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="p-5 rounded-xl bg-red-950/20 border border-red-500/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
              Statutory Legal Disclaimer & Evidence Protocols
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-2">
              BLUE LOCK is an investigative intelligence prototype designed exclusively for authorized law enforcement and cybercrime forensics personnel. Attribution results and risk ratings are probabilistic and require statutory verification by authorized officers through appropriate legal processes under Sections 91 and 102 CrPC / Bharatiya Nagarik Suraksha Sanhita.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              This platform complies with ethical AI and forensic security principles. It provides no mechanisms for transaction mixing, trace obfuscation, or regulatory circumvention.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
