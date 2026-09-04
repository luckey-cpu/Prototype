import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Navbar } from './components/common/Navbar';
import { Sidebar, PageId } from './components/common/Sidebar';
import { RadarScannerModal } from './components/common/RadarScannerModal';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
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

// Wrapper for LandingPage to supply navigation handlers via router
const LandingPageWrapper = () => {
  const navigate = useNavigate();
  return (
    <LandingPage
      onLaunchConsole={() => navigate('/login')}
      onLoadSample={() => navigate('/dashboard')}
    />
  );
};

// Extracted authenticated layout
const AuthenticatedApp = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<PageId>('forensic-workspace');
  const [activeWallet, setActiveWallet] = useState<string>(DEMO_SUSPECT_ADDRESS);
  const [selectedCase, setSelectedCase] = useState<CaseData>(DEMO_CASES[0]);
  const [isSampleScanning, setIsSampleScanning] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(2);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLoadSampleInvestigation = () => {
    setActiveWallet(DEMO_SUSPECT_ADDRESS);
    setSelectedCase(DEMO_CASES[0]);
    setIsSampleScanning(true);
  };

  const handleSampleScanComplete = () => {
    setIsSampleScanning(false);
    setCurrentPage('forensic-workspace');
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

  const handleAnalyzeWalletFromDashboard = (address: string, chain: Blockchain) => {
    setActiveWallet(address);
    setCurrentPage('wallet-analysis');
  };

  const handleGlobalSearch = (query: string) => {
    setActiveWallet(query);
    setIsSampleScanning(true);
    setCurrentPage('forensic-workspace');
  };

  const handleSelectCase = (c: CaseData) => {
    setSelectedCase(c);
    setActiveWallet(c.suspect_wallet);
    setCurrentPage('reports');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-blue-900/50 selection:text-blue-200 font-sans">
      <RadarScannerModal
        isOpen={isSampleScanning}
        walletAddress={activeWallet}
        onComplete={handleSampleScanComplete}
      />
      <Navbar
        onLoadSample={handleLoadSampleInvestigation}
        unreadAlertCount={unreadAlerts}
        onNavigateAlerts={() => setCurrentPage('alerts')}
        onNavigateHome={() => setCurrentPage('dashboard')}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onSearch={handleGlobalSearch}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activePage={currentPage}
          onSelectPage={setCurrentPage}
          unreadAlertCount={unreadAlerts}
          isOpenOnMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 overflow-y-auto bg-[#030712]">
          {currentPage === 'forensic-workspace' && <ForensicWorkspace initialAddress={activeWallet} />}
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
};

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/*" element={<AuthenticatedApp />} />
      </Routes>
    </Router>
  );
}

export default App;
