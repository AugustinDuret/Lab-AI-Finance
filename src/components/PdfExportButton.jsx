import { useState } from 'react';
import { TOOLS } from '../data/tools.js';
import { TASKS_BY_ID } from '../data/tasks.js';
import { getPromptsForTasks } from '../data/prompts.js';

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

      // ── Helpers ──────────────────────────────────────────────

      const checkPage = (needed = 20) => {
        if (y + needed > 272) {
          doc.addPage();
          drawHeader();
          y = 42;
        }
      };

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
        const lines = doc.splitTextToSize(String(text || ''), maxWidth);
        doc.text(lines, x, yPos, { align });
        return lines.length * (size * 0.4);
      };

      const roundRect = (x, yPos, w, h, color, filled = true) => {
        if (filled) {
          doc.setFillColor(...color);
          doc.roundedRect(x, yPos, w, h, 2, 2, 'F');
        } else {
          doc.setDrawColor(...color);
          doc.roundedRect(x, yPos, w, h, 2, 2, 'S');
        }
      };

      // ── Header (répété sur chaque page) ──────────────────────

      const drawHeader = () => {
        doc.setFillColor(...DARK);
        doc.rect(0, 0, W, 28, 'F');
        doc.setFillColor(...GREEN);
        doc.rect(0, 26, W, 2, 'F');

        // Logo AF
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
            ? 'Recommandation personnalisee · by Augustin Duret'
            : 'Personalised recommendation · by Augustin Duret',
          margin + 18, 20
        );

        // Date
        const dateStr = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB');
        doc.setFontSize(8);
        doc.setTextColor(...MID_GRAY);
        doc.text(dateStr, W - margin, 15, { align: 'right' });
      };

      // ── Footer ───────────────────────────────────────────────

      const drawFooter = () => {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...MID_GRAY);
        doc.setDrawColor(...MID_GRAY);
        doc.line(margin, 284, W - margin, 284);
        doc.text('lab-ai-finance-production.up.railway.app', W / 2, 289, { align: 'center' });
      };

      // ── Données du moteur ─────────────────────────────────────

      const primary   = recommendation?.primary   || null;
      const secondary = recommendation?.secondary || null;

      const toolNames = {
        copilot: 'Microsoft Copilot',
        claude:  'Claude (Anthropic)',
        chatgpt: 'ChatGPT (OpenAI)',
        gemini:  'Google Gemini',
        mistral: 'Mistral AI',
      };

      // ── PAGE 1 ────────────────────────────────────────────────

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
        tags.push(answers.ecosystem === 'microsoft365' ? 'Microsoft 365'
          : answers.ecosystem === 'google' ? 'Google Workspace'
          : lang === 'fr' ? 'Mixte' : 'Mixed');
      }
      if (answers?.sector)  tags.push(answers.sector);
      if (answers?.budget)  tags.push(answers.budget === 'free'
        ? (lang === 'fr' ? 'Version gratuite' : 'Free plan')
        : (lang === 'fr' ? 'Pret a payer' : 'Ready to pay'));

      if (tags.length > 0) {
        let tagX = margin;
        tags.forEach(tag => {
          const tagW = tag.length * 1.75 + 7;
          roundRect(tagX, y, tagW, 6, [224, 240, 236]);
          doc.setFontSize(7);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...GREEN);
          doc.text(tag, tagX + tagW / 2, y + 4.2, { align: 'center' });
          tagX += tagW + 3;
        });
        y += 12;
      }

      // ── OUTIL RECOMMANDÉ ──────────────────────────────────────

      if (primary) {
        const toolId   = primary.toolId;
        const toolData = TOOLS[toolId] || {};
        const toolName = toolNames[toolId] || toolId;

        // why et vigilance viennent de TOOLS (pas du moteur)
        const whyReasons = (lang === 'fr' ? toolData.whyFr : toolData.whyEn) || [];
        const vigilance  = (lang === 'fr' ? toolData.vigilanceFr : toolData.vigilanceEn) || [];
        const budgetInfo = (lang === 'fr' ? toolData.budgetFr : toolData.budgetEn) || '';

        // Prompts depuis la promptothèque
        const selectedTaskIds = (primary.taskDetails || []).map(td => td.taskId);
        const prompts = getPromptsForTasks(selectedTaskIds, lang, 2);

        // Bandeau gold + badge
        checkPage(90);
        roundRect(margin, y, W - margin * 2, 3, GOLD);
        y += 5;

        roundRect(margin, y, 34, 6, GOLD);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(
          lang === 'fr' ? '\u2726 RECOMMANDE' : '\u2726 RECOMMENDED',
          margin + 17, y + 4.2, { align: 'center' }
        );
        y += 10;

        // Nom + score
        y += addText(toolName, margin, y, { size: 18, bold: true, color: TEXT_DARK }) + 4;
        y += addText(
          `${lang === 'fr' ? 'Score d\'adequation' : 'Fit score'} : ${primary.score}/100`,
          margin, y, { size: 9, color: MID_GRAY }
        ) + 8;

        doc.setDrawColor(220, 220, 220);
        doc.line(margin, y, W - margin, y);
        y += 8;

        // Pourquoi cet outil
        y += addText(
          lang === 'fr' ? 'Pourquoi cet outil pour votre equipe' : 'Why this tool for your team',
          margin, y, { size: 9, bold: true, color: MID_GRAY }
        ) + 5;

        whyReasons.forEach(reason => {
          checkPage(12);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...GREEN);
          doc.text('\u2713', margin + 2, y);
          y += Math.max(
            addText(reason, margin + 8, y, { size: 8, color: TEXT_DARK, maxWidth: W - margin * 2 - 10 }) + 4,
            6
          );
        });
        y += 4;

        // Points de vigilance
        checkPage(20);
        y += addText(
          lang === 'fr' ? 'Points de vigilance' : 'Watch out for',
          margin, y, { size: 9, bold: true, color: MID_GRAY }
        ) + 5;

        vigilance.forEach(v => {
          checkPage(12);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...GOLD);
          doc.text('\u26A0', margin + 2, y);
          y += Math.max(
            addText(v, margin + 8, y, { size: 8, color: TEXT_DARK, maxWidth: W - margin * 2 - 10 }) + 4,
            6
          );
        });
        y += 4;

        // Budget
        if (budgetInfo) {
          checkPage(14);
          roundRect(margin, y, W - margin * 2, 12, LIGHT_BG);
          doc.setFontSize(7.5);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...MID_GRAY);
          doc.text(lang === 'fr' ? 'Acces & tarifs' : 'Access & pricing', margin + 3, y + 5);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...TEXT_DARK);
          doc.text(budgetInfo, margin + 3, y + 9.5);
          y += 16;
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
            const label = (lang === 'fr' ? task?.labelFr : task?.labelEn) || taskId.replace(/_/g, ' ');
            const tw = Math.min(label.length * 1.55 + 7, 72);
            if (tagXt + tw > W - margin) { tagXt = margin; y += 8; }
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
          checkPage(30);
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
            checkPage(10);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...GREEN);
            doc.text('\u2713', margin + 2, y);
            y += Math.max(
              addText(reason, margin + 8, y, { size: 8, color: TEXT_DARK, maxWidth: W - margin * 2 - 10 }) + 4,
              6
            );
          });
          y += 6;
        }

        // Prompts
        if (prompts.length > 0) {
          checkPage(35);
          doc.setDrawColor(220, 220, 220);
          doc.line(margin, y, W - margin, y);
          y += 8;

          y += addText(
            lang === 'fr' ? 'Prompts pour demarrer' : 'Prompts to get started',
            margin, y, { size: 11, bold: true, color: TEXT_DARK }
          ) + 6;

          prompts.slice(0, 2).forEach(prompt => {
            checkPage(35);
            const label = lang === 'fr' ? (prompt.labelFr || '') : (prompt.labelEn || '');
            const text  = lang === 'fr' ? (prompt.promptFr || '') : (prompt.promptEn || '');
            const excerpt = text.substring(0, 400) + (text.length > 400 ? '...' : '');

            roundRect(margin, y, W - margin * 2, 6, LIGHT_BG);
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

      // ── FOOTERS sur toutes les pages ──────────────────────────

      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawFooter();
      }

      // ── TÉLÉCHARGEMENT ────────────────────────────────────────

      const date = new Date().toISOString().split('T')[0];
      doc.save(`lab-ai-finance-${date}.pdf`);

    } catch (e) {
      if (import.meta.env.DEV) console.error('PDF error:', e);
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
