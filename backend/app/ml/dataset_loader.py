import os
import torch
import pandas as pd
import numpy as np
from torch_geometric.data import Data, InMemoryDataset
from typing import List

class Elliptic2SubgraphDataset(InMemoryDataset):
    """
    Parses Elliptic2 connected components into distinct PyG Data subgraphs.
    Each graph represents a fund-flow topology labeled as licit (0) or suspicious laundering (1).
    """
    def __init__(self, root_dir: str, transform=None, pre_transform=None):
        self.root_dir = root_dir
        super().__init__(root_dir, transform, pre_transform)
        self.data, self.slices = torch.load(self.processed_paths[0])

    @property
    def raw_file_names(self) -> List[str]:
        return ["nodes.csv", "edges.csv", "connected_components.csv"]

    @property
    def processed_file_names(self) -> List[str]:
        return ["elliptic2_subgraphs.pt"]

    def process(self):
        nodes_path = os.path.join(self.root_dir, "nodes.csv")
        edges_path = os.path.join(self.root_dir, "edges.csv")
        cc_path = os.path.join(self.root_dir, "connected_components.csv")

        # 1. Load components & labels (ccId, clId, label)
        print("[*] Loading connected components mapping...")
        cc_df = pd.read_csv(cc_path)
        
        # 2. Load node features (clId, feat_0 ... feat_N)
        print("[*] Loading node cluster features...")
        nodes_df = pd.read_csv(nodes_path)
        feature_cols = [c for c in nodes_df.columns if c not in ["clId", "label"]]
        nodes_df[feature_cols] = nodes_df[feature_cols].fillna(0.0)
        node_features_map = dict(zip(nodes_df["clId"], nodes_df[feature_cols].values))

        # 3. Load edges (clId1, clId2, txId)
        print("[*] Loading transaction edges...")
        edges_df = pd.read_csv(edges_path)
        
        data_list = []
        grouped = cc_df.groupby("ccId")

        print(f"[*] Constructing PyG subgraphs for {len(grouped)} components...")
        for cc_id, group in grouped:
            nodes_in_cc = set(group["clId"].values)
            label = int(group["label"].iloc[0]) # 0: licit, 1: suspicious

            # Map arbitrary node IDs to contiguous indices [0, N-1]
            node_idx_map = {nid: i for i, nid in enumerate(nodes_in_cc)}
            
            # Build node feature tensor X
            x_feats = [
                node_features_map[nid] for nid in nodes_in_cc 
                if nid in node_features_map
            ]
            if not x_feats or len(x_feats) != len(nodes_in_cc):
                continue
            
            x = torch.tensor(np.array(x_feats), dtype=torch.float)

            # Filter edges internal to this connected component
            sub_edges = edges_df[
                edges_df["clId1"].isin(nodes_in_cc) & edges_df["clId2"].isin(nodes_in_cc)
            ]
            
            if len(sub_edges) > 0:
                src = [node_idx_map[nid] for nid in sub_edges["clId1"].values]
                dst = [node_idx_map[nid] for nid in sub_edges["clId2"].values]
                edge_index = torch.tensor([src, dst], dtype=torch.long)
            else:
                edge_index = torch.empty((2, 0), dtype=torch.long)

            y = torch.tensor([label], dtype=torch.long)
            graph_data = Data(x=x, edge_index=edge_index, y=y, cc_id=cc_id)
            data_list.append(graph_data)

        data, slices = self.collate(data_list)
        torch.save((data, slices), self.processed_paths[0])
        print(f"[+] Saved {len(data_list)} subgraphs to {self.processed_paths[0]}")
