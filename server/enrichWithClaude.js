import Anthropic from '@anthropic-ai/sdk'
import { TASKS_BY_ID } from '../src/data/tasks.js'

const TOOL_NAMES = {
  copilot: 'Microsoft Copilot',
  claude:  'Claude (Anthropic)',
  chatgpt: 'ChatGPT (OpenAI)',
  gemini:  'Google Gemini',
  mistral: 'Mistral AI',
}

// ── Build the Claude prompt for one tool result ──────────────────
function buildPrompt(result, answers, lang) {
  const { toolId, score, dimScores, taskDetails } = result
  const {
    functions        = [],
    teamSize         = '',
    ecosystem        = 'unknown',
    dataSensitivity  = 'medium',
    budget           = '',
    dsiValidation    = 'unknown',
  } = answers

  const fr       = lang === 'fr'
  const toolName = TOOL_NAMES[toolId] || toolId

  const taskLines = taskDetails.length > 0
    ? taskDetails.map(td => {
        const task  = TASKS_BY_ID[td.taskId]
        const label = task ? (fr ? task.labelFr : task.labelEn) : td.taskId
        return `- ${label} : ${td.score}/100 (${td.level})`
      }).join('\n')
    : fr ? '(aucune tâche spécifique sélectionnée)' : '(no specific tasks selected)'

  const ecoLabel = {
    microsoft365: 'Microsoft 365',
    google:       'Google Workspace',
    mixed:        fr ? 'Mixte (M365 + Google)' : 'Mixed (M365 + Google)',
    unknown:      fr ? 'Non défini' : 'Not defined',
  }[ecosystem] || ecosystem

  const sensiLabel = {
    low:    fr ? 'Données anonymisées / agrégées'               : 'Anonymised / aggregated data',
    medium: fr ? 'Données internes sensibles'                   : 'Sensitive internal data',
    high:   fr ? 'Données très sensibles (M&A, conformité…)'   : 'Highly sensitive data (M&A, compliance…)',
  }[dataSensitivity] || dataSensitivity

  const budgetLabel =
    budget === 'free' ? (fr ? 'Version gratuite uniquement' : 'Free tier only') :
    budget === 'paid' ? (fr ? 'Prêt à payer'               : 'Ready to pay')    :
    (fr ? 'Non précisé' : 'Not specified')

  const dsiLabel =
    dsiValidation === 'yes' ? (fr ? 'Requise'   : 'Required')    :
    dsiValidation === 'no'  ? (fr ? 'Non requise' : 'Not required') :
    (fr ? 'Inconnue' : 'Unknown')

  const systemMsg = fr
    ? `Tu es un expert en IA appliquée aux équipes Finance. Génère une analyse personnalisée et factuelle,
spécifique au profil ci-dessous. Réponds UNIQUEMENT avec du JSON valide, sans texte avant ni après, sans markdown.
LANGUE OBLIGATOIRE : tout le contenu texte du JSON (whyPersonalized, limitationsPersonalized, dimNarratives) doit être rédigé ENTIÈREMENT EN FRANÇAIS. Aucun mot ni phrase en anglais, à l'exception des noms propres d'outils (Copilot, Claude, ChatGPT, Gemini, Mistral, Excel, Teams, etc.).`
    : `You are an expert in AI for Finance teams. Generate a personalised, factual analysis specific to the profile below.
Respond ONLY with valid JSON, no text before or after, no markdown.
MANDATORY LANGUAGE: all text content in the JSON (whyPersonalized, limitationsPersonalized, dimNarratives) must be written ENTIRELY IN ENGLISH. No words or sentences in any other language, except proper nouns for tools (Copilot, Claude, ChatGPT, Gemini, Mistral, Excel, Teams, etc.).`

  const userMsg = fr
    ? `PROFIL UTILISATEUR :
- Fonctions Finance : ${functions.length ? functions.join(', ') : 'Non précisé'}
- Taille d'équipe : ${teamSize || 'Non précisé'}
- Écosystème IT : ${ecoLabel}
- Sensibilité des données : ${sensiLabel}
- Budget : ${budgetLabel}
- Validation DSI : ${dsiLabel}

OUTIL RECOMMANDÉ : ${toolName} - Score ${score}/100

SCORES PAR DIMENSION :
- Qualité analytique (40 %) : ${dimScores.q}/100
- Intégration workflow (30 %) : ${dimScores.w}/100
- Traçabilité / Audit (20 %) : ${dimScores.t}/100
- Gouvernance IT (10 %) : ${dimScores.g}/100

TÂCHES AVEC SCORES :
${taskLines}

Génère un JSON avec exactement cette structure. Remplace chaque "..." par du contenu réel adapté au profil :

whyPersonalized : 3 raisons courtes (max 15 mots chacune) pourquoi cet outil est le meilleur choix pour CE profil précis.
  - [0] : raison liée aux tâches et fonctions Finance sélectionnées
  - [1] : raison liée à l'écosystème IT ou aux contraintes budget/DSI
  - [2] : point fort sur la dimension ayant le score le plus élevé

limitationsPersonalized : 2 limitations courtes (max 15 mots chacune) les plus importantes pour ce profil.
  - [0] : la limitation la plus impactante pour ce profil
  - [1] : une limitation avec un conseil pratique pour la contourner

dimNarratives : 4 textes de 2 phrases chacun, adaptés au profil.
  - q : qualité analytique pour les tâches spécifiques de cet utilisateur
  - w : intégration dans leur écosystème IT spécifique (${ecoLabel})
  - t : traçabilité adaptée à leur niveau de sensibilité données (${sensiLabel})
  - g : gouvernance dans leur contexte DSI (${dsiLabel})

RAPPEL : rédige tout le contenu ci-dessous exclusivement en français.

{
  "whyPersonalized": ["...", "...", "..."],
  "limitationsPersonalized": ["...", "..."],
  "dimNarratives": {
    "q": "...",
    "w": "...",
    "t": "...",
    "g": "..."
  }
}`
    : `USER PROFILE:
- Finance functions: ${functions.length ? functions.join(', ') : 'Not specified'}
- Team size: ${teamSize || 'Not specified'}
- IT ecosystem: ${ecoLabel}
- Data sensitivity: ${sensiLabel}
- Budget: ${budgetLabel}
- IT approval: ${dsiLabel}

RECOMMENDED TOOL: ${toolName} - Score ${score}/100

DIMENSION SCORES:
- Analytical quality (40%): ${dimScores.q}/100
- Workflow integration (30%): ${dimScores.w}/100
- Traceability / Audit (20%): ${dimScores.t}/100
- IT Governance (10%): ${dimScores.g}/100

TASKS WITH SCORES:
${taskLines}

Generate a JSON with exactly this structure. Replace each "..." with real content tailored to the profile:

whyPersonalized: 3 short reasons (max 15 words each) why this tool is the best choice for THIS specific profile.
  - [0]: reason tied to the selected Finance tasks and functions
  - [1]: reason tied to IT ecosystem or budget/IT approval constraints
  - [2]: strength on the highest-scoring dimension

limitationsPersonalized: 2 short limitations (max 15 words each) most important for this profile.
  - [0]: the most impactful limitation for this profile
  - [1]: a limitation with a practical workaround

dimNarratives: 4 texts of 2 sentences each, tailored to the profile.
  - q: analytical quality for this user's specific tasks
  - w: integration in their specific IT ecosystem (${ecoLabel})
  - t: traceability for their data sensitivity level (${sensiLabel})
  - g: governance in their IT approval context (${dsiLabel})

REMINDER: write all content below exclusively in English.

{
  "whyPersonalized": ["...", "...", "..."],
  "limitationsPersonalized": ["...", "..."],
  "dimNarratives": {
    "q": "...",
    "w": "...",
    "t": "...",
    "g": "..."
  }
}`

  return { systemMsg, userMsg }
}

// ── Filet de sécurité : détection heuristique de la langue ───────
// Le prompt demande explicitement fr/en, mais un LLM peut parfois
// ignorer la consigne. On vérifie a posteriori et on rejette le
// contenu enrichi (fallback statique) si la langue ne correspond pas.
const FR_MARKERS = [' le ', ' la ', ' les ', ' des ', ' et ', ' pour ', ' vous ', ' votre ', ' avec ', ' dans ', ' cette ', ' une ', ' est ', ' sur ']
const EN_MARKERS = [' the ', ' and ', ' your ', ' with ', ' this ', ' for ', ' is ', ' are ', ' that ', ' from ', ' you ', ' will ']

function matchesLanguage(text, lang) {
  if (!text) return true
  const t = ` ${text.toLowerCase()} `
  const frCount = FR_MARKERS.reduce((n, m) => n + (t.includes(m) ? 1 : 0), 0)
  const enCount = EN_MARKERS.reduce((n, m) => n + (t.includes(m) ? 1 : 0), 0)
  if (lang === 'fr') return frCount >= enCount
  return enCount >= frCount
}

function enrichedContentMatchesLang(enriched, lang) {
  const texts = [
    ...(enriched.whyPersonalized || []),
    ...(enriched.limitationsPersonalized || []),
    ...Object.values(enriched.dimNarratives || {}),
  ]
  // Sur un echantillon trop court on ne peut pas juger fiablement - on laisse passer
  const meaningful = texts.filter(t => typeof t === 'string' && t.length > 20)
  if (meaningful.length === 0) return true
  const mismatches = meaningful.filter(t => !matchesLanguage(t, lang)).length
  // Tolerance : on rejette seulement si une majorite claire des textes sont dans la mauvaise langue
  return mismatches / meaningful.length < 0.5
}

// ── Enrich one result object with Claude ─────────────────────────
const CLAUDE_TIMEOUT_MS = 12000

async function enrichResult(client, result, answers, lang) {
  if (!result) return null
  try {
    const { systemMsg, userMsg } = buildPrompt(result, answers, lang)
    const response = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1024,
      system:     systemMsg,
      messages:   [{ role: 'user', content: userMsg }],
    }, { timeout: CLAUDE_TIMEOUT_MS })
    const raw     = response.content[0].text.trim()
    // Strip optional ```json fences
    const jsonStr = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    const enriched = JSON.parse(jsonStr)

    if (!enrichedContentMatchesLang(enriched, lang)) {
      console.warn(`[Claude] ✗ Language mismatch for ${result.toolId} (expected ${lang}) - falling back to static content`)
      return result
    }

    console.log(`[Claude] ✓ Enriched ${result.toolId} (score ${result.score})`)
    return { ...result, ...enriched, _claudeEnriched: true, _lang: lang }
  } catch (e) {
    console.error(`[Claude] ✗ Enrichment failed for ${result.toolId}:`, e.message)
    return result  // silent fallback to base result
  }
}

// ── Main export ──────────────────────────────────────────────────
export async function enrichWithClaude(recommendation, answers, lang = 'fr') {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('[Claude] No API key - returning base engine result')
    return recommendation
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  // Run both enrichments in parallel
  const [primary, secondary] = await Promise.all([
    enrichResult(client, recommendation.primary,   answers, lang),
    enrichResult(client, recommendation.secondary, answers, lang),
  ])

  return { ...recommendation, primary, secondary }
}
