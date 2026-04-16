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
spécifique au profil ci-dessous. Réponds UNIQUEMENT avec du JSON valide, sans texte avant ni après, sans markdown.`
    : `You are an expert in AI for Finance teams. Generate a personalised, factual analysis specific to the profile below.
Respond ONLY with valid JSON, no text before or after, no markdown.`

  const why1  = fr ? 'Raison 1 — liée aux tâches et fonctions spécifiques de cet utilisateur'  : "Reason 1 — tied to this user's specific tasks and functions"
  const why2  = fr ? 'Raison 2 — lien avec leur écosystème IT ou contraintes budget/DSI'        : 'Reason 2 — link to their IT ecosystem or budget/IT constraints'
  const why3  = fr ? 'Raison 3 — point fort sur la dimension la mieux notée'                    : 'Reason 3 — strength on the highest-scoring dimension'
  const lim1  = fr ? 'Limitation 1 la plus pertinente pour ce profil précis'                    : 'Limitation 1 most relevant to this specific profile'
  const lim2  = fr ? 'Limitation 2 avec conseil pratique pour la contourner'                    : 'Limitation 2 with practical advice to work around it'
  const narQ  = fr ? '2 phrases sur la qualité analytique pour les tâches de cet utilisateur'   : "2 sentences on analytical quality for this user's tasks"
  const narW  = fr ? "2 phrases sur l'intégration dans leur écosystème IT spécifique"           : 'Sentences on integration in their specific IT ecosystem'
  const narT  = fr ? 'Traçabilité adaptée à leur niveau de sensibilité données (2 phrases)'     : 'Traceability for their data sensitivity level (2 sentences)'
  const narG  = fr ? 'Gouvernance dans leur contexte DSI (2 phrases)'                           : 'Governance in their IT approval context (2 sentences)'
  const instr = fr
    ? 'Génère le JSON suivant (max 15 mots par item pour whyPersonalized et limitationsPersonalized, 2 phrases pour les narratives) :'
    : 'Generate the following JSON (max 15 words per item for whyPersonalized and limitationsPersonalized, 2 sentences for narratives):'

  const profileSection = fr ? 'PROFIL UTILISATEUR' : 'USER PROFILE'
  const toolSection    = fr ? 'OUTIL RECOMMANDÉ'   : 'RECOMMENDED TOOL'
  const dimSection     = fr ? 'SCORES PAR DIMENSION' : 'DIMENSION SCORES'
  const taskSection    = fr ? 'TÂCHES AVEC SCORES'   : 'TASKS WITH SCORES'
  const fnLabel        = fr ? 'Fonctions Finance'     : 'Finance functions'
  const tsLabel        = fr ? "Taille d'équipe"       : 'Team size'
  const notSpec        = fr ? 'Non précisé'           : 'Not specified'

  const userMsg = `${profileSection} :
- ${fnLabel} : ${functions.length ? functions.join(', ') : notSpec}
- ${tsLabel} : ${teamSize || notSpec}
- ${fr ? 'Écosystème IT' : 'IT ecosystem'} : ${ecoLabel}
- ${fr ? 'Sensibilité des données' : 'Data sensitivity'} : ${sensiLabel}
- Budget : ${budgetLabel}
- ${fr ? 'Validation DSI' : 'IT approval'} : ${dsiLabel}

${toolSection} : ${toolName} — Score ${score}/100

${dimSection} :
- ${fr ? 'Qualité analytique' : 'Analytical quality'} (40 %) : ${dimScores.q}/100
- ${fr ? 'Intégration workflow' : 'Workflow integration'} (30 %) : ${dimScores.w}/100
- ${fr ? 'Traçabilité / Audit' : 'Traceability / Audit'} (20 %) : ${dimScores.t}/100
- ${fr ? 'Gouvernance IT' : 'IT Governance'} (10 %) : ${dimScores.g}/100

${taskSection} :
${taskLines}

${instr}
{
  "whyPersonalized": ["${why1}", "${why2}", "${why3}"],
  "limitationsPersonalized": ["${lim1}", "${lim2}"],
  "dimNarratives": {
    "q": "${narQ}",
    "w": "${narW}",
    "t": "${narT}",
    "g": "${narG}"
  }
}`

  return { systemMsg, userMsg }
}

// ── Enrich one result object with Claude ─────────────────────────
async function enrichResult(client, result, answers, lang) {
  if (!result) return null
  try {
    const { systemMsg, userMsg } = buildPrompt(result, answers, lang)
    const response = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1024,
      system:     systemMsg,
      messages:   [{ role: 'user', content: userMsg }],
    })
    const raw     = response.content[0].text.trim()
    // Strip optional ```json fences
    const jsonStr = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    const enriched = JSON.parse(jsonStr)
    return { ...result, ...enriched }
  } catch (e) {
    console.error(`[Claude] Enrichment failed for ${result.toolId}:`, e.message)
    return result  // silent fallback to base result
  }
}

// ── Main export ──────────────────────────────────────────────────
export async function enrichWithClaude(recommendation, answers, lang = 'fr') {
  if (!process.env.ANTHROPIC_API_KEY) {
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
