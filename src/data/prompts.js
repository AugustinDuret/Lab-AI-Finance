// src/data/prompts.js
// Prompts Australe - Promptothèque Finance officielle
// Source : Promptothèque Finance Australe (40 prompts validés sur Claude Sonnet)

export const PROMPT_LIBRARY = [
  {
    id: 'variance_bridge',
    taskIds: ['variance_analysis', 'pl_analysis_by_bu'],
    labelFr: 'Bridge Actuals vs Budget',
    labelEn: 'Actuals vs Budget Bridge',
    promptFr: `Tu es un directeur financier senior spécialisé en FP&A.
Analyse les données financières ci-dessous et construis un bridge Actuals vs Budget.

DONNÉES :
Entité : [ENTITE] | Période : [PERIODE] | Devise : [DEVISE]
Revenus Actuals : [ACTUALS_REVENUS] | Revenus Budget : [BUDGET_REVENUS]
EBITDA Actuals : [ACTUALS_EBITDA] | EBITDA Budget : [BUDGET_EBITDA]
[Ajouter les autres lignes P&L si disponibles]

INSTRUCTIONS :
1. Calcule les écarts absolus et en % pour chaque ligne
2. Décompose l'écart de revenus en effets Volume / Prix / Mix si les données le permettent
3. Identifie les 3 principaux drivers d'écart (positifs et négatifs)
4. Ne commente que les postes dont l'écart dépasse [SEUIL_MATERIALITY]
5. Rédige une narrative de synthèse de 3-5 phrases pour le management
6. Propose 2-3 questions à investiguer

FORMAT DE SORTIE :
- Tableau bridge (postes / Actuals / Budget / Écart € / Écart %)
- Liste des drivers clés avec quantification
- Narrative de synthèse management
- Questions d'investigation`,
    promptEn: `You are a senior FP&A Director.
Analyse the financial data below and build an Actuals vs Budget bridge.

DATA:
Entity: [ENTITE] | Period: [PERIODE] | Currency: [DEVISE]
Actuals Revenue: [ACTUALS_REVENUS] | Budget Revenue: [BUDGET_REVENUS]
Actuals EBITDA: [ACTUALS_EBITDA] | Budget EBITDA: [BUDGET_EBITDA]
[Add other P&L lines if available]

INSTRUCTIONS:
1. Calculate absolute and % variances for each line
2. Break down revenue variance into Volume / Price / Mix effects if data allows
3. Identify the 3 main variance drivers (positive and negative)
4. Only comment on items where variance exceeds [SEUIL_MATERIALITY]
5. Write a 3-5 sentence management narrative
6. Suggest 2-3 questions to investigate

OUTPUT FORMAT:
- Bridge table (lines / Actuals / Budget / Variance / Variance %)
- Key drivers list with quantification
- Management narrative
- Investigation questions`
  },
  {
    id: 'volume_price_mix',
    taskIds: ['variance_analysis'],
    labelFr: 'Analyse Prix / Volume / Mix',
    labelEn: 'Volume / Price / Mix Analysis',
    promptFr: `Tu es un analyste FP&A expert en analyse de revenus.
Décompose l'écart de revenus entre [PERIODE_COMP] et [PERIODE_REF] en trois effets : Volume, Prix et Mix.

DONNÉES :
Devise : [DEVISE]
[DONNEES_VOLUMES_PRIX_MIX]

INSTRUCTIONS :
1. Calcule l'Effet Volume = (Volume N - Volume N-1) x Prix N-1
2. Calcule l'Effet Prix = (Prix N - Prix N-1) x Volume N
3. Calcule l'Effet Mix = Écart total - Effet Volume - Effet Prix
4. Présente un tableau récapitulatif avec contribution en € et en %
5. Identifie le driver dominant et explique son impact stratégique en 2-3 phrases`,
    promptEn: `You are an expert FP&A analyst specialising in revenue analysis.
Break down the revenue variance between [PERIODE_COMP] and [PERIODE_REF] into three effects: Volume, Price, and Mix.

DATA:
Currency: [DEVISE]
[DONNEES_VOLUMES_PRIX_MIX]

INSTRUCTIONS:
1. Calculate Volume Effect = (Volume N - Volume N-1) x Price N-1
2. Calculate Price Effect = (Price N - Price N-1) x Volume N
3. Calculate Mix Effect = Total Variance - Volume Effect - Price Effect
4. Present a summary table with contribution in currency and %
5. Identify the dominant driver and explain its strategic impact in 2-3 sentences`
  },
  {
    id: 'board_pack_narrative',
    taskIds: ['board_pack_commentary', 'codir_presentation', 'internal_financial_communication'],
    labelFr: "Narrative d'écarts pour le management",
    labelEn: 'Management Variance Commentary',
    promptFr: `Tu es un contrôleur de gestion senior.
Rédige les commentaires de gestion pour le management pack à partir des écarts clés ci-dessous.

CONTEXTE :
Entité : [ENTITE] | Période : [PERIODE] | Audience : [AUDIENCE]
ÉCARTS CLÉS : [ECARTS_CLES]

INSTRUCTIONS :
1. Structure les commentaires par rubrique : Revenus, Marge, Charges, EBITDA
2. Pour chaque rubrique : écart quantifié + explication factuelle + action/outlook
3. Adapte le niveau de détail à l'audience [AUDIENCE]
4. Langue souhaitée : français
5. Format : paragraphes courts, style management pack`,
    promptEn: `You are a senior management controller.
Draft the management commentary for the management pack based on the key variances below.

CONTEXT:
Entity: [ENTITE] | Period: [PERIODE] | Audience: [AUDIENCE]
KEY VARIANCES: [ECARTS_CLES]

INSTRUCTIONS:
1. Structure commentary by section: Revenue, Margin, Costs, EBITDA
2. For each section: quantified variance + factual explanation + action/outlook
3. Adapt level of detail to [AUDIENCE]
4. Format: short paragraphs, management pack style`
  },
  {
    id: 'scenario_analysis',
    taskIds: ['sensitivity_scenarios', 'budget_forecast_narrative'],
    labelFr: 'Scénarios Bull / Base / Bear',
    labelEn: 'Bull / Base / Bear Scenarios',
    promptFr: `Tu es un directeur FP&A.
Construis une analyse de scénarios Bull / Base / Bear pour [ENTITE] sur la période [PERIODE].

VARIABLES CLÉS : [VARIABLES_CLES]
Hypothèses Bull : [HYPOTHESES_BULL]
Hypothèses Base : [HYPOTHESES_BASE]
Hypothèses Bear : [HYPOTHESES_BEAR]

INSTRUCTIONS :
1. Pour chaque scénario : définis les hypothèses chiffrées sur les variables clés
2. Calcule le P&L dans chaque scénario
3. Présente les écarts entre scénarios en absolu et en %
4. Identifie les 2-3 variables ayant le plus grand impact
5. Format : tableau de synthèse + commentary`,
    promptEn: `You are an FP&A Director.
Build a Bull / Base / Bear scenario analysis for [ENTITE] over the period [PERIODE].

KEY VARIABLES: [VARIABLES_CLES]
Bull assumptions: [HYPOTHESES_BULL]
Base assumptions: [HYPOTHESES_BASE]
Bear assumptions: [HYPOTHESES_BEAR]

INSTRUCTIONS:
1. For each scenario: define quantified assumptions on key variables
2. Calculate the P&L in each scenario
3. Present variances between scenarios in absolute and %
4. Identify the 2-3 variables with the greatest impact
5. Format: summary table + commentary`
  },
  {
    id: 'flash_report',
    taskIds: ['board_pack_commentary', 'recurring_reporting_automation', 'monthly_close_checklist'],
    labelFr: 'Flash Report P&L mensuel',
    labelEn: 'Monthly P&L Flash Report',
    promptFr: `Tu es un directeur financier qui doit produire un flash report mensuel.
Rédige un flash report P&L pour [ENTITE] pour la période [PERIODE].

DONNÉES :
CA Actuals : [CA_ACTUALS] | CA Budget : [CA_BUDGET]
EBITDA Actuals : [EBITDA_ACTUALS] | EBITDA Budget : [EBITDA_BUDGET]
Éléments clés : [ELEMENTS_CLES]

INSTRUCTIONS :
1. Une page maximum
2. Structure : Titre / KPIs clés / Faits marquants (3 max) / Alerte si écart > seuil / Outlook
3. Chiffres en M€ avec écarts vs budget en absolu et %
4. Ton : factuel, direct, sans jargon inutile
5. Prêt à être envoyé par email au CODIR`,
    promptEn: `You are a CFO who needs to produce a monthly flash report.
Draft a P&L flash report for [ENTITE] for the period [PERIODE].

DATA:
Revenue Actuals: [CA_ACTUALS] | Revenue Budget: [CA_BUDGET]
EBITDA Actuals: [EBITDA_ACTUALS] | EBITDA Budget: [EBITDA_BUDGET]
Key items: [ELEMENTS_CLES]

INSTRUCTIONS:
1. One page maximum
2. Structure: Title / Key KPIs / Key facts (3 max) / Alert if variance > threshold / Outlook
3. Figures in M€ with variances vs budget in absolute and %
4. Tone: factual, direct, no unnecessary jargon
5. Ready to be sent by email to ExCom`
  },
  {
    id: 'due_diligence',
    taskIds: ['due_diligence_structuring'],
    labelFr: 'Due diligence financière - check-list',
    labelEn: 'Financial Due Diligence Checklist',
    promptFr: `Tu es un directeur M&A.
Construis une check-list de due diligence financière pour l'acquisition de [NOM_CIBLE], société [SECTEUR] de taille [TAILLE_CIBLE].

CONTEXTE :
Délai DD : [DELAI_DD] | Conseils externes : [CONSEILS_EXTERNES]

STRUCTURE DE LA CHECK-LIST :
1. Documents financiers historiques (3-5 ans)
2. Qualité des earnings (normalisation, éléments non-récurrents)
3. Bilan et dette (structure, covenants, engagements hors bilan)
4. BFR et cash conversion
5. Capex et état des actifs
6. Fiscalité et compliance
7. Red flags spécifiques au secteur [SECTEUR]

Pour chaque item : priorité (haute/moyenne/basse), documents requis, risque associé`,
    promptEn: `You are an M&A Director.
Build a financial due diligence checklist for the acquisition of [NOM_CIBLE], a [SECTEUR] company of [TAILLE_CIBLE].

CONTEXT:
DD timeline: [DELAI_DD] | External advisors: [CONSEILS_EXTERNES]

CHECKLIST STRUCTURE:
1. Historical financial documents (3-5 years)
2. Earnings quality (normalisation, non-recurring items)
3. Balance sheet and debt (structure, covenants, off-balance sheet)
4. Working capital and cash conversion
5. Capex and asset condition
6. Tax and compliance
7. Sector-specific red flags for [SECTEUR]

For each item: priority (high/medium/low), required documents, associated risk`
  },
  {
    id: 'investment_memo',
    taskIds: ['investment_memo'],
    labelFr: "Mémo d'investissement - synthèse executive",
    labelEn: 'Investment Memo - Executive Summary',
    promptFr: `Tu es un directeur M&A préparant un mémo pour le board.
Rédige la synthèse executive du mémo d'investissement pour l'acquisition de [CIBLE].

CONTEXTE :
Secteur : [SECTEUR] | Prix d'acquisition : [PRIX_ACQUISITION]
Thèse d'investissement : [THESE_INVESTISSEMENT]
Synergies : [SYNERGIES] | Risques clés : [RISQUES_CLES]
Retour attendu : [RETOUR_ATTENDU]

INSTRUCTIONS :
1. Thèse d'investissement en 3 points (pourquoi maintenant, pourquoi cette cible)
2. Financials clés (EV, multiples d'entrée, synergies, TRI)
3. Risques clés et mitigants
4. Conditions suspensives et prochaines étapes
5. Format : note executive 1-2 pages, langage board`,
    promptEn: `You are an M&A Director preparing a memo for the board.
Draft the executive summary of the investment memo for the acquisition of [CIBLE].

CONTEXT:
Sector: [SECTEUR] | Acquisition price: [PRIX_ACQUISITION]
Investment thesis: [THESE_INVESTISSEMENT]
Synergies: [SYNERGIES] | Key risks: [RISQUES_CLES]
Expected return: [RETOUR_ATTENDU]

INSTRUCTIONS:
1. Investment thesis in 3 points (why now, why this target)
2. Key financials (EV, entry multiples, synergies, IRR)
3. Key risks and mitigants
4. Conditions precedent and next steps
5. Format: executive note 1-2 pages, board language`
  },
  {
    id: 'pricing_decision',
    taskIds: ['pricing_margin'],
    labelFr: 'Support décision pricing',
    labelEn: 'Pricing Decision Support',
    promptFr: `Tu es un directeur Commercial Finance.
Analyse l'impact financier d'une modification de prix sur [PRODUIT].

DONNÉES :
Prix actuel : [PRIX_ACTUEL] | Prix envisagé : [PRIX_ENVISAGE]
Volume actuel : [VOLUME_ACTUEL] | Élasticité estimée : [ELASTICITE_ESTIMEE]
Coûts variables : [COUTS_VARIABLES] | Contexte concurrentiel : [CONTEXTE_CONCURRENTIEL]

INSTRUCTIONS :
1. Calcule l'impact sur la marge brute dans 3 scénarios de volume (-10%, 0%, +10%)
2. Détermine le seuil de volume minimum pour maintenir la marge actuelle
3. Analyse l'élasticité-prix et son impact sur la part de marché
4. Évalue la cohérence avec le positionnement concurrentiel
5. Recommandation chiffrée avec risk/reward`,
    promptEn: `You are a Commercial Finance Director.
Analyse the financial impact of a pricing change on [PRODUIT].

DATA:
Current price: [PRIX_ACTUEL] | Target price: [PRIX_ENVISAGE]
Current volume: [VOLUME_ACTUEL] | Estimated elasticity: [ELASTICITE_ESTIMEE]
Variable costs: [COUTS_VARIABLES] | Competitive context: [CONTEXTE_CONCURRENTIEL]

INSTRUCTIONS:
1. Calculate the gross margin impact in 3 volume scenarios (-10%, 0%, +10%)
2. Determine the minimum volume threshold to maintain current margin
3. Analyse price elasticity and its market share impact
4. Assess consistency with competitive positioning
5. Quantified recommendation with risk/reward`
  },
  {
    id: 'cash_flow_forecast',
    taskIds: ['budget_forecast_narrative', 'sensitivity_scenarios'],
    labelFr: 'Cash Flow Forecast - 13 semaines',
    labelEn: 'Cash Flow Forecast - 13 Weeks',
    promptFr: `Tu es un trésorier senior. Analyse et structure un cash flow forecast 13 semaines.

CONTEXTE :
Entité : [ENTITE] | Date de début : [DATE_DEBUT]
Solde initial : [SOLDE_INITIAL] | Seuil d'alerte : [SEUIL_ALERTE_TRESORERIE]

FLUX ENCAISSEMENTS :
[FLUX_ENCAISSEMENTS]

FLUX DÉCAISSEMENTS :
[FLUX_DECAISSEMENTS]

INSTRUCTIONS :
1. Construis le tableau de flux semaine par semaine (S1 à S13)
2. Distingue les flux certains vs estimés (marquer avec *)
3. Calcule le solde de clôture cumulé chaque semaine
4. Signale les semaines où le solde passe sous le seuil d'alerte
5. Propose 2-3 actions si une tension de trésorerie est identifiée`,
    promptEn: `You are a senior treasurer. Analyse and structure a 13-week cash flow forecast.

CONTEXT:
Entity: [ENTITE] | Start date: [DATE_DEBUT]
Opening balance: [SOLDE_INITIAL] | Alert threshold: [SEUIL_ALERTE_TRESORERIE]

CASH INFLOWS:
[FLUX_ENCAISSEMENTS]

CASH OUTFLOWS:
[FLUX_DECAISSEMENTS]

INSTRUCTIONS:
1. Build the week-by-week cash flow table (W1 to W13)
2. Distinguish certain vs estimated flows (mark with *)
3. Calculate the cumulative closing balance each week
4. Flag weeks where balance falls below the alert threshold
5. Propose 2-3 actions if a cash tension is identified`
  },
  {
    id: 'capex_roi',
    taskIds: ['make_or_buy_roi', 'kpi_dashboard_design'],
    labelFr: 'Capex Planning et justification ROI',
    labelEn: 'Capex Planning and ROI Justification',
    promptFr: `Tu es un directeur financier expert en gestion des investissements.
Structure le plan Capex et calcule le ROI pour les projets suivants de [ENTITE] - [ANNEE].

PROJETS :
[PROJETS_CAPEX]
Investissement initial : [CAPEX_INITIAL] | Gains attendus : [GAINS_ATTENDUS]
Taux d'actualisation : [TAUX_ACTUALISATION] | Horizon : [HORIZON_ANALYSE] ans

INSTRUCTIONS :
1. Pour chaque projet : calcule VAN, TRI, Payback period
2. Présente une analyse coût-bénéfice avec hypothèses
3. Classe les projets par priorité (ROI, stratégie, risque)
4. Analyse de sensibilité ±20% sur les hypothèses clés
5. Recommandation d'arbitrage avec justification`,
    promptEn: `You are a CFO expert in investment management.
Structure the Capex plan and calculate the ROI for the following projects of [ENTITE] - [ANNEE].

PROJECTS:
[PROJETS_CAPEX]
Initial investment: [CAPEX_INITIAL] | Expected gains: [GAINS_ATTENDUS]
Discount rate: [TAUX_ACTUALISATION] | Horizon: [HORIZON_ANALYSE] years

INSTRUCTIONS:
1. For each project: calculate NPV, IRR, Payback period
2. Present a cost-benefit analysis with assumptions
3. Rank projects by priority (ROI, strategy, risk)
4. Sensitivity analysis ±20% on key assumptions
5. Arbitration recommendation with justification`
  },
  {
    id: 'monthly_close',
    taskIds: ['monthly_close_checklist'],
    labelFr: 'Check-list clôture mensuelle',
    labelEn: 'Monthly Close Checklist',
    promptFr: `Tu es un contrôleur de gestion senior expert en processus de clôture.
Génère une check-list complète de clôture mensuelle pour [ENTITE] - [PERIODE].

CONTEXTE :
Équipe : [TAILLE_EQUIPE] | Systèmes : [ERP] / [BI] | Délai de clôture actuel : [DELAI_ACTUEL] jours

CHECK-LIST À GÉNÉRER :
1. J-3 avant clôture : tâches préparatoires (rapprochements, cut-off)
2. J-1 : vérifications préalables (intercos, provisions, courus)
3. J0 : clôture comptable (saisies finales, lettrage, revue soldes)
4. J+1 à J+3 : reporting (P&L flash, KPIs, validation management)
5. J+5 : analyse et commentaires

Pour chaque tâche : responsable, durée estimée, outil utilisé, dépendances, risque si non fait`,
    promptEn: `You are a senior management controller expert in month-end close processes.
Generate a complete monthly close checklist for [ENTITE] - [PERIODE].

CONTEXT:
Team: [TAILLE_EQUIPE] | Systems: [ERP] / [BI] | Current close duration: [DELAI_ACTUEL] days

CHECKLIST TO GENERATE:
1. D-3 before close: preparatory tasks (reconciliations, cut-off)
2. D-1: pre-close checks (intercos, provisions, accruals)
3. D0: accounting close (final entries, clearing, balance review)
4. D+1 to D+3: reporting (P&L flash, KPIs, management sign-off)
5. D+5: analysis and commentary

For each task: owner, estimated duration, tool used, dependencies, risk if not completed`
  },
  {
    id: 'kpi_dashboard',
    taskIds: ['kpi_dashboard_design'],
    labelFr: 'Conception KPI Dashboard Finance',
    labelEn: 'Finance KPI Dashboard Design',
    promptFr: `Tu es un expert en dataviz et pilotage de la performance Finance.
Conçois un KPI dashboard Finance pour [ENTITE] destiné à [AUDIENCE].

CONTEXTE :
Secteur : [SECTEUR] | Fréquence : [FREQUENCE] | Outil BI : [OUTIL_BI]
Objectifs stratégiques : [OBJECTIFS]

LIVRABLES :
1. Sélection des 8-12 KPIs les plus pertinents (avec formule de calcul pour chacun)
2. Structure du dashboard : en-tête executive (3-4 KPIs clés) + sections détaillées
3. Pour chaque KPI : définition, fréquence, source de données, seuils alerte (rouge/orange/vert)
4. Hiérarchie visuelle recommandée (quoi afficher en premier, logique de lecture)
5. 3 indicateurs avancés (leading indicators) à surveiller`,
    promptEn: `You are an expert in data visualisation and Finance performance management.
Design a Finance KPI dashboard for [ENTITE] aimed at [AUDIENCE].

CONTEXT:
Sector: [SECTEUR] | Frequency: [FREQUENCE] | BI tool: [OUTIL_BI]
Strategic objectives: [OBJECTIFS]

DELIVERABLES:
1. Selection of 8-12 most relevant KPIs (with calculation formula for each)
2. Dashboard structure: executive header (3-4 key KPIs) + detailed sections
3. For each KPI: definition, frequency, data source, alert thresholds (red/amber/green)
4. Recommended visual hierarchy (what to show first, reading logic)
5. 3 leading indicators to monitor`
  },
  {
    id: 'lbo_dcf',
    taskIds: ['lbo_dcf_logic'],
    labelFr: 'Modélisation LBO / DCF - logique',
    labelEn: 'LBO / DCF Modelling Logic',
    promptFr: `Tu es un directeur M&A avec 15 ans d'expérience en private equity et banque d'affaires.
Valide et critique la logique financière d'un modèle LBO/DCF pour [CIBLE].

HYPOTHÈSES DU MODÈLE :
Prix d'acquisition : [EV] | Dette/Equity : [LEVERAGE] | Taux : [TAUX_DETTE]
Croissance CA : [CAGR_CA] | Marge EBITDA cible : [MARGE_EBITDA]
Horizon de sortie : [HORIZON] ans | Multiple de sortie : [MULTIPLE_SORTIE]x

INSTRUCTIONS :
1. Critique les hypothèses (réalisme sectoriel, cohérence cycle économique)
2. Calcule le TRI equity et le MOIC dans le scénario base
3. Identifie les 3 hypothèses les plus sensibles (analyse de sensibilité croisée)
4. Analyse la structure de dette (couverture intérêt, covenant headroom)
5. Scénario de stress : que se passe-t-il si CA -15% et marge -200bp ?
6. Points de due diligence à approfondir avant LOI`,
    promptEn: `You are an M&A Director with 15 years of experience in private equity and investment banking.
Validate and critique the financial logic of an LBO/DCF model for [CIBLE].

MODEL ASSUMPTIONS:
Acquisition price: [EV] | Debt/Equity: [LEVERAGE] | Rate: [TAUX_DETTE]
Revenue growth: [CAGR_CA] | Target EBITDA margin: [MARGE_EBITDA]
Exit horizon: [HORIZON] years | Exit multiple: [MULTIPLE_SORTIE]x

INSTRUCTIONS:
1. Critique the assumptions (sector realism, economic cycle consistency)
2. Calculate equity IRR and MOIC in the base scenario
3. Identify the 3 most sensitive assumptions (cross sensitivity analysis)
4. Analyse the debt structure (interest coverage, covenant headroom)
5. Stress scenario: what happens if revenue -15% and margin -200bp?
6. Due diligence items to deepen before LOI`
  },
  {
    id: 'sql_finance',
    taskIds: ['sql_queries', 'data_analysis_upload'],
    labelFr: 'Requêtes SQL Finance - extraction et analyse',
    labelEn: 'Finance SQL Queries - Extract and Analyse',
    promptFr: `Tu es un expert en bases de données financières et SQL.
Rédige les requêtes SQL pour extraire et analyser les données financières suivantes depuis [BASE_DE_DONNEES].

SCHÉMA DISPONIBLE :
Tables : [TABLES_DISPONIBLES]
Période d'analyse : [PERIODE] | Granularité : [GRANULARITE]

REQUÊTES À PRODUIRE :
1. P&L par BU et par mois (CA, marge brute, EBITDA) avec comparatif N-1
2. Top 10 clients par CA et évolution vs période précédente
3. Analyse des charges par nature et centre de coût (top 15)
4. BFR : calcul DSO, DPO, DIO avec évolution mensuelle
5. Alert requête : identifier les anomalies (écarts > 20% vs budget, doublons, valeurs nulles)

Pour chaque requête : commentaires explicatifs + index recommandés pour la performance`,
    promptEn: `You are an expert in financial databases and SQL.
Write SQL queries to extract and analyse the following financial data from [BASE_DE_DONNEES].

AVAILABLE SCHEMA:
Tables: [TABLES_DISPONIBLES]
Analysis period: [PERIODE] | Granularity: [GRANULARITE]

QUERIES TO PRODUCE:
1. P&L by BU and month (revenue, gross margin, EBITDA) with YoY comparison
2. Top 10 customers by revenue and evolution vs previous period
3. Cost analysis by nature and cost centre (top 15)
4. Working capital: DSO, DPO, DIO calculation with monthly trend
5. Alert query: identify anomalies (variances > 20% vs budget, duplicates, null values)

For each query: explanatory comments + recommended indexes for performance`
  },
  {
    id: 'business_review',
    taskIds: ['business_review_prep', 'pl_analysis_by_bu'],
    labelFr: 'Business Review - préparation complète',
    labelEn: 'Business Review - Full Preparation',
    promptFr: `Tu es un business partner Finance préparant la Business Review mensuelle.
Structure et prépare la Business Review de [ENTITE] pour la période [PERIODE].

PARTICIPANTS : [PARTICIPANTS] | Durée : [DUREE]
DONNÉES DISPONIBLES : [DONNEES_DISPONIBLES]

STRUCTURE DE LA BUSINESS REVIEW :
1. Synthèse executive (1 slide) : KPIs clés, message principal, 1 décision à prendre
2. Performance commerciale : revenus, volume, mix, pipeline et forecast
3. Performance opérationnelle : marges, coûts, écarts vs budget
4. Analyse comparative : vs N-1, vs budget, vs benchmark sectoriel si disponible
5. Points d'attention (max 3) : faits, causes, actions correctrices proposées
6. Outlook : révision forecast, hypothèses, risques et opportunités

Pour chaque section : chiffres clés à inclure, questions à anticiper, slide suggéré`,
    promptEn: `You are a Finance Business Partner preparing the monthly Business Review.
Structure and prepare the Business Review for [ENTITE] for the period [PERIODE].

PARTICIPANTS: [PARTICIPANTS] | Duration: [DUREE]
AVAILABLE DATA: [DONNEES_DISPONIBLES]

BUSINESS REVIEW STRUCTURE:
1. Executive summary (1 slide): key KPIs, main message, 1 decision needed
2. Commercial performance: revenue, volume, mix, pipeline and forecast
3. Operational performance: margins, costs, variances vs budget
4. Comparative analysis: vs prior year, vs budget, vs sector benchmark if available
5. Watch items (max 3): facts, root causes, proposed corrective actions
6. Outlook: forecast revision, assumptions, risks and opportunities

For each section: key figures to include, questions to anticipate, suggested slide`
  }
]

// Fonction pour sélectionner les prompts les plus pertinents selon les tâches
export function getPromptsForTasks(selectedTaskIds, lang = 'fr', maxCount = 3) {
  if (!selectedTaskIds || selectedTaskIds.length === 0) {
    return PROMPT_LIBRARY.slice(0, maxCount)
  }

  const matched = []
  const seen = new Set()

  // Priorité aux prompts qui matchent les tâches sélectionnées
  for (const taskId of selectedTaskIds) {
    for (const prompt of PROMPT_LIBRARY) {
      if (prompt.taskIds.includes(taskId) && !seen.has(prompt.id)) {
        seen.add(prompt.id)
        matched.push(prompt)
        if (matched.length >= maxCount) return matched
      }
    }
  }

  // Compléter si nécessaire
  for (const prompt of PROMPT_LIBRARY) {
    if (!seen.has(prompt.id)) {
      matched.push(prompt)
      if (matched.length >= maxCount) break
    }
  }

  return matched.slice(0, maxCount)
}
