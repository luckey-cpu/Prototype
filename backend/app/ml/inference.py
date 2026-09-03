import os
import json
import torch
import joblib
import structlog
import numpy as np
from typing import Optional, Dict, Any, List

from app.ml.model import GNNEncoder, ForensicsSupervisedHead

logger = structlog.get_logger()

NODE_FEAT_DIM = 96
VASP_FEAT_DIM = 144
LATENT_DIM = 64

class HybridAttributionEngine:
    def __init__(self, use_onnx: bool = False):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.use_onnx = use_onnx
        
        self.gnn_model: Optional[ForensicsSupervisedHead] = None
        self.vasp_xgb_model = None
        self.scaler = None
        self.thresholds = {
            "is_laundering": 0.70,
            "vasp_cex": 0.85,
            "vasp_mixer": 0.85
        }
        
        # ONNX Runtimes
        self.ort_gnn_session = None
        
        self.load_artifacts()

    def load_artifacts(self):
        logger.info("Loading Hybrid Attribution Engine artifacts...")
        
        if self.use_onnx:
            try:
                import onnxruntime as ort
                if os.path.exists("gnn_elliptic2.onnx"):
                    self.ort_gnn_session = ort.InferenceSession("gnn_elliptic2.onnx", providers=['CPUExecutionProvider'])
                    logger.info("Loaded ONNX GNN Encoder.")
            except ImportError:
                logger.error("onnxruntime not installed. Falling back to PyTorch.")
                self.use_onnx = False

        if not self.use_onnx:
            encoder = GNNEncoder(in_channels=NODE_FEAT_DIM, hidden_dim=128, out_dim=LATENT_DIM).to(self.device)
            self.gnn_model = ForensicsSupervisedHead(pretrained_encoder=encoder, latent_dim=LATENT_DIM, num_classes=2).to(self.device)
            
            if os.path.exists("forensics_supervised_head.pt"):
                self.gnn_model.load_state_dict(torch.load("forensics_supervised_head.pt", map_location=self.device))
                logger.info("Loaded PyTorch weights from forensics_supervised_head.pt")
            else:
                logger.warning("forensics_supervised_head.pt not found. Using randomly initialized Hybrid GNN.")
            
            self.gnn_model.eval()

        # Load MBAL Meta-Classifier
        if os.path.exists("mbal_vasp_xgb.joblib"):
            self.vasp_xgb_model = joblib.load("mbal_vasp_xgb.joblib")
            logger.info("Loaded XGBoost Meta-Classifier from mbal_vasp_xgb.joblib")
        else:
            logger.warning("mbal_vasp_xgb.joblib not found. Meta-Classifier will use fallbacks.")
            
        if os.path.exists("mbal_scaler.joblib"):
            self.scaler = joblib.load("mbal_scaler.joblib")
        
        if os.path.exists("thresholds.json"):
            with open("thresholds.json", "r") as f:
                self.thresholds.update(json.load(f))
            logger.info(f"Loaded calibrated thresholds: {self.thresholds}")

    def evaluate(self, x: torch.Tensor, edge_index: torch.Tensor, terminal_features: List[float]) -> Dict[str, Any]:
        """
        Executes Late-Fusion inference: Extracts GNN latent Z -> Concats with MBAL tabular -> XGBoost meta-classification
        """
        # 1. GNN Latent Extraction
        laundering_prob = 0.5
        latent_z = np.zeros(LATENT_DIM)
        
        if self.use_onnx and self.ort_gnn_session is not None:
            ort_inputs = {
                self.ort_gnn_session.get_inputs()[0].name: x.numpy(),
                self.ort_gnn_session.get_inputs()[1].name: edge_index.numpy()
            }
            logits, z = self.ort_gnn_session.run(None, ort_inputs)
            laundering_prob = float(np.exp(logits[0][1]) / np.sum(np.exp(logits[0])))
            latent_z = z[0] # Assume index 0 is terminal node
        elif self.gnn_model is not None:
            with torch.no_grad():
                x = x.to(self.device)
                edge_index = edge_index.to(self.device)
                logits, z = self.gnn_model(x, edge_index)
                probs = torch.softmax(logits, dim=1)
                laundering_prob = float(probs[0][1].cpu().item())
                latent_z = z[0].cpu().numpy()

        is_laundering = laundering_prob >= self.thresholds.get("is_laundering", 0.70)
        
        # 2. Late Fusion
        tabular_feats = np.array(terminal_features).reshape(1, -1)
        if self.scaler:
            tabular_feats = self.scaler.transform(tabular_feats)
            
        # Concatenate 64d latent graph embedding with 144d tabular features (Total = 208d)
        fused_features = np.hstack([latent_z.reshape(1, -1), tabular_feats])
        
        # 3. Meta-Classifier Prediction
        category = "unknown"
        confidence = 0.5
        
        if self.vasp_xgb_model:
            vasp_pred_idx = self.vasp_xgb_model.predict(fused_features)[0]
            vasp_probs = self.vasp_xgb_model.predict_proba(fused_features)[0]
            
            categories = ['business_or_services', 'cex', 'darknet', 'gambling', 'infra', 'mining_pool', 'mixer', 'unknown']
            category = categories[vasp_pred_idx] if vasp_pred_idx < len(categories) else "unknown"
            confidence = float(vasp_probs[vasp_pred_idx]) if hasattr(vasp_probs, '__getitem__') else float(vasp_probs)

        # 4. Law Enforcement Decision Engine
        is_vasp_deposit = (category == "cex" and confidence >= self.thresholds.get("vasp_cex", 0.85))
        is_mixer = (category == "mixer" and confidence >= self.thresholds.get("vasp_mixer", 0.85))
        
        flags = []
        if is_laundering:
            flags.append("HIGH_RISK_TOPOLOGY")
        if is_mixer:
            flags.append("MIXER_TUMBLER_DETECTED")
            
        return {
            "risk_score_0_100": int(laundering_prob * 100),
            "primary_entity": category,
            "confidence": confidence,
            "is_vasp_deposit": is_vasp_deposit,
            "evidentiary_flags": flags,
            "is_laundering": is_laundering,
            "laundering_prob": laundering_prob
        }

# Singleton Instance
engine = HybridAttributionEngine(use_onnx=False)

def get_engine() -> HybridAttributionEngine:
    return engine
