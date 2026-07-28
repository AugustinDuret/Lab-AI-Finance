import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chatRouter from './routes/chat.js';
import { computeRecommendation } from '../src/engine/recommendationEngine.js';
import { enrichWithClaude } from './enrichWithClaude.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  app.use(cors({ origin: 'http://localhost:5173' }));
}

app.use(express.json({ limit: '10kb' }));

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('ANTHROPIC_API_KEY manquante - Finn sera muet et l\'enrichissement Claude désactivé');
}

// ── /api/chat — Finn chatbot ──────────────────────────────────────
app.use('/api/chat', chatRouter);

// ── /api/recommend — Moteur de recommandation ────────────────────
const recommendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body,
    });
    const data = await r.json();
    if (!data.success) console.warn('[Turnstile] Failed:', data['error-codes']);
    return data.success === true;
  } catch (e) {
    console.error('[Turnstile] Verification error:', e.message);
    return false;
  }
}

app.post('/api/recommend', recommendLimiter, async (req, res) => {
  try {
    const { answers, lang = 'fr', turnstileToken } = req.body;
    if (!answers) return res.status(400).json({ error: 'answers required' });

    const ip = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const humanVerified = await verifyTurnstile(turnstileToken, ip);
    if (!humanVerified) return res.status(403).json({ error: 'Bot check failed. Please refresh and try again.' });

    const base = computeRecommendation(answers);
    if (!base) return res.status(400).json({ error: 'invalid answers' });

    const result = await enrichWithClaude(base, answers, lang);
    res.json(result);
  } catch (e) {
    console.error('[/api/recommend]', e);
    res.status(500).json({ error: e.message });
  }
});

// ── Health / Status ───────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true, finn: 'ready' }));
app.get('/api/status', (_req, res) => res.json({ claudeApiKey: !!process.env.ANTHROPIC_API_KEY }));

// ── Frontend statique (prod) ──────────────────────────────────────
if (isProd) {
  const distPath = join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(distPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`Finn server on port ${PORT} (${isProd ? 'prod' : 'dev'})`);
  console.log(`Claude API:  ${process.env.ANTHROPIC_API_KEY   ? '✓ connected' : '✗ no key'}`);
  console.log(`Turnstile:   ${process.env.TURNSTILE_SECRET_KEY ? '✓ enabled'   : '✗ disabled'}`);
});
