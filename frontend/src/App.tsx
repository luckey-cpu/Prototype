import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/common/Navbar';
import { Sidebar, PageId } from './components/common/Sidebar';
import { RadarScannerModal } from './components/common/RadarScannerModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { WalletAnalysisPage } from './pages/WalletAnalysisPage';
import { TransactionGraphPage } from './pages/TransactionGraphPage';
import { VASPIntelligencePage } from './pages/VASPIntelligencePage';
import { CrossChainPage } from './pages/CrossChainPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { AlertCenterPage } from './pages/AlertCenterPage';
import { CaseManagementPage } from './pages/CaseManagementPage';
import { InvestigationReportPage } from './pages/InvestigationReportPage';
import { SettingsPage } from './pages/SettingsPage';
import { ForensicWorkspace } from './components/forensic/ForensicWorkspace';
import { Blockchain, CaseData } from './types';
import { DEMO_SUSPECT_ADDRESS, DEMO_CASES } from './data/demoData';

export function App() {
  const [inConsole, setInConsole] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageId>('forensic-workspace');
  const [activeWallet, setActiveWallet] = useState<string>(DEMO_SUSPECT_ADDRESS);
  const [selectedCase, setSelectedCase] = useState<CaseData>(DEMO_CASES[0]);
  const [isSampleScanning, setIsSampleScanning] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(2);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1-Click SIH Presentation Demo Launcher
  const handleLoadSampleInvestigation = () => {
    setInConsole(true);
    setActiveWallet(DEMO_SUSPECT_ADDRESS);
    setSelectedCase(DEMO_CASES[0]);
    setIsSampleScanning(true);
  };

  const handleSampleScanComplete = () => {
    setIsSampleScanning(false);
    setCurrentPage('forensic-workspace');

    // Confetti burst for demo impact
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#00E676', '#FF3366']
      });
    } catch {
      // ignore
    }
  };

  // Launch console from landing page
  const handleLaunchConsole = () => {
    setInConsole(true);
    setCurrentPage('forensic-workspace');
  };

  // Analyze wallet from search
  const handleAnalyzeWalletFromDashboard = (address: string, chain: Blockchain) => {
    setActiveWallet(address);
    setCurrentPage('wallet-analysis');
  };

  // Case docket selection
  const handleSelectCase = (c: CaseData) => {
    setSelectedCase(c);
    setActiveWallet(c.suspect_wallet);
    setCurrentPage('reports');
  };

  // If user is on landing page
  if (!inConsole) {
    return (
      <LandingPage
        onLaunchConsole={handleLaunchConsole}
        onLoadSample={handleLoadSampleInvestigation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black font-sans">
      {/* Radar Scanner Modal for Sample Investigation flow */}
      <RadarScannerModal
        isOpen={isSampleScanning}
        walletAddress={activeWallet}
        onComplete={handleSampleScanComplete}
      />

      {/* Persistent Top Navigation */}
      <Navbar
        onLoadSample={handleLoadSampleInvestigation}
        unreadAlertCount={unreadAlerts}
        onNavigateAlerts={() => setCurrentPage('alerts')}
        onNavigateHome={() => setCurrentPage('dashboard')}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Layout: Sidebar + Page Container */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activePage={currentPage}
          onSelectPage={setCurrentPage}
          unreadAlertCount={unreadAlerts}
          isOpenOnMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0A0E1A] to-[#070c18]">
          {currentPage === 'forensic-workspace' && <ForensicWorkspace />}

          {currentPage === 'dashboard' && (
            <DashboardPage
              onAnalyzeWallet={handleAnalyzeWalletFromDashboard}
              onViewGraph={() => setCurrentPage('transaction-graph')}
              onViewAlerts={() => setCurrentPage('alerts')}
              onViewCases={() => setCurrentPage('cases')}
              onViewReport={(caseId) => {
                const matched = DEMO_CASES.find((c) => c.case_id === caseId) || DEMO_CASES[0];
                setSelectedCase(matched);
                setCurrentPage('reports');
              }}
            />
          )}

          {currentPage === 'wallet-analysis' && (
            <WalletAnalysisPage
              initialAddress={activeWallet}
              onViewGraph={(addr) => {
                if (addr) setActiveWallet(addr);
                setCurrentPage('transaction-graph');
              }}
              onViewVASP={(addr) => {
                if (addr) setActiveWallet(addr);
                setCurrentPage('vasp-intelligence');
              }}
              onGenerateReport={() => setCurrentPage('reports')}
            />
          )}

          {currentPage === 'transaction-graph' && (
            <TransactionGraphPage
              onSelectWallet={(addr) => {
                setActiveWallet(addr);
                setCurrentPage('wallet-analysis');
              }}
              onViewVASP={() => setCurrentPage('vasp-intelligence')}
              onViewCrossChain={() => setCurrentPage('cross-chain')}
              onGenerateReport={() => setCurrentPage('reports')}
            />
          )}

          {currentPage === 'vasp-intelligence' && (
            <VASPIntelligencePage
              walletAddress={activeWallet}
              onViewGraph={() => setCurrentPage('transaction-graph')}
              onGenerateReport={() => setCurrentPage('reports')}
            />
          )}

          {currentPage === 'cross-chain' && (
            <CrossChainPage
              onViewGraph={() => setCurrentPage('transaction-graph')}
              onViewVASP={() => setCurrentPage('vasp-intelligence')}
              onGenerateReport={() => setCurrentPage('reports')}
            />
          )}

          {currentPage === 'ai-assistant' && (
            <AIAssistantPage
              walletAddress={activeWallet}
              onGenerateReport={() => setCurrentPage('reports')}
            />
          )}

          {currentPage === 'alerts' && (
            <AlertCenterPage
              onViewCase={(caseId) => {
                const matched = DEMO_CASES.find((c) => c.case_id === caseId) || DEMO_CASES[0];
                setSelectedCase(matched);
                setCurrentPage('reports');
              }}
              onViewGraph={(addr) => {
                setActiveWallet(addr);
                setCurrentPage('transaction-graph');
              }}
              onGenerateReport={(caseId) => {
                const matched = DEMO_CASES.find((c) => c.case_id === caseId) || DEMO_CASES[0];
                setSelectedCase(matched);
                setCurrentPage('reports');
              }}
            />
          )}

          {currentPage === 'cases' && (
            <CaseManagementPage onSelectCase={handleSelectCase} />
          )}

          {currentPage === 'reports' && (
            <InvestigationReportPage currentCase={selectedCase} />
          )}

          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
