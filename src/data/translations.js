export const translations = {
  fr: {
    // Header
    tagline: "Quel outil IA pour vos projets Finance ?",
    langSwitch: "EN",

    // Hero
    heroTitle: "Trouvez l'outil IA\nfait pour votre équipe Finance",
    heroSubtitle: "Répondez à quelques questions sur votre contexte - obtenez une recommandation personnalisée avec mapping des tâches et prompts opérationnels.",
    heroCta: "Commencer l'analyse",
    heroTime: "2 minutes · Gratuit",

    // Formulaire
    formTitle: "Votre contexte Finance",
    sectionTeam: "Votre équipe",
    sectionTech: "Environnement technologique",
    sectionTasks: "Vos tâches prioritaires",
    sectionConstraints: "Contraintes",

    // Q1
    q1Label: "Taille de l'équipe Finance",
    q1Options: ["Seul(e)", "2-5 personnes", "6-15 personnes", "16-50 personnes", "50+ personnes"],

    // Q2
    q2Label: "Fonction(s) représentée(s)",
    q2Options: ["FP&A", "Contrôle de gestion", "Business Partnering", "Audit interne", "M&A / Corporate Finance", "Comptabilité", "Trésorerie", "DAF / Direction Financière"],

    // Q3
    q3Label: "Secteur d'activité",
    q3Options: ["Industrie / Manufacturing", "Retail / Distribution", "Services / Conseil", "Technologie / SaaS", "Finance / Banque / Assurance", "Santé / Pharma", "Énergie / Infrastructure", "Autre"],

    // Q4
    q4Label: "Écosystème IT principal",
    q4Options: [
      { id: "microsoft365", label: "Microsoft 365", desc: "Teams, Outlook, SharePoint, Excel, PowerPoint" },
      { id: "google", label: "Google Workspace", desc: "Gmail, Drive, Sheets, Slides, Meet" },
      { id: "mixed", label: "Mixte", desc: "Les deux environnements coexistent" },
      { id: "unknown", label: "Je ne sais pas", desc: "Ou environnement non standard" }
    ],

    // Q5
    q5Label: "Outils utilisés au quotidien",
    q5Groups: [
      { group: "Bureautique", items: ["Excel", "PowerPoint", "Word", "Google Sheets", "Google Slides"] },
      { group: "Collaboration", items: ["Teams", "Outlook", "Gmail", "Slack"] },
      { group: "ERP & Finance", items: ["SAP", "Oracle", "Cegid", "Sage", "Netsuite"] },
      { group: "BI & Data", items: ["Power BI", "Tableau", "Looker", "Qlik"] }
    ],

    // Q6
    q6Label: "Validation DSI requise pour les outils IA ?",
    q6Options: ["Oui, obligatoire", "Non, liberté d'usage", "Je ne sais pas"],

    // Section tâches
    tasksLabel: "Sélectionnez vos tâches prioritaires",
    tasksHint: "Choisissez les tâches où vous souhaitez gagner du temps avec l'IA",

    // Q8 budget
    q8Label: "Budget pour un outil IA",
    q8Options: [
      {
        id: "free",
        label: "Version gratuite",
        desc: "Je veux tester sans engagement financier"
      },
      {
        id: "paid",
        label: "Prêt à payer",
        desc: "Je cherche la meilleure solution, le prix n'est pas un frein"
      }
    ],

    // Q9 sensibilité
    q9Label: "Sensibilité de vos données Finance",
    q9Options: [
      { id: "low", label: "Données anonymisées / agrégées", desc: "Pas de données personnelles ou confidentielles" },
      { id: "medium", label: "Données internes sensibles", desc: "P&L, budgets, forecasts non publics" },
      { id: "high", label: "Données très sensibles", desc: "M&A, données personnelles, informations réglementées" }
    ],

    // Q10
    q10Label: "Exigences de conformité",
    q10Options: ["RGPD strict (hébergement EU obligatoire)", "SOX compliance", "Secteur réglementé (banque, assurance, santé)", "Aucune exigence particulière"],

    // CTA
    ctaSubmit: "Voir mes recommandations",
    ctaReset: "Recommencer",

    // Résultats
    resultsTitle: "Votre recommandation personnalisée",
    resultsContext: "Basé sur votre profil :",
    primaryTool: "Outil recommandé",
    secondaryTool: "Alternative solide",
    scoreLabel: "Score d'adéquation",
    whyTitle: "Pourquoi cet outil ?",
    tasksMapTitle: "Mapping de vos tâches",
    taskLevelExcellent: "Excellent",
    taskLevelGood: "Bon",
    taskLevelLimited: "Limité",
    promptsTitle: "Prompts pour démarrer",
    copyPrompt: "Copier",
    promptCopied: "Copié ✓",
    vigilanceTitle: "Points de vigilance",
    budgetTitle: "Accès & tarifs",
    rgpdBadge: "Conforme RGPD EU",
    startTitle: "Comment démarrer",
    showAlternative: "Voir l'alternative",
    hideAlternative: "Masquer l'alternative",

    // Loading
    loadingTitle: "Analyse en cours...",
    loadingSubtitle: "La matrice évalue votre contexte Finance",

    // Formulaire inline
    sectorOptional: "Secteur (optionnel)",
    sectorSelect: "- Sélectionner (optionnel) -",
    analysisNote: "L'analyse est générée en fonction de votre contexte exact.",

    // Budget badges résultats
    budgetFree: "🆓 Gratuit",
    budgetPaid: "💳 Payant",

    // ResultsCard
    noTasksMsg: "💡 Sélectionnez des tâches dans le formulaire pour voir le mapping détaillé",
    toolLearnMore: "En savoir plus",

    // Export PDF
    exportPdf: "Exporter en PDF",
    exportPdfLoading: "Génération...",
    exportPdfError: "Export PDF indisponible, veuillez réessayer",

    // Footer
    footerMade: "Lab-AI-Finance by",
    footerDiscuss: "Vous voulez en discuter ?",
    footerLinkedIn: "Augustin Duret",
  },

  en: {
    tagline: "Which AI tool for your Finance projects?",
    langSwitch: "FR",
    heroTitle: "Find the AI tool\nbuilt for your Finance team",
    heroSubtitle: "Answer a few questions about your context - get a personalised recommendation with task mapping and operational prompts.",
    heroCta: "Start the analysis",
    heroTime: "2 minutes · Free",
    formTitle: "Your Finance context",
    sectionTeam: "Your team",
    sectionTech: "Technology environment",
    sectionTasks: "Your priority tasks",
    sectionConstraints: "Constraints",
    q1Label: "Finance team size",
    q1Options: ["Solo", "2-5 people", "6-15 people", "16-50 people", "50+ people"],
    q2Label: "Function(s) represented",
    q2Options: ["FP&A", "Management Control", "Business Partnering", "Internal Audit", "M&A / Corporate Finance", "Accounting", "Treasury", "CFO / Finance Leadership"],
    q3Label: "Industry",
    q3Options: ["Industry / Manufacturing", "Retail / Distribution", "Services / Consulting", "Technology / SaaS", "Finance / Banking / Insurance", "Healthcare / Pharma", "Energy / Infrastructure", "Other"],
    q4Label: "Main IT ecosystem",
    q4Options: [
      { id: "microsoft365", label: "Microsoft 365", desc: "Teams, Outlook, SharePoint, Excel, PowerPoint" },
      { id: "google", label: "Google Workspace", desc: "Gmail, Drive, Sheets, Slides, Meet" },
      { id: "mixed", label: "Mixed", desc: "Both environments coexist" },
      { id: "unknown", label: "I don't know", desc: "Or non-standard environment" }
    ],
    q5Label: "Tools used daily",
    q5Groups: [
      { group: "Office", items: ["Excel", "PowerPoint", "Word", "Google Sheets", "Google Slides"] },
      { group: "Collaboration", items: ["Teams", "Outlook", "Gmail", "Slack"] },
      { group: "ERP & Finance", items: ["SAP", "Oracle", "Cegid", "Sage", "Netsuite"] },
      { group: "BI & Data", items: ["Power BI", "Tableau", "Looker", "Qlik"] }
    ],
    q6Label: "IT approval required for AI tools?",
    q6Options: ["Yes, mandatory", "No, free usage", "I don't know"],
    tasksLabel: "Select your priority tasks",
    tasksHint: "Choose the tasks where you want to save time with AI",
    q8Label: "Budget for an AI tool",
    q8Options: [
      {
        id: "free",
        label: "Free version",
        desc: "I want to test without financial commitment"
      },
      {
        id: "paid",
        label: "Ready to pay",
        desc: "I'm looking for the best solution, price is not a barrier"
      }
    ],
    q9Label: "Sensitivity of your Finance data",
    q9Options: [
      { id: "low", label: "Anonymised / aggregated data", desc: "No personal or confidential data" },
      { id: "medium", label: "Sensitive internal data", desc: "P&L, budgets, non-public forecasts" },
      { id: "high", label: "Highly sensitive data", desc: "M&A, personal data, regulated information" }
    ],
    q10Label: "Compliance requirements",
    q10Options: ["Strict GDPR (EU hosting required)", "SOX compliance", "Regulated sector (banking, insurance, healthcare)", "No specific requirements"],
    ctaSubmit: "See my recommendations",
    ctaReset: "Start over",
    resultsTitle: "Your personalised recommendation",
    resultsContext: "Based on your profile:",
    primaryTool: "Recommended tool",
    secondaryTool: "Strong alternative",
    scoreLabel: "Fit score",
    whyTitle: "Why this tool?",
    tasksMapTitle: "Your task mapping",
    taskLevelExcellent: "Excellent",
    taskLevelGood: "Good",
    taskLevelLimited: "Limited",
    promptsTitle: "Prompts to get started",
    copyPrompt: "Copy",
    promptCopied: "Copied ✓",
    vigilanceTitle: "Watch out for",
    budgetTitle: "Access & pricing",
    rgpdBadge: "EU GDPR compliant",
    startTitle: "How to get started",
    showAlternative: "Show alternative",
    hideAlternative: "Hide alternative",
    // Loading
    loadingTitle: "Analysing...",
    loadingSubtitle: "The matrix is evaluating your Finance context",

    // Form inline
    sectorOptional: "Sector (optional)",
    sectorSelect: "- Select (optional) -",
    analysisNote: "The analysis is generated based on your exact context.",

    // Budget badges results
    budgetFree: "🆓 Free plan",
    budgetPaid: "💳 Paid plan",

    // ResultsCard
    noTasksMsg: "💡 Select tasks in the form to see the detailed task mapping",
    toolLearnMore: "Learn more",

    exportPdf: "Export as PDF",
    exportPdfLoading: "Generating...",
    exportPdfError: "PDF export unavailable, please try again",
    footerMade: "Lab-AI-Finance by",
    footerDiscuss: "Want to discuss?",
    footerLinkedIn: "Augustin Duret",
  }
}
