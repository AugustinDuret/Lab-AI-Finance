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
      if (hi)  return fr ? `Claude dispose du raisonnement analytique le plus avance du marche. Pour vos taches ${fn0}, il produit des analyses multi-etapes avec une coherence rarement egale.`
                         : `Claude has the most advanced analytical reasoning on the market. For your ${fn0} tasks, it delivers multi-step analyses with rarely-matched coherence.`;
      if (mid) return fr ? `Claude offre un solide niveau d'analyse pour vos besoins ${fn0}. Verifiez les resultats sur les calculs quantitatifs les plus complexes.`
                         : `Claude offers a solid level of analysis for your ${fn0} needs. Verify results on the most complex quantitative calculations.`;
    }
    if (toolId === 'copilot') {
      if (hi)  return fr ? `Copilot excelle sur les taches integrees dans Excel et PowerPoint. Son raisonnement est optimise pour les workflows Microsoft 365.`
                         : `Copilot excels at tasks integrated in Excel and PowerPoint. Its reasoning is optimised for Microsoft 365 workflows.`;
      return fr ? `Sur les taches analytiques complexes, Copilot est en retrait face a Claude. Il reste tres performant sur les workflows Excel et reporting natifs.`
               : `On complex analytical tasks, Copilot falls behind Claude. It remains very strong on native Excel and reporting workflows.`;
    }
    if (toolId === 'chatgpt') {
      return fr ? `ChatGPT offre un bon niveau general pour les taches Finance courantes. Son web browsing integre ajoute de la valeur pour les benchmarks sectoriels et donnees de marche.`
               : `ChatGPT offers a good general level for common Finance tasks. Its built-in web browsing adds value for sector benchmarks and market data.`;
    }
    if (toolId === 'gemini') {
      return fr ? `Gemini est bien adapte aux taches dans Google Workspace. Son raisonnement Finance est solide mais inferieur a Claude sur les analyses FP&A les plus poussees.`
               : `Gemini is well suited for Google Workspace tasks. Its Finance reasoning is solid but below Claude on the most advanced FP&A analyses.`;
    }
    if (toolId === 'mistral') {
      return fr ? `Mistral offre un raisonnement competent pour les taches Finance standards. Sur les analyses FP&A complexes, il reste en retrait par rapport aux solutions US.`
               : `Mistral offers competent reasoning for standard Finance tasks. On complex FP&A analysis, it remains behind US solutions.`;
    }
    if (hi)  return fr ? `${tn} offre une excellente qualite analytique pour vos usages Finance.` : `${tn} offers excellent analytical quality for your Finance use cases.`;
    if (mid) return fr ? `${tn} offre une qualite analytique correcte pour vos besoins courants.` : `${tn} offers adequate analytical quality for your current needs.`;
    return fr ? `La qualite analytique de ${tn} presente des limitations sur les taches complexes. Une supervision humaine est recommandee.`
             : `${tn}'s analytical quality has limitations on complex tasks. Human review is recommended.`;
  }

  // ── Intégration workflow ────────────────────────────────────────
  if (dim === 'w') {
    if (toolId === 'copilot' && (ecosystem === 'microsoft365' || ecosystem === 'unknown')) {
      return fr ? `Copilot est nativement integre dans votre suite Microsoft 365. Excel, PowerPoint, Teams et Outlook deviennent des outils IA sans changer vos habitudes de travail.`
               : `Copilot is natively integrated into your Microsoft 365 suite. Excel, PowerPoint, Teams and Outlook become AI tools without changing your work habits.`;
    }
    if (toolId === 'gemini' && ecosystem === 'google') {
      return fr ? `Gemini s'integre directement dans Google Sheets et Docs. Vos workflows habituels sont enrichis sans friction supplementaire.`
               : `Gemini integrates directly into Google Sheets and Docs. Your usual workflows are enhanced without additional friction.`;
    }
    if ((toolId === 'claude' || toolId === 'chatgpt' || toolId === 'mistral') && ecosystem === 'microsoft365') {
      return fr ? `${tn} fonctionne en dehors de votre suite Microsoft 365. Des allers-retours copier-coller sont a prevoir — sauf si une integration tierce est mise en place.`
               : `${tn} works outside your Microsoft 365 suite. Copy-paste back-and-forth is expected — unless a third-party integration is set up.`;
    }
    if (hi)  return fr ? `${tn} s'integre bien dans vos workflows Finance. La prise en main est rapide et la courbe d'apprentissage limitee.`
                       : `${tn} integrates well into your Finance workflows. Onboarding is fast and the learning curve is minimal.`;
    if (mid) return fr ? `L'integration de ${tn} dans vos workflows demande quelques ajustements. Prevoyez une periode de prise en main pour votre equipe.`
                       : `Integrating ${tn} into your workflows requires some adjustments. Plan an onboarding period for your team.`;
    return fr ? `${tn} necessite des adaptations significatives de vos processus actuels. Evaluez l'impact avant un deploiement a grande echelle.`
             : `${tn} requires significant adjustments to your current processes. Assess the impact before large-scale deployment.`;
  }

  // ── Traçabilité / Audit ─────────────────────────────────────────
  if (dim === 't') {
    if (dataSensitivity === 'high') {
      if (toolId === 'mistral') return fr ? `Mistral offre un haut niveau de tracabilite avec un audit log des echanges. Pour des donnees sensibles M&A ou audit externe, c'est l'option la plus securisee.`
                                          : `Mistral offers a high level of traceability with an exchange audit log. For sensitive M&A or external audit data, it is the safest option.`;
      return fr ? `Avec des donnees tres sensibles, verifiez la politique de tracabilite de ${tn} aupres de votre DPO avant tout usage en production.`
               : `With highly sensitive data, verify ${tn}'s traceability policy with your DPO before any production use.`;
    }
    if (hi)  return fr ? `Le niveau de tracabilite de ${tn} est adapte a vos exigences Finance. Les historiques d'echanges sont accessibles et auditables.`
                       : `${tn}'s traceability level meets your Finance requirements. Exchange histories are accessible and auditable.`;
    if (mid) return fr ? `La tracabilite de ${tn} est correcte pour un usage standard. Pour des exigences d'audit elevees, documentez systematiquement vos echanges.`
                       : `${tn}'s traceability is adequate for standard use. For high audit requirements, systematically document your exchanges.`;
    return fr ? `La tracabilite de ${tn} est limitee. Pour des travaux soumis a audit, privilegiez un outil offrant un meilleur historique.`
             : `${tn}'s traceability is limited. For audit-subject work, prefer a tool offering better history.`;
  }

  // ── Gouvernance / Déploiement ───────────────────────────────────
  if (dim === 'g') {
    if (dsiValidation === 'yes') {
      return fr ? `Votre DSI a deja valide ${tn}. Le deploiement peut se faire sans friction supplementaire au niveau IT.`
               : `Your IT department has already approved ${tn}. Deployment can proceed without additional IT friction.`;
    }
    if (toolId === 'copilot' && ecosystem === 'microsoft365') {
      return fr ? `Copilot beneficie du cadre de securite Microsoft enterprise. Le deploiement est gouverne nativement par votre DSI via le portail M365.`
               : `Copilot benefits from Microsoft enterprise security. Deployment is natively governed by your IT team via the M365 portal.`;
    }
    if (toolId === 'mistral') {
      return fr ? `Mistral est heberge 100% en France et Union Europeenne. C'est la seule solution qui repond aux exigences RGPD les plus strictes sans configuration supplementaire.`
               : `Mistral is hosted 100% in France and the EU. It is the only solution meeting the strictest GDPR requirements without additional configuration.`;
    }
    if (dataSensitivity === 'high') {
      return fr ? `Pour vos donnees sensibles, la gouvernance de ${tn} doit etre validee par votre DSI et DPO avant tout deploiement en equipe.`
               : `For your sensitive data, ${tn}'s governance must be validated by your IT and data protection teams before team deployment.`;
    }
    if (hi)  return fr ? `La gouvernance de ${tn} est bien adaptee a un deploiement en equipe Finance. Les politiques de securite sont configurables selon vos besoins.`
                       : `${tn}'s governance is well suited to Finance team deployment. Security policies are configurable to your needs.`;
    return fr ? `Une validation IT de ${tn} sera necessaire avant un deploiement a l'echelle de l'equipe. Anticipez ce sujet aupres de votre DSI.`
             : `IT validation of ${tn} will be required before team-wide deployment. Get ahead of this with your IT department.`;
  }

  return '';
}
