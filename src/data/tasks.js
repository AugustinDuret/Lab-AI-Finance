export const TASK_CATEGORIES = [
  {
    id: "fpna",
    labelFr: "FP&A & Reporting",
    labelEn: "FP&A & Reporting",
    tasks: [
      { id: "variance_analysis",            labelFr: "Analyse de variance (volume / prix / mix)",        labelEn: "Variance analysis (volume / price / mix)" },
      { id: "board_pack_commentary",        labelFr: "Commentaires de reporting & board pack",           labelEn: "Board pack commentary & reporting" },
      { id: "budget_forecast_narrative",    labelFr: "Narratif budget & forecast",                      labelEn: "Budget & forecast narrative" },
      { id: "monthly_close_checklist",      labelFr: "Clôture mensuelle & check-lists",                 labelEn: "Monthly close & checklists" },
      { id: "excel_data_extraction",        labelFr: "Extraction & structuration de données Excel",     labelEn: "Excel data extraction & structuring" },
      { id: "sensitivity_scenarios",        labelFr: "Analyse de sensibilité & scénarios",              labelEn: "Sensitivity analysis & scenarios" },
      { id: "codir_presentation",           labelFr: "Présentation résultats CODIR / Board",            labelEn: "CODIR / Board results presentation" },
      { id: "recurring_reporting_automation", labelFr: "Automatisation reporting récurrent",            labelEn: "Recurring reporting automation" },
    ]
  },
  {
    id: "bp",
    labelFr: "Business Partnering",
    labelEn: "Business Partnering",
    tasks: [
      { id: "pl_analysis_by_bu",            labelFr: "Analyse P&L par BU / segment",                   labelEn: "P&L analysis by BU / segment" },
      { id: "business_review_prep",         labelFr: "Préparation business review mensuelle",           labelEn: "Monthly business review preparation" },
      { id: "pipeline_forecast_review",     labelFr: "Revue pipeline commercial & forecast",            labelEn: "Commercial pipeline & forecast review" },
      { id: "internal_financial_communication", labelFr: "Communication financière interne",            labelEn: "Internal financial communication" },
      { id: "sector_benchmark",             labelFr: "Benchmark sectoriel",                             labelEn: "Sector benchmark" },
    ]
  },
  {
    id: "ma",
    labelFr: "M&A & Stratégie",
    labelEn: "M&A & Strategy",
    tasks: [
      { id: "due_diligence_structuring",    labelFr: "Structuration due diligence financière",          labelEn: "Financial due diligence structuring",  sensible: true },
      { id: "lbo_dcf_logic",               labelFr: "Modélisation LBO / DCF (logique)",                labelEn: "LBO / DCF modelling (logic)" },
      { id: "investment_memo",              labelFr: "Mémo d'investissement / equity story",            labelEn: "Investment memo / equity story",        sensible: true },
      { id: "market_analysis",             labelFr: "Analyse de marché & positionnement",              labelEn: "Market analysis & positioning" },
    ]
  },
  {
    id: "cdg",
    labelFr: "Contrôle de gestion",
    labelEn: "Management Control",
    tasks: [
      { id: "cost_profitability_analysis",  labelFr: "Analyse des coûts & rentabilité",                labelEn: "Cost & profitability analysis" },
      { id: "kpi_dashboard_design",         labelFr: "Conception tableau de bord KPI",                 labelEn: "KPI dashboard design" },
      { id: "make_or_buy_roi",             labelFr: "Analyse make-or-buy / ROI projet",               labelEn: "Make-or-buy / project ROI analysis" },
      { id: "budget_control_alerts",        labelFr: "Contrôle budgétaire & alertes écarts",           labelEn: "Budget control & variance alerts" },
      { id: "pricing_margin",              labelFr: "Pricing & marge par produit / client",            labelEn: "Pricing & margin by product / client" },
    ]
  },
  {
    id: "audit",
    labelFr: "Audit & Conformité",
    labelEn: "Audit & Compliance",
    tasks: [
      { id: "contract_review",             labelFr: "Revue de contrats (extraction clauses)",          labelEn: "Contract review (clause extraction)",   sensible: true },
      { id: "procedures_documentation",    labelFr: "Documentation procédures & contrôles",            labelEn: "Procedures & controls documentation",   sensible: true },
      { id: "external_audit_prep",         labelFr: "Préparation audit externe (dossiers)",            labelEn: "External audit preparation",             sensible: true },
      { id: "regulatory_compliance",       labelFr: "Analyse conformité réglementaire (RGPD, SOX)",   labelEn: "Regulatory compliance analysis",         sensible: true },
    ]
  },
  {
    id: "data",
    labelFr: "Data & BI Finance",
    labelEn: "Data & Finance BI",
    tasks: [
      { id: "data_analysis_upload",        labelFr: "Analyse de données (upload CSV / Excel)",         labelEn: "Data analysis (CSV / Excel upload)" },
      { id: "sql_queries",                 labelFr: "Génération de requêtes SQL",                      labelEn: "SQL query generation" },
      { id: "bi_results_interpretation",   labelFr: "Interprétation résultats BI (Power BI / Looker)", labelEn: "BI results interpretation (Power BI / Looker)" },
      { id: "data_cleaning_transformation",labelFr: "Nettoyage & transformation de données",           labelEn: "Data cleaning & transformation" },
    ]
  },
]

// Flat list pour lookup rapide par ID
export const TASKS_BY_ID = TASK_CATEGORIES
  .flatMap(cat => cat.tasks)
  .reduce((acc, task) => ({ ...acc, [task.id]: task }), {})
