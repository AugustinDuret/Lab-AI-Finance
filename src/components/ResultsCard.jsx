import { useState } from 'react'
import { TOOLS, TOOL_URLS } from '../data/tools.js'
import { TASKS_BY_ID } from '../data/tasks.js'
import { getPromptsForTasks } from '../data/prompts.js'
import ScoreBar from './ScoreBar.jsx'

export default function ResultsCard({ result, t, lang, isPrimary, ecosystem }) {
  const [promptCopied, setPromptCopied] = useState(null)
  const [openPromptId, setOpenPromptId] = useState(null)
  const [showMatrix, setShowMatrix] = useState(false)
  const tool = TOOLS[result.toolId]
  if (!tool) return null

  const excellent = result.taskDetails.filter(td => td.level === 'excellent')
  const good      = result.taskDetails.filter(td => td.level === 'good')
  const limited   = result.taskDetails.filter(td => td.level === 'limited')

  const promptsToShow = getPromptsForTasks(
    result.taskDetails?.map(td => td.taskId) || [],
    lang,
    3
  )

  const showModuleNote = tool.moduleNote && tool.moduleNote.trigger === ecosystem

  const copyPrompt = (id, text) => {
    navigator.clipboard.writeText(text)
    setPromptCopied(id)
    setTimeout(() => setPromptCopied(null), 2000)
  }

  const taskLabel = (taskId) => {
    const task = TASKS_BY_ID[taskId]
    if (!task) return taskId
    return lang === 'fr' ? task.labelFr : task.labelEn
  }

  const whyReasons = lang === 'fr' ? tool.whyFr : tool.whyEn

  return (
    <div style={{ position: 'relative', marginTop: isPrimary ? 20 : 0 }}>

      {/* Badge "Recommandé" au-dessus de la card */}
      {isPrimary && (
        <div style={{
          position: 'absolute',
          top: -14,
          left: 20,
          zIndex: 10,
          background: 'linear-gradient(135deg, var(--australe-gold), #a87d3a)',
          borderRadius: 20,
          padding: '4px 14px',
          fontSize: 11,
          fontWeight: 700,
          color: 'white',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontFamily: 'Sora',
          boxShadow: '0 2px 12px rgba(196,163,90,0.4)',
          whiteSpace: 'nowrap'
        }}>
          {lang === 'fr' ? '✦ Recommandé' : '✦ Recommended'}
        </div>
      )}

      {/* Card elle-même */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 16,
        border: isPrimary ? '1px solid rgba(196,163,90,0.4)' : '1px solid var(--border-green)',
        boxShadow: isPrimary ? '0 0 40px rgba(196,163,90,0.08)' : 'none',
        overflow: 'visible',
        position: 'relative'
      }}>

      {/* ── Card header ─────────────────────────────── */}
      <div style={{
        padding: '24px 28px 20px',
        borderBottom: '1px solid var(--border-green)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: tool.logoBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: 'white', fontFamily: 'Sora' }}>
              {tool.logoInitial}
            </span>
          </div>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 5
            }}>
              {isPrimary ? `✦ ${t.primaryTool}` : t.secondaryTool}
            </div>
            <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {lang === 'fr' ? tool.nameFr : tool.nameEn}
            </div>
            {showModuleNote && (
              <div style={{ fontSize: 12, color: 'var(--australe-gold)', marginTop: 5 }}>
                {lang === 'fr' ? tool.moduleNote.fr : tool.moduleNote.en}
              </div>
            )}
          </div>
        </div>

        {/* Score compact */}
        <div style={{ minWidth: 80, textAlign: 'right' }}>
          <div style={{
            fontFamily: 'Sora', fontWeight: 700, fontSize: 26,
            color: isPrimary ? 'var(--australe-gold)' : 'var(--australe-green-light)',
            lineHeight: 1
          }} className="animate-score">
            {result.score}<span style={{ fontSize: 13, fontWeight: 500, opacity: 0.7 }}>/100</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t.scoreLabel}
          </div>
          <ScoreBar score={result.score} size="sm" />
        </div>
      </div>

      {/* ── Card body ────────────────────────────────── */}
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Pourquoi cet outil — raisons métier */}
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12
          }}>
            {lang === 'fr' ? 'Pourquoi cet outil pour votre équipe' : 'Why this tool for your team'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(whyReasons || []).map((reason, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{
                  color: 'var(--australe-green)', fontWeight: 700,
                  fontSize: 15, lineHeight: 1, flexShrink: 0, marginTop: 3
                }}>✓</span>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Matrice de décision déroulante */}
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-green)',
              borderRadius: showMatrix ? '10px 10px 0 0' : '10px',
              cursor: 'pointer',
              transition: 'all 150ms'
            }}
          >
            <span style={{
              fontSize: 12, fontWeight: 600,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              {lang === 'fr' ? '🔬 Détail de l\'analyse' : '🔬 Analysis detail'}
            </span>
            <span style={{
              color: 'var(--text-muted)', fontSize: 11,
              transform: showMatrix ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms'
            }}>▼</span>
          </button>

          {showMatrix && (
            <div style={{
              padding: '16px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-green)',
              borderTop: 'none',
              borderRadius: '0 0 10px 10px'
            }}>
              <p style={{
                fontSize: 12, color: 'var(--text-muted)',
                marginBottom: 14, lineHeight: 1.5
              }}>
                {lang === 'fr'
                  ? 'Score composite calculé sur 4 dimensions. Pondération : Qualité 40% · Workflow 30% · Traçabilité 20% · Gouvernance 10%.'
                  : 'Composite score across 4 dimensions. Weighting: Quality 40% · Workflow 30% · Traceability 20% · Governance 10%.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: lang === 'fr' ? 'Qualité analytique' : 'Analytical quality', weight: '40%', color: '#2D7060', score: result.dimScores?.q ?? result.score },
                  { label: lang === 'fr' ? 'Intégration workflow' : 'Workflow integration', weight: '30%', color: '#3D9080', score: result.dimScores?.w ?? Math.round(result.score * 0.9) },
                  { label: lang === 'fr' ? 'Traçabilité / Audit' : 'Traceability / Audit', weight: '20%', color: '#C4A35A', score: result.dimScores?.t ?? Math.round(result.score * 0.85) },
                  { label: lang === 'fr' ? 'Gouvernance / Déploiement' : 'Governance / Deployment', weight: '10%', color: '#8FA89A', score: result.dimScores?.g ?? Math.round(result.score * 0.8) }
                ].map(dim => (
                  <div key={dim.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: '0 0 155px', fontSize: 12, color: 'var(--text-secondary)' }}>
                      <span style={{ fontWeight: 600 }}>{dim.label}</span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: 4, fontSize: 10 }}>
                        ({dim.weight})
                      </span>
                    </div>
                    <div style={{
                      flex: 1, height: 6,
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: 99, overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${dim.score}%`,
                        background: dim.color,
                        borderRadius: 99,
                        transition: 'width 0.6s ease'
                      }} />
                    </div>
                    <div style={{
                      flex: '0 0 28px', fontSize: 12,
                      fontWeight: 700, color: 'var(--text-primary)',
                      textAlign: 'right'
                    }}>
                      {dim.score}
                    </div>
                  </div>
                ))}
              </div>

              <p style={{
                fontSize: 11, color: 'var(--text-muted)',
                marginTop: 12, lineHeight: 1.4
              }}>
                {lang === 'fr'
                  ? 'Matrice de 600 évaluations (30 tâches × 5 outils × 4 dimensions), ajustée selon votre contexte.'
                  : 'Matrix of 600 evaluations (30 tasks × 5 tools × 4 dimensions), adjusted to your context.'}
              </p>
            </div>
          )}
        </div>

        {/* Mapping tâches */}
        {result.taskDetails.length === 0 && (
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: 10,
            border: '1px solid var(--border-green)', padding: '14px 18px',
            fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic'
          }}>
            {t.noTasksMsg}
          </div>
        )}
        {result.taskDetails.length > 0 && (
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12
            }}>
              {t.tasksMapTitle}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {excellent.length > 0 && (
                <div>
                  <span style={{
                    display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6,
                    background: 'rgba(45,112,96,0.18)', color: '#4CAF82', marginBottom: 7
                  }}>{t.taskLevelExcellent}</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {excellent.map(td => (
                      <span key={td.taskId} style={{
                        fontSize: 12, padding: '4px 10px', borderRadius: 6,
                        background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                        border: '1px solid var(--border-green)'
                      }}>{taskLabel(td.taskId)}</span>
                    ))}
                  </div>
                </div>
              )}
              {good.length > 0 && (
                <div>
                  <span style={{
                    display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6,
                    background: 'rgba(196,163,90,0.12)', color: 'var(--australe-gold)', marginBottom: 7
                  }}>{t.taskLevelGood}</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {good.map(td => (
                      <span key={td.taskId} style={{
                        fontSize: 12, padding: '4px 10px', borderRadius: 6,
                        background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                        border: '1px solid var(--border-green)'
                      }}>{taskLabel(td.taskId)}</span>
                    ))}
                  </div>
                </div>
              )}
              {limited.length > 0 && (
                <div>
                  <span style={{
                    display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6,
                    background: 'rgba(107,114,128,0.15)', color: '#9CA3AF', marginBottom: 7
                  }}>{t.taskLevelLimited}</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {limited.map(td => (
                      <span key={td.taskId} style={{
                        fontSize: 12, padding: '4px 10px', borderRadius: 6,
                        background: 'var(--bg-secondary)', color: 'var(--text-muted)',
                        border: '1px solid rgba(107,114,128,0.2)'
                      }}>{taskLabel(td.taskId)}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prompts - accordéon */}
        {promptsToShow.length > 0 && (
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12
            }}>{t.promptsTitle}</div>
            {promptsToShow.map(prompt => {
              const isOpen = openPromptId === prompt.id
              const promptText = lang === 'fr' ? prompt.promptFr : prompt.promptEn
              const promptLabel = lang === 'fr' ? prompt.labelFr : prompt.labelEn
              return (
                <div key={prompt.id} style={{
                  border: '1px solid var(--border-green)',
                  borderRadius: 10,
                  overflow: 'hidden',
                  marginBottom: 8
                }}>
                  {/* Header cliquable */}
                  <button
                    onClick={() => setOpenPromptId(isOpen ? null : prompt.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: isOpen ? 'rgba(45,112,96,0.1)' : 'var(--bg-secondary)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 150ms'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: 'var(--australe-gold)',
                        background: 'rgba(196,163,90,0.12)', border: '1px solid rgba(196,163,90,0.2)',
                        borderRadius: 6, padding: '2px 8px'
                      }}>PROMPT</span>
                      <span style={{
                        fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'left'
                      }}>{promptLabel}</span>
                    </div>
                    <span style={{
                      color: 'var(--text-muted)', fontSize: 12,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms ease',
                      flexShrink: 0, marginLeft: 8
                    }}>▼</span>
                  </button>

                  {/* Contenu déroulé */}
                  {isOpen && (
                    <div style={{
                      padding: '14px 16px',
                      background: 'var(--bg-primary)',
                      borderTop: '1px solid var(--border-green)',
                      animation: 'fadeInDown 150ms ease'
                    }}>
                      <pre style={{
                        fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65,
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        marginBottom: 12, fontFamily: 'monospace', margin: '0 0 12px 0'
                      }}>{promptText}</pre>
                      <button
                        onClick={(e) => { e.stopPropagation(); copyPrompt(prompt.id, promptText) }}
                        style={{
                          background: promptCopied === prompt.id ? 'var(--australe-green)' : 'rgba(45,112,96,0.15)',
                          border: '1px solid var(--border-green)', borderRadius: 6,
                          padding: '6px 14px', fontSize: 12, fontWeight: 600,
                          color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 150ms'
                        }}
                      >
                        {promptCopied === prompt.id
                          ? (lang === 'fr' ? '✓ Copié' : '✓ Copied')
                          : (lang === 'fr' ? 'Copier le prompt' : 'Copy prompt')}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Points de vigilance */}
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12
          }}>{t.vigilanceTitle}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(lang === 'fr' ? tool.vigilanceFr : tool.vigilanceEn).map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--australe-gold)', fontWeight: 700, fontSize: 13, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>⚠</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border-green)',
          padding: '13px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t.budgetTitle}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {lang === 'fr' ? tool.budgetFr : tool.budgetEn}
          </span>
        </div>

        {/* Badge RGPD */}
        {tool.rgpd && (
          <div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(45,112,96,0.12)', border: '1px solid rgba(45,112,96,0.3)',
              borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 600, color: '#4CAF82'
            }}>
              🇪🇺 {t.rgpdBadge}
            </span>
          </div>
        )}

        {/* Comment démarrer */}
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12
          }}>{t.startTitle}</div>
          <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 0, listStyle: 'none' }}>
            {(lang === 'fr' ? tool.startStepsFr : tool.startStepsEn).map((step, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                  background: 'rgba(45,112,96,0.15)', border: '1px solid var(--border-green)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'var(--australe-green)', fontFamily: 'Sora'
                }}>{i + 1}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, paddingTop: 4 }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Lien externe vers l'outil */}
        {TOOL_URLS[result.toolId] && (
          <div style={{ borderTop: '1px solid var(--border-green)', paddingTop: 16 }}>
            <a
              href={TOOL_URLS[result.toolId]}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 13, fontWeight: 600,
                color: 'var(--australe-green-light)',
                textDecoration: 'none',
                transition: 'opacity 150ms'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {t.toolLearnMore} →
            </a>
          </div>
        )}

      </div>
      </div>
    </div>
  )
}
