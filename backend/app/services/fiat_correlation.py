"""
BLUCE LOCK - AntiGravity Engine
Module: Fiat Off-Ramp Correlation Probability Matrix
Purpose: Estimates which specific fiat currency (INR, USD, EUR, AED, USDT-P2P) illicit crypto is being
liquidated into, based on VASP banking clearing windows, geographic node locations, and temporal activity heatmaps.
"""

from typing import List, Dict, Any
from datetime import datetime

class FiatOffRampCorrelator:
    """
    Correlates on-chain exit events with off-chain fiat banking settlement systems:
      - INR: IMPS/NEFT/RTGS & UPI (IST: UTC+5:30)
      - AED: UAE Central Bank IPI / UAE Instant Payments (GST: UTC+4:00)
      - EUR: SEPA Instant Credit Transfer (CET: UTC+1:00)
      - USD: Fedwire / ACH Clearing (EST: UTC-5:00)
    """

    FIAT_CORRIDORS = {
        "INR": {
            "name": "Indian Rupee (INR)",
            "primary_clearing": "IMPS / UPI 24x7 / NEFT",
            "active_utc_hours": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],  # 8:30 AM - 9:00 PM IST
            "p2p_weight": 1.45,
            "associated_vasps": ["WAZIRX", "COINDCX", "BINANCE_P2P_INDIA", "ZEBPAY"]
        },
        "AED": {
            "name": "UAE Dirham (AED)",
            "primary_clearing": "UAE FTS / Aani Instant",
            "active_utc_hours": [5, 6, 7, 8, 9, 10, 11, 12, 13, 14],            # 9:00 AM - 6:00 PM GST
            "p2p_weight": 1.30,
            "associated_vasps": ["BYBIT_DUBAI", "BINANCE_BAHRAIN", "OKX_MIDDLE_EAST"]
        },
        "EUR": {
            "name": "Euro (EUR)",
            "primary_clearing": "SEPA Instant",
            "active_utc_hours": [7, 8, 9, 10, 11, 12, 13, 14, 15, 16],          # 8:00 AM - 5:00 PM CET
            "p2p_weight": 0.85,
            "associated_vasps": ["KRAKEN_EU", "BITSTAMP", "BINANCE_FRANCE"]
        },
        "USD": {
            "name": "United States Dollar (USD)",
            "primary_clearing": "Fedwire / FedNow / Silvergate-Legacy",
            "active_utc_hours": [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],        # 9:00 AM - 6:00 PM EST
            "p2p_weight": 0.90,
            "associated_vasps": ["COINBASE", "KRAKEN_US", "GEMINI"]
        }
    }

    def correlate_fiat_exit(
        self,
        attributed_vasp_name: str,
        transaction_utc_iso: str,
        asset_symbol: str = "USDT",
        amount_usd: float = 50000.0,
        suspect_origin_hint: str = "INDIA"
    ) -> Dict[str, Any]:
        """
        Computes the probabilistic breakdown of the fiat off-ramping corridor.
        """
        try:
            dt = datetime.fromisoformat(transaction_utc_iso.replace("Z", ""))
        except Exception:
            dt = datetime.utcnow()

        tx_hour_utc = dt.hour
        scores = {}

        for fiat, info in self.FIAT_CORRIDORS.items():
            base_score = 10.0

            # 1. Temporal banking window alignment
            if tx_hour_utc in info["active_utc_hours"]:
                base_score += 35.0  # Peak operational banking hours
            else:
                base_score += 10.0  # Off-peak / overnight P2P settlement

            # 2. VASP affiliation
            vasp_upper = attributed_vasp_name.upper()
            if any(v in vasp_upper for v in info["associated_vasps"]):
                base_score += 45.0
            elif "BINANCE" in vasp_upper and fiat in ["INR", "AED"]:
                # Binance has massive P2P liquidity in South Asia & UAE
                base_score += 25.0

            # 3. Origin Hint (e.g. Complainant in India)
            if suspect_origin_hint.upper() == "INDIA" and fiat == "INR":
                base_score += 30.0
            elif suspect_origin_hint.upper() == "UAE" and fiat == "AED":
                base_score += 30.0

            # 4. USDT P2P bias
            if asset_symbol.upper() in ["USDT", "USDC"]:
                base_score *= info["p2p_weight"]

            scores[fiat] = base_score

        # Normalize to 100%
        total_score = sum(scores.values())
        matrix = []
        for fiat, s in scores.items():
            pct = round((s / total_score) * 100, 1)
            info = self.FIAT_CORRIDORS[fiat]
            matrix.append({
                "currency": fiat,
                "currency_name": info["name"],
                "settlement_rail": info["primary_clearing"],
                "probability_percentage": pct,
                "is_clearing_window_open": tx_hour_utc in info["active_utc_hours"]
            })

        matrix.sort(key=lambda x: x["probability_percentage"], reverse=True)
        top_fiat = matrix[0]

        return {
            "attributed_vasp": attributed_vasp_name,
            "evaluated_timestamp_utc": dt.isoformat() + "Z",
            "active_utc_hour": tx_hour_utc,
            "primary_predicted_fiat": top_fiat["currency"],
            "top_confidence": f"{top_fiat['probability_percentage']}%",
            "fiat_probability_matrix": matrix,
            "investigative_guidance": (
                f"High likelihood ({top_fiat['probability_percentage']}%) that the proceeds "
                f"are being liquidated into {top_fiat['currency_name']} via {top_fiat['settlement_rail']}. "
                f"Request bank settlement logs and P2P counterparty details from {attributed_vasp_name}."
            )
        }

fiat_offramp_correlator = FiatOffRampCorrelator()
