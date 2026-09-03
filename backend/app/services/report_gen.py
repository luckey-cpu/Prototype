import os
from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML
import structlog
import uuid
import json

logger = structlog.get_logger()

# Assuming templates are in app/templates
TEMPLATE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'templates')

if not os.path.exists(TEMPLATE_DIR):
    os.makedirs(TEMPLATE_DIR)

# Create a basic Jinja2 template if it doesn't exist
DEFAULT_TEMPLATE_PATH = os.path.join(TEMPLATE_DIR, "section_91_crpc.html")
if not os.path.exists(DEFAULT_TEMPLATE_PATH):
    with open(DEFAULT_TEMPLATE_PATH, "w") as f:
        f.write("""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; padding: 40px; }
                h1 { text-align: center; text-decoration: underline; }
                .bold { font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>FORM OF NOTICE UNDER SECTION 91 Cr.P.C</h1>
            <p><strong>To,</strong><br>
            The Nodal Officer / Legal Compliance Dept.<br>
            {{ vasp_details.vasp_name }}</p>

            <p><strong>Sub:</strong> Notice u/s 91 Cr.P.C for preservation and production of information regarding crypto address <span class="bold">{{ vasp_details.deposit_address }}</span></p>

            <p>It is revealed during the investigation of Case FIR No. <strong>{{ metadata.case_number }}</strong> that stolen cryptocurrency was routed to the deposit address <strong>{{ vasp_details.deposit_address }}</strong> maintained by your exchange.</p>

            <h3>Trace Path:</h3>
            <ul>
                {% for hop in path_traversal %}
                <li>{{ hop }}</li>
                {% endendfor %}
            </ul>

            <h3>Transaction Evidence Log:</h3>
            <table>
                <tr><th>Tx Hash</th><th>Timestamp</th><th>Amount</th><th>Token</th></tr>
                {% for tx in evidence_table %}
                <tr>
                    <td>{{ tx.tx_hash }}</td>
                    <td>{{ tx.timestamp }}</td>
                    <td>{{ tx.amount }}</td>
                    <td>{{ tx.token }}</td>
                </tr>
                {% endfor %}
            </table>

            <p>You are hereby directed to:</p>
            <ol>
                <li>Immediately freeze the said account/wallet.</li>
                <li>Provide KYC details, IP logs, and linked bank accounts.</li>
                <li>Provide complete deposit and withdrawal history.</li>
            </ol>
            <br><br>
            <p>Failure to comply may attract legal proceedings under relevant sections of the law.</p>
            <br>
            <p>Date: {{ metadata.report_date }}</p>
            <p>Investigating Officer</p>
        </body>
        </html>
        """)

env = Environment(
    loader=FileSystemLoader(TEMPLATE_DIR),
    autoescape=select_autoescape(['html', 'xml'])
)

def generate_dossier(metadata: dict, path_traversal: list, evidence_table: list, vasp_details: dict) -> dict:
    """
    Takes case metadata, trace path, evidence, and VASP details to compile a DF dossier.
    Exports as JSON and a signed PDF report using WeasyPrint.
    """
    logger.info("Generating Section 91 PDF Dossier via WeasyPrint", case_number=metadata.get('case_number'))

    # Load Template
    template = env.get_template("section_91_crpc.html")
    
    # Render HTML
    rendered_html = template.render(
        metadata=metadata,
        path_traversal=path_traversal,
        evidence_table=evidence_table,
        vasp_details=vasp_details
    )
    
    # Generate PDF
    pdf_filename = f"dossier_{metadata.get('case_number', 'unknown')}_{uuid.uuid4().hex[:8]}.pdf"
    pdf_path = f"/tmp/{pdf_filename}" # In production, save to S3 or secure volume
    
    # Write to PDF
    HTML(string=rendered_html).write_pdf(pdf_path)
    
    logger.info("PDF generated successfully", path=pdf_path)

    # Return structured JSON payload for NCRP/SAHYOG sync + PDF path
    return {
        "ncrp_sync_payload": {
            "case_metadata": metadata,
            "hop_sequence": path_traversal,
            "evidence": evidence_table,
            "identified_vasp": vasp_details
        },
        "pdf_report_path": pdf_path,
        "status": "GENERATED"
    }
