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

        {/* Compliant Footer */}
        <footer className="w-full border-t border-slate-200 bg-white/95 backdrop-blur py-8 px-6 text-center text-xs font-normal text-slate-500 leading-relaxed">
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            <p className="font-semibold text-slate-600 uppercase tracking-wide">
              BLUE LOCK • Designed for Indian Law Enforcement Agencies • Compliant with GIGW & WCAG 2.1 AA Standards
            </p>
            <p>
              For official use by authorized officers under the Ministry of Home Affairs, Government of India. 
              Unauthorized access or disclosure is strictly prohibited under the Information Technology Act, 2000.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
