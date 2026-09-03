import { api } from './api';
import { VASPAttribution } from '../types';

export class VASPService {
  async getAttribution(address: string): Promise<VASPAttribution> {
    return await api.getVASP(address);
  }
}

export const vaspService = new VASPService();
