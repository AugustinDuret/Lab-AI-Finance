import { useState } from 'react'

export default function PdfExportButton({ t }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleExport = async () => {
    setLoading(true);
    setError(false);
    let wrapper = null;
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const source = document.getElementById('results-section');
      if (!source) { setError(true); setLoading(false); return; }

      wrapper = document.createElement('div');
      wrapper.style.cssText = `
        position: fixed; left: -9999px; top: 0; z-index: -1;
        width: 750px; padding: 32px;
        background: #ffffff;
        font-family: Inter, Arial, sans-serif;
        font-size: 14px; color: #1a1a1a;
      `;

      const header = document.createElement('div');
      header.style.cssText = `
        text-align: center; padding-bottom: 20px;
        border-bottom: 2px solid #2D7060; margin-bottom: 28px;
      `;
      header.innerHTML = `
        <div style="font-size:20px;font-weight:800;color:#2D7060;font-family:Arial,sans-serif">
          Lab-AI-Finance
        </div>
        <div style="font-size:12px;color:#555;margin-top:6px">
          Recommandation personnalisée · ${new Date().toLocaleDateString('fr-FR')}
        </div>
        <div style="font-size:11px;color:#888;margin-top:4px">by Augustin Duret</div>
      `;
      wrapper.appendChild(header);

      function resolveStyles(original, clone) {
        if (!(original instanceof HTMLElement)) return;
        const computed = window.getComputedStyle(original);

        const colorMatch = computed.color.match(/\d+/g);
        if (colorMatch) {
          const [r, g, b] = colorMatch.map(Number);
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          clone.style.color = luminance > 180 ? '#1a1a1a' : computed.color;
        }

        const bgMatch = computed.backgroundColor.match(/\d+/g);
        if (bgMatch) {
          const [r, g, b, a] = bgMatch.map(Number);
          if (a === 0 || computed.backgroundColor === 'transparent') {
            clone.style.backgroundColor = 'transparent';
          } else {
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            clone.style.backgroundColor = luminance < 80 ? '#f8f8f8' : computed.backgroundColor;
          }
        }

        clone.style.borderColor = '#e0e0e0';
        clone.style.fontFamily = computed.fontFamily || 'Arial, sans-serif';
        clone.style.fontSize = computed.fontSize;
        clone.style.fontWeight = computed.fontWeight;
        clone.style.lineHeight = computed.lineHeight;
        clone.style.padding = computed.padding;
        clone.style.margin = computed.margin;
        clone.style.borderRadius = computed.borderRadius;

        const origChildren = original.children;
        const cloneChildren = clone.children;
        for (let i = 0; i < origChildren.length; i++) {
          resolveStyles(origChildren[i], cloneChildren[i]);
        }
      }

      const clone = source.cloneNode(true);
      resolveStyles(source, clone);
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      const date = new Date().toISOString().split('T')[0];
      await html2pdf().set({
        margin: [10, 10, 10, 10],
        filename: `lab-ai-finance-${date}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          allowTaint: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(wrapper).save();

      document.body.removeChild(wrapper);
      wrapper = null;

    } catch (e) {
      console.error('PDF error:', e);
      if (wrapper && wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
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
