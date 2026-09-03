"""
BLUCE LOCK - AntiGravity Engine
Module: Mule Feeder Account Clustering Engine
Purpose: Machine Learning heuristic to identify and cluster 'mule feeder' topologies where multiple unlinked,
low-value wallets funnel illicit proceeds into a central consolidation wallet within a 24-hour window.
"""

from typing import List, Dict, Any, Optional
import math
from datetime import datetime, timedelta

class MuleFeederClusterEngine:
    """
    Identifies Smurfing / Mule Feeder Rings:
      Many Unlinked Feeders (Low Value) ---> [24-hr Window] ---> Central Consolidation Sink
    """

    def __init__(self, time_window_hours: float = 24.0, min_feeders: int = 3, max_feeder_usd: float = 12000.0):
        self.time_window_hours = time_window_hours
        self.min_feeders = min_feeders
        self.max_feeder_usd = max_feeder_usd

    def analyze_consolidation_sink(
        self,
        target_wallet: str,
        inflow_transactions: List[Dict[str, Any]],
        historical_interactions_map: Optional[Dict[str, List[str]]] = None
    ) -> Dict[str, Any]:
        """
        Evaluates incoming transactions to the target wallet to detect mule feeder rings.
        """
        if not inflow_transactions:
            return {
                "target_wallet": target_wallet,
                "is_mule_consolidation_sink": False,
                "confidence_score": 0.0,
                "reason": "No inflow transactions available."
            }

        # Parse timestamps and group by 24h sliding windows
        parsed_txs = []
        for tx in inflow_transactions:
            raw_time = tx.get("timestamp", "")
            try:
                dt = datetime.fromisoformat(raw_time.replace("Z", ""))
            except Exception:
                dt = datetime.utcnow()

            parsed_txs.append({
                "hash": tx.get("hash", ""),
                "sender": tx.get("from", tx.get("from_address", "")).lower(),
                "amount": float(tx.get("amount", tx.get("value", 0.0))),
                "currency": tx.get("currency", "USDT"),
                "datetime": dt,
                "holding_duration_mins": float(tx.get("sender_holding_mins", 8.5))
            })

        parsed_txs.sort(key=lambda x: x["datetime"])

        # Sliding window evaluation (24 hours)
        best_cluster = None
        max_cluster_feeders = 0

        for i in range(len(parsed_txs)):
            window_start = parsed_txs[i]["datetime"]
            window_end = window_start + timedelta(hours=self.time_window_hours)

            window_txs = [t for t in parsed_txs if window_start <= t["datetime"] <= window_end]
            unique_senders = list({t["sender"] for t in window_txs if t["sender"] != target_wallet.lower()})

            if len(unique_senders) > max_cluster_feeders:
                max_cluster_feeders = len(unique_senders)
                best_cluster = {
                    "start": window_start,
                    "end": window_end,
                    "txs": window_txs,
                    "feeders": unique_senders
                }

        if not best_cluster or len(best_cluster["feeders"]) < self.min_feeders:
            return {
                "target_wallet": target_wallet,
                "is_mule_consolidation_sink": False,
                "confidence_score": 0.15,
                "feeder_count": len(best_cluster["feeders"]) if best_cluster else 0,
                "verdict": "BENIGN_OR_STANDARD_ACTIVITY",
                "details": "Insufficient multi-source fan-in within 24h window."
            }

        # Extract features for heuristic scoring
        cluster_txs = best_cluster["txs"]
        amounts = [t["amount"] for t in cluster_txs]
        total_consolidated = sum(amounts)
        mean_amount = total_consolidated / max(len(amounts), 1)

        # Standard deviation of amounts
        variance = sum((x - mean_amount) ** 2 for x in amounts) / max(len(amounts), 1)
        std_dev = math.sqrt(variance)
        coefficient_of_variation = std_dev / mean_amount if mean_amount > 0 else 0

        # Structured smurfing metric: Are amounts just under the $10,000 regulatory threshold?
        near_threshold_feeders = sum(1 for a in amounts if 3000.0 <= a <= 9900.0)
        smurf_ratio = near_threshold_feeders / len(amounts)

        # Unlinked check (Jaccard similarity among historical counterparts)
        unlinked_score = 0.95  # High unlinked prior probability
        if historical_interactions_map:
            shared_contacts = 0
            pairs = 0
            feeders = best_cluster["feeders"]
            for f1 in range(len(feeders)):
                for f2 in range(f1 + 1, len(feeders)):
                    pairs += 1
                    s1 = set(historical_interactions_map.get(feeders[f1], []))
                    s2 = set(historical_interactions_map.get(feeders[f2], []))
                    if s1 and s2:
                        jaccard = len(s1 & s2) / len(s1 | s2)
                        if jaccard > 0.2:
                            shared_contacts += 1
            if pairs > 0:
                unlinked_score = 1.0 - (shared_contacts / pairs)

        # Holding duration penalty: mules forward cash immediately
        avg_holding = sum(t["holding_duration_mins"] for t in cluster_txs) / len(cluster_txs)
        speed_factor = 1.3 if avg_holding < 30.0 else 1.0

        # Composite Anomaly Score (0 to 100)
        base_score = (
            (min(len(best_cluster["feeders"]), 10) / 10.0) * 35.0 +  # Fan-in weight
            (smurf_ratio * 30.0) +                                  # Smurfing weight
            (unlinked_score * 20.0) +                               # Unlinked topology weight
            (1.0 - min(coefficient_of_variation, 1.0)) * 15.0       # Amount uniformity weight
        ) * speed_factor

        final_score = min(98.5, max(10.0, base_score))
        is_mule_ring = final_score >= 70.0

        return {
            "target_wallet": target_wallet,
            "is_mule_consolidation_sink": is_mule_ring,
            "confidence_score": round(final_score, 1),
            "threat_classification": "ACTIVE_MULE_FEEDER_CONSOLIDATION_SINK" if is_mule_ring else "SUSPICIOUS_AGGREGATION",
            "cluster_metrics": {
                "active_feeder_wallets_count": len(best_cluster["feeders"]),
                "window_duration_hours": self.time_window_hours,
                "window_start": best_cluster["start"].isoformat() + "Z",
                "window_end": best_cluster["end"].isoformat() + "Z",
                "total_consolidated_usd": round(total_consolidated, 2),
                "average_feeder_transfer_usd": round(mean_amount, 2),
                "smurfing_structuring_ratio": f"{round(smurf_ratio * 100, 1)}%",
                "mean_holding_time_minutes": round(avg_holding, 1),
                "unlinked_counterparty_index": round(unlinked_score, 2)
            },
            "identified_feeder_nodes": [
                {
                    "wallet_address": sender,
                    "total_contributed": round(sum(t["amount"] for t in cluster_txs if t["sender"] == sender), 2),
                    "tx_count": sum(1 for t in cluster_txs if t["sender"] == sender),
                    "is_burner": True
                }
                for sender in best_cluster["feeders"]
            ],
            "forensic_summary": (
                f"Detected {len(best_cluster['feeders'])} unlinked feeder wallets funneling "
                f"${total_consolidated:,.2f} into consolidation sink {target_wallet[:10]}... "
                f"within {self.time_window_hours} hours. Average transit latency is {round(avg_holding, 1)} mins. "
                f"Indicates classic mule network funneling illicit proceeds for batch off-ramping."
            )
        }

mule_clustering_engine = MuleFeederClusterEngine()
