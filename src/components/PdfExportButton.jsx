import { useState } from 'react';
import { jsPDF } from 'jspdf';

export default function PdfExportButton({ t, recommendation, answers, lang }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleExport = () => {
    setLoading(true);
    setError(false);

    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W = 210;
      const margin = 16;
      let y = 0;

      // Couleurs Australe
      const GREEN = [45, 112, 96];
      const GOLD = [196, 163, 90];
      const DARK = [10, 17, 14];
      const LIGHT_GRAY = [248, 248, 248];
      const MID_GRAY = [150, 150, 150];
      const TEXT_DARK = [26, 26, 26];

      // Helper : nouvelle page si nécessaire
      const checkPage = (needed = 20) => {
        if (y + needed > 272) {
          doc.addPage();
          drawHeader();
          y = 42;
        }
      };

      // Helper : texte multiligne avec retour à la ligne automatique
      const addText = (text, x, yPos, opts = {}) => {
        const {
          size = 10,
          color = TEXT_DARK,
          bold = false,
          maxWidth = W - margin * 2,
          align = 'left'
        } = opts;
        doc.setFontSize(size);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(String(text), maxWidth);
        doc.text(lines, x, yPos, { align });
        return lines.length * (size * 0.4);
      };

      // Helper : rectangle arrondi (simulé)
      const roundRect = (x, yPos, w, h, color, filled = true) => {
        if (filled) {
          doc.setFillColor(...color);
          doc.roundedRect(x, yPos, w, h, 2, 2, 'F');
        } else {
          doc.setDrawColor(...color);
          doc.roundedRect(x, yPos, w, h, 2, 2, 'S');
        }
      };

      // Header présent sur chaque page
      const drawHeader = () => {
        // Bandeau vert foncé
        doc.setFillColor(...DARK);
        doc.rect(0, 0, W, 28, 'F');

        // Accent vert
        doc.setFillColor(...GREEN);
        doc.rect(0, 26, W, 2, 'F');

        // Logo "AF" dans un carré
        doc.setFillColor(...GREEN);
        doc.roundedRect(margin, 7, 14, 14, 2, 2, 'F');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...GOLD);
        doc.text('AF', margin + 7, 16.5, { align: 'center' });

        // Titre
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(240, 244, 241);
        doc.text('Lab-AI-Finance', margin + 18, 15);

        // Tagline
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...MID_GRAY);
        doc.text(
          lang === 'fr'
            ? 'Recommandation personnalisée · by Augustin Duret'
            : 'Personalised recommendation · by Augustin Duret',
          margin + 18,
          20
        );

        // Date à droite
        const dateStr = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB');
        doc.setFontSize(8);
        doc.setTextColor(...MID_GRAY);
        doc.text(dateStr, W - margin, 15, { align: 'right' });
      };

      // Footer présent sur chaque page
      const drawFooter = () => {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...MID_GRAY);
        doc.setDrawColor(...MID_GRAY);
        doc.line(margin, 284, W - margin, 284);
        doc.text('lab-ai-finance-production.up.railway.app', W / 2, 289, { align: 'center' });
      };

      // ─── PAGE 1 ───────────────────────────────────────────────

      drawHeader();
      y = 38;

      // Titre principal
      const h1 = addText(
        lang === 'fr' ? 'Votre recommandation personnalisée' : 'Your personalised recommendation',
        margin, y,
        { size: 16, bold: true, color: TEXT_DARK }
      );
      y += h1 + 8;

      // Tags profil utilisateur
      const tags = [];
      if (answers?.functions?.length > 0) tags.push(answers.functions.slice(0, 2).join(', '));
      if (answers?.ecosystem && answers.ecosystem !== 'unknown') {
        tags.push(answers.ecosystem === 'microsoft365' ? 'Microsoft 365'
          : answers.ecosystem === 'google' ? 'Google Workspace' : 'Mixte');
      }
      if (answers?.sector) tags.push(answers.sector);

      if (tags.length > 0) {
        let tagX = margin;
        tags.forEach(tag => {
          const tagW = tag.length * 1.8 + 6;
          roundRect(tagX, y, tagW, 6, [224, 240, 236]);
          doc.setFontSize(7);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...GREEN);
          doc.text(tag, tagX + tagW / 2, y + 4.2, { align: 'center' });
          tagX += tagW + 3;
        });
        y += 12;
      }

      // ─── OUTIL RECOMMANDÉ ────────────────────────────────────

      if (recommendation?.primary) {
        const primary = recommendation.primary;
        const toolNames = {
          copilot: 'Microsoft Copilot',
          claude: 'Claude (Anthropic)',
          chatgpt: 'ChatGPT (OpenAI)',
          gemini: 'Google Gemini',
          mistral: 'Mistral AI'
        };
        const toolName = toolNames[primary.toolId] || primary.toolId;

        // Card principale avec bordure gold
        checkPage(80);
        roundRect(margin, y, W - margin * 2, 4, GOLD);
        y += 5;

        // Badge "Recommandé"
        roundRect(margin, y, 32, 6, GOLD);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(lang === 'fr' ? '\u2726 RECOMMANDE' : '\u2726 RECOMMENDED', margin + 16, y + 4.2, { align: 'center' });
        y += 10;

        // Nom de l'outil
        const h2 = addText(toolName, margin, y, { size: 18, bold: true, color: TEXT_DARK });
        y += h2 + 8;

        // Séparateur
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, y, W - margin, y);
        y += 8;

        // Pourquoi cet outil
        const whyTitle = addText(
          lang === 'fr' ? 'Pourquoi cet outil pour votre equipe' : 'Why this tool for your team',
          margin, y,
          { size: 9, bold: true, color: MID_GRAY }
        );
        y += whyTitle + 5;

        const reasons = primary.whyThisTool || [];
        reasons.forEach(reason => {
          checkPage(12);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...GREEN);
          doc.text('\u2713', margin + 2, y);
          const rh = addText(reason, margin + 7, y, { size: 8, color: TEXT_DARK, maxWidth: W - margin * 2 - 10 });
          y += Math.max(rh + 4, 6);
        });

        y += 4;

        // Points de vigilance
        checkPage(20);
        const vigTitle = addText(
          lang === 'fr' ? 'Points de vigilance' : 'Watch out for',
          margin, y,
          { size: 9, bold: true, color: MID_GRAY }
        );
        y += vigTitle + 5;

        const limitations = primary.limitations || [];
        limitations.forEach(lim => {
          checkPage(12);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...GOLD);
          doc.text('\u26A0', margin + 2, y);
          const lh = addText(lim, margin + 7, y, { size: 8, color: TEXT_DARK, maxWidth: W - margin * 2 - 10 });
          y += Math.max(lh + 4, 6);
        });

        y += 6;

        // Tâches sélectionnées
        if (answers?.selectedTasks?.length > 0) {
          checkPage(24);
          doc.setDrawColor(220, 220, 220);
          doc.line(margin, y, W - margin, y);
          y += 8;

          const taskTitle = addText(
            lang === 'fr' ? 'Vos taches prioritaires' : 'Your priority tasks',
            margin, y,
            { size: 9, bold: true, color: MID_GRAY }
          );
          y += taskTitle + 5;

          let tagXt = margin;
          answers.selectedTasks.forEach(taskId => {
            const label = taskId.replace(/_/g, ' ');
            const tw = Math.min(label.length * 1.6 + 6, 70);
            if (tagXt + tw > W - margin) {
              tagXt = margin;
              y += 8;
            }
            checkPage(10);
            roundRect(tagXt, y, tw, 6, LIGHT_GRAY);
            doc.setDrawColor(220, 220, 220);
            doc.roundedRect(tagXt, y, tw, 6, 1, 1, 'S');
            doc.setFontSize(6.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(label, tagXt + tw / 2, y + 4, { align: 'center' });
            tagXt += tw + 3;
          });
          y += 12;
        }

        // ─── ALTERNATIVE ────────────────────────────────────────

        if (recommendation.secondary) {
          checkPage(30);
          doc.setDrawColor(220, 220, 220);
          doc.line(margin, y, W - margin, y);
          y += 8;

          const altName = toolNames[recommendation.secondary.toolId] || recommendation.secondary.toolId;
          const altTitle = addText(
            lang === 'fr' ? `Alternative solide : ${altName}` : `Strong alternative: ${altName}`,
            margin, y,
            { size: 11, bold: true, color: TEXT_DARK }
          );
          y += altTitle + 5;

          const altReasons = recommendation.secondary.whyThisTool || [];
          altReasons.slice(0, 2).forEach(reason => {
            checkPage(10);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...GREEN);
            doc.text('\u2713', margin + 2, y);
            const ah = addText(reason, margin + 7, y, { size: 8, color: TEXT_DARK, maxWidth: W - margin * 2 - 10 });
            y += Math.max(ah + 4, 6);
          });
        }

        y += 8;

        // ─── PROMPTS ────────────────────────────────────────────

        if (primary.prompts?.length > 0) {
          checkPage(30);
          doc.setDrawColor(220, 220, 220);
          doc.line(margin, y, W - margin, y);
          y += 8;

          const promptTitle = addText(
            lang === 'fr' ? 'Prompts pour demarrer' : 'Prompts to get started',
            margin, y,
            { size: 11, bold: true, color: TEXT_DARK }
          );
          y += promptTitle + 6;

          primary.prompts.slice(0, 2).forEach(prompt => {
            checkPage(35);
            const promptText = lang === 'fr' ? (prompt.promptFr || '') : (prompt.promptEn || '');
            const labelText = lang === 'fr' ? (prompt.labelFr || prompt.taskLabel || '') : (prompt.labelEn || prompt.taskLabel || '');

            roundRect(margin, y, W - margin * 2, 6, [240, 248, 245]);
            doc.setFontSize(7.5);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...GREEN);
            doc.text(labelText, margin + 3, y + 4.2);
            y += 8;

            const ph = addText(
              promptText.substring(0, 400) + (promptText.length > 400 ? '...' : ''),
              margin + 2, y,
              { size: 7.5, color: [80, 80, 80], maxWidth: W - margin * 2 - 4 }
            );
            y += ph + 8;
          });
        }
      }

      // ─── PIED DE PAGE sur toutes les pages ───────────────────

      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawFooter();
      }

      // ─── TÉLÉCHARGEMENT ──────────────────────────────────────

      const date = new Date().toISOString().split('T')[0];
      doc.save(`lab-ai-finance-${date}.pdf`);

    } catch (e) {
      console.error('PDF error:', e);
      setError(true);
    }

    setLoading(false);
  };

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={loading}
        style={{
          border: '1px solid var(--border-gold)',
          color: 'var(--australe-gold)',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '13px',
          opacity: loading ? 0.6 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
          background: 'transparent',
          transition: 'opacity 200ms'
        }}
      >
        {loading
          ? (t?.exportPdfLoading || 'Génération...')
          : `\u2193 ${t?.exportPdf || 'Exporter PDF'}`}
      </button>
      {error && (
        <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
          {t?.exportPdfError || 'Export indisponible, veuillez réessayer.'}
        </p>
      )}
    </div>
  );
}
