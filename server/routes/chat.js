import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const rateLimits = new Map();
const RATE_LIMIT = 15;
const RATE_WINDOW = 60 * 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimits.get(ip) || { count: 0, resetAt: now + RATE_WINDOW };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + RATE_WINDOW; }
  entry.count++;
  rateLimits.set(ip, entry);
  return entry.count <= RATE_LIMIT;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, e] of rateLimits.entries()) {
    if (now > e.resetAt) rateLimits.delete(ip);
  }
}, RATE_WINDOW);

function buildSystemPrompt(profile, lang) {
  const isFr = lang === 'fr';

  const base = isFr
    ? `Tu es Finn, le copilote IA de Lab-AI-Finance. Tu aides les professionnels Finance (DAF, contrôleurs de gestion, FP&A, trésoriers, comptables) à adopter l'IA pour gagner en productivité et performance.

Ton périmètre EXACT :
- Recommander et expliquer des outils IA pour les équipes Finance (Microsoft Copilot, Notion AI, ChatGPT Enterprise, Cursor, Glean, etc.)
- Aider sur des cas d'usage Finance : FP&A, reporting, clôture, cash management, analyse de données, automatisation, consolidation
- Expliquer comment l'IA peut accélérer des tâches Finance concrètes
- Conseiller sur l'adoption IA dans les équipes Finance

Tu NE fais PAS : conseil en investissement personnel, crypto, budget personnel, analyse de portefeuille boursier. Si on te demande ça, redirige poliment vers ton vrai domaine.

Style : expert mais accessible, un peu geek et drôle, direct. Max 3 phrases. Un seul emoji. Réponds en français.`
    : `You are Finn, the AI copilot for Lab-AI-Finance. You help Finance professionals (CFOs, controllers, FP&A, treasury, accounting teams) adopt AI to boost productivity and performance.

Your EXACT scope:
- Recommend and explain AI tools for Finance teams (Microsoft Copilot, Notion AI, ChatGPT Enterprise, Cursor, Glean, etc.)
- Help with Finance use cases: FP&A, reporting, month-end close, cash management, data analysis, automation, consolidation
- Explain how AI can accelerate concrete Finance tasks
- Advise on AI adoption within Finance teams

You do NOT do: personal investment advice, crypto, personal budgeting, stock portfolio analysis. If asked, politely redirect to your actual domain.

Style: expert but approachable, a bit geeky and witty, direct. Max 3 sentences. One emoji only.`;

  if (!profile?.toolId) return base;

  const ctx = isFr
    ? `\n\nContexte de l'utilisateur : outil recommandé=${profile.toolId}, écosystème IT=${profile.ecosystem || '?'}, tâches prioritaires=${profile.tasks || '?'}, budget=${profile.budget || '?'}. Utilise ce contexte pour personnaliser tes réponses.`
    : `\n\nUser context: recommended tool=${profile.toolId}, IT ecosystem=${profile.ecosystem || '?'}, priority tasks=${profile.tasks || '?'}, budget=${profile.budget || '?'}. Use this context to personalise your answers.`;

  return base + ctx;
}

function sanitize(val) {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, 400).replace(/[<>]/g, '');
}

router.post('/', async (req, res) => {
  const ip = req.ip || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Trop de requêtes - réessaie dans une heure 🙏' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'Finn est temporairement indisponible.' });
  }

  const { messages, userProfile, lang } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages invalides.' });
  }

  let history = messages
    .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: sanitize(m.content) }))
    .filter(m => m.content.length > 0)
    .slice(-6);

  while (history.length > 0 && history[0].role === 'assistant') history.shift();

  if (history.length === 0) {
    return res.status(400).json({ error: 'Aucun message valide.' });
  }

  const cleanProfile = userProfile ? {
    toolId:    sanitize(String(userProfile.toolId    || '')),
    ecosystem: sanitize(String(userProfile.ecosystem || '')),
    tasks:     sanitize(String(userProfile.tasks     || '')),
    budget:    sanitize(String(userProfile.budget    || '')),
  } : null;

  try {
    const response = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 280,
      system:     buildSystemPrompt(cleanProfile?.toolId ? cleanProfile : null, lang || 'fr'),
      messages:   history,
    });

    const text = response.content?.[0]?.text || '';
    if (!text) throw new Error('Réponse vide');
    res.json({ content: text });

  } catch (err) {
    console.error('Finn error:', err.message);
    res.status(500).json({
      error: lang === 'fr'
        ? 'Finn a eu un bug... réessaie ! 😅'
        : 'Finn hit a bug... try again! 😅',
    });
  }
});

export default router;
