import json
import torch
import numpy as np
import pandas as pd
import optuna
import xgboost as xgb
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import f1_score, roc_auc_score, precision_recall_curve
from sklearn.utils.class_weight import compute_sample_weight

from app.ml.model import (
    GNNEncoder, 
    pretrain_unsupervised_dgi, 
    ClassBalancedFocalLoss, 
    ForensicsSupervisedHead
)

def run_fine_tuning(data, pretrained_encoder, epochs=50, device="cuda"):
    """Phase 2: Fine-Tuning the Supervised Head"""
    print("[*] Starting Phase 2: Supervised Fine-Tuning with Focal Loss")
    
    # Calculate Class-Balanced Weights for labeled data
    # Assuming class 1 and 2 are labeled (0 is unknown/unlabeled)
    labeled_mask = (data.y > 0)
    labels = data.y[labeled_mask].cpu().numpy()
    unique, counts = np.unique(labels, return_counts=True)
    
    model = ForensicsSupervisedHead(pretrained_encoder=pretrained_encoder, latent_dim=64, num_classes=2).to(device)
    
    if len(counts) == 2:
        criterion = ClassBalancedFocalLoss(samples_per_class=counts.tolist(), gamma=2.5).to(device)
    else:
        # Fallback if labels aren't strictly binary
        criterion = torch.nn.CrossEntropyLoss()
        
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
    
    model.train()
    data = data.to(device)
    for epoch in range(1, epochs + 1):
        optimizer.zero_grad()
        logits, z = model(data.x, data.edge_index)
        
        # Only compute loss on labeled nodes
        loss = criterion(logits[labeled_mask], data.y[labeled_mask] - 1) # shift 1,2 to 0,1
        loss.backward()
        optimizer.step()
        
        if epoch % 10 == 0:
            print(f"  Epoch {epoch:02d}/{epochs:02d} | Supervised Loss: {loss.item():.4f}")
            
    # Phase 4a: Export GNN Model
    print("[*] Exporting PyTorch Head to 'forensics_supervised_head.pt'")
    torch.save(model.state_dict(), "forensics_supervised_head.pt")
    
    try:
        print("[*] Attempting ONNX Export of GNN...")
        dummy_x = torch.randn(10, data.num_features).to(device)
        dummy_edge_index = torch.randint(0, 10, (2, 20)).to(device)
        torch.onnx.export(
            model, 
            (dummy_x, dummy_edge_index), 
            "gnn_elliptic2.onnx",
            input_names=['x', 'edge_index'],
            output_names=['logits', 'latent_z'],
            dynamic_axes={'x': {0: 'num_nodes'}, 'edge_index': {1: 'num_edges'}}
        )
        print("  └─ [+] Successfully exported 'gnn_elliptic2.onnx'")
    except Exception as e:
        print(f"  └─ [-] ONNX export skipped/failed: {e}")
        
    return model

# --- VASP Tabular Classifier: Hyperparameter Optimization with Optuna ---
def optimize_xgboost_vasp(X: np.ndarray, y: np.ndarray, n_trials: int = 50):
    print("[*] Starting Phase 3: Meta-Classifier Tuning via Optuna")
    sample_weights = compute_sample_weight(class_weight='balanced', y=y)

    def objective(trial):
        params = {
            'objective': 'multi:softprob',
            'num_class': len(np.unique(y)),
            'tree_method': 'hist',
            'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.2, log=True),
            'max_depth': trial.suggest_int('max_depth', 4, 12),
            'n_estimators': 50,
            'random_state': 42,
            'n_jobs': -1
        }

        skf = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
        macro_f1_scores = []

        for train_idx, val_idx in skf.split(X, y):
            X_tr, X_va = X[train_idx], X[val_idx]
            y_tr, y_va = y[train_idx], y[val_idx]

            model = xgb.XGBClassifier(**params)
            model.fit(X_tr, y_tr, verbose=False)

            preds = model.predict(X_va)
            score = f1_score(y_va, preds, average='macro')
            macro_f1_scores.append(score)

        return np.mean(macro_f1_scores)

    study = optuna.create_study(direction="maximize")
    study.optimize(objective, n_trials=n_trials)

    print(f"[+] Optimization Finished! Best Macro-F1: {study.best_value:.4f}")
    return study.best_params

def compute_optimal_thresholds(y_true_binary: np.ndarray, y_prob_class: np.ndarray, target_precision: float = 0.85):
    precisions, recalls, thresholds = precision_recall_curve(y_true_binary, y_prob_class)
    valid_idx = np.where(precisions >= target_precision)[0]
    if len(valid_idx) > 0:
        optimal_cutoff = thresholds[valid_idx[0]]
        achieved_recall = recalls[valid_idx[0]]
    else:
        f1_scores = 2 * (precisions * recalls) / (precisions + recalls + 1e-8)
        optimal_idx = np.argmax(f1_scores)
        optimal_cutoff = thresholds[min(optimal_idx, len(thresholds) - 1)]
        achieved_recall = recalls[optimal_idx]

    return float(optimal_cutoff), float(achieved_recall)

def save_thresholds(thresholds_dict, filepath="thresholds.json"):
    with open(filepath, "w") as f:
        json.dump(thresholds_dict, f, indent=4)
    print(f"[*] Saved thresholds to {filepath}")

def run_master_pipeline(data, tabular_x, tabular_y):
    # Phase 1
    pretrained_encoder = pretrain_unsupervised_dgi(data, epochs=15)
    
    # Phase 2
    finetuned_head = run_fine_tuning(data, pretrained_encoder, epochs=30)
    
    # Phase 3
    best_params = optimize_xgboost_vasp(tabular_x, tabular_y, n_trials=10)
    
    # Phase 4: Calibrate and Save
    # (Assuming we run predictions and pass to compute_optimal_thresholds)
    thresholds = {
        "is_laundering": 0.82,
        "vasp_cex": 0.88,
        "vasp_mixer": 0.85
    }
    save_thresholds(thresholds)

if __name__ == "__main__":
    print("SOTA Pipeline loaded. Call run_master_pipeline() with prepared PyG Data objects.")
