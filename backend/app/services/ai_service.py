from typing import List, Optional
from app.models.schemas import AIAnalysisResponse

class AIAssistantService:
    def analyze_case(self, wallet_address: str, query: Optional[str] = None) -> AIAnalysisResponse:
        observed_facts = [
            "Wallet C (0xA15D...cD9B) acts as the primary convergence node, absorbing 73% ($72,000 USD) of victim fund flows.",
            "Funds originated from 3 distinct complainant wallets (Victim 1, Victim 2, Victim 3) reporting investment fraud losses.",
            "A cross-chain bridge transfer of $44,500 USDT was executed via Stargate Finance from Ethereum to Polygon at block 20561862.",
            "Wallet D (0xB26E...a822) executed 2 batched consolidation transfers totaling $95,450 to Polygon Deposit Cluster 0x28C6c...1d60.",
            "All outbound transfers from suspect wallet 0x7A2F...91F occurred within 420 seconds of initial victim deposit."
        ]

        inferred_patterns = [
            "Layering Strategy: Structured peel-chain dispersal through Intermediary A and Intermediary B was utilized to circumvent real-time AML thresholds.",
            "Cross-Chain Obfuscation: Transit through the Stargate bridge indicates deliberate evasion of single-chain automated blacklist monitoring.",
            "Cashing-Out Signature: The transaction trajectory converges on a high-velocity deposit address associated with Binance Hot Wallet #14 (91% confidence).",
            "Mule Network Architecture: Intermediary wallets A, B, and C exhibit zero staking or DeFi activity, operating strictly as transient burner relays."
        ]

        recommendations = [
            "Priority 1: Draft and serve Section 91 CrPC / LEA Preservation Order to Binance Compliance for Deposit Cluster 0x28C6c...1d60 requesting KYC records, login IP logs, and linked bank accounts.",
            "Priority 2: Requisition Stargate Bridge relayer payload logs for transaction hash 0x9f63...5646 to verify source IP and RPC endpoints.",
            "Priority 3: Mark Intermediary Wallets A, B, C, and D as 'Suspect Mule Relays' in NCRP and local Cyber Forensics intelligence databases.",
            "Priority 4: Verify whether remaining residual dust balances ($2,520 in Suspect Wallet, $400 in Wallet D) can be targeted for freeze requests under Section 102 CrPC."
        ]

        procedural_notice = (
            "NOTICE UNDER SECTION 91 OF CODE OF CRIMINAL PROCEDURE, 1973\n"
            "TO: Compliance Officer & Law Enforcement Liaison, Binance Services Holdings Ltd.\n"
            "RE: FIR No. 182/2026 u/s 420, 120-B IPC & 66-D IT Act - Cyber Crime Police Station\n"
            "SUBJECT: Urgent requisition of KYC, transaction logs, and asset preservation for Deposit Cluster 0x28C6c...1d60.\n\n"
            "Whereas an investigation into cryptocurrency investment fraud is being conducted by this unit, "
            "it is revealed that illicit proceeds of ₹8,42,500 were transferred to the subject deposit address on Polygon.\n"
            "You are hereby directed to provide:\n"
            "1. Complete User Identification (KYC/Aadhaar/Passport/Phone/Email) of account owner.\n"
            "2. Complete IP login history with port numbers and timestamps.\n"
            "3. Linked fiat bank account or P2P trading records.\n"
            "4. Immediate freezing / lien marking of available balance under Section 102 CrPC."
        )

        # Custom query handling
        if query and "subpoena" in query.lower() or query and "notice" in query.lower():
            return AIAnalysisResponse(
                wallet_address=wallet_address,
                observed_facts=observed_facts[:2],
                inferred_patterns=inferred_patterns[:2],
                recommendations=["Issue statutory preservation notice immediately using standard format below."],
                procedural_notice_draft=procedural_notice
            )

        return AIAnalysisResponse(
            wallet_address=wallet_address,
            observed_facts=observed_facts,
            inferred_patterns=inferred_patterns,
            recommendations=recommendations,
            procedural_notice_draft=procedural_notice
        )

ai_service = AIAssistantService()
