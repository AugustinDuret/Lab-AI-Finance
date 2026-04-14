import { useState } from 'react';
import { TOOLS } from '../data/tools.js';
import { TASKS_BY_ID } from '../data/tasks.js';
import { getPromptsForTasks } from '../data/prompts.js';

// Converti tout texte en ASCII pur compatible Latin-1 (encodage jsPDF Helvetica)
const s = (str) =>
  String(str || '')
    .replace(/[€]/g, 'EUR')
    .replace(/[£]/g, 'GBP')
    .replace(/[àáâãäå]/gi, 'a')
    .replace(/[èéêë]/gi, 'e')
    .replace(/[ìíîï]/gi, 'i')
    .replace(/[òóôõö]/gi, 'o')
    .replace(/[ùúûü]/gi, 'u')
    .replace(/[ýÿ]/gi, 'y')
    .replace(/[ñ]/gi, 'n')
    .replace(/[ç]/gi, 'c')
    .replace(/[œ]/gi, 'oe')
    .replace(/[æ]/gi, 'ae')
    .replace(/[\u2018\u2019\u0060]/g, "'")
    .replace(/[\u201C\u201D\u00AB\u00BB]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/[·•]/g, '-')
    .replace(/[^\x20-\x7E]/g, '');

export default function PdfExportButton({ t, recommendation, answers, lang }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(false);

  const handleExport = async () => {
    setLoading(true);
    setError(false);
    try {
      const { jsPDF } = await import('jspdf');

      // ── Constantes layout ──────────────────────────────────────
      const W  = 210;   // largeur A4 mm
      const M  = 14;    // margin
      const CW = W - M * 2; // content width
      let   y  = 0;

      // ── Palette PDF (fond blanc → tout en foncé) ───────────────
      const C = {
        dark:    [15, 23, 18],    // quasi-noir
        green:   [34, 85, 68],    // vert foncé lisible
        gold:    [160, 120, 40],  // or foncé lisible
        gray:    [90, 90, 90],    // gris moyen
        lgray:   [160, 160, 160], // gris clair (séparateurs)
        bggreen: [232, 245, 238], // fond vert très clair
        bggold:  [252, 245, 228], // fond or très clair
        white:   [255, 255, 255],
      };

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // ── Helpers ────────────────────────────────────────────────
      const text = (str, x, yy, opts = {}) => {
        const { size = 10, color = C.dark, bold = false, maxW = CW, align = 'left' } = opts;
        const safe = s(str);
        if (!safe) return 0;
        doc.setFontSize(size);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(safe, maxW);
        doc.text(lines, x, yy, { align });
        return lines.length * size * 0.42;
      };

      const checkPage = (need = 20) => {
        if (y + need > 275) { doc.addPage(); drawHeader(); y = 38; }
      };

      const sep = (yy, color = C.lgray) => {
        doc.setDrawColor(...color);
        doc.line(M, yy, W - M, yy);
      };

      // ── En-tête Australe ───────────────────────────────────────
      const drawHeader = () => {
        // Bandeau foncé
        doc.setFillColor(...C.dark);
        doc.rect(0, 0, W, 26, 'F');
        // Trait vert
        doc.setFillColor(...C.green);
        doc.rect(0, 24, W, 2, 'F');
        // Badge AF
        doc.setFillColor(...C.green);
        doc.roundedRect(M, 6, 13, 13, 2, 2, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...C.white);
        doc.text('AF', M + 6.5, 14.5, { align: 'center' });
        // Titre
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...C.white);
        doc.text('Lab-AI-Finance', M + 17, 13);
        // Sous-titre
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...C.lgray);
        doc.text(
          lang === 'fr'
            ? 'Recommandation personnalisee - by Augustin Duret'
            : 'Personalised recommendation - by Augustin Duret',
          M + 17, 19
        );
        // Date
        const d = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB');
        doc.setFontSize(7);
        doc.setTextColor(...C.lgray);
        doc.text(d, W - M, 14, { align: 'right' });
      };

      const drawFooter = () => {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...C.lgray);
        doc.setDrawColor(...C.lgray);
        doc.line(M, 284, W - M, 284);
        doc.text('lab-ai-finance-production.up.railway.app', W / 2, 289, { align: 'center' });
      };

      // ── Données moteur ─────────────────────────────────────────
      const primary   = recommendation?.primary   ?? null;
      const secondary = recommendation?.secondary ?? null;

      const TOOL_NAMES = {
        copilot: 'Microsoft Copilot',
        claude:  'Claude (Anthropic)',
        chatgpt: 'ChatGPT (OpenAI)',
        gemini:  'Google Gemini',
        mistral: 'Mistral AI',
      };

      // ════════════════════════════════════════════════════════════
      // PAGE 1
      // ════════════════════════════════════════════════════════════
      drawHeader();
      y = 36;

      // Titre principal
      y += text(
        lang === 'fr' ? 'Votre recommandation personnalisee' : 'Your personalised recommendation',
        M, y, { size: 17, bold: true, color: C.dark }
      ) + 8;

      // Tags profil
      const tags = [];
      if (answers?.functions?.length > 0) tags.push(...answers.functions.slice(0, 2));
      if (answers?.ecosystem && answers.ecosystem !== 'unknown')
        tags.push(answers.ecosystem === 'microsoft365' ? 'Microsoft 365'
          : answers.ecosystem === 'google' ? 'Google Workspace'
          : lang === 'fr' ? 'Mixte' : 'Mixed');
      if (answers?.budget === 'free')
        tags.push(lang === 'fr' ? 'Version gratuite' : 'Free plan');

      if (tags.length > 0) {
        let tx = M;
        tags.forEach(tag => {
          const label = s(tag);
          const tw = Math.min(label.length * 1.9 + 8, 75);
          if (tx + tw > W - M) { tx = M; y += 8; }
          doc.setFillColor(...C.bggreen);
          doc.roundedRect(tx, y - 1, tw, 6.5, 1, 1, 'F');
          doc.setFontSize(7);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...C.green);
          doc.text(label, tx + tw / 2, y + 3.5, { align: 'center' });
          tx += tw + 3;
        });
        y += 11;
      }

      // ── BLOC OUTIL RECOMMANDÉ ──────────────────────────────────
      if (primary) {
        const toolId   = primary.toolId;
        const toolData = TOOLS[toolId] ?? {};
        const toolName = TOOL_NAMES[toolId] ?? toolId;
        const reasons  = (lang === 'fr' ? toolData.whyFr      : toolData.whyEn)      ?? [];
        const vigilance= (lang === 'fr' ? toolData.vigilanceFr: toolData.vigilanceEn) ?? [];
        const budget   = (lang === 'fr' ? toolData.budgetFr   : toolData.budgetEn)   ?? '';
        const taskIds  = (primary.taskDetails ?? []).map(td => td.taskId);
        const prompts  = getPromptsForTasks(taskIds, lang, 2);

        checkPage(70);

        // Trait gold
        doc.setFillColor(...C.gold);
        doc.rect(M, y, CW, 2, 'F');
        y += 5;

        // Badge RECOMMANDE
        doc.setFillColor(...C.gold);
        doc.roundedRect(M, y, 42, 6, 1, 1, 'F');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...C.white);
        doc.text(lang === 'fr' ? 'RECOMMANDE' : 'RECOMMENDED', M + 21, y + 4.2, { align: 'center' });
        y += 10;

        // Nom outil
        y += text(toolName, M, y, { size: 20, bold: true, color: C.dark }) + 3;

        // Score
        y += text(
          (lang === 'fr' ? "Score d'adequation : " : 'Fit score: ') + primary.score + '/100',
          M, y, { size: 9, color: C.gray }
        ) + 8;

        sep(y); y += 8;

        // ── Pourquoi cet outil ──────────────────────────────────
        if (reasons.length > 0) {
          checkPage(reasons.length * 12 + 20);
          y += text(
            lang === 'fr' ? 'Pourquoi cet outil pour votre equipe' : 'Why this tool for your team',
            M, y, { size: 9, bold: true, color: C.gray }
          ) + 6;

          reasons.forEach(reason => {
            checkPage(14);
            // Puce verte
            doc.setFillColor(...C.green);
            doc.circle(M + 2.5, y - 1, 1.5, 'F');
            const h = text(reason, M + 7, y, { size: 9, color: C.dark, maxW: CW - 8 });
            y += Math.max(h + 4, 7);
          });
          y += 4;
        }

        // ── Points de vigilance ─────────────────────────────────
        if (vigilance.length > 0) {
          checkPage(vigilance.length * 12 + 20);
          y += text(
            lang === 'fr' ? 'Points de vigilance' : 'Watch out for',
            M, y, { size: 9, bold: true, color: C.gray }
          ) + 6;

          vigilance.forEach(point => {
            checkPage(14);
            // Triangle attention
            doc.setFillColor(...C.gold);
            doc.triangle(M + 2.5, y - 3, M + 0.5, y + 1, M + 4.5, y + 1, 'F');
            const h = text(point, M + 7, y, { size: 9, color: C.dark, maxW: CW - 8 });
            y += Math.max(h + 4, 7);
          });
          y += 4;
        }

        // ── Budget ──────────────────────────────────────────────
        if (budget) {
          checkPage(18);
          y += text(
            lang === 'fr' ? 'Acces et tarifs' : 'Access and pricing',
            M, y, { size: 9, bold: true, color: C.gray }
          ) + 5;
          doc.setFillColor(...C.bggold);
          const budgetLines = doc.splitTextToSize(s(budget), CW - 6);
          const boxH = budgetLines.length * 9 * 0.42 + 8;
          doc.roundedRect(M, y - 2, CW, boxH, 2, 2, 'F');
          y += text(budget, M + 4, y + 3, { size: 9, color: C.dark, maxW: CW - 8 }) + boxH - 5;
          y += 6;
        }

        // ── Tâches sélectionnées ────────────────────────────────
        if (answers?.selectedTasks?.length > 0) {
          checkPage(28);
          sep(y); y += 8;

          y += text(
            lang === 'fr' ? 'Vos taches prioritaires' : 'Your priority tasks',
            M, y, { size: 9, bold: true, color: C.gray }
          ) + 6;

          let tx = M;
          answers.selectedTasks.forEach(taskId => {
            const task = TASKS_BY_ID[taskId];
            const lbl  = s((lang === 'fr' ? task?.labelFr : task?.labelEn) || taskId.replace(/_/g, ' '));
            const tw   = Math.min(lbl.length * 1.6 + 8, 80);
            if (tx + tw > W - M) { tx = M; y += 9; }
            checkPage(10);
            doc.setFillColor(238, 238, 238);
            doc.roundedRect(tx, y - 1, tw, 6.5, 1, 1, 'F');
            doc.setFontSize(6.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...C.dark);
            doc.text(lbl, tx + tw / 2, y + 3.5, { align: 'center' });
            tx += tw + 3;
          });
          y += 12;
        }

        // ── Alternative ─────────────────────────────────────────
        if (secondary) {
          checkPage(32);
          sep(y); y += 8;

          const altData = TOOLS[secondary.toolId] ?? {};
          const altName = TOOL_NAMES[secondary.toolId] ?? secondary.toolId;
          const altWhy  = (lang === 'fr' ? altData.whyFr : altData.whyEn) ?? [];

          y += text(
            (lang === 'fr' ? 'Alternative solide : ' : 'Strong alternative: ') + altName,
            M, y, { size: 12, bold: true, color: C.dark }
          ) + 6;

          altWhy.slice(0, 2).forEach(reason => {
            checkPage(12);
            doc.setFillColor(...C.green);
            doc.circle(M + 2.5, y - 1, 1.5, 'F');
            const h = text(reason, M + 7, y, { size: 9, color: C.dark, maxW: CW - 8 });
            y += Math.max(h + 4, 7);
          });
          y += 4;
        }

        // ── Prompts ─────────────────────────────────────────────
        if (prompts.length > 0) {
          checkPage(40);
          sep(y); y += 8;

          y += text(
            lang === 'fr' ? 'Prompts Finance pour demarrer' : 'Finance prompts to get started',
            M, y, { size: 12, bold: true, color: C.dark }
          ) + 7;

          prompts.slice(0, 2).forEach(prompt => {
            checkPage(50);
            const lbl  = s(lang === 'fr' ? prompt.labelFr : prompt.labelEn);
            const body = s(lang === 'fr' ? prompt.promptFr : prompt.promptEn);
            const excerpt = body.substring(0, 400) + (body.length > 400 ? '...' : '');

            // En-tête prompt
            doc.setFillColor(...C.bggreen);
            doc.roundedRect(M, y - 1, CW, 8, 1, 1, 'F');
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...C.green);
            doc.text(lbl, M + 4, y + 4.5);
            y += 11;

            const h = text(excerpt, M + 2, y, { size: 7.5, color: C.gray, maxW: CW - 4 });
            y += h + 9;
          });
        }
      }

      // ── Footers sur toutes les pages ───────────────────────────
      const total = doc.internal.getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        drawFooter();
      }

      const date = new Date().toISOString().split('T')[0];
      doc.save(`lab-ai-finance-${date}.pdf`);

    } catch (e) {
      console.error('[PDF] Erreur:', e);
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
          border:       '1px solid var(--border-gold)',
          color:        'var(--australe-gold)',
          borderRadius: '8px',
          padding:      '8px 18px',
          fontSize:     '13px',
          fontWeight:   '500',
          opacity:      loading ? 0.6 : 1,
          cursor:       loading ? 'not-allowed' : 'pointer',
          background:   'transparent',
          transition:   'opacity 200ms',
          whiteSpace:   'nowrap',
        }}
      >
        {loading
          ? (lang === 'fr' ? 'Generation...' : 'Generating...')
          : `\u2193 ${lang === 'fr' ? 'Exporter PDF' : 'Export PDF'}`}
      </button>
      {error && (
        <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
          {lang === 'fr' ? 'Export indisponible, reessayez.' : 'Export failed, please retry.'}
        </p>
      )}
    </div>
  );
}
