import React from 'react';
import { AIAssistantPanel } from '../components/ai/AIAssistantPanel';
import { DEMO_SUSPECT_ADDRESS } from '../data/demoData';

interface AIAssistantPageProps {
  walletAddress?: string;
  onGenerateReport?: () => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  walletAddress = DEMO_SUSPECT_ADDRESS,
  onGenerateReport
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AIAssistantPanel
        walletAddress={walletAddress}
        onGenerateReport={onGenerateReport}
      />
    </div>
  );
};
