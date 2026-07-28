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
    ? 'Tu es Finn, assistant IA Finance expert, drôle et amical. Max 3 phrases. Un emoji. Finance et IA uniquement.'
    : 'You are Finn, an expert Finance AI assistant, funny and friendly. Max 3 sentences. One emoji. Finance and AI only.';
  if (!profile?.toolId) return base;
  const ctx = isFr
    ? `Contexte: outil=${profile.toolId}, éco=${profile.ecosystem || '?'}, tâches=${profile.tasks || '?'}, budget=${profile.budget || '?'}.`
    : `Context: tool=${profile.toolId}, eco=${profile.ecosystem || '?'}, tasks=${profile.tasks || '?'}, budget=${profile.budget || '?'}.`;
  return `${base} ${ctx}`;
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
