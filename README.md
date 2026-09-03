# BLUCE LOCK 🛡️
### Real-Time Crypto Fraud Attribution & VASP Intelligence Platform
*National-Level Cybercrime Blockchain Forensics Command Center — Smart India Hackathon (SIH) Prototype*

---

## 📌 Executive Summary

**BLUCE LOCK** is an intelligence platform engineered specifically for law enforcement officers, cybercrime police units, and financial intelligence analysts.

It takes a **victim-reported suspect cryptocurrency wallet address** and systematically de-anonymizes the fund trail into actionable statutory evidence by:
1. **Multi-Chain Ledger Tracing**: Traces fund movements across Ethereum, Polygon, and major EVM/UTXO blockchains.
2. **Interactive Transaction Flow Graph (Hero Feature)**: Visualizes fund hops using React Flow and Dagre layout with real-time moving flow particles.
3. **Intermediary & Burner Wallet Identification**: Automatically isolates temporary pass-through mule addresses and peel chains.
4. **Cross-Chain Bridge Forensics**: Tracks cross-chain liquidity pool transitions (e.g., Ethereum &rarr; Stargate Finance &rarr; Polygon).
5. **VASP Attribution Engine**: Computes explainable probabilistic clustering attributing the likely destination cryptocurrency exchange (e.g. Binance 91% confidence) with an evidentiary checklist.
6. **Explainable Risk Scoring Engine (0–100)**: Evaluates behavioral indicators (rapid forwarding &lt;300s, multiple victim inputs, peel chains, mixer proximity) with clear score breakdowns.
7. **BLUCE AI Investigation Assistant**: Distinguishes verified ledger facts, heuristic inferences, and recommended legal directives (Section 91 CrPC notices, Section 102 CrPC freeze requisitions).
8. **NCRP Case & Alert Management**: Tracks active investigation dockets and real-time alerts.
9. **Forensic Report Generation**: Exports standardized PDF memorandums (via ReportLab), browser-optimized printouts, and structured JSON intelligence packages.

---

## 🏗️ Architectural Topology

```
┌─────────────────────────────────────────────────────────────┐
│                       BLUCE LOCK UI                         │
│             React 19 + Vite + Tailwind CSS + Dagre          │
│          Interactive Transaction Graph (@xyflow/react)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / WebSocket (/ws/analysis)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                        │
│                 Python 3.13 + Uvicorn Core                  │
├─────────────────┬───────────────────┬───────────────────────┤
│ Blockchain Svc  │ NetworkX Graph Svc│ Risk & VASP Engine    │
│ Multi-chain RPC │ Betweenness & Path│ Heuristic Clustering  │
├─────────────────┴───────────────────┴───────────────────────┤
│            ReportLab PDF Forensic Generator Engine          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### 1. Launch Backend (FastAPI)
```powershell
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
- API Docs & Swagger: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Interactive OpenAPI: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### 2. Launch Frontend (React + Vite)
```powershell
cd frontend
npm run dev -- --host 0.0.0.0
```
- **Local (Laptop)**: [http://localhost:5173](http://localhost:5173)
- **Mobile / Wi-Fi Network**: [http://10.66.242.21:5173](http://10.66.242.21:5173) *(or your machine's local IPv4)*
- Accessible from any smartphone (iOS / Android), tablet, or external laptop on the same network.
- Features mobile slide-out drawer navigation, responsive bottom sheets for transaction graph inspectors, and adaptive SVG layouts.

### 3. Run Automated Tests
```powershell
cd backend
python -m pytest tests/test_api.py -v
```

---

## 🎬 2-to-3 Minute SIH Presentation Walkthrough

1. **Landing Page**:
   - Showcase the cybercrime command center design and animated blockchain particle background.
   - Click **"Launch Investigation Console"** or **"View Demo Investigation"**.
2. **Dashboard Command Center**:
   - Highlight live metrics: Active Cases (128), Wallets Analyzed (2,841), Funds Traced (₹4.82 Cr), Avg Analysis Time (18s).
   - Click **"DEMO MODE: LOAD SAMPLE INVESTIGATION"** (or paste Suspect Address `0x7A2F8C91F0328b9c24090954e3d389a91f`).
3. **Radar Scanning Simulation**:
   - Observe the multi-stage radar scanner validating addresses, building graph, evaluating velocity, and matching VASP clusters.
4. **Wallet Analysis & Explainable Risk Gauge**:
   - Note the **87/100 CRITICAL Risk Rating**.
   - Review the **Detected Risk Indicators** cards (Rapid Forwarding, Layering, Cross-Chain, Exchange Sweep).
5. **Hero Feature: Interactive Transaction Graph**:
   - Observe moving particle flow along edges representing fund transfer velocity.
   - Click **Victim Wallets** &rarr; **Suspect Wallet** &rarr; **Intermediary C** &rarr; **Binance Cluster**.
   - Click any node to open the **Node Inspector Drawer**; click any edge to open the **Transaction Edge Inspector**.
6. **Cross-Chain Hop Analysis**:
   - Review the Ethereum &rarr; Stargate &rarr; Polygon flow diagram breaking linear chain-hopping obfuscation.
7. **VASP Intelligence**:
   - Review **BINANCE (91% Confidence)** with the large circular confidence meter and verified evidence checklist.
8. **BLUCE AI Investigation Assistant**:
   - Note the strict separation of **Observed Facts**, **Inferred Patterns**, and **Investigative Directives**.
   - Review the pre-drafted **Section 91 CrPC Requisition Notice**.
9. **Official Report Generation**:
   - Click **"DOWNLOAD REPORT (PDF)"** to trigger ReportLab PDF generation or use **"PRINT REPORT"** / **"EXPORT JSON"**.

---

## ⚖️ Legal & Ethical Compliance
BLUCE LOCK is an investigative decision-support prototype. Attribution findings are probabilistic and require statutory verification by authorized law enforcement officers through appropriate legal notices under Section 91 & Section 102 of the Code of Criminal Procedure, 1973 / Bharatiya Nagarik Suraksha Sanhita (BNSS).
