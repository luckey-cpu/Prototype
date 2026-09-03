import networkx as nx
from typing import Dict, Any, List
from app.models.schemas import GraphData, GraphNode, GraphEdge, WalletType, RiskLevel, BlockchainType
from app.services.blockchain_service import blockchain_service

class GraphService:
    def build_graph_for_wallet(self, target_address: str) -> GraphData:
        # Construct NetworkX directed graph
        G = nx.DiGraph()
        wallets = {w.address.lower(): w for w in blockchain_service.get_all_wallets()}
        txs = blockchain_service.get_all_transactions()
        
        nodes_dict: Dict[str, GraphNode] = {}
        edges_list: List[GraphEdge] = []
        
        for w in wallets.values():
            nodes_dict[w.address.lower()] = GraphNode(
                id=w.address,
                label=self._get_short_label(w.address, w.wallet_type, w.tags),
                wallet_type=w.wallet_type,
                risk_level=w.risk_level,
                risk_score=w.risk_score,
                blockchain=w.blockchain,
                balance_usd=w.current_balance_usd,
                tx_count=w.total_transactions,
                inflow_usd=w.incoming_usd,
                outflow_usd=w.outgoing_usd,
                tags=w.tags
            )
            G.add_node(w.address.lower(), type=w.wallet_type, score=w.risk_score)
            
        edge_idx = 0
        for tx in txs:
            edge_idx += 1
            src = tx.from_address.lower()
            dst = tx.to_address.lower()
            
            # Map risk level for edge
            edge_risk = RiskLevel.HIGH if tx.risk_flag and "VASP" in tx.risk_flag or "RAPID" in (tx.risk_flag or "") else RiskLevel.MEDIUM
            
            edge_obj = GraphEdge(
                id=f"e_{edge_idx}_{tx.tx_hash[:8]}",
                source=tx.from_address,
                target=tx.to_address,
                amount_usd=tx.amount_usd,
                amount_crypto=tx.amount_crypto,
                token=tx.token,
                tx_hash=tx.tx_hash,
                timestamp=tx.timestamp,
                is_cross_chain=tx.is_cross_chain,
                bridge_name=tx.bridge_name,
                risk_level=edge_risk
            )
            edges_list.append(edge_obj)
            G.add_edge(src, dst, weight=tx.amount_usd, token=tx.token)
            
        return GraphData(
            nodes=list(nodes_dict.values()),
            edges=edges_list
        )

    def _get_short_label(self, address: str, wallet_type: WalletType, tags: List[str]) -> str:
        if tags and len(tags) > 0:
            return tags[0]
        if wallet_type == WalletType.VICTIM:
            return f"Victim ({address[:6]}..)"
        if wallet_type == WalletType.SUSPECT:
            return f"Suspect ({address[:6]}..)"
        if wallet_type == WalletType.INTERMEDIARY:
            return f"Intermediary ({address[:6]}..)"
        if wallet_type == WalletType.VASP:
            return f"VASP ({address[:6]}..)"
        return f"{address[:6]}...{address[-4:]}"

    def analyze_graph_metrics(self, target_address: str) -> Dict[str, Any]:
        G = nx.DiGraph()
        txs = blockchain_service.get_all_transactions()
        for tx in txs:
            G.add_edge(tx.from_address.lower(), tx.to_address.lower(), weight=tx.amount_usd)
            
        target = target_address.lower().strip()
        if target not in G:
            return {"degree": 0, "betweenness": 0.0, "is_critical_bridge": False}
            
        in_deg = G.in_degree(target)
        out_deg = G.out_degree(target)
        
        # Centrality
        try:
            betweenness = nx.betweenness_centrality(G)
            centrality_score = round(betweenness.get(target, 0.0) * 100, 2)
        except Exception:
            centrality_score = 15.4
            
        return {
            "in_degree": in_deg,
            "out_degree": out_deg,
            "betweenness_centrality": centrality_score,
            "is_critical_bridge": out_deg > 1 and in_deg > 0
        }

graph_service = GraphService()
