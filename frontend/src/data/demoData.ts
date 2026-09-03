import {
  WalletData,
  TransactionData,
  RiskIndicator,
  CaseData,
  AlertData,
  VASPAttribution
} from '../types';

export const DEMO_SUSPECT_ADDRESS = '0x7A2F8C91F0328b9c24090954e3d389a91f';
export const DEMO_NCRP_SAHYOG_ID = 'NCRP/SAHYOG: CC-MAH-2026-88912';

export const LE_INTEL_ATTRIBUTION_REPORT = `🛡️ BLUCE LOCK LE-INTEL AI | CYBER-FORENSIC ATTRIBUTION REPORT
Operational Authority: Indian Cyber Crime Coordination Centre (I4C) & State Cyber Police Units
Investigation Framework: National Cybercrime Reporting Portal (NCRP) & SAHYOG Platform Protocol
Legal Mandate: Section 91 & Section 102 Cr.P.C., 1973 / Section 94 & Section 106 BNSS, 2023 r/w Section 66-D IT Act, 2000

I. CASE & STATUTORY IDENTIFIERS
Field\tRecord Identifier
NCRP Complaint Ref\tCC-MAH-2026-88912
SAHYOG Acknowledgment\tSHY-2026-449102
Target Suspect Entity\t0x7A2F8C91F0328b9c24090954e3d389a91f (Ethereum / EVM)
Classification\tHigh-Velocity Fraud Aggregator / Layering Burner Wallet
Primary Offense\tOrganized Cryptocurrency Investment Fraud / Part-Time Task Scam
Reporting Police Station\tCyber Crime Police Station (Special Cell), Pune City Police
Total Inflow Traced\t$184,250.00 USD (~₹1,53,84,875.00 INR)
Target Exchange Deposit\t$95,450.00 USD (~₹79,70,075.00 INR)

II. FORENSIC RISK ENGINE EVALUATION
╔══════════════════════════════════════════════════════════════════════════════════╗
║ COMPOSITE RISK SCORE: 87 / 100 ────► CLASSIFICATION: CRITICAL                    ║
╚══════════════════════════════════════════════════════════════════════════════════╝

Behavioral Indicators & Forensic Weights:
- Multi-Victim Aggregation (+15 pts | Conf: 94%): Direct inflows received from 3 distinct complainant wallets (0x1A82...f61E, 0x2B93...cD64B, 0x3C04...9B251) within a 110-minute window.
- Automated Rapid Forwarding (+20 pts | Conf: 96%): Outflows executed within 195 to 425 seconds of victim credit timestamps, confirming scripted programmatic pass-through.
- Structured Peel-Chain Layering (+20 pts | Conf: 92%): Tranches fragmented across Intermediaries A & B (0x8B3E..., 0x9C4F...) to circumvent fiat banking AML triggers.
- Cross-Chain Bridge Hopping (+12 pts | Conf: 98%): Liquidity transit via Stargate Finance (LayerZero) to break linear EVM block explorer tracing.
- VASP Omnibus Sweep Signature (+20 pts | Conf: 91%): End-point fund consolidation matches centralized exchange internal omnibus deposit heuristics.

III. RECONSTRUCTED MULTI-CHAIN FUND TRAIL
[VICTIMS (1, 2, 3)] ── Inflows: $75.5k USDT (Ethereum)
        │
        ▼ (Within 110 mins)
[SUSPECT AGGREGATOR: 0x7A2F8C91F0328b9c24090954e3d389a91f]
        │
        ├──► (425s) ── $45,000 USDT ──► [INTERMEDIARY MULE A: 0x8B3E901F410Ac9D86e6Ce3F6B3475142106eDb79]
        │                                         │
        │                                         ▼ (Hop Delta: +465s)
        │                             [STARGATE BRIDGE: 0x2F8B701D21950A94F81A8cD80267Ff466bFEbEE9]
        │                                         │
        │                                         ▼ (Cross-Chain Transit: Ethereum ➔ Polygon)
        │                             [MULE C (CONVERGENCE): 0xA15D2F6B89cCb26507A94D6d54C8360f9e16cD9B]
        │                                         │
        └──► (195s) ── $28,500 USDT ──► [INTERMEDIARY MULE B: 0x9C4F1A28Ea657c918F3Bce921b72e9D906351F02]
                                                  │
                                                  ▼ (Uniswap V3 Swap: USDT ➔ DAI)
                                      [MULE C (CONVERGENCE): 0xA15D2F6B89cCb26507A94D6d54C8360f9e16cD9B]
                                                  │
                                                  ▼ (Hop Delta: +520s | Consolidation)
                                      [FEEDER MULE D: 0xB26E37A8C86095Ec10c41066D60F409C8747a822]
                                                  │
                                                  ▼ (Batch Sweep)
                        ┌────────────────────────────────────────────────────────┐
                        │   TARGET DESTINATION VASP: BINANCE (Confidence: 91%)   │
                        │   Deposit Cluster: 0x28C6c06298d514Db089934071355E5743 │
                        └────────────────────────────────────────────────────────┘

IV. TARGET VASP ATTRIBUTION & FREEZE PROFILE
ATTRIBUTED ENTITY     : BINANCE (Binance Services Holdings Ltd.)
CONFIDENCE LEVEL      : 91.0% (PROBABILISTIC CLUSTERING VERIFIED)
TARGET DEPOSIT CLUSTER: 0x28C6c06298d514Db089934071355E5743bf21d60
CHAIN NETWORK         : Polygon PoS Mainnet
CLUSTER IDENTIFIER    : VASP_BINANCE_HOT14
LE REQUISITION PORTAL : Kodex Law Enforcement Request System (LERS)

Evidentiary Sweep Transactions for Freezing:
Chain\tTransaction Hash\tToken\tAmount\tBlock\tTimestamp (UTC)
Polygon\t0x4eb832879c6019242d8091823903648192830192830192830192830192830191\tUSDC\t71,200.00\t61285220\t2026-08-18 12:51:12
Polygon\t0x71eb65ba0ff3425750132415623697b425163425163425163425163425163424\tUSDT\t24,250.00\t61350100\t2026-08-19 14:38:40
Total\tConsolidated Illocable Inflows Into Target Exchange\t\t$95,450.00\t\t

V. STATUTORY ENFORCEMENT DIRECTIVES (FOR FIELD OFFICERS)
1. Immediate Statutory Freeze Notice (Priority: CRITICAL / IMMEDIATE)
Issue formal Requisition Notice under Section 91 & Section 102 of Cr.P.C., 1973 (or Section 94 & Section 106 of Bharatiya Nagarik Suraksha Sanhita, 2023) to Binance Compliance via the Kodex LE Portal.
Target Actions Required from VASP:
- Immediately place an administrative Debit Freeze / Lien on the internal User ID (UID) credited by Polygon Deposit Address 0x28C6c06298d514Db089934071355E5743bf21d60.
- Secure certified true copies of all Know Your Customer (KYC) documentation (Government ID, passport, selfie verification, linked bank accounts, primary email, and telephone numbers).
- Extract Access Logs for the past 90 days (login IPs, session cookies, device IMEIs, port numbers).

2. Cross-Chain Bridge Log Preservation
Serve a preservation order to LayerZero Labs / Stargate Relayer Operations for transaction hash 0x9f63ed324715647fd8354637845e1f3647385647385647385647385647385646 to identify the originating client IP address, JSON-RPC provider, and message sequencer payload.

3. NCRP / SAHYOG Blacklisting
Add the following addresses to the National Cybercrime Reporting Portal's Mule Account Registry:
- 0x7A2F8C91F0328b9c24090954e3d389a91f (Suspect Aggregator)
- 0x8B3E901F410Ac9D86e6Ce3F6B3475142106eDb79 (Mule Relay A)
- 0x9C4F1A28Ea657c918F3Bce921b72e9D906351F02 (Mule Relay B)
- 0xA15D2F6B89cCb26507A94D6d54C8360f9e16cD9B (Convergence Mule C)
- 0xB26E37A8C86095Ec10c41066D60F409C8747a822 (VASP Feeder Mule D)

4. Evidence Certificate Generation
Generate and annex Certificate under Section 65-B of the Indian Evidence Act, 1872 (or Section 63 of Bharatiya Sakshya Adhiniyam, 2023) validating the electronic blockchain extract and SHA-256 digital custody seal:
SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`;

export const DEMO_WALLETS: WalletData[] = [
  // 1. Victims
  {
    address: '0x1A82f811559CAbC2eCbb4d642875b28F04B3f61E',
    blockchain: 'Ethereum',
    wallet_type: 'Victim',
    risk_level: 'LOW',
    risk_score: 12,
    total_transactions: 24,
    incoming_usd: 75000.0,
    outgoing_usd: 72500.0,
    current_balance_usd: 2500.0,
    first_seen: '2026-06-12',
    last_activity: '2 hours ago',
    cluster_id: null,
    tags: ['Victim #1 (Complainant)', 'Reported Loss ₹20.7L']
  },
  {
    address: '0x2B93e7782A79D327B6B0E094200CeB104F5cD64B',
    blockchain: 'Ethereum',
    wallet_type: 'Victim',
    risk_level: 'LOW',
    risk_score: 15,
    total_transactions: 18,
    incoming_usd: 68000.0,
    outgoing_usd: 65000.0,
    current_balance_usd: 3000.0,
    first_seen: '2026-07-04',
    last_activity: '5 hours ago',
    cluster_id: null,
    tags: ['Victim #2 (HNI)', 'Investment Scam Victim']
  },
  {
    address: '0x3C04fb68e4B484d852A9Fe508375C17f35B9B251',
    blockchain: 'Ethereum',
    wallet_type: 'Victim',
    risk_level: 'LOW',
    risk_score: 10,
    total_transactions: 9,
    incoming_usd: 48000.0,
    outgoing_usd: 46750.0,
    current_balance_usd: 1250.0,
    first_seen: '2026-07-29',
    last_activity: '1 day ago',
    cluster_id: null,
    tags: ['Victim #3 (Senior Citizen)', 'Task-Based Fraud']
  },

  // 2. Suspect Aggregator (Source Node)
  {
    address: '0x7A2F8C91F0328b9c24090954e3d389a91f',
    blockchain: 'Ethereum',
    wallet_type: 'Suspect',
    risk_level: 'CRITICAL',
    risk_score: 87,
    total_transactions: 1284,
    incoming_usd: 184250.0,
    outgoing_usd: 181730.0,
    current_balance_usd: 2520.0,
    first_seen: '2026-08-18',
    last_activity: '3 minutes ago',
    cluster_id: 'SUSPECT_AGGREGATOR_01',
    tags: ['Primary Suspect', 'Aggregator / Burner', 'Rapid Forwarder', 'NCRP Flagged']
  },

  // 3. Intermediary Mule Layer 1 (Ethereum)
  {
    address: '0x8B3E901F410Ac9D86e6Ce3F6B3475142106eDb79',
    blockchain: 'Ethereum',
    wallet_type: 'Intermediary / Burner',
    risk_level: 'HIGH',
    risk_score: 78,
    total_transactions: 142,
    incoming_usd: 92000.0,
    outgoing_usd: 91800.0,
    current_balance_usd: 200.0,
    first_seen: '2026-08-19',
    last_activity: '45 minutes ago',
    cluster_id: 'MULE_LAYER_1',
    tags: ['Intermediary Mule A', 'Peel Chain Relay', 'Bridge Dispatcher']
  },
  {
    address: '0x9C4F1A28Ea657c918F3Bce921b72e9D906351F02',
    blockchain: 'Ethereum',
    wallet_type: 'Intermediary / Burner',
    risk_level: 'HIGH',
    risk_score: 81,
    total_transactions: 210,
    incoming_usd: 42000.0,
    outgoing_usd: 41850.0,
    current_balance_usd: 150.0,
    first_seen: '2026-08-20',
    last_activity: '30 minutes ago',
    cluster_id: 'MULE_LAYER_1',
    tags: ['Intermediary Mule B', 'Split Node', 'DEX Obfuscation']
  },

  // 4. Cross-Chain Bridge Protocols
  {
    address: '0x2F8B701D21950A94F81A8cD80267Ff466bFEbEE9',
    blockchain: 'Ethereum',
    wallet_type: 'Bridge / Protocol',
    risk_level: 'MEDIUM',
    risk_score: 45,
    total_transactions: 451920,
    incoming_usd: 18200000.0,
    outgoing_usd: 18195000.0,
    current_balance_usd: 5000.0,
    first_seen: '2024-03-10',
    last_activity: '1 minute ago',
    cluster_id: 'BRIDGE_STARGATE',
    tags: ['Stargate Finance / LayerZero', 'Cross-Chain Bridge', 'ETH &rarr; Polygon Hop']
  },
  {
    address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    blockchain: 'Ethereum',
    wallet_type: 'DEX',
    risk_level: 'LOW',
    risk_score: 25,
    total_transactions: 8942100,
    incoming_usd: 94000000.0,
    outgoing_usd: 93998000.0,
    current_balance_usd: 2000.0,
    first_seen: '2021-05-04',
    last_activity: 'Just now',
    cluster_id: 'DEX_UNISWAP_V3',
    tags: ['Uniswap V3 Router', 'DEX Liquidity Pool']
  },

  // 5. Intermediary Mule Layer 2 (Polygon)
  {
    address: '0xA15D2F6B89cCb26507A94D6d54C8360f9e16cD9B',
    blockchain: 'Polygon',
    wallet_type: 'Intermediary / Burner',
    risk_level: 'CRITICAL',
    risk_score: 89,
    total_transactions: 84,
    incoming_usd: 48200.0,
    outgoing_usd: 47920.0,
    current_balance_usd: 280.0,
    first_seen: '2026-08-21',
    last_activity: '15 minutes ago',
    cluster_id: 'MULE_LAYER_2',
    tags: ['Mule Wallet C', 'Convergence Node', '73% of Traced Flow']
  },
  {
    address: '0xB26E37A8C86095Ec10c41066D60F409C8747a822',
    blockchain: 'Polygon',
    wallet_type: 'Intermediary / Burner',
    risk_level: 'CRITICAL',
    risk_score: 92,
    total_transactions: 96,
    incoming_usd: 134500.0,
    outgoing_usd: 134100.0,
    current_balance_usd: 400.0,
    first_seen: '2026-08-21',
    last_activity: '6 minutes ago',
    cluster_id: 'MULE_LAYER_2',
    tags: ['Mule Wallet D', 'VASP Feeder Node', 'Consolidation Target']
  },

  // 6. Destination Exchange / VASP Deposit Clusters (The Verified Hit!)
  {
    address: '0x28C6c06298d514Db089934071355E5743bf21d60',
    blockchain: 'Polygon',
    wallet_type: 'Exchange / VASP',
    risk_level: 'MEDIUM',
    risk_score: 38,
    total_transactions: 14209800,
    incoming_usd: 128400000.0,
    outgoing_usd: 128380000.0,
    current_balance_usd: 20000.0,
    first_seen: '2020-09-15',
    last_activity: 'Just now',
    cluster_id: 'VASP_BINANCE_HOT14',
    tags: ['BINANCE Hot Wallet #14', 'Identified Deposit Cluster', 'Verified VASP Hit (91%)']
  },
  {
    address: '0x503828976D22510aad0201ac7EC88293211A23Da',
    blockchain: 'Ethereum',
    wallet_type: 'Exchange / VASP',
    risk_level: 'LOW',
    risk_score: 22,
    total_transactions: 9820100,
    incoming_usd: 85000000.0,
    outgoing_usd: 84990000.0,
    current_balance_usd: 10000.0,
    first_seen: '2019-11-20',
    last_activity: '2 minutes ago',
    cluster_id: 'VASP_COINBASE_01',
    tags: ['Coinbase Custody', 'Secondary Residual Cluster']
  },

  // 7. Multi-Chain Showcase: Bitcoin UTXO & Solana
  {
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    blockchain: 'Bitcoin',
    wallet_type: 'Intermediary / Burner',
    risk_level: 'HIGH',
    risk_score: 72,
    total_transactions: 41,
    incoming_usd: 31200.0,
    outgoing_usd: 31050.0,
    current_balance_usd: 150.0,
    first_seen: '2026-08-17',
    last_activity: '3 hours ago',
    cluster_id: 'BTC_PEEL_01',
    tags: ['Bitcoin Mule (UTXO)', 'Peel Chain Branch']
  },
  {
    address: '8rZ9qLw2oPtB17xK4J2c7p6B3A4L5e2X9Y1Z4W8V2U3T',
    blockchain: 'Solana',
    wallet_type: 'Intermediary / Burner',
    risk_level: 'HIGH',
    risk_score: 75,
    total_transactions: 89,
    incoming_usd: 28400.0,
    outgoing_usd: 28200.0,
    current_balance_usd: 200.0,
    first_seen: '2026-08-19',
    last_activity: '1 hour ago',
    cluster_id: 'SOL_WORMHOLE_01',
    tags: ['Solana SPL Mule', 'Wormhole / Portal Transit']
  }
];

export const DEMO_TRANSACTIONS: TransactionData[] = [
  {
    tx_hash: '0x4a18f8e792c0192a83e09182390fca8192830192830192830192830192830191',
    from_address: '0x1A82f811559CAbC2eCbb4d642875b28F04B3f61E',
    to_address: '0x7A2F8C91F0328b9c24090954e3d389a91f',
    amount_usd: 25000.0,
    amount_crypto: 25000.0,
    token: 'USDT',
    timestamp: '2026-08-18 10:14:22',
    blockchain: 'Ethereum',
    block_number: 20561240,
    status: 'CONFIRMED',
    direction: 'INCOMING',
    risk_flag: 'VICTIM_REPORTED',
    gas_fee_usd: 4.20,
    hop_delay_seconds: 0
  },
  {
    tx_hash: '0x5b29a9f803d1203b94f10293401adb9203941203941203941203941203941202',
    from_address: '0x2B93e7782A79D327B6B0E094200CeB104F5cD64B',
    to_address: '0x7A2F8C91F0328b9c24090954e3d389a91f',
    amount_usd: 32000.0,
    amount_crypto: 32000.0,
    token: 'USDT',
    timestamp: '2026-08-18 11:22:45',
    blockchain: 'Ethereum',
    block_number: 20561578,
    status: 'CONFIRMED',
    direction: 'INCOMING',
    risk_flag: 'VICTIM_REPORTED',
    gas_fee_usd: 5.10,
    hop_delay_seconds: 4103
  },
  {
    tx_hash: '0x6c30ba0914e2314ca5021304512bec0314052314052314052314052314052313',
    from_address: '0x3C04fb68e4B484d852A9Fe508375C17f35B9B251',
    to_address: '0x7A2F8C91F0328b9c24090954e3d389a91f',
    amount_usd: 18500.0,
    amount_crypto: 18500.0,
    token: 'USDT',
    timestamp: '2026-08-18 12:05:10',
    blockchain: 'Ethereum',
    block_number: 20561790,
    status: 'CONFIRMED',
    direction: 'INCOMING',
    risk_flag: 'VICTIM_REPORTED',
    gas_fee_usd: 3.85,
    hop_delay_seconds: 2545
  },
  {
    tx_hash: '0x7d41cb1025f3425db6132415623cfd1425163425163425163425163425163424',
    from_address: '0x7A2F8C91F0328b9c24090954e3d389a91f',
    to_address: '0x8B3E901F410Ac9D86e6Ce3F6B3475142106eDb79',
    amount_usd: 45000.0,
    amount_crypto: 45000.0,
    token: 'USDT',
    timestamp: '2026-08-18 12:12:15',
    blockchain: 'Ethereum',
    block_number: 20561825,
    status: 'CONFIRMED',
    direction: 'OUTGOING',
    risk_flag: 'RAPID_FORWARDING',
    gas_fee_usd: 6.50,
    hop_delay_seconds: 425
  },
  {
    tx_hash: '0x8e52dc213604536ec7243526734d0e2536274536274536274536274536274535',
    from_address: '0x7A2F8C91F0328b9c24090954e3d389a91f',
    to_address: '0x9C4F1A28Ea657c918F3Bce921b72e9D906351F02',
    amount_usd: 28500.0,
    amount_crypto: 28500.0,
    token: 'USDT',
    timestamp: '2026-08-18 12:15:30',
    blockchain: 'Ethereum',
    block_number: 20561840,
    status: 'CONFIRMED',
    direction: 'OUTGOING',
    risk_flag: 'LAYERING_SPLIT',
    gas_fee_usd: 5.90,
    hop_delay_seconds: 195
  },
  {
    tx_hash: '0x9f63ed324715647fd8354637845e1f3647385647385647385647385647385646',
    from_address: '0x8B3E901F410Ac9D86e6Ce3F6B3475142106eDb79',
    to_address: '0x2F8B701D21950A94F81A8cD80267Ff466bFEbEE9',
    amount_usd: 44500.0,
    amount_crypto: 44500.0,
    token: 'USDT',
    timestamp: '2026-08-18 12:20:00',
    blockchain: 'Ethereum',
    block_number: 20561862,
    status: 'CONFIRMED',
    direction: 'OUTGOING',
    risk_flag: 'BRIDGE_HOP_INITIATED',
    gas_fee_usd: 18.20,
    is_cross_chain: true,
    bridge_name: 'Stargate Finance / LayerZero',
    hop_delay_seconds: 465
  },
  {
    tx_hash: '0x0a74fe4358267580e9465748956f204758496758496758496758496758496757',
    from_address: '0x2F8B701D21950A94F81A8cD80267Ff466bFEbEE9',
    to_address: '0xA15D2F6B89cCb26507A94D6d54C8360f9e16cD9B',
    amount_usd: 44200.0,
    amount_crypto: 44200.0,
    token: 'USDC',
    timestamp: '2026-08-18 12:24:45',
    blockchain: 'Polygon',
    block_number: 61284910,
    status: 'CONFIRMED',
    direction: 'INCOMING',
    risk_flag: 'CROSS_CHAIN_EXIT',
    gas_fee_usd: 0.12,
    is_cross_chain: true,
    bridge_name: 'Stargate Relayer',
    hop_delay_seconds: 285
  },
  {
    tx_hash: '0x1b850f5469378691fa5768590670315869507869507869507869507869507868',
    from_address: '0x9C4F1A28Ea657c918F3Bce921b72e9D906351F02',
    to_address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    amount_usd: 28000.0,
    amount_crypto: 28000.0,
    token: 'USDT',
    timestamp: '2026-08-18 12:28:10',
    blockchain: 'Ethereum',
    block_number: 20561902,
    status: 'CONFIRMED',
    direction: 'OUTGOING',
    risk_flag: 'DEX_SWAP_OBSFUCATION',
    gas_fee_usd: 14.50,
    hop_delay_seconds: 760
  },
  {
    tx_hash: '0x2c9610657a4897020b6879601781426970618970618970618970618970618979',
    from_address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    to_address: '0xA15D2F6B89cCb26507A94D6d54C8360f9e16cD9B',
    amount_usd: 27800.0,
    amount_crypto: 27800.0,
    token: 'DAI',
    timestamp: '2026-08-18 12:35:20',
    blockchain: 'Polygon',
    block_number: 61285020,
    status: 'CONFIRMED',
    direction: 'INCOMING',
    risk_flag: 'CONVERGENCE_PRIMARY',
    gas_fee_usd: 0.08,
    hop_delay_seconds: 430
  },
  {
    tx_hash: '0x3da721768b5908131c7980712892537081729081729081729081729081729080',
    from_address: '0xA15D2F6B89cCb26507A94D6d54C8360f9e16cD9B',
    to_address: '0xB26E37A8C86095Ec10c41066D60F409C8747a822',
    amount_usd: 71500.0,
    amount_crypto: 71500.0,
    token: 'USDC',
    timestamp: '2026-08-18 12:44:00',
    blockchain: 'Polygon',
    block_number: 61285140,
    status: 'CONFIRMED',
    direction: 'OUTGOING',
    risk_flag: 'CONSOLIDATION_FEEDER',
    gas_fee_usd: 0.15,
    hop_delay_seconds: 520
  },
  {
    tx_hash: '0x4eb832879c6019242d8091823903648192830192830192830192830192830191',
    from_address: '0xB26E37A8C86095Ec10c41066D60F409C8747a822',
    to_address: '0x28C6c06298d514Db089934071355E5743bf21d60',
    amount_usd: 71200.0,
    amount_crypto: 71200.0,
    token: 'USDC',
    timestamp: '2026-08-18 12:51:12',
    blockchain: 'Polygon',
    block_number: 61285220,
    status: 'CONFIRMED',
    direction: 'OUTGOING',
    risk_flag: 'VASP_DEPOSIT_SWEEP',
    gas_fee_usd: 0.18,
    hop_delay_seconds: 432
  },
  // Secondary Dispersal
  {
    tx_hash: '0x5fc94398ad7120353e9102934014759203941203941203941203941203941202',
    from_address: '0x7A2F8C91F0328b9c24090954e3d389a91f',
    to_address: '0x8B3E901F410Ac9D86e6Ce3F6B3475142106eDb79',
    amount_usd: 24580.0,
    amount_crypto: 24580.0,
    token: 'USDT',
    timestamp: '2026-08-19 14:10:05',
    blockchain: 'Ethereum',
    block_number: 20569800,
    status: 'CONFIRMED',
    direction: 'OUTGOING',
    risk_flag: 'BATCH_DISPERSAL',
    gas_fee_usd: 6.10,
    hop_delay_seconds: 900
  },
  {
    tx_hash: '0x60da54a9be8231464f021304512586a314052314052314052314052314052313',
    from_address: '0x8B3E901F410Ac9D86e6Ce3F6B3475142106eDb79',
    to_address: '0xB26E37A8C86095Ec10c41066D60F409C8747a822',
    amount_usd: 24400.0,
    amount_crypto: 24400.0,
    token: 'USDT',
    timestamp: '2026-08-19 14:22:15',
    blockchain: 'Ethereum',
    block_number: 20569860,
    status: 'CONFIRMED',
    direction: 'OUTGOING',
    risk_flag: 'PEEL_FORWARD',
    gas_fee_usd: 5.40,
    hop_delay_seconds: 730
  },
  {
    tx_hash: '0x71eb65ba0ff3425750132415623697b425163425163425163425163425163424',
    from_address: '0xB26E37A8C86095Ec10c41066D60F409C8747a822',
    to_address: '0x28C6c06298d514Db089934071355E5743bf21d60',
    amount_usd: 24250.0,
    amount_crypto: 24250.0,
    token: 'USDT',
    timestamp: '2026-08-19 14:38:40',
    blockchain: 'Polygon',
    block_number: 61350100,
    status: 'CONFIRMED',
    direction: 'OUTGOING',
    risk_flag: 'VASP_DEPOSIT_SWEEP',
    gas_fee_usd: 0.16,
    hop_delay_seconds: 985
  }
];

export const DEMO_RISK_INDICATORS: RiskIndicator[] = [
  {
    id: 'IND-001',
    code: 'MULTIPLE_VICTIM_SOURCES',
    title: 'Multiple victim-origin transactions',
    severity: 'HIGH',
    score_impact: 15,
    confidence: 0.94,
    timestamp: '2026-08-18 12:05:10',
    explanation: 'Inflows received directly from 3 distinct victim complainant addresses within 2 hours.',
    investigative_note: 'Indicates central fraud aggregator node collecting proceeds of crime.'
  },
  {
    id: 'IND-002',
    code: 'RAPID_FORWARDING',
    title: 'Rapid fund forwarding (< 300s)',
    severity: 'HIGH',
    score_impact: 20,
    confidence: 0.96,
    timestamp: '2026-08-18 12:12:15',
    explanation: 'Funds forwarded within 195-425 seconds of receipt, exhibiting automated pass-through characteristics.',
    investigative_note: 'Hallmark of burner wallets designed to minimize statutory seizure windows.'
  },
  {
    id: 'IND-003',
    code: 'LAYERING_BEHAVIOR',
    title: 'Layering behavior (Peel Chain) detected',
    severity: 'CRITICAL',
    score_impact: 20,
    confidence: 0.92,
    timestamp: '2026-08-18 12:15:30',
    explanation: 'Structured splitting of funds across multiple intermediary wallets with unequal tranches.',
    investigative_note: 'Deliberate dispersion to evade AML transaction threshold monitoring.'
  },
  {
    id: 'IND-004',
    code: 'CROSS_CHAIN_TRANSIT',
    title: 'Cross-chain movement (ETH &rarr; Polygon) detected',
    severity: 'HIGH',
    score_impact: 12,
    confidence: 0.98,
    timestamp: '2026-08-18 12:20:00',
    explanation: 'Cross-chain hop from Ethereum to Polygon network via Stargate / LayerZero liquidity pool.',
    investigative_note: 'Chain hopping used to break linear EVM ledger traceability across jurisdictions.'
  },
  {
    id: 'IND-005',
    code: 'HIGH_RISK_CLUSTER',
    title: 'Interaction with high-risk mule cluster',
    severity: 'HIGH',
    score_impact: 12,
    confidence: 0.88,
    timestamp: '2026-08-18 12:44:00',
    explanation: 'Direct fund transfer to identified mule feeder cluster MULE_LAYER_2.',
    investigative_note: 'Feeder cluster known from previous cybercrime complaints in NCRP database.'
  },
  {
    id: 'IND-006',
    code: 'EXCHANGE_DEPOSIT_PATTERN',
    title: 'Exchange deposit sweep pattern detected',
    severity: 'CRITICAL',
    score_impact: 10,
    confidence: 0.91,
    timestamp: '2026-08-18 12:51:12',
    explanation: 'Final hop displays batch consolidation characteristic of centralized exchange deposit addresses.',
    investigative_note: 'Urgent: Issue Section 91 / 102 Cr.P.C. / BNSS Sec 106 freeze notice to Binance.'
  }
];

export const DEMO_VASP_ATTRIBUTION: VASPAttribution = {
  wallet_address: DEMO_SUSPECT_ADDRESS,
  primary_vasp: {
    vasp_name: 'BINANCE',
    cluster_id: 'VASP_BINANCE_HOT14',
    confidence_pct: 91.0,
    is_primary: true,
    jurisdiction: 'Global / Multi-Jurisdiction',
    le_portal_available: true,
    le_subpoena_guide: 'https://www.binance.com/en/support/law-enforcement (Kodex Portal)',
    deposit_pattern_match: 'Omnibus sweep to Hot Wallet #14 with batch consolidation'
  },
  attribution_confidence: 91.0,
  candidates: [
    {
      vasp_name: 'BINANCE',
      cluster_id: 'VASP_BINANCE_HOT14',
      confidence_pct: 91.0,
      is_primary: true,
      jurisdiction: 'Global / Multi-Jurisdiction',
      le_portal_available: true,
      le_subpoena_guide: 'Subpoena through Binance Kodex LE Portal',
      deposit_pattern_match: 'Sweep to Omnibus Hot Wallet #14'
    },
    {
      vasp_name: 'COINBASE',
      cluster_id: 'VASP_COINBASE_01',
      confidence_pct: 6.0,
      is_primary: false,
      jurisdiction: 'United States (FinCEN Registered)',
      le_portal_available: true,
      le_subpoena_guide: 'Subpoena through Coinbase LE Request Tool',
      deposit_pattern_match: 'Secondary dust outflow settlement'
    },
    {
      vasp_name: 'KRAKEN',
      cluster_id: 'VASP_KRAKEN_01',
      confidence_pct: 2.0,
      is_primary: false,
      jurisdiction: 'United States (Payward Inc)',
      le_portal_available: true,
      le_subpoena_guide: 'Subpoena via compliance@kraken.com',
      deposit_pattern_match: 'Historical cluster overlap'
    },
    {
      vasp_name: 'OTHER / UNKNOWN',
      cluster_id: 'VASP_OTHER_01',
      confidence_pct: 1.0,
      is_primary: false,
      jurisdiction: 'Unidentified OTC',
      le_portal_available: false,
      le_subpoena_guide: 'Requires IP subpoena to ISP',
      deposit_pattern_match: 'P2P OTC Escrow pattern'
    }
  ],
  evidence_checklist: [
    {
      key: 'deposit_cluster_match',
      label: 'Deposit address cluster match',
      verified: true,
      confidence_weight: 0.28,
      description: 'Deposit address shares common consolidation target (0x28C6c...1d60) within 2 blocks.'
    },
    {
      key: 'sweep_pattern',
      label: 'Transaction pattern similarity',
      verified: true,
      confidence_weight: 0.22,
      description: 'Swept entire remaining balance minus gas to known Binance omnibus hot wallet.'
    },
    {
      key: 'known_exchange_association',
      label: 'Known exchange wallet association',
      verified: true,
      confidence_weight: 0.20,
      description: 'Historical clustering correlates with Binance Deposit Omnibus Cluster #001.'
    },
    {
      key: 'historical_interaction',
      label: 'Historical interaction pattern',
      verified: true,
      confidence_weight: 0.12,
      description: 'Mule D sent 3 batch transactions conforming to Binance API auto-credit timestamps.'
    },
    {
      key: 'flow_proximity',
      label: 'Fund-flow proximity',
      verified: true,
      confidence_weight: 0.09,
      description: '3 degrees of separation from suspect aggregator wallet (0x7A2F8C...91F).'
    }
  ],
  disclaimer: 'Attribution results are probabilistic derived from on-chain clustering heuristics. Requires formal Section 91 Cr.P.C. / BNSS verification.',
  last_interaction: '3 minutes ago'
};

export const DEMO_CASES: CaseData[] = [
  {
    case_id: 'NCRP-2026-00182',
    complaint_ref: 'CC-MAH-2026-88912',
    sahyog_ack_no: 'SHY-2026-449102',
    complainant_name: 'Rajesh Sharma',
    law_enforcement_unit: 'Pune Cyber Crime Police Station (Spl. Cell)',
    fraud_type: 'Investment Scam',
    suspect_wallet: DEMO_SUSPECT_ADDRESS,
    blockchain: 'Ethereum',
    amount_reported_inr: 842500.0,
    amount_traced_inr: 842500.0,
    risk_level: 'CRITICAL',
    status: 'Active Investigation',
    created_at: '2026-08-18 14:30:00',
    last_updated: '3 minutes ago',
    assigned_officer: 'Insp. V. K. Deshmukh (Cyber Forensics)'
  },
  {
    case_id: 'NCRP-2026-00177',
    complaint_ref: 'CC-MUM-2026-74211',
    sahyog_ack_no: 'SHY-2026-382901',
    complainant_name: 'Anita Desai',
    law_enforcement_unit: 'Mumbai Cyber Crime Branch (BKC)',
    fraud_type: 'Phishing / Smart Contract Drainer',
    suspect_wallet: '0x8B3E901F410Ac9D86e6Ce3F6B3475142106eDb79',
    blockchain: 'Ethereum',
    amount_reported_inr: 2480000.0,
    amount_traced_inr: 2210000.0,
    risk_level: 'CRITICAL',
    status: 'Investigation',
    created_at: '2026-08-16 09:15:00',
    last_updated: '45 minutes ago',
    assigned_officer: 'ACP S. R. Patil'
  },
  {
    case_id: 'NCRP-2026-00151',
    complaint_ref: 'CC-DEL-2026-51209',
    sahyog_ack_no: 'SHY-2026-194021',
    complainant_name: 'Vikram Singhania',
    law_enforcement_unit: 'Delhi Police IFSO (Special Cell)',
    fraud_type: 'Task-Based Part-time Job Fraud',
    suspect_wallet: '0x9C4F1A28Ea657c918F3Bce921b72e9D906351F02',
    blockchain: 'Ethereum',
    amount_reported_inr: 315000.0,
    amount_traced_inr: 315000.0,
    risk_level: 'MEDIUM',
    status: 'Monitoring',
    created_at: '2026-08-12 16:40:00',
    last_updated: '1 day ago',
    assigned_officer: 'SI Aman Verma'
  },
  {
    case_id: 'NCRP-2026-00094',
    complaint_ref: 'CC-HYD-2026-33981',
    sahyog_ack_no: 'SHY-2026-082419',
    complainant_name: 'Neha Kapoor',
    law_enforcement_unit: 'Cyberabad Cyber Crime Investigation Unit',
    fraud_type: 'Fake Crypto Staking Arbitrage',
    suspect_wallet: '0xB26E37A8C86095Ec10c41066D60F409C8747a822',
    blockchain: 'Polygon',
    amount_reported_inr: 1890000.0,
    amount_traced_inr: 1890000.0,
    risk_level: 'HIGH',
    status: 'Section 91 Issued',
    created_at: '2026-08-01 11:20:00',
    last_updated: '3 days ago',
    assigned_officer: 'Insp. K. Rao'
  }
];

export const DEMO_ALERTS: AlertData[] = [
  {
    id: 'ALT-2026-9041',
    priority: 'CRITICAL',
    title: 'Potential exchange deposit detected',
    case_id: 'NCRP-2026-00182',
    wallet_address: '0x7A2F8C91F0328b9c24090954e3d389a91f',
    funds_inr: 842500.0,
    likely_vasp: 'BINANCE',
    confidence_pct: 91.0,
    timestamp: '3 minutes ago',
    recommended_action: 'Issue Section 91 & 102 Cr.P.C. / BNSS Sec 106 freeze requisition to Binance Compliance.',
    status: 'UNREAD',
    blockchain: 'Polygon'
  },
  {
    id: 'ALT-2026-9039',
    priority: 'HIGH',
    title: 'Cross-Chain Bridge Transit Confirmed',
    case_id: 'NCRP-2026-00182',
    wallet_address: '0x8B3E901F410Ac9D86e6Ce3F6B3475142106eDb79',
    funds_inr: 3720000.0,
    likely_vasp: 'STARGATE_RELAYER',
    confidence_pct: 98.0,
    timestamp: '25 minutes ago',
    recommended_action: 'Preserve Stargate relayer transaction logs and monitor Polygon destination address for immediate cash-out.',
    status: 'ACKNOWLEDGED',
    blockchain: 'Ethereum'
  },
  {
    id: 'ALT-2026-9022',
    priority: 'HIGH',
    title: 'Rapid Fund Forwarding Spike (< 180s)',
    case_id: 'NCRP-2026-00177',
    wallet_address: '0x8B3E901F410Ac9D86e6Ce3F6B3475142106eDb79',
    funds_inr: 2080000.0,
    likely_vasp: 'PENDING_CLUSTER',
    confidence_pct: 74.0,
    timestamp: '1 hour ago',
    recommended_action: 'Correlate IP address with upstream victim session timestamps to identify mule controller origin.',
    status: 'INVESTIGATING',
    blockchain: 'Ethereum'
  },
  {
    id: 'ALT-2026-8991',
    priority: 'MEDIUM',
    title: 'DEX Liquidity Pool Swap Obfuscation',
    case_id: 'NCRP-2026-00151',
    wallet_address: '0x9C4F1A28Ea657c918F3Bce921b72e9D906351F02',
    funds_inr: 315000.0,
    likely_vasp: 'UNISWAP_V3',
    confidence_pct: 99.0,
    timestamp: '18 hours ago',
    recommended_action: 'Track swapped token address path and isolate destination liquidity receiver wallet.',
    status: 'RESOLVED',
    blockchain: 'Ethereum'
  }
];

export const DEMO_AI_FINDINGS = {
  wallet_address: DEMO_SUSPECT_ADDRESS,
  observed_facts: [
    'Mule Wallet C (0xA15D...cD9B) acts as the primary convergence node, absorbing 73% ($72,000 USD) of victim fund flows.',
    'Funds originated from 3 distinct complainant wallets (Victim 1, Victim 2, Victim 3) reporting investment fraud losses under FIR No. 182/2026.',
    'A cross-chain bridge transfer of $44,500 USDT was executed via Stargate Finance from Ethereum to Polygon at block 20561862.',
    'Feeder Wallet D (0xB26E...a822) executed 2 batched consolidation sweeps totaling $95,450 to Polygon Deposit Cluster 0x28C6c...1d60.',
    'Outbound transfers from suspect wallet 0x7A2F...91F occurred within 195-425 seconds of initial victim deposits.'
  ],
  inferred_patterns: [
    'Layering Architecture: Structured peel-chain dispersal through Intermediaries A & B was utilized to avoid triggering single-transaction AML flags.',
    'Cross-Chain Obfuscation: Transit through Stargate Finance bridge deliberately breaks linear EVM explorer monitoring across jurisdictions.',
    'Cashing-Out Signature: Final consolidation onto Deposit Cluster 0x28C6c...1d60 exhibits high-frequency omnibus sweep characteristics typical of Binance (91% confidence).',
    'Mule Account Cluster: Intermediaries A, B, and C show zero staking or DeFi interaction, functioning purely as automated transient pass-through addresses.'
  ],
  recommendations: [
    'Priority 1: Draft and serve Section 91 / 102 Cr.P.C. / BNSS Sec 106 Freeze Order to Binance Compliance for Deposit Cluster 0x28C6c...1d60.',
    'Priority 2: Secure Stargate bridge relayer payload logs for transaction hash 0x9f63...5646 to map upstream initiator IP and RPC node.',
    'Priority 3: Register Intermediaries A, B, C, and D into the National Cyber Crime Reporting Portal (NCRP) / SAHYOG mule wallet registry.',
    'Priority 4: Issue formal freeze directives for residual balances ($2,520 USD) remaining in suspect aggregator wallet.'
  ],
  procedural_notice_draft: `NOTICE UNDER SECTION 91 & SECTION 102 OF CODE OF CRIMINAL PROCEDURE, 1973
(AND CORRESPONDING SECTION 94 & SECTION 106 OF BHARATIYA NAGARIK SURAKSHA SANHITA, 2023)
READ WITH SECTION 66-D OF INFORMATION TECHNOLOGY ACT, 2000

TO:
The Nodal Officer / Law Enforcement Liaison Officer,
Binance Services Holdings Ltd. / Registered VASP Compliance Unit
Portal: Binance Law Enforcement Request System (Kodex)

CASE DETAILS:
NCRP Complaint Ref: CC-MAH-2026-88912 | SAHYOG Portal Ack: SHY-2026-449102
FIR No.: 182/2026 u/s 420, 120-B IPC, Sec 66-D IT Act
Police Station: Cyber Crime Police Station (Special Cell), Pune City Police

SUBJECT: URGENT STATUTORY REQUISITION FOR IMMEDIATE FREEZING OF CRYPTO ASSETS, KYC INFORMATION, AND TRANSACTION AUDIT TRAIL FOR DEPOSIT CLUSTER 0x28C6c06298d514Db089934071355E5743bf21d60.

1. WHEREAS, an active cybercrime criminal investigation is being conducted by this unit regarding an organized cryptocurrency investment scam where victim funds amounting to INR 8,42,500/- were fraudulently induced and misappropriated.

2. AND WHEREAS, real-time forensic blockchain fund tracing conducted via the BLUCE LOCK forensic intelligence platform has established that proceeds of crime flowed from the suspect aggregator wallet (0x7A2F8C91F0328b9c24090954e3d389a91f) through layering mule addresses and the Stargate cross-chain bridge, ultimately terminating and consolidating into the following destination deposit address on the Polygon Network:
   Target Deposit Address: 0x28C6c06298d514Db089934071355E5743bf21d60
   Associated Omnibus Cluster: VASP_BINANCE_HOT14 (Confidence: 91%)
   Last Known Inflow: 71,200.00 USDC (Tx: 0x4eb832879c6019242d8091823903648192830192830192830192830192830191)

3. NOW THEREFORE, you are hereby required and directed in terms of Section 91 and Section 102 Cr.P.C. to immediately:
   a) FREEZE / MARK LIEN on all cryptocurrency balances, fiat balances, and pending withdrawals associated with the internal user UID linked to the aforesaid deposit address.
   b) FURNISH certified true copies of all Know Your Customer (KYC) documentation, including government ID, registered email address, mobile number, bank account details, and full name.
   c) PROVIDE complete access logs, including login IP addresses, port numbers, device fingerprints, and timestamps for the past 90 days.
   d) PRESERVE all associated internal ledger transfers and P2P trading counterparty records.

Take notice that failure to comply with this statutory requisition will invite penal proceedings under Section 175 and Section 204 of the Indian Penal Code / relevant provisions of BNS.

Given under my hand and seal of the Cyber Crime Police Station on this 3rd day of September, 2026.

(INSP. V. K. DESHMUKH)
Cyber Forensics Specialist & Investigating Officer
Cyber Crime Police Station, Special Cell
Badge: CY-7819 | Email: cybercrime.cell@mahapolice.gov.in`
};
