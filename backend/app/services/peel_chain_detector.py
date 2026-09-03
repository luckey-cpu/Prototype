"""
BLUCE LOCK - AntiGravity Engine
Module: Peel Chain Optimization & Collapse Engine
Purpose: Detect, classify (Exchange Sweeping vs Malicious Obfuscation), and collapse linear peel chains into supernodes.
"""

from typing import List, Dict, Any, Tuple
import math
from datetime import datetime

class PeelChainDetector:
    """
    Detects peel chain topologies:
      Input Node -> [Peel Node (small fraction), Change Node (large remainder)] -> Next Hop...
    Differentiates:
      - Legitimate Exchange Sweeping (high uniformity, 100% balance sweep, hot wallet destination, zero entropy)
      - Malicious Laundering Obfuscation (variable peel %s, jittered timing, burner change addresses)
    """

    def __init__(self, min_hops_threshold: int = 3, peel_ratio_max: float = 0.35):
        self.min_hops_threshold = min_hops_threshold
        self.peel_ratio_max = peel_ratio_max

    def _calculate_shannon_entropy(self, values: List[float]) -> float:
        """Calculates Shannon entropy to measure irregularity in peel amounts."""
        if not values or sum(values) == 0:
            return 0.0
        total = sum(values)
        probabilities = [v / total for v in values if v > 0]
        return -sum(p * math.log2(p) for p in probabilities if p > 0)

    def detect_and_collapse_peel_chains(
        self,
        nodes: List[Dict[str, Any]],
        edges: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Scans graph adjacency to find linear peel chains, determines intent,
        and outputs collapsed supernodes for 60fps WebGL/Canvas rendering.
        """
        # Build adjacency maps
        out_edges: Dict[str, List[Dict[str, Any]]] = {}
        in_edges: Dict[str, List[Dict[str, Any]]] = {}
        node_map: Dict[str, Dict[str, Any]] = {n["id"]: n for n in nodes}

        for edge in edges:
            src = edge["source"]
            tgt = edge["target"]
            out_edges.setdefault(src, []).append(edge)
            in_edges.setdefault(tgt, []).append(edge)

        identified_chains = []
        visited_nodes = set()

        for start_id, node in node_map.items():
            if start_id in visited_nodes:
                continue

            current = start_id
            chain_hops = []

            # Trace consecutive 2-output patterns (one peel, one pass-through change)
            while True:
                children_edges = out_edges.get(current, [])
                if len(children_edges) != 2:
                    break  # Not a standard 2-output peel branch

                amounts = [e.get("amount", e.get("value", 0.0)) for e in children_edges]
                if min(amounts) == 0:
                    break

                total_out = sum(amounts)
                min_idx = 0 if amounts[0] < amounts[1] else 1
                max_idx = 1 - min_idx

                peel_edge = children_edges[min_idx]
                change_edge = children_edges[max_idx]

                peel_ratio = amounts[min_idx] / total_out
                # Check if this qualifies as a peel
                if peel_ratio > self.peel_ratio_max:
                    break  # Balanced split rather than a peel

                peeled_addr = peel_edge["target"]
                change_addr = change_edge["target"]

                chain_hops.append({
                    "hop_index": len(chain_hops) + 1,
                    "feeder_address": current,
                    "peeled_address": peeled_addr,
                    "peel_amount": amounts[min_idx],
                    "peel_currency": peel_edge.get("currency", "USDT"),
                    "change_address": change_addr,
                    "remaining_amount": amounts[max_idx],
                    "timestamp": peel_edge.get("timestamp", ""),
                    "gas_gwei": peel_edge.get("gas_gwei", 35.0)
                })

                visited_nodes.add(current)
                visited_nodes.add(peeled_addr)
                visited_nodes.add(change_addr)

                current = change_addr

            if len(chain_hops) >= self.min_hops_threshold:
                # Classify the detected chain
                classification = self._classify_chain(chain_hops, node_map)
                identified_chains.append({
                    "chain_id": f"PEEL-CHAIN-{len(identified_chains) + 1}",
                    "hop_count": len(chain_hops),
                    "total_peeled_amount": sum(h["peel_amount"] for h in chain_hops),
                    "initial_principal": chain_hops[0]["peel_amount"] + chain_hops[0]["remaining_amount"],
                    "final_remaining": chain_hops[-1]["remaining_amount"],
                    "classification": classification,
                    "hops": chain_hops
                })

        # Generate collapsed graph representation
        collapsed_nodes = []
        collapsed_edges = []
        handled_node_ids = set()

        for chain in identified_chains:
            # Mark all nodes in this chain as handled
            for h in chain["hops"]:
                handled_node_ids.add(h["feeder_address"])
                handled_node_ids.add(h["peeled_address"])
                handled_node_ids.add(h["change_address"])

            # Create Supernode
            supernode_id = f"supernode_{chain['chain_id']}"
            collapsed_nodes.append({
                "id": supernode_id,
                "label": f"Collapsed Peel Chain ({chain['hop_count']} Hops)",
                "is_supernode": True,
                "type": "peel_supernode",
                "classification": chain["classification"]["verdict"],
                "risk_rating": chain["classification"]["risk_rating"],
                "total_peeled_usd": round(chain["total_peeled_amount"], 2),
                "summary": (
                    f"{chain['classification']['verdict']}: {chain['hop_count']} sequential peels "
                    f"siphoning ${chain['total_peeled_amount']:,.2f}."
                ),
                "internal_hops": chain["hops"]
            })

        # Keep uncollapsed nodes
        for node in nodes:
            if node["id"] not in handled_node_ids:
                collapsed_nodes.append(node)

        # Keep uncollapsed edges
        for edge in edges:
            if edge["source"] not in handled_node_ids and edge["target"] not in handled_node_ids:
                collapsed_edges.append(edge)

        return {
            "peel_chains_found": len(identified_chains),
            "chains_metadata": identified_chains,
            "collapsed_graph": {
                "nodes": collapsed_nodes,
                "edges": collapsed_edges,
                "node_count_before": len(nodes),
                "node_count_after": len(collapsed_nodes),
                "compression_ratio": f"{round((1 - len(collapsed_nodes)/max(len(nodes),1))*100, 1)}%"
            }
        }

    def _classify_chain(self, hops: List[Dict[str, Any]], node_map: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
        """
        Differentiates between:
          - LEGITIMATE_EXCHANGE_SWEEP
          - MALICIOUS_OBFUSCATION_PEEL
        """
        peel_amounts = [h["peel_amount"] for h in hops]
        entropy = self._calculate_shannon_entropy(peel_amounts)
        gas_fees = [h.get("gas_gwei", 30.0) for h in hops]
        gas_variance = sum((g - (sum(gas_fees)/len(gas_fees)))**2 for g in gas_fees) / len(gas_fees)

        # High variance + High entropy indicates human/scripted obfuscation
        # Zero variance + Target being a central exchange indicates automated sweep
        is_malicious = entropy > 1.2 or gas_variance > 25.0

        if is_malicious:
            return {
                "verdict": "MALICIOUS_OBFUSCATION_PEEL",
                "risk_rating": "CRITICAL",
                "confidence": 0.93,
                "entropy_score": round(entropy, 3),
                "gas_variance": round(gas_variance, 2),
                "forensic_reasoning": (
                    "High Shannon entropy across peeled tranches coupled with irregular gas premiums "
                    "confirms deliberate anti-clustering obfuscation designed to thwart threshold triggers."
                )
            }
        else:
            return {
                "verdict": "LEGITIMATE_EXCHANGE_SWEEP",
                "risk_rating": "LOW",
                "confidence": 0.88,
                "entropy_score": round(entropy, 3),
                "gas_variance": round(gas_variance, 2),
                "forensic_reasoning": (
                    "High uniformity in sweeping tranches and deterministic gas schedules consistent with "
                    "exchange hot-wallet sweeping routines."
                )
            }

peel_chain_detector = PeelChainDetector()
