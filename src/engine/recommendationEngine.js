import { TASKS_BY_ID } from '../data/tasks.js'

// ─── MATRICE TASK_TOOL_AFFINITY ────────────────────────────────
// Format : { q: qualité(40%), w: workflow(30%), t: traçabilité(20%), g: gouvernance(10%) }
// Note finale = 0.40×q + 0.30×w + 0.20×t + 0.10×g

const TASK_TOOL_AFFINITY = {
  // ── CATÉGORIE 1 : FP&A & Reporting ──────────────────────────
  variance_analysis: {
    copilot: { q: 55, w: 60, t: 65, g: 75 },
    claude:  { q: 95, w: 55, t: 80, g: 70 },
    chatgpt: { q: 75, w: 55, t: 65, g: 65 },
    gemini:  { q: 55, w: 50, t: 60, g: 65 },
    mistral: { q: 50, w: 40, t: 60, g: 80 },
  },
  board_pack_commentary: {
    copilot: { q: 60, w: 70, t: 65, g: 80 },
    claude:  { q: 95, w: 55, t: 80, g: 70 },
    chatgpt: { q: 75, w: 55, t: 65, g: 65 },
    gemini:  { q: 55, w: 50, t: 60, g: 65 },
    mistral: { q: 55, w: 40, t: 65, g: 80 },
  },
  budget_forecast_narrative: {
    copilot: { q: 60, w: 70, t: 65, g: 75 },
    claude:  { q: 90, w: 55, t: 80, g: 70 },
    chatgpt: { q: 75, w: 55, t: 65, g: 65 },
    gemini:  { q: 55, w: 50, t: 60, g: 65 },
    mistral: { q: 55, w: 40, t: 65, g: 80 },
  },
  monthly_close_checklist: {
    copilot: { q: 65, w: 90, t: 75, g: 85 },
    claude:  { q: 70, w: 50, t: 70, g: 70 },
    chatgpt: { q: 65, w: 50, t: 65, g: 65 },
    gemini:  { q: 60, w: 70, t: 65, g: 70 },
    mistral: { q: 55, w: 40, t: 65, g: 80 },
  },
  excel_data_extraction: {
    copilot: { q: 70, w: 95, t: 75, g: 85 },
    claude:  { q: 75, w: 50, t: 70, g: 70 },
    chatgpt: { q: 70, w: 50, t: 65, g: 65 },
    gemini:  { q: 65, w: 85, t: 65, g: 70 },
    mistral: { q: 45, w: 35, t: 55, g: 80 },
  },
  sensitivity_scenarios: {
    copilot: { q: 60, w: 70, t: 65, g: 75 },
    claude:  { q: 90, w: 50, t: 80, g: 70 },
    chatgpt: { q: 75, w: 50, t: 65, g: 65 },
    gemini:  { q: 60, w: 50, t: 60, g: 65 },
    mistral: { q: 55, w: 40, t: 65, g: 80 },
  },
  codir_presentation: {
    copilot: { q: 65, w: 90, t: 65, g: 80 },
    claude:  { q: 85, w: 50, t: 75, g: 70 },
    chatgpt: { q: 70, w: 50, t: 65, g: 65 },
    gemini:  { q: 60, w: 65, t: 60, g: 65 },
    mistral: { q: 50, w: 40, t: 60, g: 80 },
  },
  recurring_reporting_automation: {
    copilot: { q: 60, w: 95, t: 70, g: 85 },
    claude:  { q: 55, w: 40, t: 65, g: 70 },
    chatgpt: { q: 55, w: 40, t: 65, g: 65 },
    gemini:  { q: 55, w: 80, t: 65, g: 70 },
    mistral: { q: 45, w: 35, t: 60, g: 80 },
  },
  // ── CATÉGORIE 2 : Business Partnering ───────────────────────
  pl_analysis_by_bu: {
    copilot: { q: 60, w: 70, t: 65, g: 75 },
    claude:  { q: 90, w: 50, t: 80, g: 70 },
    chatgpt: { q: 75, w: 50, t: 65, g: 65 },
    gemini:  { q: 55, w: 55, t: 60, g: 65 },
    mistral: { q: 55, w: 40, t: 65, g: 80 },
  },
  business_review_prep: {
    copilot: { q: 60, w: 85, t: 65, g: 80 },
    claude:  { q: 85, w: 50, t: 75, g: 70 },
    chatgpt: { q: 70, w: 50, t: 65, g: 65 },
    gemini:  { q: 60, w: 70, t: 60, g: 65 },
    mistral: { q: 50, w: 40, t: 60, g: 80 },
  },
  pipeline_forecast_review: {
    copilot: { q: 60, w: 75, t: 65, g: 75 },
    claude:  { q: 80, w: 50, t: 70, g: 70 },
    chatgpt: { q: 75, w: 55, t: 65, g: 65 },
    gemini:  { q: 65, w: 75, t: 60, g: 65 },
    mistral: { q: 50, w: 40, t: 60, g: 80 },
  },
  internal_financial_communication: {
    copilot: { q: 60, w: 75, t: 60, g: 80 },
    claude:  { q: 90, w: 50, t: 75, g: 70 },
    chatgpt: { q: 75, w: 50, t: 65, g: 65 },
    gemini:  { q: 60, w: 55, t: 60, g: 65 },
    mistral: { q: 60, w: 40, t: 65, g: 80 },
  },
  sector_benchmark: {
    copilot: { q: 50, w: 60, t: 55, g: 75 },
    claude:  { q: 80, w: 45, t: 70, g: 70 },
    chatgpt: { q: 80, w: 60, t: 65, g: 65 },
    gemini:  { q: 75, w: 65, t: 65, g: 65 },
    mistral: { q: 50, w: 35, t: 60, g: 80 },
  },
  // ── CATÉGORIE 3 : M&A & Stratégie ───────────────────────────
  due_diligence_structuring: {
    copilot: { q: 45, w: 55, t: 65, g: 80 },
    claude:  { q: 95, w: 50, t: 85, g: 65 },
    chatgpt: { q: 75, w: 50, t: 65, g: 60 },
    gemini:  { q: 50, w: 45, t: 55, g: 60 },
    mistral: { q: 60, w: 40, t: 70, g: 90 },
  },
  lbo_dcf_logic: {
    copilot: { q: 50, w: 65, t: 65, g: 75 },
    claude:  { q: 85, w: 50, t: 80, g: 70 },
    chatgpt: { q: 75, w: 50, t: 65, g: 65 },
    gemini:  { q: 50, w: 45, t: 55, g: 65 },
    mistral: { q: 55, w: 40, t: 65, g: 80 },
  },
  investment_memo: {
    copilot: { q: 45, w: 60, t: 65, g: 80 },
    claude:  { q: 95, w: 50, t: 80, g: 65 },
    chatgpt: { q: 75, w: 50, t: 65, g: 60 },
    gemini:  { q: 50, w: 45, t: 55, g: 60 },
    mistral: { q: 60, w: 40, t: 70, g: 90 },
  },
  market_analysis: {
    copilot: { q: 50, w: 60, t: 55, g: 75 },
    claude:  { q: 80, w: 45, t: 70, g: 70 },
    chatgpt: { q: 85, w: 60, t: 65, g: 65 },
    gemini:  { q: 80, w: 65, t: 65, g: 65 },
    mistral: { q: 55, w: 35, t: 60, g: 80 },
  },
  // ── CATÉGORIE 4 : Contrôle de gestion ───────────────────────
  cost_profitability_analysis: {
    copilot: { q: 60, w: 75, t: 65, g: 80 },
    claude:  { q: 90, w: 50, t: 80, g: 70 },
    chatgpt: { q: 75, w: 50, t: 65, g: 65 },
    gemini:  { q: 55, w: 55, t: 60, g: 65 },
    mistral: { q: 55, w: 40, t: 65, g: 80 },
  },
  kpi_dashboard_design: {
    copilot: { q: 65, w: 90, t: 65, g: 80 },
    claude:  { q: 80, w: 45, t: 70, g: 70 },
    chatgpt: { q: 65, w: 45, t: 60, g: 65 },
    gemini:  { q: 65, w: 80, t: 60, g: 70 },
    mistral: { q: 45, w: 35, t: 60, g: 80 },
  },
  make_or_buy_roi: {
    copilot: { q: 55, w: 65, t: 65, g: 75 },
    claude:  { q: 90, w: 50, t: 80, g: 70 },
    chatgpt: { q: 80, w: 50, t: 65, g: 65 },
    gemini:  { q: 55, w: 50, t: 60, g: 65 },
    mistral: { q: 60, w: 40, t: 65, g: 80 },
  },
  budget_control_alerts: {
    copilot: { q: 60, w: 95, t: 70, g: 85 },
    claude:  { q: 60, w: 40, t: 70, g: 70 },
    chatgpt: { q: 55, w: 40, t: 65, g: 65 },
    gemini:  { q: 55, w: 80, t: 65, g: 70 },
    mistral: { q: 45, w: 35, t: 60, g: 80 },
  },
  pricing_margin: {
    copilot: { q: 60, w: 70, t: 65, g: 75 },
    claude:  { q: 90, w: 50, t: 80, g: 70 },
    chatgpt: { q: 80, w: 50, t: 65, g: 65 },
    gemini:  { q: 55, w: 55, t: 60, g: 65 },
    mistral: { q: 60, w: 40, t: 65, g: 80 },
  },
  // ── CATÉGORIE 5 : Audit & Conformité ────────────────────────
  contract_review: {
    copilot: { q: 55, w: 60, t: 65, g: 80 },
    claude:  { q: 90, w: 45, t: 85, g: 65 },
    chatgpt: { q: 75, w: 45, t: 65, g: 60 },
    gemini:  { q: 55, w: 45, t: 60, g: 60 },
    mistral: { q: 65, w: 40, t: 75, g: 90 },
  },
  procedures_documentation: {
    copilot: { q: 60, w: 70, t: 65, g: 85 },
    claude:  { q: 85, w: 50, t: 75, g: 65 },
    chatgpt: { q: 70, w: 50, t: 65, g: 60 },
    gemini:  { q: 60, w: 55, t: 60, g: 65 },
    mistral: { q: 65, w: 40, t: 75, g: 90 },
  },
  external_audit_prep: {
    copilot: { q: 60, w: 70, t: 70, g: 85 },
    claude:  { q: 80, w: 50, t: 80, g: 65 },
    chatgpt: { q: 70, w: 50, t: 65, g: 60 },
    gemini:  { q: 55, w: 50, t: 60, g: 60 },
    mistral: { q: 65, w: 40, t: 80, g: 90 },
  },
  regulatory_compliance: {
    copilot: { q: 50, w: 60, t: 65, g: 85 },
    claude:  { q: 85, w: 45, t: 80, g: 65 },
    chatgpt: { q: 75, w: 45, t: 65, g: 60 },
    gemini:  { q: 55, w: 45, t: 60, g: 60 },
    mistral: { q: 65, w: 40, t: 80, g: 95 },
  },
  // ── CATÉGORIE 6 : Data & BI Finance ─────────────────────────
  data_analysis_upload: {
    copilot: { q: 70, w: 90, t: 70, g: 80 },
    claude:  { q: 80, w: 55, t: 75, g: 70 },
    chatgpt: { q: 80, w: 55, t: 65, g: 65 },
    gemini:  { q: 75, w: 80, t: 65, g: 70 },
    mistral: { q: 45, w: 35, t: 55, g: 80 },
  },
  sql_queries: {
    copilot: { q: 55, w: 65, t: 65, g: 75 },
    claude:  { q: 85, w: 55, t: 75, g: 70 },
    chatgpt: { q: 85, w: 55, t: 65, g: 65 },
    gemini:  { q: 75, w: 65, t: 65, g: 65 },
    mistral: { q: 70, w: 45, t: 65, g: 80 },
  },
  bi_results_interpretation: {
    copilot: { q: 65, w: 90, t: 65, g: 80 },
    claude:  { q: 75, w: 50, t: 70, g: 70 },
    chatgpt: { q: 65, w: 50, t: 60, g: 65 },
    gemini:  { q: 70, w: 80, t: 65, g: 70 },
    mistral: { q: 45, w: 35, t: 55, g: 80 },
  },
  data_cleaning_transformation: {
    copilot: { q: 65, w: 90, t: 70, g: 80 },
    claude:  { q: 75, w: 50, t: 70, g: 70 },
    chatgpt: { q: 75, w: 50, t: 65, g: 65 },
    gemini:  { q: 70, w: 80, t: 65, g: 70 },
    mistral: { q: 45, w: 35, t: 55, g: 80 },
  },
}

// ─── FONCTIONS CORE ───────────────────────────────────────────

function computeScore(dims) {
  return Math.round(0.40 * dims.q + 0.30 * dims.w + 0.20 * dims.t + 0.10 * dims.g)
}

function isEligible(toolId, taskId, isSensitive) {
  if (!isSensitive) return true
  const dims = TASK_TOOL_AFFINITY[taskId]?.[toolId]
  if (!dims) return true
  return dims.g >= 70
}

function getTaskLevel(score) {
  if (score >= 75) return 'excellent'
  if (score >= 60) return 'good'
  return 'limited'
}

// ─── MOTEUR PRINCIPAL ─────────────────────────────────────────

export function computeRecommendation(answers) {
  if (!answers) return null

  const {
    ecosystem       = 'unknown',  // 'microsoft365' | 'google' | 'mixed' | 'unknown'
    dsiValidation   = 'unknown',  // 'yes' | 'no' | 'unknown'
    selectedTasks   = [],         // string[] - IDs des tâches sélectionnées
    budget          = '',         // 'free' | 'paid' | ''
    dataSensitivity = 'medium',   // 'low' | 'medium' | 'high'
  } = answers

  const isSensitive = dataSensitivity === 'high'
  const TOOL_IDS = ['copilot', 'claude', 'chatgpt', 'gemini', 'mistral']

  // 1. Calculer le score moyen par outil sur les tâches sélectionnées
  const baseScores = {}
  TOOL_IDS.forEach(toolId => {
    if (selectedTasks.length === 0) {
      const allTaskIds = Object.keys(TASK_TOOL_AFFINITY)
      const eligible = allTaskIds.filter(taskId => isEligible(toolId, taskId, isSensitive))
      if (eligible.length === 0) { baseScores[toolId] = 0; return }
      const total = eligible.reduce((sum, taskId) => {
        return sum + computeScore(TASK_TOOL_AFFINITY[taskId][toolId])
      }, 0)
      baseScores[toolId] = Math.round(total / eligible.length)
    } else {
      const eligible = selectedTasks.filter(taskId => isEligible(toolId, taskId, isSensitive))
      if (eligible.length === 0) { baseScores[toolId] = 0; return }
      const total = eligible.reduce((sum, taskId) => {
        const dims = TASK_TOOL_AFFINITY[taskId]?.[toolId]
        return sum + (dims ? computeScore(dims) : 50)
      }, 0)
      baseScores[toolId] = Math.round(total / eligible.length)
    }
  })

  // 2. Appliquer les bonus/malus contextuels
  const adjustedScores = { ...baseScores }

  if (ecosystem === 'microsoft365') {
    adjustedScores.copilot = Math.min(100, adjustedScores.copilot + 12)
  }
  if (ecosystem === 'google') {
    adjustedScores.gemini = Math.min(100, adjustedScores.gemini + 12)
  }
  if (dsiValidation === 'no') {
    adjustedScores.copilot = Math.max(0, adjustedScores.copilot - 8)
  }
  const isFreeOnly = budget === 'free'
  if (isFreeOnly) {
    // Copilot nécessite 30$/user/mois minimum - pénaliser fortement
    adjustedScores.copilot = Math.max(0, adjustedScores.copilot - 20)
    // Favoriser les outils avec plan gratuit viable
    adjustedScores.claude  = Math.min(100, adjustedScores.claude  + 5)
    adjustedScores.chatgpt = Math.min(100, adjustedScores.chatgpt + 5)
    adjustedScores.mistral = Math.min(100, adjustedScores.mistral + 5)
  }
  // Si budget paid : aucun ajustement, tous les outils sont accessibles

  // 3. Éliminer les outils avec score 0
  const eligibleTools = TOOL_IDS.filter(id => adjustedScores[id] > 0)

  // 4. Trier
  const ranked = eligibleTools.sort((a, b) => adjustedScores[b] - adjustedScores[a])

  // 5. Construire le détail des tâches pour les 2 premiers outils
  function buildDimScores(toolId, taskIds) {
    const tasks = taskIds.length > 0
      ? taskIds
      : Object.keys(TASK_TOOL_AFFINITY)

    let totalQ = 0, totalW = 0, totalT = 0, totalG = 0, count = 0
    tasks.forEach(taskId => {
      const dims = TASK_TOOL_AFFINITY[taskId]?.[toolId]
      if (dims) {
        totalQ += dims.q
        totalW += dims.w
        totalT += dims.t
        totalG += dims.g
        count++
      }
    })

    if (count === 0) return { q: 0, w: 0, t: 0, g: 0 }
    return {
      q: Math.round(totalQ / count),
      w: Math.round(totalW / count),
      t: Math.round(totalT / count),
      g: Math.round(totalG / count)
    }
  }

  function buildTaskDetail(toolId) {
    if (selectedTasks.length === 0) return []
    const tasks = selectedTasks
    return tasks.map(taskId => {
      const dims = TASK_TOOL_AFFINITY[taskId]?.[toolId]
      const score = dims ? computeScore(dims) : 50
      const eligible = isEligible(toolId, taskId, isSensitive)
      return {
        taskId,
        score: eligible ? score : 0,
        level: eligible ? getTaskLevel(score) : 'limited',
        blocked: !eligible,
      }
    })
  }

  return {
    primary: {
      toolId: ranked[0],
      score: adjustedScores[ranked[0]],
      taskDetails: buildTaskDetail(ranked[0]),
      dimScores: buildDimScores(ranked[0], selectedTasks),
    },
    secondary: ranked[1] ? {
      toolId: ranked[1],
      score: adjustedScores[ranked[1]],
      taskDetails: buildTaskDetail(ranked[1]),
      dimScores: buildDimScores(ranked[1], selectedTasks),
    } : null,
    allScores: adjustedScores,
    isSensitive,
    ecosystem,
  }
}
