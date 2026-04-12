import { useState } from 'react';
import { TOOLS } from '../data/tools.js';
import { TASKS_BY_ID } from '../data/tasks.js';
import { getPromptsForTasks } from '../data/prompts.js';

// Remplace les caractères hors latin-1 pour compatibilité jsPDF (encodage helvetica)
const sanitize = (str) =>
  String(str || '')
    .replace(/€/g, 'EUR')
    .replace(/£/g, 'GBP')
    .replace(/[•·]/g, '-')
    .replace(/[✓✔]/g, 'v')
    .replace(/[⚠⚡]/g, '!')
    .replace(/[✦✧★☆◆]/g, '*')
    .replace(/[""«»]/g, '"')
    .replace(/[''`]/g, "'")
    .replace(/–—/g, '-')
    .replace(/…/g, '...')
    .replace(/[^\x00-\xFF]/g, '?');

export default function PdfExportButton({ t, recommendation, answers, lang }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    setError(false);

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W = 210;
      const margin = 16;
      let y = 0;

      // Couleurs Australe
      const GREEN     = [45, 112, 96];
      const GOLD      = [196, 163, 90];
      const DARK      = [10, 17, 14];
      const LIGHT_BG  = [240, 248, 245];
      const MID_GRAY  = [150, 150, 150];
      const TEXT_DARK = [26, 26, 26];

      // ── Helpers ──────────────────────────────────────────────────

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
        const safe = sanitize(text);
        const lines = doc.splitTextToSize(safe, maxWidth);
        doc.text(lines, x, yPos, { align });
        return lines.length * (size * 0.45);
      };

      const checkPage = (needed = 20) => {
        if (y + needed > 272) {
          doc.addPage();
          drawHeader();
          y = 42;
        }
      };

      // ── Header (répété sur chaque page) ──────────────────────────

      const drawHeader = () => {
        doc.setFillColor(...DARK);
        doc.rect(0, 0, W, 28, 'F');
        doc.setFillColor(...GREEN);
        doc.rect(0, 26, W, 2, 'F');

        // Carré AF
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
            ? 'Recommandation personnalisee - by Augustin Duret'
            : 'Personalised recommendation - by Augustin Duret',
          margin + 18, 20
        );

        // Date
        const dateStr = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB');
        doc.setFontSize(8);
        doc.setTextColor(...MID_GRAY);
        doc.text(dateStr, W - margin, 15, { align: 'right' });
      };

      // ── Footer ───────────────────────────────────────────────────

      const drawFooter = () => {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...MID_GRAY);
        doc.setDrawColor(...MID_GRAY);
        doc.line(margin, 284, W - margin, 284);
        doc.text('lab-ai-finance-production.up.railway.app', W / 2, 289, { align: 'center' });
      };

      // ── Données moteur ───────────────────────────────────────────

      const primary   = recommendation?.primary   || null;
      const secondary = recommendation?.secondary || null;

      const toolNames = {
        copilot: 'Microsoft Copilot',
        claude:  'Claude (Anthropic)',
        chatgpt: 'ChatGPT (OpenAI)',
        gemini:  'Google Gemini',
        mistral: 'Mistral AI',
      };

      // ── PAGE 1 ───────────────────────────────────────────────────

      drawHeader();
      y = 38;

      // Titre principal
      y += addText(
        lang === 'fr' ? 'Votre recommandation personnalisee' : 'Your personalised recommendation',
        margin, y,
        { size: 16, bold: true, color: TEXT_DARK }
      ) + 8;

      // Tags profil
      const tags = [];
      if (answers?.functions?.length > 0) tags.push(answers.functions.slice(0, 2).join(', '));
      if (answers?.ecosystem && answers.ecosystem !== 'unknown') {
        tags.push(
          answers.ecosystem === 'microsoft365' ? 'Microsoft 365'
            : answers.ecosystem === 'google' ? 'Google Workspace'
            : lang === 'fr' ? 'Mixte' : 'Mixed'
        );
      }
      if (answers?.sector) tags.push(sanitize(answers.sector));
      if (answers?.budget) tags.push(
        answers.budget === 'free'
          ? (lang === 'fr' ? 'Version gratuite' : 'Free plan')
          : (lang === 'fr' ? 'Pret a payer' : 'Ready to pay')
      );

      if (tags.length > 0) {
        let tagX = margin;
        tags.forEach(tag => {
          const tagW = Math.min(tag.length * 1.75 + 8, 80);
          doc.setFillColor(224, 240, 236);
          doc.roundedRect(tagX, y, tagW, 6, 1, 1, 'F');
          doc.setFontSize(7);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...GREEN);
          doc.text(sanitize(tag), tagX + tagW / 2, y + 4.2, { align: 'center' });
          tagX += tagW + 3;
          if (tagX > W - margin - 20) { tagX = margin; y += 8; }
        });
        y += 10;
      }

      // ── OUTIL RECOMMANDÉ ─────────────────────────────────────────

      if (primary) {
        const toolId   = primary.toolId;
        const toolData = TOOLS[toolId] || {};
        const toolName = toolNames[toolId] || toolId;

        // Sources de données correctes : TOOLS, pas le moteur
        const whyReasons = (lang === 'fr' ? toolData.whyFr : toolData.whyEn) || [];
        const vigilance  = (lang === 'fr' ? toolData.vigilanceFr : toolData.vigilanceEn) || [];
        const budgetInfo = sanitize(lang === 'fr' ? toolData.budgetFr : toolData.budgetEn);

        // Prompts depuis la promptothèque
        const taskIds = (primary.taskDetails || []).map(td => td.taskId);
        const prompts = getPromptsForTasks(taskIds, lang, 2);

        checkPage(80);

        // Barre gold
        doc.setFillColor(...GOLD);
        doc.rect(margin, y, W - margin * 2, 2, 'F');
        y += 4;

        // Badge "Recommandé"
        doc.setFillColor(...GOLD);
        doc.roundedRect(margin, y, 38, 6, 1, 1, 'F');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(
          lang === 'fr' ? '> RECOMMANDE' : '> RECOMMENDED',
          margin + 19, y + 4.2, { align: 'center' }
        );
        y += 10;

        // Nom de l'outil
        y += addText(toolName, margin, y, { size: 18, bold: true, color: TEXT_DARK }) + 3;

        // Score
        y += addText(
          `${lang === 'fr' ? "Score d'adequation" : 'Fit score'} : ${primary.score}/100`,
          margin, y, { size: 9, color: MID_GRAY }
        ) + 8;

        doc.setDrawColor(220, 220, 220);
        doc.line(margin, y, W - margin, y);
        y += 8;

        // Pourquoi cet outil
        if (whyReasons.length > 0) {
          y += addText(
            lang === 'fr' ? 'Pourquoi cet outil pour votre equipe' : 'Why this tool for your team',
            margin, y, { size: 9, bold: true, color: MID_GRAY }
          ) + 5;

          whyReasons.forEach(reason => {
            checkPage(14);
            // Préfixe ASCII (pas de checkmark Unicode)
            const lineH = addText(
              'v  ' + sanitize(reason),
              margin + 2, y,
              { size: 8, color: TEXT_DARK, maxWidth: W - margin * 2 - 4 }
            );
            // Colorier le "v" en vert
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...GREEN);
            doc.text('v', margin + 2, y);
            y += Math.max(lineH + 4, 7);
          });
          y += 4;
        }

        // Points de vigilance
        if (vigilance.length > 0) {
          checkPage(20);
          y += addText(
            lang === 'fr' ? 'Points de vigilance' : 'Watch out for',
            margin, y, { size: 9, bold: true, color: MID_GRAY }
          ) + 5;

          vigilance.forEach(v => {
            checkPage(14);
            const lineH = addText(
              '!  ' + sanitize(v),
              margin + 2, y,
              { size: 8, color: TEXT_DARK, maxWidth: W - margin * 2 - 4 }
            );
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...GOLD);
            doc.text('!', margin + 2, y);
            y += Math.max(lineH + 4, 7);
          });
          y += 4;
        }

        // Budget / tarifs
        if (budgetInfo) {
          checkPage(16);
          doc.setFillColor(...LIGHT_BG);
          doc.roundedRect(margin, y, W - margin * 2, 14, 2, 2, 'F');
          doc.setFontSize(7.5);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...MID_GRAY);
          doc.text(
            lang === 'fr' ? 'Acces & tarifs' : 'Access & pricing',
            margin + 3, y + 5
          );
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...TEXT_DARK);
          doc.text(budgetInfo, margin + 3, y + 10.5);
          y += 18;
        }

        // Tâches sélectionnées
        if (answers?.selectedTasks?.length > 0) {
          checkPage(28);
          doc.setDrawColor(220, 220, 220);
          doc.line(margin, y, W - margin, y);
          y += 8;

          y += addText(
            lang === 'fr' ? 'Vos taches prioritaires' : 'Your priority tasks',
            margin, y, { size: 9, bold: true, color: MID_GRAY }
          ) + 5;

          let tagXt = margin;
          answers.selectedTasks.forEach(taskId => {
            const task = TASKS_BY_ID[taskId];
            const label = sanitize(
              (lang === 'fr' ? task?.labelFr : task?.labelEn) || taskId.replace(/_/g, ' ')
            );
            const tw = Math.min(label.length * 1.5 + 8, 74);
            if (tagXt + tw > W - margin) { tagXt = margin; y += 9; }
            checkPage(10);
            doc.setFillColor(240, 240, 240);
            doc.roundedRect(tagXt, y, tw, 6, 1, 1, 'F');
            doc.setFontSize(6.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);
            doc.text(label, tagXt + tw / 2, y + 4, { align: 'center' });
            tagXt += tw + 3;
          });
          y += 12;
        }

        // Alternative
        if (secondary) {
          checkPage(32);
          doc.setDrawColor(220, 220, 220);
          doc.line(margin, y, W - margin, y);
          y += 8;

          const altData = TOOLS[secondary.toolId] || {};
          const altName = toolNames[secondary.toolId] || secondary.toolId;
          const altWhy  = (lang === 'fr' ? altData.whyFr : altData.whyEn) || [];

          y += addText(
            lang === 'fr' ? `Alternative solide : ${altName}` : `Strong alternative: ${altName}`,
            margin, y, { size: 11, bold: true, color: TEXT_DARK }
          ) + 5;

          altWhy.slice(0, 2).forEach(reason => {
            checkPage(12);
            const lineH = addText(
              'v  ' + sanitize(reason),
              margin + 2, y,
              { size: 8, color: TEXT_DARK, maxWidth: W - margin * 2 - 4 }
            );
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...GREEN);
            doc.text('v', margin + 2, y);
            y += Math.max(lineH + 4, 7);
          });
          y += 6;
        }

        // Prompts
        if (prompts.length > 0) {
          checkPage(40);
          doc.setDrawColor(220, 220, 220);
          doc.line(margin, y, W - margin, y);
          y += 8;

          y += addText(
            lang === 'fr' ? 'Prompts pour demarrer' : 'Prompts to get started',
            margin, y, { size: 11, bold: true, color: TEXT_DARK }
          ) + 6;

          prompts.slice(0, 2).forEach(prompt => {
            checkPage(40);
            const label = sanitize(lang === 'fr' ? prompt.labelFr : prompt.labelEn);
            const text  = sanitize(lang === 'fr' ? prompt.promptFr : prompt.promptEn);
            const excerpt = text.substring(0, 380) + (text.length > 380 ? '...' : '');

            doc.setFillColor(...LIGHT_BG);
            doc.roundedRect(margin, y, W - margin * 2, 6, 1, 1, 'F');
            doc.setFontSize(7.5);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...GREEN);
            doc.text(label, margin + 3, y + 4.2);
            y += 8;

            y += addText(excerpt, margin + 2, y, {
              size: 7.5,
              color: [80, 80, 80],
              maxWidth: W - margin * 2 - 4
            }) + 8;
          });
        }
      }

      // ── FOOTERS sur toutes les pages ──────────────────────────────

      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawFooter();
      }

      // ── TÉLÉCHARGEMENT ────────────────────────────────────────────

      const date = new Date().toISOString().split('T')[0];
      doc.save(`lab-ai-finance-${date}.pdf`);

    } catch (e) {
      // Toujours logger l'erreur (pas uniquement en DEV)
      console.error('[PdfExportButton] Erreur export PDF:', e);
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
          ? (t?.exportPdfLoading || 'Generation...')
          : `\u2193 ${t?.exportPdf || 'Exporter PDF'}`}
      </button>
      {error && (
        <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
          {t?.exportPdfError || 'Export indisponible, veuillez reessayer.'}
        </p>
      )}
    </div>
  );
}
