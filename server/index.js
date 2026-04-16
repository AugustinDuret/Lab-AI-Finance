import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import { computeRecommendation } from '../src/engine/recommendationEngine.js'
import { enrichWithClaude } from './enrichWithClaude.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(express.json())

// ── Cloudflare Turnstile verification ───────────────────────────
async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true  // not configured — skip check (dev mode)
  if (!token) return false

  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.append('remoteip', ip)

  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    })
    const data = await r.json()
    if (!data.success) console.warn('[Turnstile] Failed:', data['error-codes'])
    return data.success === true
  } catch (e) {
    console.error('[Turnstile] Verification error:', e.message)
    return false
  }
}

// Static files (pre-built dist committed to git)
app.use(express.static(path.join(__dirname, '../dist')))

// ── POST /api/recommend ──────────────────────────────────────────
// 1. Run the deterministic scoring engine (fast, always works)
// 2. Enrich with Claude API if ANTHROPIC_API_KEY is set
// 3. Return enriched recommendation (or base if enrichment fails)
app.post('/api/recommend', async (req, res) => {
  try {
    const { answers, lang = 'fr', turnstileToken } = req.body
    if (!answers) return res.status(400).json({ error: 'answers required' })

    // Verify Cloudflare Turnstile bot check
    const ip = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim()
    const humanVerified = await verifyTurnstile(turnstileToken, ip)
    if (!humanVerified) return res.status(403).json({ error: 'Bot check failed. Please refresh and try again.' })

    const base = computeRecommendation(answers)
    if (!base) return res.status(400).json({ error: 'invalid answers' })

    const result = await enrichWithClaude(base, answers, lang)
    res.json(result)
  } catch (e) {
    console.error('[/api/recommend]', e)
    res.status(500).json({ error: e.message })
  }
})

// Health check (used by Railway)
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Status — shows whether Claude API key is configured
app.get('/api/status', (_req, res) => res.json({ claudeApiKey: !!process.env.ANTHROPIC_API_KEY }))

// SPA fallback — all other GET routes serve the React app
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Lab-AI-Finance server → http://localhost:${PORT}`)
  console.log(`Claude API:  ${process.env.ANTHROPIC_API_KEY    ? '✓ connected' : '✗ no key — using base engine'}`)
  console.log(`Turnstile:   ${process.env.TURNSTILE_SECRET_KEY  ? '✓ enabled'   : '✗ no key — bot check disabled'}`)
})
