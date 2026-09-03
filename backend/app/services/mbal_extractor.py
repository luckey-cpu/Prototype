import asyncio
import time
import numpy as np
from typing import Dict, Any, List
from web3 import AsyncWeb3
from aiohttp import ClientSession
from tenacity import retry, wait_exponential, stop_after_attempt
from pydantic import BaseModel, Field

class MBALFeatureVector(BaseModel):
    """Pydantic schema to validate the 144-dimensional feature vector."""
    address: str = Field(..., description="EVM 0x hex address")
    execution_latency_ms: float = Field(..., description="Time taken to extract features in ms")
    features: List[float] = Field(..., min_items=144, max_items=144, description="Strictly ordered 1D array of size 144")

class MBALFeatureExtractor:
    def __init__(self, rpc_url: str):
        self.w3 = AsyncWeb3(AsyncWeb3.AsyncHTTPProvider(rpc_url))
        self.rpc_url = rpc_url

    @retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(5))
    async def fetch_receipt_batch(self, session: ClientSession, tx_hashes: List[str]) -> List[Dict]:
        """Fetch transaction receipts in batch to filter out failed transactions."""
        payload = [
            {"jsonrpc": "2.0", "method": "eth_getTransactionReceipt", "params": [tx_hash], "id": i}
            for i, tx_hash in enumerate(tx_hashes)
        ]
        async with session.post(self.rpc_url, json=payload) as response:
            response.raise_for_status()
            data = await response.json()
            return [res.get("result") for res in data if res.get("result")]

    @retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(5))
    async def fetch_block_timestamps(self, session: ClientSession, block_numbers: List[int]) -> Dict[int, int]:
        """Fetch block headers to calculate temporal velocity (delta t)."""
        unique_blocks = list(set(block_numbers))
        payload = [
            {"jsonrpc": "2.0", "method": "eth_getBlockByNumber", "params": [hex(bn), False], "id": i}
            for i, bn in enumerate(unique_blocks)
        ]
        async with session.post(self.rpc_url, json=payload) as response:
            response.raise_for_status()
            data = await response.json()
            return {
                int(res["result"]["number"], 16): int(res["result"]["timestamp"], 16)
                for res in data if res.get("result")
            }

    async def extract_features(self, address: str, tx_history: List[Dict]) -> MBALFeatureVector:
        """
        Extract behavioral and topological features from on-chain transaction history.
        Assumes `tx_history` is a list of raw transaction dicts (e.g., from an indexer or Etherscan).
        """
        start_time = time.time()
        address = address.lower()
        
        # 1. Concurrency & Extraction: Filter failed txs
        tx_hashes = [tx["hash"] for tx in tx_history]
        async with ClientSession() as session:
            # Batch query in chunks of 50 to avoid RPC limits
            valid_txs = []
            block_nums = []
            for i in range(0, len(tx_hashes), 50):
                chunk = tx_hashes[i:i+50]
                receipts = await self.fetch_receipt_batch(session, chunk)
                for receipt in receipts:
                    # Status 1 = Success
                    if receipt and int(receipt.get("status", "0x0"), 16) == 1:
                        # Find original tx
                        tx = next(t for t in tx_history if t["hash"] == receipt["transactionHash"])
                        valid_txs.append(tx)
                        block_nums.append(int(tx["blockNumber"], 16) if isinstance(tx["blockNumber"], str) else tx["blockNumber"])
            
            timestamps = await self.fetch_block_timestamps(session, block_nums)

        # 2. Behavioral Metrics Calculation
        values_sent = []
        values_received = []
        in_counterparties = set()
        out_counterparties = set()
        time_intervals = []
        contract_interactions = 0
        peeling_count = 0
        
        prev_time = None
        for tx in valid_txs:
            val = float(AsyncWeb3.from_wei(int(tx.get("value", 0)), 'ether'))
            blk_num = int(tx["blockNumber"], 16) if isinstance(tx["blockNumber"], str) else tx["blockNumber"]
            tx_time = timestamps.get(blk_num, 0)
            
            if prev_time is not None and tx_time > prev_time:
                time_intervals.append(tx_time - prev_time)
            prev_time = tx_time
            
            # Simple heuristic for contract interactions (empty to_address or data payload present)
            if not tx.get("to") or (tx.get("input") and tx["input"] != "0x"):
                contract_interactions += 1
            
            if tx["from"].lower() == address:
                values_sent.append(val)
                if tx.get("to"): out_counterparties.add(tx["to"].lower())
                
                # Peeling Heuristic: Output >= 75% of a typical change value
                # (Highly simplified for this module)
                if val > 0: peeling_count += 1 
            else:
                values_received.append(val)
                in_counterparties.add(tx["from"].lower())

        # Volume Dynamics
        tot_sent = sum(values_sent) if values_sent else 0.0
        tot_recv = sum(values_received) if values_received else 0.0
        net_balance = tot_recv - tot_sent
        mean_sent = np.mean(values_sent) if values_sent else -1.0
        var_sent = np.var(values_sent) if len(values_sent) > 1 else -1.0
        
        # Temporal Velocity
        min_dt = np.min(time_intervals) if time_intervals else -1.0
        max_dt = np.max(time_intervals) if time_intervals else -1.0
        mean_dt = np.mean(time_intervals) if time_intervals else -1.0
        std_dt = np.std(time_intervals) if len(time_intervals) > 1 else -1.0
        
        # In/Out Degree Ratios
        in_deg = len(in_counterparties)
        out_deg = len(out_counterparties)
        degree_ratio = out_deg / (in_deg + 1e-6)

        # 3. Feature Formatting
        # We need a 144-dimensional vector. 
        # We will map our calculated features into the first N indices and pad the rest with -1.0 (imputed missing)
        # In a full production MBAL pipeline, each of the 144 features would be exhaustively calculated.
        raw_features = [
            tot_sent, tot_recv, net_balance, mean_sent, var_sent, 
            min_dt, max_dt, mean_dt, std_dt, 
            float(in_deg), float(out_deg), degree_ratio, 
            float(contract_interactions), float(peeling_count)
        ]
        
        feature_vector = np.full((144,), -1.0, dtype=np.float32)
        feature_vector[:len(raw_features)] = raw_features
        
        latency_ms = (time.time() - start_time) * 1000

        return MBALFeatureVector(
            address=address,
            execution_latency_ms=latency_ms,
            features=feature_vector.tolist()
        )
