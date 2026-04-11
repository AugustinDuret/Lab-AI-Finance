import { useState } from 'react';

export default function PdfExportButton({ t }) {
  const [printing, setPrinting] = useState(false);

  const handlePrint = () => {
    setPrinting(true);

    // Afficher le div d'impression, déclencher l'impression, puis cacher
    const printTarget = document.getElementById('print-target');
    if (printTarget) {
      printTarget.style.display = 'block';
    }

    // Délai pour que le navigateur rende le contenu
    setTimeout(() => {
      window.print();
      // Après impression, cacher à nouveau
      setTimeout(() => {
        if (printTarget) {
          printTarget.style.display = 'none';
        }
        setPrinting(false);
      }, 1000);
    }, 200);
  };

  return (
    <button
      onClick={handlePrint}
      disabled={printing}
      style={{
        border: '1px solid var(--border-gold)',
        color: 'var(--australe-gold)',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '13px',
        opacity: printing ? 0.6 : 1,
        cursor: printing ? 'not-allowed' : 'pointer',
        background: 'transparent',
        transition: 'opacity 200ms'
      }}
    >
      {printing ? (t?.exportPdfLoading || 'Génération...') : `↓ ${t?.exportPdf || 'Exporter PDF'}`}
    </button>
  );
}
