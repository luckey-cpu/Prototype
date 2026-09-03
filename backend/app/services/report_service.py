import io
import json
from pathlib import Path
from typing import Dict, Any, Optional
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas
from app.services.blockchain_service import blockchain_service
from app.services.risk_engine import risk_engine
from app.services.vasp_service import vasp_service
from app.services.ai_service import ai_service

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "BLUCE LOCK — CONFIDENTIAL LAW ENFORCEMENT INTELLIGENCE REPORT")
            self.drawRightString(612 - 54, 750, "RESTRICTED / OFFICIAL USE ONLY")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 612 - 54, 742)
            
        # Footer
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawString(54, 36, "PRODUCED BY BLUCE LOCK CYBERCRIME FORENSICS PLATFORM | SECTION 65B EVIDENCE DRAFT")
        self.drawRightString(612 - 54, 36, page_str)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 48, 612 - 54, 48)
        self.restoreState()

class ReportService:
    def generate_pdf_report(
        self,
        case_id: str,
        investigator_name: str = "Insp. V. K. Deshmukh",
        badge_number: str = "CY-7819",
        notes: str = ""
    ) -> bytes:
        # Load case details
        cases_file = DATA_DIR / "cases.json"
        case_data = None
        if cases_file.exists():
            with open(cases_file, "r", encoding="utf-8") as f:
                cases = json.load(f)
                case_data = next((c for c in cases if c["case_id"] == case_id), None)
                
        if not case_data:
            case_data = {
                "case_id": case_id,
                "complaint_ref": "CC-2026-UNKNOWN",
                "complainant_name": "Official Complainant",
                "law_enforcement_unit": "Cyber Crime Police Station",
                "fraud_type": "Cryptocurrency Investment Fraud",
                "suspect_wallet": "0x7A2F8C91F0328b9c24090954e3d389a91f",
                "blockchain": "Ethereum",
                "amount_reported_inr": 842500.0,
                "amount_traced_inr": 842500.0,
                "risk_level": "CRITICAL",
                "status": "Active Investigation",
                "created_at": "2026-08-18 14:30:00",
                "last_updated": "Recent",
                "assigned_officer": investigator_name
            }
            
        suspect_wallet = case_data.get("suspect_wallet", "0x7A2F8C91F0328b9c24090954e3d389a91f")
        wallet_info = blockchain_service.get_wallet(suspect_wallet)
        txs = blockchain_service.get_transactions_for_wallet(suspect_wallet)
        risk_info = risk_engine.calculate_wallet_risk(suspect_wallet)
        vasp_info = vasp_service.attribute_vasp(suspect_wallet)
        ai_info = ai_service.analyze_case(suspect_wallet)

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            leftMargin=54,
            rightMargin=54,
            topMargin=54,
            bottomMargin=54
        )

        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=18,
            leading=22,
            textColor=colors.HexColor("#0F172A"),
            spaceAfter=4
        )
        
        subtitle_style = ParagraphStyle(
            'SubtitleStyle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#475569"),
            spaceAfter=12
        )
        
        h2_style = ParagraphStyle(
            'H2Style',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#0284C7"),
            spaceBefore=12,
            spaceAfter=6
        )

        body_style = ParagraphStyle(
            'BodyStyle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#1E293B")
        )

        badge_style = ParagraphStyle(
            'BadgeStyle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#DC2626")
        )

        story = []

        # Header Banner
        header_data = [
            [
                Paragraph("<b>NATIONAL CYBER CRIME INVESTIGATION WING</b><br/><b>BLUCE LOCK BLOCKCHAIN FORENSIC INTELLIGENCE PLATFORM</b>", body_style),
                Paragraph("<b>CONFIDENTIAL</b><br/>LAW ENFORCEMENT SENSITIVE", ParagraphStyle('RHeader', parent=body_style, alignment=2, textColor=colors.HexColor("#DC2626")))
            ]
        ]
        header_table = Table(header_data, colWidths=[330, 174])
        header_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(header_table)
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284C7"), spaceAfter=12))

        # Title
        story.append(Paragraph("CRYPTOCURRENCY FRAUD ATTRIBUTION REPORT", title_style))
        story.append(Paragraph(f"Forensic Investigation Memorandum &bull; Case ID: <b>{case_data['case_id']}</b> &bull; Ref: {case_data['complaint_ref']}", subtitle_style))
        story.append(Spacer(1, 8))

        # Case Summary Grid
        meta_data = [
            [Paragraph("<b>Fraud Category:</b>", body_style), Paragraph(case_data['fraud_type'], body_style), Paragraph("<b>Risk Classification:</b>", body_style), Paragraph(f"<font color='#DC2626'><b>{risk_info['risk_level']} ({risk_info['risk_score']}/100)</b></font>", body_style)],
            [Paragraph("<b>Suspect Address:</b>", body_style), Paragraph(f"<code>{suspect_wallet[:18]}...{suspect_wallet[-8:]}</code>", body_style), Paragraph("<b>Primary Chain:</b>", body_style), Paragraph(str(case_data['blockchain']), body_style)],
            [Paragraph("<b>Complainant:</b>", body_style), Paragraph(case_data['complainant_name'], body_style), Paragraph("<b>LE Unit:</b>", body_style), Paragraph(case_data['law_enforcement_unit'], body_style)],
            [Paragraph("<b>Reported Loss:</b>", body_style), Paragraph(f"&#8377; {case_data['amount_reported_inr']:,.2f}", body_style), Paragraph("<b>Funds Traced:</b>", body_style), Paragraph(f"&#8377; {case_data['amount_traced_inr']:,.2f}", body_style)],
            [Paragraph("<b>Investigator:</b>", body_style), Paragraph(f"{investigator_name} ({badge_number})", body_style), Paragraph("<b>Date & Time:</b>", body_style), Paragraph(case_data['created_at'], body_style)]
        ]
        meta_table = Table(meta_data, colWidths=[90, 162, 100, 152])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#E2E8F0")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(meta_table)
        story.append(Spacer(1, 14))

        # Executive Summary & VASP Attribution
        story.append(Paragraph("1. VASP (EXCHANGE) ATTRIBUTION & CASH-OUT INTELLIGENCE", h2_style))
        primary_vasp = vasp_info.primary_vasp
        vasp_summary_text = (
            f"Automated forensic analysis identified <b>{primary_vasp.vasp_name}</b> as the most probable destination VASP "
            f"with an <b>Attribution Confidence of {primary_vasp.confidence_pct:.1f}%</b>. "
            f"The fund trail indicates that proceeds flowed through two layering intermediary addresses before converging onto "
            f"Polygon Deposit Cluster <code>0x28C6c...1d60</code>, associated with {primary_vasp.vasp_name}."
        )
        story.append(Paragraph(vasp_summary_text, body_style))
        story.append(Spacer(1, 6))

        # Evidence Checklist Table
        ev_data = [["Evidence Item", "Verification Status", "Weight", "Investigative Observation"]]
        for ev in vasp_info.evidence_checklist:
            status_txt = "VERIFIED" if ev.verified else "UNVERIFIED"
            ev_data.append([
                Paragraph(ev.label, body_style),
                Paragraph(f"<b>{status_txt}</b>", body_style),
                f"{int(ev.confidence_weight * 100)}%",
                Paragraph(ev.description, body_style)
            ])
        ev_table = Table(ev_data, colWidths=[130, 80, 45, 249])
        ev_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0284C7")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(ev_table)
        story.append(Spacer(1, 14))

        # Cross-Chain Hop Summary
        story.append(Paragraph("2. CROSS-CHAIN MOVEMENT & PEEL CHAIN LAYERING", h2_style))
        flow_text = (
            "<b>Fund Flow Pathway:</b><br/>"
            "Victim Complainant Wallets (1, 2, 3) &rarr; Suspect Aggregator (0x7A2F...91F) &rarr; "
            "Intermediary A & B &rarr; Stargate Finance Cross-Chain Bridge & Uniswap V3 &rarr; "
            "Polygon Layering Node (Wallet C) &rarr; Feeder Wallet D &rarr; <b>Binance Deposit Cluster</b>.<br/>"
            "Total Cross-Chain Transit: <b>$44,500.00 USDT</b> (Source Chain: Ethereum &bull; Destination Chain: Polygon)."
        )
        story.append(Paragraph(flow_text, body_style))
        story.append(Spacer(1, 14))

        # Detected Fraud Indicators
        story.append(Paragraph("3. DETECTED RISK INDICATORS (EXPLAINABLE SCORING)", h2_style))
        ind_data = [["Code", "Indicator Title", "Severity", "Impact", "Forensic Explanation"]]
        for ind in risk_info["indicators"]:
            ind_data.append([
                ind["code"],
                Paragraph(ind["title"], body_style),
                ind["severity"],
                f"+{ind['score_impact']}",
                Paragraph(ind["explanation"], body_style)
            ])
        ind_table = Table(ind_data, colWidths=[110, 115, 60, 45, 174])
        ind_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E293B")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(ind_table)
        story.append(Spacer(1, 14))

        # AI Recommendations & Statutory Directives
        story.append(Paragraph("4. AI INVESTIGATION FINDINGS & RECOMMENDED STATUTORY ACTIONS", h2_style))
        for idx, rec in enumerate(ai_info.recommendations, 1):
            story.append(Paragraph(f"<b>Directive {idx}:</b> {rec}", body_style))
            story.append(Spacer(1, 3))
        story.append(Spacer(1, 10))

        # Statutory Disclaimer
        disclaimer_text = (
            "<b>STATUTORY DISCLAIMER & DIGITAL EVIDENCE NOTICE:</b><br/>"
            "This document is an automated preliminary intelligence analysis generated by the BLUCE LOCK forensics engine. "
            "Attribution results are probabilistic and must be verified through formal legal requisitions (Section 91 CrPC / Section 102 CrPC) "
            "served upon registered Virtual Digital Asset service providers."
        )
        story.append(Paragraph(disclaimer_text, ParagraphStyle('Disc', parent=body_style, fontSize=8, textColor=colors.HexColor("#64748B"))))

        # Build Document
        doc.build(story, canvasmaker=NumberedCanvas)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes

report_service = ReportService()
