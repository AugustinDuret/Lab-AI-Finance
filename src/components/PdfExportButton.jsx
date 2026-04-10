import { useState } from 'react'

export default function PdfExportButton({ t }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleExport = async () => {
    setLoading(true);
    setError(false);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('results-section');

      if (!element) {
        console.error('results-section not found');
        setError(true);
        setLoading(false);
        return;
      }

      // Forcer le fond blanc et les couleurs lisibles via une feuille de style injectée
      const style = document.createElement('style');
      style.id = 'pdf-override-style';
      style.textContent = `
        #results-section, #results-section * {
          color: #1a1a1a !important;
          background-color: transparent !important;
          border-color: #e0e0e0 !important;
        }
        #results-section {
          background-color: #ffffff !important;
          padding: 20px !important;
        }
      `;
      document.head.appendChild(style);

      const date = new Date().toISOString().split('T')[0];
      const opt = {
        margin: [15, 15, 15, 15],
        filename: `lab-ai-finance-${date}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          allowTaint: true,
          foreignObjectRendering: false
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        }
      };

      await html2pdf().set(opt).from(element).save();

      // Nettoyer le style injecté
      document.getElementById('pdf-override-style')?.remove();

    } catch (e) {
      console.error('PDF export error:', e);
      document.getElementById('pdf-override-style')?.remove();
      setError(true);
    }
    setLoading(false);
  }

  return (
    <div>
      <button onClick={handleExport} disabled={loading}
        style={{
          border: '1px solid var(--border-gold)',
          color: 'var(--australe-gold)',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '13px',
          opacity: loading ? 0.6 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
        className="transition-opacity hover:opacity-80">
        {loading ? t.exportPdfLoading : `\u2193 ${t.exportPdf}`}
      </button>
      {error && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{t.exportPdfError}</p>}
    </div>
  )
}
