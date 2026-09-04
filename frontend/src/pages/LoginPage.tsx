import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Server } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ officerId: '', ssoToken: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication check
    if (credentials.officerId) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
      
      {/* Background Decorative Mesh Glow */}
      <div className="absolute inset-0 bg-cyber-network opacity-20 pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10">
        
        {/* Header Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/10 border border-blue-500/30 rounded-xl mb-4 text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">National SSO Portal</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">AUTHORIZED PERSONNEL ONLY • I4C ENCRYPTED</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-2">Govt Officer ID / Email</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="OFFICER-8842-MHA"
                value={credentials.officerId}
                onChange={(e) => setCredentials({ ...credentials, officerId: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-2">SSO Passcode / Security Key</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={credentials.ssoToken}
                onChange={(e) => setCredentials({ ...credentials, ssoToken: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition duration-200 cursor-pointer"
          >
            <span>Authenticate & Access Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1"><Server className="w-3 h-3 text-emerald-500" /> SECURE GATEWAY</span>
          <span>LATENCY: 12ms</span>
        </div>

      </div>
    </div>
  );
};
