"""
BLUCE LOCK - AntiGravity Engine
Module: Legal NLP Generation Engine
Purpose: Translates raw blockchain graph data (tx hashes, block numbers, timestamps, fiat valuations, VASP attributions)
into formal Indian legal prose compliant with:
  - Section 65B of the Indian Evidence Act, 1872 / Section 63 Bharatiya Sakshya Adhiniyam (BSA), 2023
  - Section 91 of the Code of Criminal Procedure, 1973 / Section 94 Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023
  - Section 102 of the Code of Criminal Procedure, 1973 / Section 106 Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023
"""

from typing import List, Dict, Any
from datetime import datetime
import hashlib

class LegalNLPEngine:
    """
    Automated Legal Prose Generator for Law Enforcement Officers,
    Cyber Crime Police Stations, and Special Investigation Teams (SIT).
    """

    def generate_section_65b_certificate(
        self,
        officer_name: str,
        officer_designation: str,
        police_station: str,
        fir_number: str,
        case_sections: str,
        extracted_transactions: List[Dict[str, Any]],
        hash_digest: str
    ) -> str:
        """
        Generates Section 65B (IEA) / Section 63 (BSA) Certificate of Digital Evidence Admissibility.
        """
        today_str = datetime.utcnow().strftime("%d-%B-%Y")
        tx_rows = []
        for idx, tx in enumerate(extracted_transactions, 1):
            tx_rows.append(
                f"  ({idx}) Tx Hash: {tx.get('hash', 'N/A')} | "
                f"Block: {tx.get('block_number', 'N/A')} | "
                f"Time (UTC): {tx.get('timestamp', 'N/A')} | "
                f"Amount: {tx.get('amount', 0.0)} {tx.get('currency', 'USDT')} (INR ~Rs. {tx.get('inr_value', '0'):,}) | "
                f"From: {tx.get('from', 'N/A')} -> To: {tx.get('to', 'N/A')}"
            )
        tx_block = "\n".join(tx_rows)

        certificate_text = f"""
=================================================================================================
             CERTIFICATE UNDER SECTION 65B OF THE INDIAN EVIDENCE ACT, 1872 
       READ WITH SECTION 63 OF THE BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023
=================================================================================================

BEFORE THE HON'BLE COURT OF COMPETENT JURISDICTION / MAGISTRATE FIRST CLASS

IN THE MATTER OF:
State / Cyber Crime Police Station: {police_station}
FIR / Crime No.: {fir_number}
Under Sections: {case_sections}

I, {officer_name}, {officer_designation}, attached to {police_station}, do hereby solemnly affirm and state on oath as follows:

1. That I am the Investigating Officer / Technical Forensic Analyst in the above-captioned matter and am lawfully responsible for the operation and extraction of electronic blockchain evidence using the BLUCE LOCK National Forensics Node.

2. That the electronic records described herein below were retrieved and printed from the BLUCE LOCK forensic system during the normal and lawful course of blockchain forensic inquiry on {today_str}.

3. That throughout the material period, the computer system, distributed forensic ledger nodes, and cryptographic hashing modules were operating properly without any malfunction that could affect the accuracy or integrity of the electronic record.

4. PARTICULARS OF THE EXTRACTED DIGITAL TRANSACTIONS:
{tx_block}

5. CRYPTOGRAPHIC INTEGRITY VERIFICATION:
   - Primary SHA-256 Digest of Extracted Evidence: {hash_digest}
   - Extraction Environment: BLUCE LOCK LE-INTEL Secure Node v2.4.0
   - Integrity Attestation: The electronic record extracted contains an authentic, bit-level identical reproduction of the distributed state ledger records.

6. That the contents of this Certificate are true and correct to the best of my personal knowledge, official technical records, and nothing material has been concealed therefrom.

Date: {today_str}
Place: {police_station}

DEPONENT / CERTIFYING OFFICER:
Name: {officer_name}
Designation: {officer_designation}
Badge / Pen No: CCPS-{officer_name.upper()[:3]}-2026
Seal of the Police Station: [OFFICIAL SEAL]
"""
        return certificate_text.strip()

    def generate_section_91_notice(
        self,
        fir_number: str,
        police_station: str,
        recipient_vasp: str,
        recipient_email: str,
        target_deposit_wallet: str,
        illicit_amount_usd: float,
        parent_tx_hash: str
    ) -> str:
        """
        Generates Section 91 Cr.P.C. / Section 94 BNSS Legal Production Notice to VASP.
        """
        today_str = datetime.utcnow().strftime("%d-%B-%Y")
        inr_val = illicit_amount_usd * 86.50

        notice = f"""
=================================================================================================
                OFFICE OF THE SUPERINTENDENT OF POLICE / INVESTIGATING OFFICER
                      CYBER CRIME POLICE STATION, {police_station.upper()}
=================================================================================================

NOTICE UNDER SECTION 91 OF THE CODE OF CRIMINAL PROCEDURE, 1973 (Cr.P.C.)
READ WITH SECTION 94 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023
URGENT - CYBERCRIME PROCEEDS OF CRIME INVESTIGATION - PRE-FREEZE ACTION REQUIRED

Notice Ref No: CCPS/CRPC91/{datetime.utcnow().year}/{fir_number.replace('/', '-')}-01
Date of Issuance: {today_str}

TO:
The Compliance Officer / Law Enforcement Liaison Team,
{recipient_vasp}
Designated LEA Portal: {recipient_email}

SUBJECT: Requisition of Account Details, KYC/AML Dossiers, IP Access Logs, and Linked Banking
         Instruments in respect of Deposit Wallet: {target_deposit_wallet}
REF:     FIR No. {fir_number}, registered at Cyber Crime Police Station, {police_station}.

Sir / Madam,

1. WHEREAS, an investigation is being conducted into an organized cyber-financial fraud under 
   FIR No. {fir_number}, wherein proceeds of crime totaling ${illicit_amount_usd:,.2f} 
   (Approx. INR Rs. {inr_val:,.2f}) have been fraudulently siphoned and laundered.

2. AND WHEREAS, on-chain cryptographic attribution performed by this agency utilizing the BLUCE LOCK
   intelligence platform reveals that proceeds of crime have routed directly into your platform's 
   internal deposit structure:
     - Target Deposit Address: {target_deposit_wallet}
     - Attributed VASP Cluster: {recipient_vasp}
     - Tracing Transaction Hash: {parent_tx_hash}

3. NOW THEREFORE, by virtue of powers conferred upon me under Section 91 Cr.P.C. / Section 94 BNSS, 
   you are hereby DIRECTED to furnish the following information and documents within 24 HOURS of receipt:
     a) Full Name, Registered Legal Identity, Residential Address, and Date of Birth of the account holder.
     b) Complete KYC Documents (Passport, National ID, Aadhaar / PAN if domestic, Selfie/Liveness verification).
     c) Linked Fiat Settlement Details: Beneficiary Bank Account No., IFSC/SWIFT code, UPI ID, or P2P handle.
     d) IPv4/IPv6 login logs, device IMEI/fingerprints, and user-agent strings for all sessions in the last 90 days.
     e) Full Ledger Deposit and Withdrawal History with destination/source transaction hashes.

4. YOU ARE FURTHER DIRECTED to preserve all server logs, session state, and database backups pertaining 
   to the aforementioned account identifier under Section 67C of the Information Technology Act, 2000.

FAILURE TO COMPLY with this statutory notice shall render the responsible entities liable for penal action 
under Section 175 and Section 188 of the Indian Penal Code, 1860 / Sections 222 & 223 of the BNS, 2023.

Given under my hand and seal of the Police Station this {today_str}.

Investigating Officer / Inspector of Police
Cyber Crime Cell, {police_station}
Official Email: cybercrime.{police_station.lower().replace(' ', '')}@gov.in
"""
        return notice.strip()

    def generate_section_102_freeze_order(
        self,
        fir_number: str,
        police_station: str,
        recipient_vasp: str,
        target_wallet: str,
        seizure_amount_usd: float,
        chain: str
    ) -> str:
        """
        Generates Section 102 Cr.P.C. / Section 106 BNSS Seizure & Freezing Order.
        """
        today_str = datetime.utcnow().strftime("%d-%B-%Y")
        order = f"""
=================================================================================================
                                   ORDER OF SEIZURE & FREEZE
              UNDER SECTION 102 OF THE CODE OF CRIMINAL PROCEDURE, 1973 (Cr.P.C.)
        READ WITH SECTION 106 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023
=================================================================================================

ORDER NO: CCPS/CRPC102/FREEZE/{fir_number.replace('/', '-')}-001
DATE: {today_str}

TO:
Compliance & Legal Operations Directorate,
{recipient_vasp}

WHEREAS, in the course of the investigation of FIR No. {fir_number}, registered at Cyber Crime Police Station,
it has been conclusively established that the digital wallet/account detailed below contains proceeds of crime:
  - Account / Wallet Address: {target_wallet}
  - Network / Chain: {chain.upper()}
  - Quantum of Seizure: ${seizure_amount_usd:,.2f} USD and all current associated balances

NOW THEREFORE, I, the undersigned Investigating Officer, in exercise of statutory powers under Section 102 Cr.P.C. 
/ Section 106 BNSS, 2023, do hereby ORDER AND DIRECT you to:
  1. IMMEDIATELY IMPOSE A COMPLETE DEBIT AND WITHDRAWAL FREEZE on the specified account/wallet.
  2. Prevent any transfers, off-ramping, swaps, internal sub-account movements, or P2P orders.
  3. Mark a legal lien in favor of the Cyber Crime Police Station, {police_station}.
  4. Confirm execution of this freeze order via return electronic transmission within 4 HOURS.

TAKE NOTICE that any dissipation or unauthorized release of these restrained assets post-receipt shall 
attract prosecution for screening an offender and contempt of lawful statutory authority.

Issued under my official signature and seal.

Investigating Officer
Cyber Crime Police Station, {police_station}
"""
        return order.strip()

legal_nlp_engine = LegalNLPEngine()
