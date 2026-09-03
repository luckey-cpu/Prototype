import { api } from './api';
import { RiskIndicator } from '../types';

export class RiskService {
  async getRiskAssessment(address: string): Promise<{
    risk_score: number;
    risk_level: string;
    indicators: RiskIndicator[];
  }> {
    return await api.getRisk(address);
  }
}

export const riskService = new RiskService();
