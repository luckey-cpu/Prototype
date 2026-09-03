import { api } from './api';
import { WalletData, TransactionData } from '../types';

export class BlockchainService {
  async getWalletDetails(address: string): Promise<WalletData> {
    return await api.getWallet(address);
  }

  async getWalletTransactions(address: string): Promise<TransactionData[]> {
    return await api.getTransactions(address);
  }

  isValidAddress(address: string): boolean {
    if (!address) return false;
    const trimmed = address.trim();
    // EVM address check
    if (trimmed.startsWith('0x') && trimmed.length === 42) return true;
    // BTC address check or shortened demo address check
    if (trimmed.length >= 26 && trimmed.length <= 64) return true;
    return false;
  }
}

export const blockchainService = new BlockchainService();
