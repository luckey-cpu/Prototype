import uuid
import time
import networkx as nx
from typing import List, Dict, Tuple
from pydantic import BaseModel

class MuleCluster(BaseModel):
    staging_address: str
    mule_addresses: List[str]
    total_volume: float
    time_delta_seconds: float

class PrunedGraphResult(BaseModel):
    collapsed_hops: int
    total_fees_consumed: float
    peel_nodes_created: List[str]

class ForensicGraphPruner:
    def __init__(self, graph: nx.MultiDiGraph):
        # We copy the graph so we don't mutate the original reference unpredictably
        self.graph = graph.copy()

    def collapse_peel_chains(self) -> Tuple[nx.MultiDiGraph, PrunedGraphResult]:
        """
        Rule: A peel transaction occurs when an address A transfers funds to exactly two outputs:
        - Output 1 (Change/Peel): Receives >= 75% of total input value
        - Output 2 (Dispersal/Sink): Receives <= 25% of input value
        """
        start_time = time.time()
        
        peel_nodes = []
        collapsed_hops = 0
        total_fees = 0.0
        
        # We look for nodes with exactly out_degree == 2
        # (For MultiDiGraph, out_degree counts multiple edges to same target, 
        # so we check number of unique successors).
        nodes_to_process = list(self.graph.nodes())
        
        for node in nodes_to_process:
            if not self.graph.has_node(node):
                continue
                
            successors = list(self.graph.successors(node))
            if len(successors) == 2:
                # Calculate total out volume
                out_edges = self.graph.out_edges(node, data=True)
                total_out = sum(data.get('value', 0.0) for _, _, data in out_edges)
                
                if total_out <= 0:
                    continue
                
                # Check ratio
                vol_0 = sum(data.get('value', 0.0) for _, _, data in self.graph.out_edges(node, data=True) if _ == node and data.get('to_address') == successors[0] or _ == node and list(self.graph.successors(node))[0] == successors[0]) 
                # Better logic:
                vol_0 = sum(data.get('value', 0.0) for u, v, data in self.graph.edges(node, data=True) if v == successors[0])
                vol_1 = sum(data.get('value', 0.0) for u, v, data in self.graph.edges(node, data=True) if v == successors[1])
                
                ratio_0 = vol_0 / total_out
                ratio_1 = vol_1 / total_out
                
                change_node = None
                sink_node = None
                
                if ratio_0 >= 0.75 and ratio_1 <= 0.25:
                    change_node = successors[0]
                    sink_node = successors[1]
                elif ratio_1 >= 0.75 and ratio_0 <= 0.25:
                    change_node = successors[1]
                    sink_node = successors[0]
                    
                if change_node and sink_node:
                    # It's a peel!
                    # Collapse the change node into a virtual Peel Run
                    peel_id = f"Peel_Run_{uuid.uuid4().hex[:8]}"
                    
                    # Aggregate
                    collapsed_hops += 1
                    total_fees += sum(data.get('fee', 0.0) for u, v, data in self.graph.edges(node, data=True))
                    
                    # We will just add the virtual node and wire the sink
                    self.graph.add_node(peel_id, type="peel_run")
                    self.graph.add_edge(node, peel_id, value=total_out, type="peel_entry")
                    self.graph.add_edge(peel_id, sink_node, value=min(vol_0, vol_1), type="peel_sink")
                    
                    peel_nodes.append(peel_id)
                    
                    # Remove the original edges and the change node to collapse
                    # In a full recursive collapse, we would traverse the change_node chain.
                    self.graph.remove_node(change_node)
        
        result = PrunedGraphResult(
            collapsed_hops=collapsed_hops,
            total_fees_consumed=total_fees,
            peel_nodes_created=peel_nodes
        )
        return self.graph, result

    def detect_mule_clusters(self, time_window_hours: int = 6) -> List[MuleCluster]:
        """
        Rule: Multiple distinct addresses (N >= 3) receiving fragmented funds 
        that subsequently forward >= 90% of received balances to a common staging address 
        within a rolling sliding window.
        """
        clusters = []
        time_window_seconds = time_window_hours * 3600
        
        # For every node, see if it acts as a staging address (high in-degree from unique mules)
        for node in self.graph.nodes():
            predecessors = list(self.graph.predecessors(node))
            if len(predecessors) >= 3:
                mules = []
                total_vol = 0.0
                timestamps = []
                
                for pred in predecessors:
                    # Check if pred forwards >= 90% of its received balance to `node`
                    in_edges = self.graph.in_edges(pred, data=True)
                    out_edges = self.graph.out_edges(pred, data=True)
                    
                    total_recv = sum(data.get('value', 0.0) for _, _, data in in_edges)
                    forwarded_to_staging = sum(data.get('value', 0.0) for u, v, data in out_edges if v == node)
                    
                    if total_recv > 0 and (forwarded_to_staging / total_recv) >= 0.90:
                        mules.append(pred)
                        total_vol += forwarded_to_staging
                        
                        # Collect timestamps to check sliding window
                        for u, v, data in out_edges:
                            if v == node and 'timestamp' in data:
                                timestamps.append(data['timestamp'])
                                
                if len(mules) >= 3 and timestamps:
                    min_ts = min(timestamps)
                    max_ts = max(timestamps)
                    
                    if (max_ts - min_ts) <= time_window_seconds:
                        clusters.append(MuleCluster(
                            staging_address=node,
                            mule_addresses=mules,
                            total_volume=total_vol,
                            time_delta_seconds=(max_ts - min_ts)
                        ))
                        
                        # Graph Action: Group these addresses into a Mule_Cluster node
                        cluster_node = f"Mule_Cluster_{node[:6]}"
                        self.graph.add_node(cluster_node, type="mule_cluster", aggregation_volume=total_vol)
                        self.graph.add_edge(cluster_node, node, value=total_vol)
                        
                        # Optionally remove the original mules to compress graph
                        for m in mules:
                            if self.graph.has_node(m):
                                self.graph.remove_node(m)

        return clusters

# Example benchmark runner
if __name__ == "__main__":
    import random
    
    # Generate 10k edge mock graph
    G = nx.MultiDiGraph()
    for i in range(10000):
        src = f"0x{random.randint(1000, 9999)}"
        dst = f"0x{random.randint(1000, 9999)}"
        G.add_edge(src, dst, value=random.uniform(0.1, 10.0), timestamp=int(time.time()))
        
    print(f"Graph initialized with {G.number_of_edges()} edges and {G.number_of_nodes()} nodes.")
    
    pruner = ForensicGraphPruner(G)
    
    t0 = time.perf_counter()
    pruned_G, res = pruner.collapse_peel_chains()
    t1 = time.perf_counter()
    
    t2 = time.perf_counter()
    clusters = pruner.detect_mule_clusters()
    t3 = time.perf_counter()
    
    print(f"Peel Chain Collapse: {(t1 - t0) * 1000:.2f} ms")
    print(f"Mule Cluster Detection: {(t3 - t2) * 1000:.2f} ms")
