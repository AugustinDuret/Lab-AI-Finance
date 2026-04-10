import { useState } from 'react'

export default function PdfExportButton({ t }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    setError(false)
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const element = document.getElementById('results-section')
      if (!element) throw new Error('results-section not found')

      // Cloner l'element pour ne pas modifier le DOM visible
      const clone = element.cloneNode(true)
      clone.style.cssText = `
        background: #ffffff;
        color: #1a1a1a;
        padding: 24px;
        font-family: Arial, sans-serif;
        max-width: 800px;
      `

      // Remplacer toutes les couleurs CSS variables par des valeurs concretes
      const allElements = clone.querySelectorAll('*')
      allElements.forEach(el => {
        const computed = window.getComputedStyle(el)

        // Forcer les couleurs de texte lisibles sur fond blanc
        const color = computed.color
        const bg = computed.backgroundColor

        // Remplacer les fonds sombres par blanc/gris tres clair
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          const rgb = bg.match(/\d+/g)
          if (rgb) {
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000
            if (brightness < 128) {
              el.style.backgroundColor = '#f8f9fa'
            }
          }
        }

        // Remplacer les textes clairs par du texte sombre
        if (color) {
          const rgb = color.match(/\d+/g)
          if (rgb) {
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000
            if (brightness > 180) {
              el.style.color = '#1a1a1a'
            }
          }
        }

        // Adapter les bordures
        if (el.style.border && el.style.border.includes('rgba')) {
          el.style.border = '1px solid #e0e0e0'
        }
        if (el.style.borderColor && el.style.borderColor.includes('rgba')) {
          el.style.borderColor = '#e0e0e0'
        }
      })

      // Ajouter un header PDF
      const header = document.createElement('div')
      header.style.cssText = `
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #2D7060;
        margin-bottom: 24px;
      `
      header.innerHTML = `
        <div style="font-size: 20px; font-weight: 800; color: #2D7060; font-family: Arial;">Lab-AI-Finance</div>
        <div style="font-size: 12px; color: #666; margin-top: 4px;">Recommandation personnalis\u00e9e - ${new Date().toLocaleDateString('fr-FR')}</div>
        <div style="font-size: 11px; color: #999; margin-top: 4px;">by Augustin Duret</div>
      `
      clone.insertBefore(header, clone.firstChild)

      // Ajouter temporairement au DOM (cache) pour le rendu
      clone.style.position = 'fixed'
      clone.style.left = '-9999px'
      clone.style.top = '0'
      document.body.appendChild(clone)

      const date = new Date().toISOString().split('T')[0]
      const opt = {
        margin: [15, 15, 15, 15],
        filename: `lab-ai-finance-${date}.pdf`,
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      await html2pdf().set(opt).from(clone).save()
      document.body.removeChild(clone)

    } catch (e) {
      console.error('PDF export error:', e)
      setError(true)
    }
    setLoading(false)
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
