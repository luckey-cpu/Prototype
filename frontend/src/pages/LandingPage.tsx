import React, { useEffect, useRef } from 'react';
import {
  Shield,
  Search,
  Network,
  Building2,
  GitFork,
  Bot,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface LandingPageProps {
  onLaunchConsole: () => void;
  onLoadSample: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchConsole,
  onLoadSample
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for blockchain network background
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1.5,
      color: Math.random() > 0.6 ? '#00F2FE' : '#38BDF8',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle connections (graph edges)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.25 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const features = [
    {
      title: 'REAL-TIME TRACING',
      desc: 'Instant EVM & UTXO transaction graph traversal mapping suspect fund dispersal within seconds.',
      icon: Search,
      color: 'border-cyan-500/30 text-cyan-400'
    },
    {
      title: 'VASP ATTRIBUTION',
      desc: 'Probabilistic exchange attribution identifying likely cashing-out deposit clusters with evidence verification.',
      icon: Building2,
      color: 'border-emerald-500/30 text-emerald-400'
    },
    {
      title: 'CROSS-CHAIN ANALYSIS',
      desc: 'Relayer-level tracking of cross-chain bridge hops (Ethereum, Polygon, Arbitrum) breaking chain-hopping obfuscation.',
      icon: GitFork,
      color: 'border-purple-500/30 text-purple-400'
    },
    {
      title: 'AI RISK DETECTION',
      desc: 'Explainable rule-based & ML risk engine detecting rapid forwarding, peel chains, and mule feeder patterns.',
      icon: Bot,
      color: 'border-red-500/30 text-red-400'
    },
    {
      title: 'INVESTIGATIVE REPORTING',
      desc: 'Standardized Section 65B forensic reports ready for statutory notices (Section 91 / 102 CrPC) & court dockets.',
      icon: FileText,
      color: 'border-amber-500/30 text-amber-400'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#050811] text-white flex flex-col overflow-hidden">
      {/* Animated Blockchain Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-40" />

      {/* Subtle glowing radial gradient in center */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Simple Landing Header */}
      <header className="relative z-10 w-full border-b border-slate-800/80 bg-[#070c18]/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="font-mono text-base font-black tracking-wider text-white">
              BLUCE<span className="text-cyan-400">LOCK</span>
            </span>
            <span className="ml-2 cyber-badge bg-cyan-950 text-cyan-300 border-cyan-700/60 text-[9px]">
              LE PLATFORM
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLoadSample}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>DEMO CASE (NCRP-00182)</span>
          </button>
          <button
            onClick={onLaunchConsole}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          >
            <span>CONSOLE LOGIN</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-5xl mx-auto">
        {/* LE Badge Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>CYBERCRIME FORENSIC INTELLIGENCE ENGINE &bull; SIH PROTOTYPE</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-mono text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
          From Wallet Address to <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            Actionable Intelligence.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base text-slate-300 max-w-2xl font-sans leading-relaxed">
          Real-time cryptocurrency fraud attribution, automated fund-flow mapping, cross-chain bridge tracking, and VASP deposit clustering engineered for cybercrime investigators.
        </p>

        {/* Main CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onLaunchConsole}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Launch Investigation Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onLoadSample}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-mono text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>View Demo Investigation (1-Click)</span>
          </button>
        </div>

        {/* Key Features Grid */}
        <div className="mt-20 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-left">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl glass-panel border ${f.color} hover:scale-105 transition-all duration-200`}
              >
                <Icon className="w-5 h-5 mb-2.5" />
                <h4 className="font-mono text-xs font-bold text-white tracking-wide">
                  {f.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-800/80 py-4 px-6 text-center text-xs font-mono text-slate-500">
        BLUCE LOCK &bull; Law-Enforcement-Oriented Cryptocurrency Forensics &bull; SIH Prototype &bull; Section 91 CrPC Compliance Ready
      </footer>
    </div>
  );
};
