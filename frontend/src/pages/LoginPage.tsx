import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Server, Fingerprint, Lock, Cpu, Key, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { TxSentinelLogo } from '../components/common/TxSentinelLogo';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [credentials, setCredentials] = useState({ officerId: '', ssoToken: '' });
  const [showToken, setShowToken] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [mfaStatus, setMfaStatus] = useState<'idle' | 'awaiting' | 'success'>('idle');
  const [latency, setLatency] = useState(12);

  // Simulate live telemetry ping
  useEffect(() => {
    const interval = setInterval(() => setLatency(Math.floor(Math.random() * 8) + 8), 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.officerId && credentials.ssoToken) {
      setIsAuthenticating(true);
      setTimeout(() => {
        setIsAuthenticating(false);
        setStep(2);
        setMfaStatus('awaiting');
      }, 1500);
    }
  };

  const handleMfaAuth = () => {
    if (mfaStatus !== 'awaiting') return;
    setMfaStatus('success');
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Dynamic Visual Depth: Mesh, Grid & Scanlines */}
      <div className="absolute inset-0 bg-cyber-network opacity-10 pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(37,99,235,0.08)_0%,rgba(3,7,18,1)_100%)] pointer-events-none" />
      <div className="scanlines absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to bottom, transparent 50%, #000 50%)', backgroundSize: '100% 4px' }} />

      <main className="w-full max-w-md relative z-10">
        
        {/* Auth Card Architecture */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-xl overflow-hidden bg-slate-900/40 backdrop-blur-2xl border border-blue-500/20 shadow-[0_0_40px_-10px_rgba(37,99,235,0.3)]"
        >
          {/* Corner HUD Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/50 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/50 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500/50 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/50 rounded-br-xl pointer-events-none" />

          {/* Top Status Header */}
          <div className="bg-blue-950/40 border-b border-blue-500/20 px-4 py-2 flex items-center justify-between text-[10px] font-mono tracking-widest text-blue-400">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              SYSTEM.AUTH
            </span>
            <span>[SEC_LEVEL: TOP_SECRET_L4]</span>
          </div>

          <div className="p-8 pb-10">
            {/* Glowing Icon Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <TxSentinelLogo size={56} showText={true} textSize="lg" className="flex-col !gap-3" />
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleStep1Submit} 
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <label className="flex text-[10px] font-mono text-slate-400 tracking-wider uppercase ml-1">
                      <Cpu className="w-3 h-3 mr-1.5" /> Govt Officer ID
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        required
                        value={credentials.officerId}
                        onChange={(e) => setCredentials({ ...credentials, officerId: e.target.value })}
                        placeholder="OFFICER-8842-MHA"
                        className="w-full bg-[#030712]/80 border border-slate-700/60 rounded-lg px-4 py-3.5 text-sm font-mono text-blue-50 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:shadow-[inset_0_0_15px_rgba(37,99,235,0.15)] transition-all"
                      />
                      {credentials.officerId && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex text-[10px] font-mono text-slate-400 tracking-wider uppercase ml-1">
                      <Key className="w-3 h-3 mr-1.5" /> Access Token
                    </label>
                    <div className="relative group">
                      <input
                        type={showToken ? 'text' : 'password'}
                        required
                        value={credentials.ssoToken}
                        onChange={(e) => setCredentials({ ...credentials, ssoToken: e.target.value })}
                        placeholder="••••••••••••••••"
                        className="w-full bg-[#030712]/80 border border-slate-700/60 rounded-lg px-4 py-3.5 pr-10 text-sm font-mono tracking-widest text-blue-50 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:shadow-[inset_0_0_15px_rgba(37,99,235,0.15)] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors focus:outline-none"
                      >
                        {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isAuthenticating || !credentials.officerId || !credentials.ssoToken}
                    whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(37,99,235,0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed border border-blue-400/30"
                  >
                    {isAuthenticating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="tracking-wider text-sm">AUTHENTICATING...</span>
                      </>
                    ) : (
                      <>
                        <span className="tracking-wider text-sm">INITIALIZE UPLINK</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:animate-[shimmer_1.5s_infinite]" />
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-6"
                >
                  <div className="relative mb-6">
                    <motion.button
                      onClick={handleMfaAuth}
                      disabled={mfaStatus === 'success'}
                      animate={mfaStatus === 'awaiting' ? { 
                        boxShadow: ['0 0 0 0 rgba(6,182,212,0.7)', '0 0 0 20px rgba(6,182,212,0)'],
                      } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        mfaStatus === 'success' 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                          : 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer'
                      }`}
                    >
                      {mfaStatus === 'success' ? (
                        <Lock className="w-10 h-10" />
                      ) : (
                        <Fingerprint className="w-10 h-10" />
                      )}
                    </motion.button>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">
                    {mfaStatus === 'success' ? 'ACCESS GRANTED' : 'AWAITING HARDWARE KEY'}
                  </h3>
                  <p className="text-xs text-slate-400 text-center font-mono max-w-[250px] leading-relaxed">
                    {mfaStatus === 'success' 
                      ? 'Cryptographic handshake verified. Establishing secure connection...' 
                      : 'Tap your registered YubiKey or biometric sensor to complete cryptographic handshake.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Live Telemetry Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-slate-500 tracking-wider">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-blue-500/70" />
            <span className="text-slate-400">NODE:</span> NDLS-NODE-04
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5"><Lock className="w-3 h-3 text-emerald-500/70" /> AES-256-GCM / TLS 1.3</span>
            <span className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 
              {latency}ms
            </span>
          </div>
        </div>

      </main>
    </div>
  );
};
