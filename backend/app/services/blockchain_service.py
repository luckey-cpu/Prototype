import json
import os
from typing import List, Optional, Dict, Any
from pathlib import Path
from app.models.schemas import WalletSummary, TransactionItem, BlockchainType, WalletType, RiskLevel, TransactionDirection

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

class BlockchainService:
    def __init__(self):
        self.wallets_cache: Dict[str, Dict[str, Any]] = {}
        self.transactions_cache: List[Dict[str, Any]] = []
        self._load_data()

    def _load_data(self):
        wallets_file = DATA_DIR / "demo_wallets.json"
        tx_file = DATA_DIR / "demo_transactions.json"
        
        if wallets_file.exists():
            with open(wallets_file, "r", encoding="utf-8") as f:
                wallets_list = json.load(f)
                for w in wallets_list:
                    self.wallets_cache[w["address"].lower()] = w
                    
        if tx_file.exists():
            with open(tx_file, "r", encoding="utf-8") as f:
                self.transactions_cache = json.load(f)

    def get_wallet(self, address: str) -> Optional[WalletSummary]:
        addr = address.lower().strip()
        data = self.wallets_cache.get(addr)
        if not data:
            # Fallback for dynamic query: generate synthetic profile for unknown address
            return WalletSummary(
                address=address,
                blockchain=BlockchainType.ETHEREUM,
                wallet_type=WalletType.UNKNOWN,
                risk_level=RiskLevel.MEDIUM,
                risk_score=45,
                total_transactions=12,
                incoming_usd=24500.0,
                outgoing_usd=24100.0,
                current_balance_usd=400.0,
                first_seen="2026-08-01",
                last_activity="2 hours ago",
                cluster_id=None,
                tags=["Newly Analyzed", "Unlabeled"]
            )
        return WalletSummary(**data)

    def get_transactions_for_wallet(self, address: str) -> List[TransactionItem]:
        addr = address.lower().strip()
        results = []
        for tx in self.transactions_cache:
            if tx["from_address"].lower() == addr or tx["to_address"].lower() == addr:
                direction = TransactionDirection.OUTGOING if tx["from_address"].lower() == addr else TransactionDirection.INCOMING
                tx_copy = dict(tx)
                tx_copy["direction"] = direction
                results.append(TransactionItem(**tx_copy))
        return results

    def get_all_transactions(self) -> List[TransactionItem]:
        return [TransactionItem(**tx) for tx in self.transactions_cache]

    def get_all_wallets(self) -> List[WalletSummary]:
        return [WalletSummary(**w) for w in self.wallets_cache.values()]

# Singleton instance
blockchain_service = BlockchainService()
