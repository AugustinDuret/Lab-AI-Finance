// SVG logos for each tool — white icons, rendered on tool.logoBg background
// Used in ResultsCard (UI) and PdfExportButton (PDF via canvas→PNG)

export const LOGOS = {
  copilot: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 20C20 20 8 16 8 8C8 4 11 3 14 5C17 7 20 14 20 20Z" fill="white"/>
    <path d="M20 20C20 20 32 16 32 8C32 4 29 3 26 5C23 7 20 14 20 20Z" fill="white"/>
    <path d="M20 20C20 20 8 24 8 32C8 36 11 37 14 35C17 33 20 26 20 20Z" fill="white" opacity="0.55"/>
    <path d="M20 20C20 20 32 24 32 32C32 36 29 37 26 35C23 33 20 26 20 20Z" fill="white" opacity="0.55"/>
  </svg>`,

  claude: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6C12.3 6 6 12.3 6 20C6 27.7 12.3 34 20 34C25.6 34 30.4 30.6 32.6 25.7C31.3 26.2 29.9 26.5 28.4 26.5C22 26.5 16.8 21.3 16.8 14.9C16.8 11.8 18.1 9 20.2 7C20.1 6.7 20.1 6.3 20 6Z" fill="white"/>
  </svg>`,

  chatgpt: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5L33 12.5L33 27.5L20 35L7 27.5L7 12.5Z" fill="none" stroke="white" stroke-width="2.5"/>
    <path d="M20 13L26.5 16.75L26.5 24.25L20 28L13.5 24.25L13.5 16.75Z" fill="white"/>
  </svg>`,

  gemini: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" fill="white">
    <path d="M20 4C20 4 22.5 15 36 20C22.5 25 20 36 20 36C20 36 17.5 25 4 20C17.5 15 20 4 20 4Z"/>
  </svg>`,

  mistral: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="7" width="11" height="11" rx="1.5" fill="white"/>
    <rect x="22" y="7" width="11" height="11" rx="1.5" fill="white" opacity="0.5"/>
    <rect x="7" y="22" width="11" height="11" rx="1.5" fill="white" opacity="0.5"/>
    <rect x="22" y="22" width="11" height="11" rx="1.5" fill="white"/>
  </svg>`,
};

// Returns a data URL usable in <img src> (React UI)
export const logoDataUrl = (toolId) => {
  const svg = LOGOS[toolId];
  if (!svg) return null;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};

// Converts SVG string -> PNG data URL via canvas (for jsPDF)
export const svgToPng = (svgString, size = 80) => new Promise((resolve) => {
  try {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      canvas.getContext('2d').drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  } catch { resolve(null); }
});
