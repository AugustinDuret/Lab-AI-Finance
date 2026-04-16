import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import { computeRecommendation } from '../src/engine/recommendationEngine.js'
import { enrichWithClaude } from './enrichWithClaude.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(express.json())

// Static files (pre-built dist committed to git)
app.use(express.static(path.join(__dirname, '../dist')))

// ── POST /api/recommend ──────────────────────────────────────────
// 1. Run the deterministic scoring engine (fast, always works)
// 2. Enrich with Claude API if ANTHROPIC_API_KEY is set
// 3. Return enriched recommendation (or base if enrichment fails)
app.post('/api/recommend', async (req, res) => {
  try {
    const { answers, lang = 'fr' } = req.body
    if (!answers) return res.status(400).json({ error: 'answers required' })

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

// SPA fallback — all other GET routes serve the React app
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Lab-AI-Finance server → http://localhost:${PORT}`)
  console.log(`Claude API: ${process.env.ANTHROPIC_API_KEY ? '✓ connected' : '✗ no key — using base engine'}`)
})
