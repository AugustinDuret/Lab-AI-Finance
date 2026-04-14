import { useState } from 'react';
import { TOOLS } from '../data/tools.js';
import { TASKS_BY_ID } from '../data/tasks.js';
import { getPromptsForTasks } from '../data/prompts.js';

// Garantit la compatibilité latin-1 (encodage helvetica jsPDF)
const sanitize = (str) =>
  String(str || '')
    .replace(/[€]/g,  'EUR')
    .replace(/[£]/g,  'GBP')
    .replace(/[·•]/g, '-')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019\u0060]/g, "'")
    .replace(/[\u201C\u201D\u00AB\u00BB]/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/[^\x00-\xFF]/g, '');   // supprime tout autre hors latin-1

export default function PdfExportButton({ t, recommendation, answers, lang }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(false);

  const handleExport = async () => {
    setLoading(true);
    setError(false);

    console.log('[PDF] primary toolId:', recommendation?.primary?.toolId,
      '| primary keys:', recommendation?.primary ? Object.keys(recommendation.primary) : 'NO PRIMARY');

    try {
      const { jsPDF } = await import('jspdf');
      const doc    = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W      = 210;
      const M      = 16;   // margin
      let   y      = 0;

      // Palette Australe
      const GREEN     = [45, 112, 96];
      const GOLD      = [196, 163, 90];
      const DARK      = [10, 17, 14];
      const LIGHT_BG  = [240, 248, 245];
      const MID_GRAY  = [150, 150, 150];
      const TEXT_DARK = [26, 26, 26];

      // ── addText : dessine du texte et retourne la hauteur consommée ──
      const addText = (text, x, yPos, opts = {}) => {
        const {
          size     = 10,
          color    = TEXT_DARK,
          bold     = false,
          maxWidth = W - M * 2,
          align    = 'left',
        } = opts;
        const safe = sanitize(text);
        if (!safe) return 0;
        doc.setFontSize(size);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setTextColor(color[0], color[1], color[2]);
        const lines = doc.splitTextToSize(safe, maxWidth);
        doc.text(lines, x, yPos, { align });
        return lines.length * (size * 0.45);
      };

      // ── checkPage : nouvelle page si besoin ─────────────────────────
      const checkPage = (needed = 20) => {
        if (y + needed > 272) {
          doc.addPage();
          _drawHeader();
          y = 42;
        }
      };

      // ── header (bandeau Australe) ────────────────────────────────────
      const _drawHeader = () => {
        doc.setFillColor(DARK[0], DARK[1], DARK[2]);
        doc.rect(0, 0, W, 28, 'F');
        doc.setFillColor(GREEN[0], GREEN[1], GREEN[2]);
        doc.rect(0, 26, W, 2, 'F');

        // Carré AF
        doc.setFillColor(GREEN[0], GREEN[1], GREEN[2]);
        doc.roundedRect(M, 7, 14, 14, 2, 2, 'F');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.text('AF', M + 7, 16.5, { align: 'center' });

        // Titre
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(240, 244, 241);
        doc.text('Lab-AI-Finance', M + 18, 15);

        // Tagline
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(MID_GRAY[0], MID_GRAY[1], MID_GRAY[2]);
        doc.text(
          lang === 'fr'
            ? 'Recommandation personnalisee - by Augustin Duret'
            : 'Personalised recommendation - by Augustin Duret',
          M + 18, 20
        );

        // Date
        const d = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB');
        doc.setFontSize(8);
        doc.setTextColor(MID_GRAY[0], MID_GRAY[1], MID_GRAY[2]);
        doc.text(d, W - M, 15, { align: 'right' });
      };

      // ── footer ───────────────────────────────────────────────────────
      const _drawFooter = () => {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(MID_GRAY[0], MID_GRAY[1], MID_GRAY[2]);
        doc.setDrawColor(MID_GRAY[0], MID_GRAY[1], MID_GRAY[2]);
        doc.line(M, 284, W - M, 284);
        doc.text('lab-ai-finance-production.up.railway.app', W / 2, 289, { align: 'center' });
      };

      // ── extraction données moteur ────────────────────────────────────
      const primary   = recommendation?.primary   ?? null;
      const secondary = recommendation?.secondary ?? null;

      const TOOL_NAMES = {
        copilot: 'Microsoft Copilot',
        claude:  'Claude (Anthropic)',
        chatgpt: 'ChatGPT (OpenAI)',
        gemini:  'Google Gemini',
        mistral: 'Mistral AI',
      };

      // ═══════════════════════════════════════════════════════════════
      // PAGE 1
      // ═══════════════════════════════════════════════════════════════
      _drawHeader();
      y = 38;

      // Titre principal
      y += addText(
        lang === 'fr' ? 'Votre recommandation personnalisee' : 'Your personalised recommendation',
        M, y, { size: 16, bold: true, color: TEXT_DARK }
      ) + 8;

      // ── Tags profil ──────────────────────────────────────────────────
      const profileTags = [];
      if (answers?.functions?.length > 0)
        profileTags.push(answers.functions.slice(0, 2).join(', '));
      if (answers?.ecosystem && answers.ecosystem !== 'unknown')
        profileTags.push(
          answers.ecosystem === 'microsoft365' ? 'Microsoft 365'
            : answers.ecosystem === 'google'   ? 'Google Workspace'
            : lang === 'fr' ? 'Mixte' : 'Mixed'
        );
      if (answers?.sector)
        profileTags.push(answers.sector);
      if (answers?.budget)
        profileTags.push(
          answers.budget === 'free'
            ? (lang === 'fr' ? 'Version gratuite' : 'Free plan')
            : (lang === 'fr' ? 'Pret a payer' : 'Ready to pay')
        );

      if (profileTags.length > 0) {
        let tx = M;
        profileTags.forEach(tag => {
          const tw = Math.min(sanitize(tag).length * 1.8 + 8, 80);
          if (tx + tw > W - M) { tx = M; y += 9; }
          doc.setFillColor(224, 240, 236);
          doc.roundedRect(tx, y, tw, 6, 1, 1, 'F');
          doc.setFontSize(7);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(GREEN[0], GREEN[1], GREEN[2]);
          doc.text(sanitize(tag), tx + tw / 2, y + 4.2, { align: 'center' });
          tx += tw + 3;
        });
        y += 10;
      }

      // ═══════════════════════════════════════════════════════════════
      // BLOC OUTIL RECOMMANDÉ
      // ═══════════════════════════════════════════════════════════════
      if (primary) {
        const toolId   = recommendation?.primary?.toolId;
        const toolData = TOOLS?.[toolId];
        const toolName = TOOL_NAMES[toolId] ?? toolId;

        // Données depuis TOOLS — PAS depuis le moteur
        const reasons   = (lang === 'fr' ? toolData?.whyFr       : toolData?.whyEn)       || [];
        const vigilance = (lang === 'fr' ? toolData?.vigilanceFr : toolData?.vigilanceEn) || [];
        const budget    = (lang === 'fr' ? toolData?.budgetFr    : toolData?.budgetEn)    || '';

        console.log('[PDF] toolId:', toolId,
          '| reasons.length:', reasons.length,
          '| vigilance.length:', vigilance.length,
          '| budget:', budget);

        // Prompts depuis la promptothèque
        const taskIds = (primary.taskDetails ?? []).map(td => td.taskId);
        const prompts = getPromptsForTasks(taskIds, lang, 2);

        checkPage(80);

        // Barre accent gold
        doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.rect(M, y, W - M * 2, 2, 'F');
        y += 4;

        // Badge recommandé
        doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.roundedRect(M, y, 40, 6, 1, 1, 'F');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(
          lang === 'fr' ? '> RECOMMANDE' : '> RECOMMENDED',
          M + 20, y + 4.2, { align: 'center' }
        );
        y += 10;

        // Nom de l'outil
        y += addText(toolName, M, y, { size: 18, bold: true, color: TEXT_DARK }) + 3;

        // Score
        y += addText(
          (lang === 'fr' ? "Score d'adequation : " : 'Fit score: ') + primary.score + '/100',
          M, y, { size: 9, color: MID_GRAY }
        ) + 8;

        // Séparateur
        doc.setDrawColor(220, 220, 220);
        doc.line(M, y, W - M, y);
        y += 8;

        // ── Pourquoi cet outil ────────────────────────────────────────
        if (reasons.length > 0) {
          checkPage(reasons.length * 10 + 20);
          y += addText(
            lang === 'fr' ? 'Pourquoi cet outil pour votre equipe' : 'Why this tool for your team',
            M, y, { size: 9, bold: true, color: MID_GRAY }
          ) + 5;
          reasons.forEach(reason => {
            checkPage(12);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(GREEN[0], GREEN[1], GREEN[2]);
            doc.text('>', M + 2, y);
            const rh = addText(reason, M + 7, y,
              { size: 8, color: TEXT_DARK, maxWidth: W - M * 2 - 10 });
            y += Math.max(rh + 4, 6);
          });
          y += 4;
        }

        // ── Points de vigilance ───────────────────────────────────────
        if (vigilance.length > 0) {
          checkPage(vigilance.length * 10 + 20);
          y += addText(
            lang === 'fr' ? 'Points de vigilance' : 'Watch out for',
            M, y, { size: 9, bold: true, color: MID_GRAY }
          ) + 5;
          vigilance.forEach(point => {
            checkPage(12);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
            doc.text('!', M + 2, y);
            const vh = addText(point, M + 7, y,
              { size: 8, color: TEXT_DARK, maxWidth: W - M * 2 - 10 });
            y += Math.max(vh + 4, 6);
          });
          y += 4;
        }

        // ── Budget / tarifs ───────────────────────────────────────────
        if (budget) {
          checkPage(16);
          y += addText(
            lang === 'fr' ? 'Acces et tarifs' : 'Access and pricing',
            M, y, { size: 9, bold: true, color: MID_GRAY }
          ) + 4;
          y += addText(budget, M, y, { size: 9, color: TEXT_DARK }) + 8;
        }

        // ── Tâches sélectionnées ──────────────────────────────────────
        if (answers?.selectedTasks?.length > 0) {
          checkPage(28);
          doc.setDrawColor(220, 220, 220);
          doc.line(M, y, W - M, y);
          y += 8;

          y += addText(
            lang === 'fr' ? 'Vos taches prioritaires' : 'Your priority tasks',
            M, y, { size: 9, bold: true, color: MID_GRAY }
          ) + 5;

          let tx = M;
          answers.selectedTasks.forEach(taskId => {
            const task = TASKS_BY_ID[taskId];
            const lbl  = sanitize(
              (lang === 'fr' ? task?.labelFr : task?.labelEn) || taskId.replace(/_/g, ' ')
            );
            const tw = Math.min(lbl.length * 1.5 + 8, 75);
            if (tx + tw > W - M) { tx = M; y += 9; }
            checkPage(10);
            doc.setFillColor(238, 238, 238);
            doc.roundedRect(tx, y, tw, 6, 1, 1, 'F');
            doc.setFontSize(6.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);
            doc.text(lbl, tx + tw / 2, y + 4, { align: 'center' });
            tx += tw + 3;
          });
          y += 12;
        }

        // ── Alternative ───────────────────────────────────────────────
        if (secondary) {
          checkPage(32);
          doc.setDrawColor(220, 220, 220);
          doc.line(M, y, W - M, y);
          y += 8;

          const altData = TOOLS[secondary.toolId] ?? {};
          const altName = TOOL_NAMES[secondary.toolId] ?? secondary.toolId;
          const altWhy  = (lang === 'fr' ? altData.whyFr : altData.whyEn) ?? [];

          y += addText(
            (lang === 'fr' ? 'Alternative solide : ' : 'Strong alternative: ') + altName,
            M, y, { size: 11, bold: true, color: TEXT_DARK }
          ) + 5;

          altWhy.slice(0, 2).forEach(reason => {
            checkPage(12);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(GREEN[0], GREEN[1], GREEN[2]);
            doc.text('v', M + 1, y);
            const h = addText(sanitize(reason), M + 6, y, {
              size: 8, color: TEXT_DARK, maxWidth: W - M * 2 - 8
            });
            y += Math.max(h, 4) + 5;
          });
          y += 4;
        }

        // ── Prompts ───────────────────────────────────────────────────
        if (prompts.length > 0) {
          checkPage(40);
          doc.setDrawColor(220, 220, 220);
          doc.line(M, y, W - M, y);
          y += 8;

          y += addText(
            lang === 'fr' ? 'Prompts pour demarrer' : 'Prompts to get started',
            M, y, { size: 11, bold: true, color: TEXT_DARK }
          ) + 6;

          prompts.slice(0, 2).forEach(prompt => {
            checkPage(40);
            const lbl  = sanitize(lang === 'fr' ? prompt.labelFr : prompt.labelEn);
            const body = sanitize(lang === 'fr' ? prompt.promptFr : prompt.promptEn);
            const excerpt = body.substring(0, 360) + (body.length > 360 ? '...' : '');

            doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
            doc.roundedRect(M, y, W - M * 2, 6, 1, 1, 'F');
            doc.setFontSize(7.5);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(GREEN[0], GREEN[1], GREEN[2]);
            doc.text(lbl, M + 3, y + 4.2);
            y += 8;

            y += addText(excerpt, M + 2, y, {
              size: 7.5, color: [80, 80, 80], maxWidth: W - M * 2 - 4
            }) + 8;
          });
        }
      }

      // ═══════════════════════════════════════════════════════════════
      // FOOTERS
      // ═══════════════════════════════════════════════════════════════
      const total = doc.internal.getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        _drawFooter();
      }

      const date = new Date().toISOString().split('T')[0];
      doc.save(`lab-ai-finance-${date}.pdf`);

    } catch (e) {
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
          border:     '1px solid var(--border-gold)',
          color:      'var(--australe-gold)',
          borderRadius: '8px',
          padding:    '8px 16px',
          fontSize:   '13px',
          opacity:    loading ? 0.6 : 1,
          cursor:     loading ? 'not-allowed' : 'pointer',
          background: 'transparent',
          transition: 'opacity 200ms',
        }}
      >
        {loading
          ? (t?.exportPdfLoading ?? 'Generation...')
          : `\u2193 ${t?.exportPdf ?? 'Exporter PDF'}`}
      </button>
      {error && (
        <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
          {t?.exportPdfError ?? 'Export indisponible, veuillez reessayer.'}
        </p>
      )}
    </div>
  );
}
