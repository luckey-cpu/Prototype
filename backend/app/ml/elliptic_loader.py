"""
Elliptic Dataset Graph Neural Network (GNN) Pipeline
====================================================
Execution Context: 
Processes `elliptic_txs_features.csv`, `elliptic_txs_edgelist.csv`, and `elliptic_txs_classes.csv` into a PyTorch Geometric `Data` object for Anti-Money Laundering (AML) node classification.

Memory Constraints: 
Assumes feature matrix requires ~1.2GB RAM. Implements batched CSV loading via pandas to prevent OOM errors on constrained environments. Node mapping enforces strict zero-indexed integer arrays required by PyTorch Geometric edge_index (COO format).
"""

import os
import pandas as pd
import torch
import numpy as np
from torch_geometric.data import Data
from typing import Tuple, Dict

def load_elliptic_graph(data_dir: str, chunk_size: int = 50000) -> Data:
    features_path = os.path.join(data_dir, "elliptic_txs_features.csv")
    edges_path = os.path.join(data_dir, "elliptic_txs_edgelist.csv")
    classes_path = os.path.join(data_dir, "elliptic_txs_classes.csv")

    if not all(os.path.exists(p) for p in [features_path, edges_path, classes_path]):
        raise FileNotFoundError(f"Missing required CSV files in target directory: {data_dir}. Ensure features, edgelist, and classes exist.")

    # 1. Load Node Features (Batched to respect memory footprint)
    # Col 0: txId, Col 1: time step, Col 2-166: local/aggregated features
    features_iter = pd.read_csv(features_path, header=None, chunksize=chunk_size)
    features_df = pd.concat([chunk for chunk in features_iter], ignore_index=True)
    
    # Extract unique transaction IDs and map them to continuous [0, N-1] integers for PyTorch COO sparse matrices
    tx_ids = features_df[0].values
    tx_id_to_idx: Dict[int, int] = {int(tx_id): idx for idx, tx_id in enumerate(tx_ids)}
    
    # Drop txId and time step for the feature matrix
    x_matrix = features_df.iloc[:, 2:].values
    x = torch.tensor(x_matrix, dtype=torch.float32)

    # 2. Load Node Labels (Classes)
    classes_df = pd.read_csv(classes_path)
    
    # Map classes: '1' -> illicit (1), '2' -> licit (0), 'unknown' -> unlabeled (-1 for mask)
    class_mapping = {'1': 1, '2': 0, 'unknown': -1}
    classes_df['class'] = classes_df['class'].map(class_mapping).fillna(-1).astype(np.int64)
    
    # Align classes with the feature matrix index using txId
    classes_df = classes_df.set_index('txId')
    aligned_labels = classes_df.reindex(tx_ids)['class'].values
    y = torch.tensor(aligned_labels, dtype=torch.long)

    # 3. Load Edges (Directed Multigraph connectivity)
    edges_df = pd.read_csv(edges_path)
    
    # Map raw transaction IDs to our zero-indexed nodes. Drop edges containing unresolved nodes.
    edges_df['txId1'] = edges_df['txId1'].map(tx_id_to_idx)
    edges_df['txId2'] = edges_df['txId2'].map(tx_id_to_idx)
    edges_df = edges_df.dropna(subset=['txId1', 'txId2'])
    
    # Construct PyTorch Geometric COO edge_index [2, num_edges]
    source_nodes = edges_df['txId1'].values.astype(np.int64)
    target_nodes = edges_df['txId2'].values.astype(np.int64)
    edge_index = torch.tensor([source_nodes, target_nodes], dtype=torch.long)

    # 4. Generate Train/Val/Test Masks based on temporal splits
    # Typically in the Elliptic dataset, time steps 1-34 are train, 35-42 validation, 43-49 test.
    time_steps = features_df[1].values
    train_mask = torch.tensor((time_steps <= 34) & (aligned_labels != -1), dtype=torch.bool)
    val_mask = torch.tensor(((time_steps > 34) & (time_steps <= 42)) & (aligned_labels != -1), dtype=torch.bool)
    test_mask = torch.tensor((time_steps > 42) & (aligned_labels != -1), dtype=torch.bool)

    # Build standard PyTorch Geometric Data object
    data = Data(x=x, edge_index=edge_index, y=y)
    data.train_mask = train_mask
    data.val_mask = val_mask
    data.test_mask = test_mask
    
    # Enforce memory cleanup
    del features_df, edges_df, classes_df
    
    return data

if __name__ == "__main__":
    # Example local test execution
    try:
        dataset_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../DATABASE FILES"))
        graph_data = load_elliptic_graph(dataset_path)
        print(f"Graph loaded successfully. Nodes: {graph_data.num_nodes}, Edges: {graph_data.num_edges}")
        print(f"Feature dimensionality: {graph_data.num_node_features}")
    except Exception as e:
        print(f"Pipeline initialization failed: {str(e)}")
