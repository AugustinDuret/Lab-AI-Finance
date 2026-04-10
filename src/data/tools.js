export const TOOLS = {
  copilot: {
    id: "copilot",
    nameFr: "Microsoft Copilot",
    nameEn: "Microsoft Copilot",
    logoBg: "#0078D4",
    logoInitial: "Co",
    descFr: "L'assistant IA natif de Microsoft, intégré dans Excel, PowerPoint, Teams et Outlook.",
    descEn: "Microsoft's native AI assistant, integrated in Excel, PowerPoint, Teams and Outlook.",
    moduleNote: {
      trigger: "microsoft365",
      fr: "Priorité : Copilot in Excel pour vos tâches data et reporting",
      en: "Priority: Copilot in Excel for your data and reporting tasks"
    },
    whyFr: [
      "Natif dans Excel et PowerPoint - aucune manipulation supplémentaire pour vos reportings",
      "Intégré à Teams et Outlook - centralise les workflows sans changer vos habitudes de travail",
      "Validé IT dans la plupart des environnements Microsoft 365 - déploiement sans friction DSI"
    ],
    whyEn: [
      "Native in Excel and PowerPoint - no extra steps for your reporting workflows",
      "Integrated with Teams and Outlook - centralises workflows without changing your work habits",
      "IT-approved in most Microsoft 365 environments - frictionless deployment with IT"
    ],
    vigilanceFr: ["Fonctionnalités avancées en anglais en priorité", "Requiert licence Microsoft 365 E3/E5 + add-on Copilot (~30$/user/mois)", "Raisonnement limité sur les analyses complexes multi-étapes"],
    vigilanceEn: ["Advanced features prioritised in English", "Requires Microsoft 365 E3/E5 + Copilot add-on (~$30/user/month)", "Limited reasoning on complex multi-step analyses"],
    budgetFr: "30$/user/mois (add-on Copilot M365). Licence M365 requise.",
    budgetEn: "$30/user/month (Copilot M365 add-on). M365 licence required.",
    rgpd: true,
    startStepsFr: ["Vérifier votre licence Microsoft 365 (E3 ou E5)", "Activer Copilot pour Microsoft 365 auprès de votre IT/DSI", "Commencer par Excel : tapez '/' pour activer Copilot dans une feuille"],
    startStepsEn: ["Check your Microsoft 365 licence (E3 or E5)", "Activate Copilot for Microsoft 365 with your IT/IS department", "Start with Excel: type '/' to activate Copilot in a sheet"],
  },
  claude: {
    id: "claude",
    nameFr: "Claude (Anthropic)",
    nameEn: "Claude (Anthropic)",
    logoBg: "#C4A35A",
    logoInitial: "Cl",
    descFr: "Le LLM le plus performant sur les tâches d'analyse complexe, rédaction executive et raisonnement financier.",
    descEn: "The most performant LLM for complex analysis tasks, executive writing and financial reasoning.",
    moduleNote: null,
    whyFr: [
      "Raisonnement multi-étapes supérieur pour les analyses de variance, DCF et due diligence",
      "Rédaction executive de qualité native en français - board packs et narratifs sans retraitement",
      "Fenêtre de contexte de 200 000 tokens - idéal pour analyser des documents financiers longs"
    ],
    whyEn: [
      "Superior multi-step reasoning for variance analysis, DCF modelling, and due diligence",
      "Native executive-quality writing in English - board packs and narratives with no rework",
      "200,000 token context window - ideal for analysing long financial documents"
    ],
    vigilanceFr: ["Données transitent vers les serveurs Anthropic (plan standard)", "Pas d'intégration native Excel/PPT - copier-coller nécessaire", "Claude Max (100$/mois) recommandé pour usage intensif"],
    vigilanceEn: ["Data transits to Anthropic servers (standard plan)", "No native Excel/PPT integration - copy-paste required", "Claude Max ($100/month) recommended for intensive use"],
    budgetFr: "Gratuit (limité) · Pro : 20$/mois · Max : 100$/mois",
    budgetEn: "Free (limited) · Pro: $20/month · Max: $100/month",
    rgpd: false,
    startStepsFr: ["Créer un compte sur claude.ai", "Choisir le plan adapté (Pro recommandé pour usage professionnel)", "Tester avec un prompt Finance depuis la promptothèque Australe"],
    startStepsEn: ["Create an account on claude.ai", "Choose the right plan (Pro recommended for professional use)", "Test with a Finance prompt from the Australe prompt library"],
  },
  chatgpt: {
    id: "chatgpt",
    nameFr: "ChatGPT (OpenAI)",
    nameEn: "ChatGPT (OpenAI)",
    logoBg: "#10A37F",
    logoInitial: "Ch",
    descFr: "Le LLM le plus connu, excellent pour les benchmarks sectoriels et analyses de marché grâce au web browsing.",
    descEn: "The best-known LLM, excellent for sector benchmarks and market analyses thanks to web browsing.",
    moduleNote: null,
    whyFr: [
      "Web browsing en temps réel - benchmarks sectoriels et données de marché à jour",
      "Outil le plus connu des équipes Finance - courbe d'adoption minimale",
      "Plans Team et Enterprise validés IT dans de nombreuses entreprises"
    ],
    whyEn: [
      "Real-time web browsing - up-to-date sector benchmarks and market data",
      "Most familiar tool for finance teams - minimal adoption curve",
      "Team and Enterprise plans IT-approved in many organisations"
    ],
    vigilanceFr: ["Données transitent vers les serveurs OpenAI", "Qualité variable selon les versions - GPT-4o recommandé", "Erreurs numériques documentées sur les calculs complexes"],
    vigilanceEn: ["Data transits to OpenAI servers", "Variable quality depending on version - GPT-4o recommended", "Documented numerical errors on complex calculations"],
    budgetFr: "Gratuit · Plus : 20$/mois · Team : 30$/user/mois",
    budgetEn: "Free · Plus: $20/month · Team: $30/user/month",
    rgpd: false,
    startStepsFr: ["Créer un compte sur chatgpt.com", "Activer ChatGPT Plus pour accéder à GPT-4o et le web browsing", "Utiliser le mode 'Recherche' pour les benchmarks sectoriels"],
    startStepsEn: ["Create an account at chatgpt.com", "Activate ChatGPT Plus to access GPT-4o and web browsing", "Use 'Search' mode for sector benchmarks"],
  },
  gemini: {
    id: "gemini",
    nameFr: "Google Gemini",
    nameEn: "Google Gemini",
    logoBg: "#4285F4",
    logoInitial: "Ge",
    descFr: "L'IA de Google, native dans Google Workspace (Sheets, Docs, Slides). Idéale si votre équipe est sur Google.",
    descEn: "Google's AI, native in Google Workspace (Sheets, Docs, Slides). Ideal if your team is on Google.",
    moduleNote: {
      trigger: "google",
      fr: "Priorité : Gemini in Sheets pour vos tâches data et automatisation",
      en: "Priority: Gemini in Sheets for your data and automation tasks"
    },
    whyFr: [
      "Natif dans Google Sheets et Docs - parfaitement intégré si votre équipe est sur Google Workspace",
      "Gemini in Sheets permet l'automatisation sans quitter l'environnement de travail habituel",
      "Inclus dans Google Workspace Business Standard - pas de coût additionnel"
    ],
    whyEn: [
      "Native in Google Sheets and Docs - seamlessly integrated if your team uses Google Workspace",
      "Gemini in Sheets enables automation without leaving your usual work environment",
      "Included in Google Workspace Business Standard - no additional cost"
    ],
    vigilanceFr: ["Recommandé uniquement si écosystème Google Workspace", "Moins performant que Claude ou ChatGPT sur le raisonnement complexe", "Fonctionnalités Workspace AI nécessitent Business Standard ou plus"],
    vigilanceEn: ["Recommended only if Google Workspace ecosystem", "Less performant than Claude or ChatGPT on complex reasoning", "Workspace AI features require Business Standard or above"],
    budgetFr: "Gemini Advanced : 22€/mois · Inclus dans Google Workspace Business Standard+",
    budgetEn: "Gemini Advanced: £22/month · Included in Google Workspace Business Standard+",
    rgpd: true,
    startStepsFr: ["Vérifier votre plan Google Workspace (Business Standard minimum)", "Activer Gemini dans vos paramètres Google Workspace", "Tester directement dans Google Sheets avec '@Gemini'"],
    startStepsEn: ["Check your Google Workspace plan (Business Standard minimum)", "Enable Gemini in your Google Workspace settings", "Test directly in Google Sheets with '@Gemini'"],
  },
  mistral: {
    id: "mistral",
    nameFr: "Mistral AI",
    nameEn: "Mistral AI",
    logoBg: "#FF6B35",
    logoInitial: "Mi",
    descFr: "Le seul LLM souverain européen. Hébergement 100% France - la seule option pour les données très sensibles soumises au RGPD strict.",
    descEn: "The only sovereign European LLM. 100% France hosting - the only option for highly sensitive data subject to strict GDPR.",
    moduleNote: null,
    whyFr: [
      "Hébergement 100% France - seule option validée pour les données financières réglementées",
      "Conformité RGPD garantie - aucun transfert de données hors Union Européenne",
      "Souveraineté numérique européenne - argument décisif pour les DSI et DPO des grandes entreprises"
    ],
    whyEn: [
      "100% French hosting - the only validated option for regulated financial data",
      "Full GDPR compliance guaranteed - no data transfer outside the European Union",
      "European digital sovereignty - a decisive argument for enterprise IT and data protection teams"
    ],
    vigilanceFr: ["Moins performant que Claude/ChatGPT sur les tâches analytiques complexes", "Interface moins mature - pensé pour usage API en priorité", "Coût API à estimer selon les volumes d'usage"],
    vigilanceEn: ["Less performant than Claude/ChatGPT on complex analytical tasks", "Less mature interface - primarily designed for API use", "API cost to estimate based on usage volumes"],
    budgetFr: "Le Chat : gratuit · Pro : 14,99€/mois · Enterprise : sur devis",
    budgetEn: "Le Chat: free · Pro: £14.99/month · Enterprise: on request",
    rgpd: true,
    startStepsFr: ["Créer un compte sur chat.mistral.ai", "Pour usage enterprise/données sensibles : contacter Mistral pour un contrat DPA", "Tester Le Chat Pro pour les tâches documentaires et conformité"],
    startStepsEn: ["Create an account at chat.mistral.ai", "For enterprise/sensitive data use: contact Mistral for a DPA agreement", "Test Le Chat Pro for document and compliance tasks"],
  },
}

// Prompts exemples
export const PROMPT_EXAMPLES = {
  variance_analysis: {
    fr: "Agis comme analyste FP&A senior. Voici notre P&L du mois [coller les données]. Identifie les 3 principaux drivers de variance actuals vs budget. Pour chaque driver, distingue l'effet volume, l'effet prix et l'effet mix. Présente ta réponse sous forme de tableau synthétique puis d'un paragraphe d'explication pour le CODIR.",
    en: "Act as a senior FP&A analyst. Here is our monthly P&L [paste data]. Identify the 3 main variance drivers vs budget. For each driver, distinguish the volume effect, price effect and mix effect. Present your answer as a summary table followed by a paragraph for the Board."
  },
  board_pack_commentary: {
    fr: "Tu es directeur financier. Voici les résultats [période] de [entité] : [coller les données]. Rédige un commentaire exécutif de 150 mots maximum. Mets en avant 2 points positifs et 1 point d'attention. Ton direct, pas de jargon, style board pack.",
    en: "You are a CFO. Here are the [period] results for [entity]: [paste data]. Write an executive commentary of maximum 150 words. Highlight 2 positive points and 1 area of attention. Direct tone, no jargon, board pack style."
  },
  budget_forecast_narrative: {
    fr: "Agis comme contrôleur de gestion senior. Voici notre budget [année] et nos hypothèses clés : [coller]. Rédige le narratif de présentation du budget en 3 parties : (1) contexte macro et hypothèses, (2) axes stratégiques traduits en objectifs financiers, (3) principaux risques et opportunités.",
    en: "Act as a senior controller. Here is our [year] budget and key assumptions: [paste]. Write the budget presentation narrative in 3 parts: (1) macro context and assumptions, (2) strategic priorities translated into financial targets, (3) main risks and opportunities."
  },
  due_diligence_structuring: {
    fr: "Tu es un directeur M&A. Construis une check-list de due diligence financière pour l'acquisition de [nom cible], société [secteur] de taille [taille]. Délai DD : [X] semaines. Structure la check-list en 6 blocs (historique financier, qualité des earnings, bilan/dette, BFR, fiscalité, red flags sectoriels). Priorité haute/moyenne/basse pour chaque item.",
    en: "You are an M&A Director. Build a financial due diligence checklist for the acquisition of [target name], a [sector] company of [size]. DD timeline: [X] weeks. Structure the checklist in 6 blocks (financial history, earnings quality, balance sheet/debt, working capital, tax, sector red flags). High/medium/low priority for each item."
  },
  investment_memo: {
    fr: "Tu es un conseiller en corporate finance. Rédige une thèse d'investissement pour [entité] dans [secteur]. Contexte : [coller]. Structure : (1) thèse en 1 phrase, (2) 3 piliers de l'equity story chiffrés, (3) réponse au 'pourquoi maintenant', (4) différenciation concurrents, (5) 3 objections principales + réponses.",
    en: "You are a corporate finance advisor. Write an investment thesis for [entity] in [sector]. Context: [paste]. Structure: (1) thesis in 1 sentence, (2) 3 quantified equity story pillars, (3) answer to 'why now', (4) competitor differentiation, (5) 3 main objections + responses."
  },
}

// Prompt générique de fallback
export const GENERIC_PROMPTS = {
  fr: "Agis comme expert finance senior. Voici ma tâche : [décrire la tâche]. Données disponibles : [coller]. Produis une analyse structurée avec les points clés, les insights actionnables et les recommandations. Format : synthèse exécutive + développement.",
  en: "Act as a senior finance expert. Here is my task: [describe the task]. Available data: [paste]. Produce a structured analysis with key points, actionable insights and recommendations. Format: executive summary + development."
}
