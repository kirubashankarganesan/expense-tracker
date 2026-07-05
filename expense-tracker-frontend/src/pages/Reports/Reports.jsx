import { useState } from "react";
import { toast } from "react-toastify";
import AppShell from "../../components/AppShell/AppShell";
import api from "../../services/api";

function Reports() {
  const [downloading, setDownloading] = useState("");

  const downloadReport = async (type) => {
    try {
      setDownloading(type);

      const response = await api.get(`/reports/${type}`, {
        responseType: "blob",
      });

      const extension = type === "pdf" ? "pdf" : "xlsx";
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.download = `Expense_Report.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`${type.toUpperCase()} downloaded`);
    } catch (error) {
      console.error(error);
      toast.error(`${type.toUpperCase()} download failed`);
    } finally {
      setDownloading("");
    }
  };

  return (
    <AppShell>
      <main className="app-page">
        <header className="app-page-header">
          <div>
            <span className="app-page-kicker">Exports</span>
            <h1>Reports</h1>
            <p>
              Download your expense data in shareable PDF or spreadsheet format.
            </p>
          </div>
        </header>

        <section className="app-card">
          <div className="report-grid">
            <article className="report-card">
              <h2>PDF Report</h2>
              <p>Best for printing, sharing, and quick review.</p>
              <button
                className="btn btn-danger"
                disabled={downloading === "pdf"}
                onClick={() => downloadReport("pdf")}
                type="button"
              >
                {downloading === "pdf" ? "Downloading..." : "Download PDF"}
              </button>
            </article>

            <article className="report-card">
              <h2>Excel Report</h2>
              <p>Best for filtering, formulas, and deeper analysis.</p>
              <button
                className="btn btn-success"
                disabled={downloading === "excel"}
                onClick={() => downloadReport("excel")}
                type="button"
              >
                {downloading === "excel" ? "Downloading..." : "Download Excel"}
              </button>
            </article>
          </div>
        </section>
      </main>
    </AppShell>
  );
}

export default Reports;
