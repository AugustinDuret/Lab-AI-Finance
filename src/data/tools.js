export const TOOL_ICONS = {
  copilot: '🪟',
  claude:  '🌀',
  chatgpt: '💬',
  gemini:  '✨',
  mistral: '🌬️',
}

export const TOOL_URLS = {
  copilot: 'https://copilot.microsoft.com',
  claude:  'https://claude.ai',
  chatgpt: 'https://chatgpt.com',
  gemini:  'https://gemini.google.com',
  mistral: 'https://chat.mistral.ai',
}

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
      'Integre nativement dans Excel, PowerPoint et Teams - zero friction workflow',
      'Deploiement governe par la DSI avec securite Microsoft enterprise',
      'Ideal pour les equipes deja sur Microsoft 365 sans couts additionnels'
    ],
    whyEn: [
      'Natively integrated in Excel, PowerPoint and Teams - zero workflow friction',
      'IT-governed deployment with Microsoft enterprise security',
      'Ideal for teams already on Microsoft 365 at no extra cost'
    ],
    vigilanceFr: [
      'Necessite une licence Microsoft 365 E3/E5 - environ 36 EUR/user/mois',
      'Raisonnement analytique moins profond que Claude sur les taches complexes'
    ],
    vigilanceEn: [
      'Requires Microsoft 365 E3/E5 licence - approx EUR 36/user/month',
      'Less deep analytical reasoning than Claude on complex tasks'
    ],
    budgetFr: 'Inclus dans Microsoft 365 E3 ou E5. Version standalone Copilot Pro : 22 EUR/mois',
    budgetEn: 'Included in Microsoft 365 E3 or E5. Copilot Pro standalone: EUR 22/month',
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
      'Meilleur raisonnement analytique du marche - ideal pour variance, narratifs, M&A',
      'Contexte 200k tokens - analyse de documents longs sans perte de coherence',
      'Qualite redactionnelle executive en francais native'
    ],
    whyEn: [
      'Best analytical reasoning on the market - ideal for variance, narratives, M&A',
      '200k token context - long document analysis without coherence loss',
      'Native executive writing quality in French'
    ],
    vigilanceFr: [
      'Pas d integration native dans Excel ou PowerPoint - copier-coller necessaire',
      'Necessite une validation DSI selon la politique de donnees de l entreprise'
    ],
    vigilanceEn: [
      'No native Excel or PowerPoint integration - copy-paste required',
      'Requires IT validation depending on company data policy'
    ],
    budgetFr: 'Claude Pro : 20 EUR/mois. Claude Max : 100 EUR/mois',
    budgetEn: 'Claude Pro: EUR 20/month. Claude Max: EUR 100/month',
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
      'Polyvalent et accessible - bon generiste pour les taches Finance courantes',
      'Browsing web integre pour benchmark et donnees de marche recentes',
      'Ecosystem de plugins etendu pour des usages specifiques'
    ],
    whyEn: [
      'Versatile and accessible - solid generalist for common Finance tasks',
      'Built-in web browsing for benchmarking and recent market data',
      'Extensive plugin ecosystem for specific use cases'
    ],
    vigilanceFr: [
      'Raisonnement analytique profond inferieur a Claude sur les taches complexes',
      'Confidentialite des donnees a verifier selon le plan utilise'
    ],
    vigilanceEn: [
      'Deep analytical reasoning below Claude for complex tasks',
      'Data confidentiality to verify depending on plan used'
    ],
    budgetFr: 'ChatGPT Plus : 20 EUR/mois. ChatGPT Pro : 200 EUR/mois',
    budgetEn: 'ChatGPT Plus: EUR 20/month. ChatGPT Pro: EUR 200/month',
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
      'Integration native dans Google Sheets, Docs et Gmail - ideal ecosysteme Google',
      'Acces aux donnees Google Workspace en temps reel',
      'Bon rapport qualite-prix pour les equipes deja sur Google'
    ],
    whyEn: [
      'Native integration in Google Sheets, Docs and Gmail - ideal for Google ecosystem',
      'Real-time access to Google Workspace data',
      'Good value for teams already on Google'
    ],
    vigilanceFr: [
      'Moins performant que Claude sur les taches analytiques Finance complexes',
      'Hebergement hors UE par defaut - verifier conformite RGPD'
    ],
    vigilanceEn: [
      'Less performant than Claude on complex Finance analytical tasks',
      'Non-EU hosting by default - verify GDPR compliance'
    ],
    budgetFr: 'Gemini Advanced : 22 EUR/user/mois via Google One AI Premium',
    budgetEn: 'Gemini Advanced: EUR 22/user/month via Google One AI Premium',
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
      'Hebergement 100% France et Union Europeenne - conformite RGPD maximale',
      'Option souveraine pour les donnees tres sensibles (M&A, audit, compliance)',
      'Modeles open source deployables sur infrastructure privee si necessaire'
    ],
    whyEn: [
      '100% France and EU hosting - maximum GDPR compliance',
      'Sovereign option for highly sensitive data (M&A, audit, compliance)',
      'Open source models deployable on private infrastructure if needed'
    ],
    vigilanceFr: [
      'Qualite analytique inferieure a Claude et ChatGPT sur les taches FP&A complexes',
      'Ecosystem d integration moins developpe que les solutions US'
    ],
    vigilanceEn: [
      'Analytical quality below Claude and ChatGPT for complex FP&A tasks',
      'Less developed integration ecosystem than US solutions'
    ],
    budgetFr: 'Le Chat Pro : 15 EUR/mois. API Mistral : tarif variable selon usage',
    budgetEn: 'Le Chat Pro: EUR 15/month. Mistral API: variable pricing based on usage',
    rgpd: true,
    startStepsFr: ["Créer un compte sur chat.mistral.ai", "Pour usage enterprise/données sensibles : contacter Mistral pour un contrat DPA", "Tester Le Chat Pro pour les tâches documentaires et conformité"],
    startStepsEn: ["Create an account at chat.mistral.ai", "For enterprise/sensitive data use: contact Mistral for a DPA agreement", "Test Le Chat Pro for document and compliance tasks"],
  },
}
