// Generates contextual narrative sentences for each analysis dimension.
// Structured for future Claude API integration — currently deterministic.

const TOOL_SHORT = { copilot: 'Copilot', claude: 'Claude', chatgpt: 'ChatGPT', gemini: 'Gemini', mistral: 'Mistral AI' };

export function generateDimNarrative(toolId, dim, score, answers, lang) {
  const fr = lang === 'fr';
  const {
    ecosystem = 'unknown',
    dataSensitivity = 'medium',
    dsiValidation = 'unknown',
    functions = [],
  } = answers || {};

  const tn  = TOOL_SHORT[toolId] || toolId;
  const hi  = score >= 75;
  const mid = score >= 55;
  const fn0 = functions[0] || (fr ? 'Finance' : 'Finance');

  // ── Qualité analytique ──────────────────────────────────────────
  if (dim === 'q') {
    if (toolId === 'claude') {
      if (hi)  return fr ? `Claude dispose du raisonnement analytique le plus avancé du marché. Pour vos tâches ${fn0}, il produit des analyses multi-étapes avec une cohérence rarement égalée.`
                         : `Claude has the most advanced analytical reasoning on the market. For your ${fn0} tasks, it delivers multi-step analyses with rarely-matched coherence.`;
      if (mid) return fr ? `Claude offre un solide niveau d'analyse pour vos besoins ${fn0}. Vérifiez les résultats sur les calculs quantitatifs les plus complexes.`
                         : `Claude offers a solid level of analysis for your ${fn0} needs. Verify results on the most complex quantitative calculations.`;
    }
    if (toolId === 'copilot') {
      if (hi)  return fr ? `Copilot excelle sur les tâches intégrées dans Excel et PowerPoint. Son raisonnement est optimisé pour les workflows Microsoft 365.`
                         : `Copilot excels at tasks integrated in Excel and PowerPoint. Its reasoning is optimised for Microsoft 365 workflows.`;
      return fr ? `Sur les tâches analytiques complexes, Copilot est en retrait face à Claude. Il reste très performant sur les workflows Excel et reporting natifs.`
               : `On complex analytical tasks, Copilot falls behind Claude. It remains very strong on native Excel and reporting workflows.`;
    }
    if (toolId === 'chatgpt') {
      return fr ? `ChatGPT offre un bon niveau général pour les tâches Finance courantes. Son web browsing intégré ajoute de la valeur pour les benchmarks sectoriels et données de marché.`
               : `ChatGPT offers a good general level for common Finance tasks. Its built-in web browsing adds value for sector benchmarks and market data.`;
    }
    if (toolId === 'gemini') {
      return fr ? `Gemini est bien adapté aux tâches dans Google Workspace. Son raisonnement Finance est solide mais inférieur à Claude sur les analyses FP&A les plus poussées.`
               : `Gemini is well suited for Google Workspace tasks. Its Finance reasoning is solid but below Claude on the most advanced FP&A analyses.`;
    }
    if (toolId === 'mistral') {
      return fr ? `Mistral offre un raisonnement compétent pour les tâches Finance standards. Sur les analyses FP&A complexes, il reste en retrait par rapport aux solutions US.`
               : `Mistral offers competent reasoning for standard Finance tasks. On complex FP&A analysis, it remains behind US solutions.`;
    }
    if (hi)  return fr ? `${tn} offre une excellente qualité analytique pour vos usages Finance.` : `${tn} offers excellent analytical quality for your Finance use cases.`;
    if (mid) return fr ? `${tn} offre une qualité analytique correcte pour vos besoins courants.` : `${tn} offers adequate analytical quality for your current needs.`;
    return fr ? `La qualité analytique de ${tn} présente des limitations sur les tâches complexes. Une supervision humaine est recommandée.`
             : `${tn}'s analytical quality has limitations on complex tasks. Human review is recommended.`;
  }

  // ── Intégration workflow ────────────────────────────────────────
  if (dim === 'w') {
    if (toolId === 'copilot' && (ecosystem === 'microsoft365' || ecosystem === 'unknown')) {
      return fr ? `Copilot est nativement intégré dans votre suite Microsoft 365. Excel, PowerPoint, Teams et Outlook deviennent des outils IA sans changer vos habitudes de travail.`
               : `Copilot is natively integrated into your Microsoft 365 suite. Excel, PowerPoint, Teams and Outlook become AI tools without changing your work habits.`;
    }
    if (toolId === 'gemini' && ecosystem === 'google') {
      return fr ? `Gemini s'intègre directement dans Google Sheets et Docs. Vos workflows habituels sont enrichis sans friction supplémentaire.`
               : `Gemini integrates directly into Google Sheets and Docs. Your usual workflows are enhanced without additional friction.`;
    }
    if ((toolId === 'claude' || toolId === 'chatgpt' || toolId === 'mistral') && ecosystem === 'microsoft365') {
      return fr ? `${tn} fonctionne en dehors de votre suite Microsoft 365. Des allers-retours copier-coller sont à prévoir — sauf si une intégration tierce est mise en place.`
               : `${tn} works outside your Microsoft 365 suite. Copy-paste back-and-forth is expected — unless a third-party integration is set up.`;
    }
    if (hi)  return fr ? `${tn} s'intègre bien dans vos workflows Finance. La prise en main est rapide et la courbe d'apprentissage limitée.`
                       : `${tn} integrates well into your Finance workflows. Onboarding is fast and the learning curve is minimal.`;
    if (mid) return fr ? `L'intégration de ${tn} dans vos workflows demande quelques ajustements. Prévoyez une période de prise en main pour votre équipe.`
                       : `Integrating ${tn} into your workflows requires some adjustments. Plan an onboarding period for your team.`;
    return fr ? `${tn} nécessite des adaptations significatives de vos processus actuels. Évaluez l'impact avant un déploiement à grande échelle.`
             : `${tn} requires significant adjustments to your current processes. Assess the impact before large-scale deployment.`;
  }

  // ── Traçabilité / Audit ─────────────────────────────────────────
  if (dim === 't') {
    if (dataSensitivity === 'high') {
      if (toolId === 'mistral') return fr ? `Mistral offre un haut niveau de traçabilité avec un audit log des échanges. Pour des données sensibles M&A ou audit externe, c'est l'option la plus sécurisée.`
                                          : `Mistral offers a high level of traceability with an exchange audit log. For sensitive M&A or external audit data, it is the safest option.`;
      return fr ? `Avec des données très sensibles, vérifiez la politique de traçabilité de ${tn} auprès de votre DPO avant tout usage en production.`
               : `With highly sensitive data, verify ${tn}'s traceability policy with your DPO before any production use.`;
    }
    if (hi)  return fr ? `Le niveau de traçabilité de ${tn} est adapté à vos exigences Finance. Les historiques d'échanges sont accessibles et auditables.`
                       : `${tn}'s traceability level meets your Finance requirements. Exchange histories are accessible and auditable.`;
    if (mid) return fr ? `La traçabilité de ${tn} est correcte pour un usage standard. Pour des exigences d'audit élevées, documentez systématiquement vos échanges.`
                       : `${tn}'s traceability is adequate for standard use. For high audit requirements, systematically document your exchanges.`;
    return fr ? `La traçabilité de ${tn} est limitée. Pour des travaux soumis à audit, privilégiez un outil offrant un meilleur historique.`
             : `${tn}'s traceability is limited. For audit-subject work, prefer a tool offering better history.`;
  }

  // ── Gouvernance / Déploiement ───────────────────────────────────
  if (dim === 'g') {
    if (dsiValidation === 'yes') {
      return fr ? `Votre DSI a déjà validé ${tn}. Le déploiement peut se faire sans friction supplémentaire au niveau IT.`
               : `Your IT department has already approved ${tn}. Deployment can proceed without additional IT friction.`;
    }
    if (toolId === 'copilot' && ecosystem === 'microsoft365') {
      return fr ? `Copilot bénéficie du cadre de sécurité Microsoft enterprise. Le déploiement est gouverné nativement par votre DSI via le portail M365.`
               : `Copilot benefits from Microsoft enterprise security. Deployment is natively governed by your IT team via the M365 portal.`;
    }
    if (toolId === 'mistral') {
      return fr ? `Mistral est hébergé 100% en France et Union Européenne. C'est la seule solution qui répond aux exigences RGPD les plus strictes sans configuration supplémentaire.`
               : `Mistral is hosted 100% in France and the EU. It is the only solution meeting the strictest GDPR requirements without additional configuration.`;
    }
    if (dataSensitivity === 'high') {
      return fr ? `Pour vos données sensibles, la gouvernance de ${tn} doit être validée par votre DSI et DPO avant tout déploiement en équipe.`
               : `For your sensitive data, ${tn}'s governance must be validated by your IT and data protection teams before team deployment.`;
    }
    if (hi)  return fr ? `La gouvernance de ${tn} est bien adaptée à un déploiement en équipe Finance. Les politiques de sécurité sont configurables selon vos besoins.`
                       : `${tn}'s governance is well suited to Finance team deployment. Security policies are configurable to your needs.`;
    return fr ? `Une validation IT de ${tn} sera nécessaire avant un déploiement à l'échelle de l'équipe. Anticipez ce sujet auprès de votre DSI.`
             : `IT validation of ${tn} will be required before team-wide deployment. Get ahead of this with your IT department.`;
  }

  return '';
}
