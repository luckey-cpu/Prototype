import os
import hashlib
import time
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from pydantic import BaseModel
from typing import List, Dict, Any

class FundFlowHop(BaseModel):
    hop_index: int
    block_height: int
    utc_timestamp: str
    sender: str
    recipient: str
    value_crypto: float
    value_inr: float
    tx_hash: str

class StatutoryRequisitionData(BaseModel):
    fir_no: str
    police_station: str
    io_name: str
    io_designation: str
    ncrp_ack_no: str
    suspect_address: str
    vasp_name: str
    target_exchange_deposit_uid: str
    fund_flow: List[FundFlowHop]

class LegalNoticeGenerator:
    def __init__(self, output_dir: str = "dossiers"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        self.styles = getSampleStyleSheet()
        
        # Define Government-Compliant Styling
        self.styles.add(ParagraphStyle(
            name='FormalTitle',
            parent=self.styles['Heading1'],
            alignment=1, # Center
            fontSize=14,
            textColor=colors.darkblue
        ))
        
        self.styles.add(ParagraphStyle(
            name='FormalText',
            parent=self.styles['Normal'],
            fontSize=11,
            leading=14
        ))

    def _generate_merkle_root(self, data: StatutoryRequisitionData) -> str:
        """Generate a cryptographic hash representing the digital evidence trail."""
        hasher = hashlib.sha256()
        for hop in data.fund_flow:
            hasher.update(hop.tx_hash.encode('utf-8'))
            hasher.update(hop.sender.encode('utf-8'))
            hasher.update(hop.recipient.encode('utf-8'))
        hasher.update(data.suspect_address.encode('utf-8'))
        return hasher.hexdigest()

    def generate_requisition_pdf(self, data: StatutoryRequisitionData) -> str:
        merkle_root = self._generate_merkle_root(data)
        timestamp_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        
        filename = f"{data.ncrp_ack_no}_Sec91_102_Requisition.pdf"
        filepath = os.path.join(self.output_dir, filename)
        
        doc = SimpleDocTemplate(filepath, pagesize=A4,
                                rightMargin=40, leftMargin=40,
                                topMargin=40, bottomMargin=40)
        
        story = []
        
        # 1. Header
        story.append(Paragraph("GOVERNMENT OF INDIA", self.styles['FormalTitle']))
        story.append(Paragraph(f"POLICE STATION: {data.police_station.upper()}", self.styles['FormalTitle']))
        story.append(Spacer(1, 20))
        
        # 2. Subject & Statutory Authority
        story.append(Paragraph(
            f"<b>SUBJECT:</b> Statutory Notice under Section 91 CrPC (Sec 94 BNSS) & "
            f"Direction to Freeze Assets under Section 102 CrPC (Sec 107 BNSS)", 
            self.styles['FormalText']
        ))
        story.append(Spacer(1, 10))
        
        story.append(Paragraph(
            f"<b>TO:</b> Compliance Officer / Law Enforcement Liaison, {data.vasp_name}",
            self.styles['FormalText']
        ))
        story.append(Spacer(1, 10))
        
        # 3. Body Text
        body_text = f"""
        This directive pertains to FIR No. <b>{data.fir_no}</b> (NCRP Acknowledgment: {data.ncrp_ack_no}). 
        During the course of a criminal cyber-financial investigation, cryptographic funds originating from the victim 
        have been forensically traced on the blockchain. 
        <br/><br/>
        The funds have been attributed to your exchange via Suspect Deposit Address: <b>{data.suspect_address}</b> 
        (Exchange UID/Memo: {data.target_exchange_deposit_uid}).
        <br/><br/>
        <b>DIRECTIVES:</b><br/>
        1. <b>IMMEDIATE FREEZE:</b> You are hereby directed under Section 102 CrPC (Sec 107 BNSS) to immediately freeze all assets linked to the aforementioned deposit address and associated user account.<br/>
        2. <b>PRESERVATION OF EVIDENCE:</b> Preserve and produce all KYC/AML records (Aadhaar, PAN, Passport), login IP logs, withdrawal bank accounts, and IMEI numbers under Section 91 CrPC (Sec 94 BNSS).
        """
        story.append(Paragraph(body_text, self.styles['FormalText']))
        story.append(Spacer(1, 20))
        
        # 4. Chronological Fund-Flow Table
        story.append(Paragraph("<b>CRYPTOGRAPHIC EVIDENCE TRAIL (FUND-FLOW)</b>", self.styles['FormalText']))
        story.append(Spacer(1, 10))
        
        table_data = [["Hop", "Time (UTC)", "Sender", "Recipient", "Tx Hash", "Value"]]
        for hop in data.fund_flow:
            short_hash = hop.tx_hash[:6] + "..." + hop.tx_hash[-4:]
            short_sender = hop.sender[:6] + "..." + hop.sender[-4:]
            short_recv = hop.recipient[:6] + "..." + hop.recipient[-4:]
            table_data.append([
                str(hop.hop_index), 
                hop.utc_timestamp, 
                short_sender, 
                short_recv, 
                short_hash,
                f"{hop.value_crypto} (~{hop.value_inr} INR)"
            ])
            
        t = Table(table_data, colWidths=[30, 80, 80, 80, 80, 100])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.navy),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,0), 9),
            ('BOTTOMPADDING', (0,0), (-1,0), 8),
            ('BACKGROUND', (0,1), (-1,-1), colors.whitesmoke),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
            ('FONTSIZE', (0,1), (-1,-1), 8),
        ]))
        story.append(t)
        story.append(Spacer(1, 30))
        
        # 5. Section 65B / 63 Certificate
        story.append(Paragraph("<b>CERTIFICATE UNDER SECTION 65B IEA / SECTION 63 BSA</b>", self.styles['FormalText']))
        story.append(Spacer(1, 10))
        cert_text = f"""
        I, {data.io_name}, {data.io_designation}, do hereby certify that the electronic record contained in this 
        document is a true and accurate algorithmic output generated by BLUCE LOCK Forensic Engine. 
        <br/><br/>
        <b>Cryptographic Merkle Root (Evidence Hash):</b> {merkle_root}<br/>
        <b>Generation Timestamp:</b> {timestamp_str}<br/>
        The computer network was operating properly during the entire period of tracing.
        """
        story.append(Paragraph(cert_text, self.styles['FormalText']))
        story.append(Spacer(1, 40))
        
        # 6. Signature Block
        story.append(Paragraph(f"<b>{data.io_name}</b>", self.styles['FormalText']))
        story.append(Paragraph(f"{data.io_designation}", self.styles['FormalText']))
        story.append(Paragraph(f"Investigating Officer, {data.police_station}", self.styles['FormalText']))
        
        # Build Document
        doc.build(story)
        
        return filepath
