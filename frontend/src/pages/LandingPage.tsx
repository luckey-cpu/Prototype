import React from 'react';
import { Header } from '../components/landing/Header';
import { Hero } from '../components/landing/Hero';

interface LandingPageProps {
  onLaunchConsole: () => void;
  onLoadSample: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchConsole,
  onLoadSample
}) => {
  return (
    <div className="bg-cyber-network min-h-screen text-slate-600 font-sans selection:bg-blue-100 selection:text-blue-900 relative">
      {/* Optional Dark/Light Overlay layer for additional contrast */}
      <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 pointer-events-none"></div>

      {/* Content Area */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onLoadSample={onLoadSample} />
        
        <Hero 
          onLaunchConsole={onLaunchConsole} 
          onLoadSample={onLoadSample} 
        />

      </div>
    </div>
  );
};
