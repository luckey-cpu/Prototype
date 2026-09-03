import React from 'react';
import { InvestigationReportPreview } from '../components/report/InvestigationReportPreview';
import { CaseData } from '../types';

interface InvestigationReportPageProps {
  currentCase?: CaseData;
}

export const InvestigationReportPage: React.FC<InvestigationReportPageProps> = ({
  currentCase
}) => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <InvestigationReportPreview currentCase={currentCase} />
    </div>
  );
};
