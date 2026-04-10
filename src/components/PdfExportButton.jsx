import { useState } from 'react'

export default function PdfExportButton({ t }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleExport = async () => {
    setLoading(true);
    setError(false);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const source = document.getElementById('results-section');
      if (!source) { setError(true); setLoading(false); return; }

      // Créer un conteneur temporaire hors écran
      const container = document.createElement('div');
      container.style.cssText = `
        position: fixed; left: -9999px; top: 0;
        width: 800px; background: #ffffff;
        font-family: Inter, Arial, sans-serif;
        color: #1a1a1a; padding: 32px;
      `;

      // Cloner le contenu
      const clone = source.cloneNode(true);

      // Appliquer récursivement des styles lisibles sur fond blanc
      function applyPdfStyles(el) {
        if (!(el instanceof HTMLElement)) return;

        // Forcer fond blanc et texte sombre sur tous les éléments
        el.style.backgroundColor = '#ffffff';
        el.style.color = '#1a1a1a';
        el.style.borderColor = '#e0e0e0';

        // Exceptions : badges colorés
        if (el.tagName === 'SPAN' && el.textContent.includes('✦')) {
          el.style.backgroundColor = '#C4A35A';
          el.style.color = '#ffffff';
          el.style.borderRadius = '20px';
          el.style.padding = '3px 12px';
          el.style.fontSize = '11px';
        }
        if (el.textContent.includes('RGPD') || el.textContent.includes('GDPR')) {
          el.style.color = '#2D7060';
          el.style.backgroundColor = '#e8f4f1';
          el.style.borderRadius = '12px';
          el.style.padding = '3px 10px';
        }
        if (el.textContent.includes('PROMPT')) {
          el.style.color = '#C4A35A';
          el.style.backgroundColor = '#fdf8ee';
          el.style.borderRadius = '6px';
          el.style.padding = '2px 8px';
        }
        if (el.textContent === '✓' && el.tagName === 'SPAN') {
          el.style.color = '#2D7060';
          el.style.backgroundColor = 'transparent';
        }
        if (el.textContent === '⚠') {
          el.style.color = '#C4A35A';
          el.style.backgroundColor = 'transparent';
        }

        // Sections et cards : fond très légèrement gris pour différencier
        if (el.tagName === 'DIV' && el.children.length > 2) {
          el.style.backgroundColor = '#fafafa';
          el.style.border = '1px solid #e8e8e8';
          el.style.borderRadius = '8px';
          el.style.marginBottom = '12px';
        }

        Array.from(el.children).forEach(applyPdfStyles);
      }

      applyPdfStyles(clone);

      // Header PDF
      const header = document.createElement('div');
      header.style.cssText = `
        text-align: center; padding-bottom: 20px;
        border-bottom: 2px solid #2D7060; margin-bottom: 28px;
      `;
      header.innerHTML = `
        <div style="font-size:20px;font-weight:800;color:#2D7060;font-family:Arial">Lab-AI-Finance</div>
        <div style="font-size:12px;color:#666;margin-top:4px">
          Recommandation personnalisée - ${new Date().toLocaleDateString('fr-FR')}
        </div>
        <div style="font-size:11px;color:#999;margin-top:3px">by Augustin Duret</div>
      `;
      clone.insertBefore(header, clone.firstChild);

      container.appendChild(clone);
      document.body.appendChild(container);

      const date = new Date().toISOString().split('T')[0];
      await html2pdf().set({
        margin: [15, 15, 15, 15],
        filename: `lab-ai-finance-${date}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(container).save();

      document.body.removeChild(container);

    } catch (e) {
      console.error('PDF error:', e);
      document.querySelectorAll('[data-pdf-container]').forEach(el => el.remove());
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
