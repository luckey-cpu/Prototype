import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import SAGEConv, DeepGraphInfomax, LayerNorm, JumpingKnowledge
from torch_geometric.loader import NeighborLoader
from sklearn.metrics import classification_report, f1_score
import numpy as np

# 1. Base Encoder for Contrastive & Supervised Stages
class GNNEncoder(nn.Module):
    def __init__(self, in_channels: int, hidden_dim: int = 128, out_dim: int = 64):
        super().__init__()
        self.conv1 = SAGEConv(in_channels, hidden_dim)
        self.ln1 = LayerNorm(hidden_dim)
        self.conv2 = SAGEConv(hidden_dim, hidden_dim)
        self.ln2 = LayerNorm(hidden_dim)
        self.conv3 = SAGEConv(hidden_dim, out_dim)
        self.ln3 = LayerNorm(out_dim)
        self.jk = JumpingKnowledge(mode='cat', channels=hidden_dim, num_layers=2)

    def forward(self, x, edge_index):
        h1 = F.gelu(self.ln1(self.conv1(x, edge_index)))
        h2 = F.gelu(self.ln2(self.conv2(h1, edge_index)))
        h3 = self.ln3(self.conv3(h2, edge_index))
        return h3

# 2. Deep Graph Infomax (DGI) for Unsupervised Node Representation
def corruption_fn(x, edge_index):
    # Shuffles feature matrix to generate negative graph instances
    return x[torch.randperm(x.size(0))], edge_index

def summary_fn(z, *args, **kwargs):
    return torch.sigmoid(z.mean(dim=0))

def pretrain_unsupervised_dgi(data, epochs: int = 15, device: str = "cuda"):
    """Pre-trains on all nodes to learn network topology."""
    encoder = GNNEncoder(in_channels=data.num_features).to(device)
    dgi = DeepGraphInfomax(
        hidden_channels=64,
        encoder=encoder,
        summary=summary_fn,
        corruption=corruption_fn
    ).to(device)

    optimizer = torch.optim.AdamW(dgi.parameters(), lr=1e-3, weight_decay=1e-5)
    data = data.to(device)

    print("[*] Starting Self-Supervised DGI Pre-training on Full Unlabeled Graph...")
    dgi.train()
    for epoch in range(1, epochs + 1):
        optimizer.zero_grad()
        pos_z, neg_z, summary = dgi(data.x, data.edge_index)
        loss = dgi.loss(pos_z, neg_z, summary)
        loss.backward()
        optimizer.step()
        print(f"  Epoch {epoch:02d}/{epochs:02d} | Contrastive Loss: {loss.item():.4f}")

    # Freeze base weights or return pre-trained backbone
    return dgi.encoder

# 3. Class-Balanced Focal Loss
class ClassBalancedFocalLoss(nn.Module):
    def __init__(self, samples_per_class: list, beta: float = 0.9999, gamma: float = 2.5):
        super().__init__()
        effective_num = 1.0 - np.power(beta, samples_per_class)
        weights = (1.0 - beta) / np.array(effective_num)
        weights = weights / np.sum(weights) * len(samples_per_class)
        self.alpha = torch.tensor(weights, dtype=torch.float)
        self.gamma = gamma

    def forward(self, logits, targets):
        alpha = self.alpha.to(logits.device)
        ce_loss = F.cross_entropy(logits, targets, reduction='none', weight=alpha)
        pt = torch.exp(-ce_loss)
        focal_loss = ((1.0 - pt) ** self.gamma) * ce_loss
        return focal_loss.mean()

# 4. Supervised Fine-Tuning Classifier
class ForensicsSupervisedHead(nn.Module):
    def __init__(self, pretrained_encoder: nn.Module, latent_dim: int = 64, num_classes: int = 2):
        super().__init__()
        self.encoder = pretrained_encoder
        self.classifier = nn.Sequential(
            nn.Linear(latent_dim, 64),
            nn.GELU(),
            nn.Dropout(0.3),
            nn.Linear(64, num_classes)
        )

    def forward(self, x, edge_index):
        # Extract bottleneck representations
        z = self.encoder(x, edge_index)
        logits = self.classifier(z)
        return logits, z
