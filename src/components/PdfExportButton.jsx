import { useState } from 'react';
import { TOOLS } from '../data/tools.js';
import { LOGOS, svgToPng } from '../data/logos.js';
import { TASKS_BY_ID } from '../data/tasks.js';
import { getPromptsForTasks } from '../data/prompts.js';

// ASCII transliteration — jsPDF Helvetica est Latin-1, pas UTF-8
const a = (str) =>
  String(str || '')
    .replace(/[€]/g, 'EUR').replace(/[£]/g, 'GBP')
    .replace(/[àáâãäå]/gi, 'a').replace(/[èéêë]/gi, 'e')
    .replace(/[ìíîï]/gi, 'i').replace(/[òóôõö]/gi, 'o')
    .replace(/[ùúûü]/gi, 'u').replace(/[ç]/gi, 'c')
    .replace(/[œ]/gi, 'oe').replace(/[æ]/gi, 'ae')
    .replace(/[ñ]/gi, 'n').replace(/[ß]/gi, 'ss')
    .replace(/[\u2018\u2019\u0060]/g, "'")
    .replace(/[\u201C\u201D\u00AB\u00BB]/g, '"')
    .replace(/[\u2013\u2014]/g, '-').replace(/\u2026/g, '...')
    .replace(/[·•]/g, '-').replace(/[^\x20-\x7E]/g, '');

// Parse hex color -> [r, g, b]
const hex2rgb = (hex) => {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
};

export default function PdfExportButton({ recommendation, answers, lang }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(false);

  const handleExport = async () => {
    setLoading(true);
    setError(false);
    try {
      const { jsPDF } = await import('jspdf');

      // ── Layout constants ───────────────────────────────────────
      const W  = 210;       // page width mm
      const M  = 15;        // margin
      const CW = W - M * 2; // content width = 180mm
      let   y  = 0;

      // ── Brand palette ──────────────────────────────────────────
      // Identique aux CSS vars du site, adaptee fond blanc
      const INK   = [18, 24, 20];       // --bg-primary quasi-noir
      const GREEN  = [45, 112, 96];     // --australe-green
      const GOLD   = [180, 145, 70];    // --australe-gold adapte fond blanc
      const MUTED  = [95, 120, 108];    // --text-secondary
      const LGRAY  = [185, 195, 190];   // separateurs
      const BG_GRN = [232, 245, 240];   // fond vert pale
      const BG_GLD = [252, 247, 232];   // fond or pale
      const BG_DRK = [15, 25, 20];      // header fonce
      const WHITE  = [255, 255, 255];

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // ── Core helpers ───────────────────────────────────────────

      // Hauteur d'une ligne en mm pour une taille de police en pt
      const lh = (size) => size * 0.42;

      // Dessine du texte, retourne la hauteur totale consommee
      const txt = (str, x, yy, opts = {}) => {
        const { size = 10, color = INK, bold = false, maxW = CW, align = 'left' } = opts;
        const safe = a(str);
        if (!safe) return 0;
        doc.setFontSize(size);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(safe, maxW);
        doc.text(lines, x, yy, { align });
        return lines.length * lh(size);
      };

      // Ajoute une page si la hauteur requise depasse la zone utile
      const need = (n = 20) => {
        if (y + n > 277) { doc.addPage(); drawHeader(); y = 40; }
      };

      // ── Header (toutes les pages) ──────────────────────────────
      const drawHeader = () => {
        // Bandeau fonce
        doc.setFillColor(...BG_DRK);
        doc.rect(0, 0, W, 29, 'F');
        // Trait vert signature
        doc.setFillColor(...GREEN);
        doc.rect(0, 27.5, W, 1.5, 'F');

        // Badge AF
        doc.setFillColor(...GREEN);
        doc.roundedRect(M, 7.5, 14, 14, 2.5, 2.5, 'F');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...GOLD);
        doc.text('AF', M + 7, 16.5, { align: 'center' });

        // Titre
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...WHITE);
        doc.text('Lab-AI-Finance', M + 18, 15.5);

        // Tagline
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...LGRAY);
        doc.text(
          lang === 'fr'
            ? 'Recommandation personnalisee - by Augustin Duret'
            : 'Personalised recommendation - by Augustin Duret',
          M + 18, 22
        );

        // Date
        const d = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB');
        doc.setFontSize(7.5);
        doc.setTextColor(...LGRAY);
        doc.text(d, W - M, 15.5, { align: 'right' });
      };

      // ── Footer (numerote) ──────────────────────────────────────
      const drawFooter = (n, total) => {
        doc.setDrawColor(...LGRAY);
        doc.line(M, 285, W - M, 285);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...MUTED);
        doc.text('lab-ai-finance-production.up.railway.app', M, 290);
        doc.text(n + ' / ' + total, W - M, 290, { align: 'right' });
      };

      // ── Section label (barre coloree + label majuscule) ────────
      const sLabel = (label, yy) => {
        doc.setFillColor(...GREEN);
        doc.rect(M, yy, 2.5, 8, 'F');
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...MUTED);
        doc.text(a(label).toUpperCase(), M + 6, yy + 5.5);
        return 12;
      };

      // ── Bullet vert (checkmark) ────────────────────────────────
      const bGreen = (str, yy) => {
        doc.setFillColor(...GREEN);
        doc.circle(M + 3.5, yy + 2.5, 2, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...WHITE);
        doc.text('v', M + 3.5, yy + 3.8, { align: 'center' });
        const h = txt(str, M + 9, yy, { size: 9.5, color: INK, maxW: CW - 11 });
        return Math.max(h + 5, 10);
      };

      // ── Bullet or (avertissement) ──────────────────────────────
      const bGold = (str, yy) => {
        doc.setFillColor(...GOLD);
        doc.roundedRect(M + 1.5, yy + 0.5, 4, 4, 0.5, 0.5, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...WHITE);
        doc.text('!', M + 3.5, yy + 3.8, { align: 'center' });
        const h = txt(str, M + 9, yy, { size: 9.5, color: INK, maxW: CW - 11 });
        return Math.max(h + 5, 10);
      };

      // ── Donnees ────────────────────────────────────────────────
      const primary = recommendation?.primary ?? null;
      const TOOL_NAMES = {
        copilot: 'Microsoft Copilot',
        claude:  'Claude (Anthropic)',
        chatgpt: 'ChatGPT (OpenAI)',
        gemini:  'Google Gemini',
        mistral: 'Mistral AI',
      };

      // ════════════════════════════════════════════════════════════
      // PAGE 1 — RECOMMANDATION
      // ════════════════════════════════════════════════════════════
      drawHeader();
      y = 40;

      if (!primary) {
        txt(lang === 'fr' ? 'Aucune recommandation disponible.' : 'No recommendation available.', M, y);
      } else {
        const toolId    = primary.toolId;
        const toolData  = TOOLS[toolId] ?? {};
        const toolName  = TOOL_NAMES[toolId] ?? toolId;
        const toolRGB   = hex2rgb(toolData.logoBg ?? '#2D7060');
        const logoIni   = a(toolData.logoInitial ?? toolId.slice(0,2).toUpperCase());
        const logoPng   = LOGOS[toolId] ? await svgToPng(LOGOS[toolId], 80) : null;
        const reasons  = (lang === 'fr' ? toolData.whyFr       : toolData.whyEn)       ?? [];
        const vigilance= (lang === 'fr' ? toolData.vigilanceFr : toolData.vigilanceEn) ?? [];
        const budget   = (lang === 'fr' ? toolData.budgetFr    : toolData.budgetEn)    ?? '';

        // ── Titre de page ────────────────────────────────────────
        y += txt(
          lang === 'fr' ? 'Votre recommandation personnalisee' : 'Your personalised recommendation',
          M, y, { size: 15, bold: true, color: INK }
        ) + 10;

        // ── Carte outil principale ───────────────────────────────
        const CARD_H = 46;
        // Fond carte
        doc.setFillColor(...BG_GRN);
        doc.roundedRect(M, y, CW, CARD_H, 3, 3, 'F');
        // Barre gauche couleur de l'outil
        doc.setFillColor(...toolRGB);
        doc.roundedRect(M, y, 5, CARD_H, 2, 2, 'F');

        // Badge logo SVG converti en PNG, ou fallback initiales
        doc.setFillColor(...toolRGB);
        doc.roundedRect(M + 10, y + 10, 20, 20, 3, 3, 'F');
        if (logoPng) {
          doc.addImage(logoPng, 'PNG', M + 11.5, y + 11.5, 17, 17);
        } else {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...WHITE);
          doc.text(logoIni, M + 20, y + 23, { align: 'center' });
        }

        // Badge RECOMMANDE (pill or)
        doc.setFillColor(...GOLD);
        doc.roundedRect(M + 33, y + 7, 40, 7, 2, 2, 'F');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...WHITE);
        doc.text(
          lang === 'fr' ? '+ RECOMMANDE' : '+ RECOMMENDED',
          M + 53, y + 12.5, { align: 'center' }
        );

        // Nom de l'outil
        doc.setFontSize(17);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...INK);
        doc.text(a(toolName), M + 33, y + 26);

        // Score (chiffre, a droite)
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...GREEN);
        doc.text('' + primary.score, W - M - 4, y + 24, { align: 'right' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...MUTED);
        doc.text('/100', W - M - 4, y + 30, { align: 'right' });
        doc.setFontSize(7);
        doc.setTextColor(...MUTED);
        doc.text(
          lang === 'fr' ? "Score d'adequation" : 'Fit score',
          W - M - 4, y + 36, { align: 'right' }
        );

        // Barre de score (sous le nom)
        const BAR_X = M + 33, BAR_Y = y + 33, BAR_W = 90, BAR_H = 3.5;
        doc.setFillColor(...LGRAY);
        doc.roundedRect(BAR_X, BAR_Y, BAR_W, BAR_H, 1.5, 1.5, 'F');
        doc.setFillColor(...GREEN);
        doc.roundedRect(BAR_X, BAR_Y, BAR_W * primary.score / 100, BAR_H, 1.5, 1.5, 'F');

        y += CARD_H + 10;

        // ── Pourquoi cet outil ───────────────────────────────────
        if (reasons.length > 0) {
          need(reasons.length * 12 + 20);
          y += sLabel(lang === 'fr' ? 'Pourquoi cet outil pour votre equipe' : 'Why this tool for your team', y);
          reasons.forEach(r => { need(12); y += bGreen(r, y); });
          y += 6;
        }

        // ── Points de vigilance ──────────────────────────────────
        if (vigilance.length > 0) {
          need(vigilance.length * 12 + 20);
          y += sLabel(lang === 'fr' ? 'Points de vigilance' : 'Watch out for', y);
          vigilance.forEach(v => { need(12); y += bGold(v, y); });
          y += 6;
        }

        // ── Tarifs ───────────────────────────────────────────────
        if (budget) {
          need(26);
          y += sLabel(lang === 'fr' ? 'Acces et tarifs' : 'Access and pricing', y);
          const bLines = doc.splitTextToSize(a(budget), CW - 14);
          const boxH   = bLines.length * lh(9.5) + 12;
          doc.setFillColor(...BG_GLD);
          doc.roundedRect(M, y, CW, boxH, 2, 2, 'F');
          doc.setFillColor(...GOLD);
          doc.roundedRect(M, y, 4, boxH, 2, 2, 'F');
          txt(budget, M + 9, y + 7, { size: 9.5, color: INK, maxW: CW - 14 });
          y += boxH + 8;
        }

        // ── Profil utilisateur (tags) ────────────────────────────
        const tags = [];
        if (answers?.functions?.length > 0) tags.push(...answers.functions.slice(0, 3));
        if (answers?.ecosystem && answers.ecosystem !== 'unknown')
          tags.push(
            answers.ecosystem === 'microsoft365' ? 'Microsoft 365' :
            answers.ecosystem === 'google'       ? 'Google Workspace' :
            lang === 'fr' ? 'Ecosysteme mixte' : 'Mixed ecosystem'
          );
        if (answers?.budget === 'free')
          tags.push(lang === 'fr' ? 'Version gratuite' : 'Free plan');

        if (tags.length > 0) {
          need(24);
          y += sLabel(lang === 'fr' ? 'Votre profil' : 'Your profile', y);
          let tx = M;
          tags.forEach(tag => {
            const lbl = a(tag);
            const tw  = Math.min(lbl.length * 2.0 + 10, 85);
            if (tx + tw > W - M) { tx = M; y += 9; }
            doc.setFillColor(...BG_GRN);
            doc.roundedRect(tx, y, tw, 7.5, 2, 2, 'F');
            doc.setDrawColor(...GREEN);
            doc.setLineWidth(0.3);
            doc.roundedRect(tx, y, tw, 7.5, 2, 2, 'D');
            doc.setLineWidth(0.2);
            doc.setFontSize(7.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...GREEN);
            doc.text(lbl, tx + tw / 2, y + 5.2, { align: 'center' });
            tx += tw + 4;
          });
          y += 12;
        }

        // ── Taches selectionnees ─────────────────────────────────
        if (answers?.selectedTasks?.length > 0) {
          need(26);
          y += sLabel(lang === 'fr' ? 'Taches prioritaires selectionnees' : 'Selected priority tasks', y);
          let tx = M;
          answers.selectedTasks.forEach(taskId => {
            const task = TASKS_BY_ID[taskId];
            const lbl  = a((lang === 'fr' ? task?.labelFr : task?.labelEn) || taskId.replace(/_/g, ' '));
            const tw   = Math.min(lbl.length * 1.75 + 10, 90);
            if (tx + tw > W - M) { tx = M; y += 9; }
            need(10);
            doc.setFillColor(240, 245, 242);
            doc.roundedRect(tx, y, tw, 7.5, 2, 2, 'F');
            doc.setFontSize(6.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...MUTED);
            doc.text(lbl, tx + tw / 2, y + 5.2, { align: 'center' });
            tx += tw + 3;
          });
          y += 12;
        }

        // ── Scores analytiques (grille 2 colonnes) ───────────────
        if (primary.dimScores) {
          const { q, w, t, g } = primary.dimScores;
          need(50);
          y += sLabel(lang === 'fr' ? "Detail de l'analyse" : 'Analysis breakdown', y);

          const dims = lang === 'fr'
            ? [['Qualite analytique', q], ['Integration workflow', w], ['Tracabilite', t], ['Gouvernance IT', g]]
            : [['Analytical quality', q], ['Workflow integration', w], ['Traceability', t], ['IT governance', g]];

          const colW = (CW - 8) / 2;

          dims.forEach(([label, score], i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const cx  = M + col * (colW + 8);
            const cy  = y + row * 20;
            const barColor = score >= 75 ? GREEN : score >= 55 ? GOLD : [200, 80, 80];

            // Label + score
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...MUTED);
            doc.text(a(label), cx, cy + 5);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...barColor);
            doc.text(score + '/100', cx + colW, cy + 5, { align: 'right' });

            // Mini barre
            doc.setFillColor(220, 228, 224);
            doc.roundedRect(cx, cy + 7, colW, 3, 1, 1, 'F');
            doc.setFillColor(...barColor);
            doc.roundedRect(cx, cy + 7, colW * score / 100, 3, 1, 1, 'F');
          });
          y += 44;
        }

        // ════════════════════════════════════════════════════════
        // PAGE 2+ — PROMPTS COMPLETS
        // ════════════════════════════════════════════════════════
        const taskIds = (primary.taskDetails ?? []).map(td => td.taskId);
        const prompts = getPromptsForTasks(taskIds, lang, 2);

        if (prompts.length > 0) {
          doc.addPage();
          drawHeader();
          y = 40;

          y += txt(
            lang === 'fr' ? 'Prompts Finance pour demarrer' : 'Finance prompts to get started',
            M, y, { size: 15, bold: true, color: INK }
          ) + 4;

          y += txt(
            lang === 'fr'
              ? 'Copiez et collez ces prompts directement dans ' + a(toolName) + '.'
              : 'Copy and paste these prompts directly into ' + a(toolName) + '.',
            M, y, { size: 9.5, color: MUTED, maxW: CW }
          ) + 10;

          prompts.forEach((prompt, idx) => {
            const lbl      = a(lang === 'fr' ? prompt.labelFr : prompt.labelEn);
            const body     = a(lang === 'fr' ? prompt.promptFr : prompt.promptEn);
            const bodyLines = doc.splitTextToSize(body, CW - 16);
            const bodyH    = bodyLines.length * lh(8.5);
            const cardH    = bodyH + 28;

            // Nouvelle page si le prompt ne tient pas
            need(cardH + 8);

            // Fond de la carte
            doc.setFillColor(246, 250, 248);
            doc.roundedRect(M, y, CW, cardH, 3, 3, 'F');
            // Barre coloree gauche
            doc.setFillColor(...GREEN);
            doc.roundedRect(M, y, 5, cardH, 2, 2, 'F');

            // Numero du prompt
            doc.setFontSize(7.5);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...GREEN);
            doc.text('PROMPT ' + (idx + 1), M + 10, y + 8);

            // Titre
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...INK);
            doc.text(lbl, M + 10, y + 18);

            // Ligne de separation interne
            doc.setDrawColor(...LGRAY);
            doc.setLineWidth(0.3);
            doc.line(M + 10, y + 22, M + CW - 5, y + 22);
            doc.setLineWidth(0.2);

            // Corps du prompt (texte complet)
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(65, 85, 75);
            doc.text(bodyLines, M + 10, y + 29);

            y += cardH + 10;
          });
        }
      }

      // ── Footers (toutes les pages) ─────────────────────────────
      const total = doc.internal.getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        drawFooter(i, total);
      }

      const date = new Date().toISOString().split('T')[0];
      doc.save('lab-ai-finance-' + date + '.pdf');

    } catch (e) {
      console.error('[PDF]', e);
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
          : '\u2193 ' + (lang === 'fr' ? 'Exporter PDF' : 'Export PDF')}
      </button>
      {error && (
        <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
          {lang === 'fr' ? 'Export indisponible, reessayez.' : 'Export failed, please retry.'}
        </p>
      )}
    </div>
  );
}
