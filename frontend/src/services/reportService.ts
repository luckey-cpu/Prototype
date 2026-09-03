import { api } from './api';

export class ReportService {
  async downloadPDF(caseId: string, investigatorName?: string): Promise<boolean> {
    const blob = await api.downloadReportPDF(caseId, investigatorName);
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BLUCE_LOCK_REPORT_${caseId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    }
    return false;
  }

  printReport(): void {
    window.print();
  }

  exportJSON(data: any, filename: string): void {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${filename}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
}

export const reportService = new ReportService();
