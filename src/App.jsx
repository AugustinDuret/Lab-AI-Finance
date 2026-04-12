import { useState, useRef, useEffect } from 'react'
import { useLanguage } from './hooks/useLanguage.js'
import { useIsMobile } from './hooks/useIsMobile.js'
import { computeRecommendation } from './engine/recommendationEngine.js'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import TaskSelector from './components/TaskSelector.jsx'
import ResultsCard from './components/ResultsCard.jsx'
import PdfExportButton from './components/PdfExportButton.jsx'
import Footer from './components/Footer.jsx'
import AnimatedBackground from './components/AnimatedBackground.jsx'
import FinanceSphere from './components/FinanceSphere.jsx'
import { TOOLS } from './data/tools.js'
import { TASKS_BY_ID } from './data/tasks.js'

const VIEWS = { HERO: 'hero', FORM: 'form', LOADING: 'loading', RESULTS: 'results' }

const SECTION_LABELS = {
  fr: ['Votre équipe', 'Environnement IT', 'Vos tâches', 'Contraintes'],
  en: ['Your team', 'IT Environment', 'Your tasks', 'Constraints']
}

export default function App() {
  const { lang, toggleLang, t } = useLanguage()
  const isMobile = useIsMobile()
  const [view, setView] = useState(VIEWS.HERO)
  const [activeSection, setActiveSection] = useState(0)
  const [answers, setAnswers] = useState({
    teamSize: '',
    functions: [],
    sector: '',
    ecosystem: 'unknown',
    dailyTools: [],
    dsiValidation: 'unknown',
    selectedTasks: [],
    budget: '',
    dataSensitivity: 'medium',
    rgpdRequirements: [],
  })
  const [recommendation, setRecommendation] = useState(null)
  const [showSecondary, setShowSecondary] = useState(false)
  const resultsRef = useRef(null)

  // Progress bar: auto-advance based on interactions
  useEffect(() => {
    if (view !== VIEWS.FORM) return
    setActiveSection(0)
  }, [view])

  useEffect(() => {
    if (answers.ecosystem !== 'unknown' || answers.dailyTools.length > 0 || answers.dsiValidation !== 'unknown') {
      setActiveSection(prev => Math.max(prev, 1))
    }
  }, [answers.ecosystem, answers.dailyTools, answers.dsiValidation])

  useEffect(() => {
    if (answers.selectedTasks.length > 0) {
      setActiveSection(prev => Math.max(prev, 2))
    }
  }, [answers.selectedTasks])

  useEffect(() => {
    if (answers.budget !== '' || answers.dataSensitivity !== 'medium' || answers.rgpdRequirements.length > 0) {
      setActiveSection(prev => Math.max(prev, 3))
    }
  }, [answers.budget, answers.dataSensitivity, answers.rgpdRequirements])

  const updateAnswer = (key, value) =>
    setAnswers(prev => ({ ...prev, [key]: value }))

  const toggleMulti = (key, value) =>
    setAnswers(prev => {
      const arr = prev[key]
      return { ...prev, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] }
    })

  const toggleTask = (taskId) => {
    setActiveSection(s => Math.max(s, 2))
    setAnswers(prev => {
      const tasks = prev.selectedTasks
      return { ...prev, selectedTasks: tasks.includes(taskId) ? tasks.filter(id => id !== taskId) : [...tasks, taskId] }
    })
  }

  const handleSubmit = () => {
    setView(VIEWS.LOADING)
    setTimeout(() => {
      const result = computeRecommendation(answers)
      setRecommendation(result)
      setShowSecondary(false)
      setView(VIEWS.RESULTS)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
    }, 1400)
  }

  const handleReset = () => {
    setView(VIEWS.HERO)
    setRecommendation(null)
    setActiveSection(0)
    setAnswers({
      teamSize: '', functions: [], sector: '', ecosystem: 'unknown',
      dailyTools: [], dsiValidation: 'unknown', selectedTasks: [],
      budget: '', dataSensitivity: 'medium', rgpdRequirements: [],
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Styles partagés ───────────────────────────────────────────
  const sectionCard = {
    background: 'var(--bg-card)', borderRadius: 16,
    border: '1px solid var(--border-green)', overflow: 'hidden'
  }

  const makeSectionHeader = (num, label) => (
    <div style={{
      padding: '18px 28px 16px', borderBottom: '1px solid var(--border-green)',
      display: 'flex', alignItems: 'center', gap: 12
    }}>
      <span style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: 'rgba(45,112,96,0.15)', border: '1px solid var(--border-green)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, color: 'var(--australe-gold)', fontFamily: 'Sora'
      }}>{num}</span>
      <h3 style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', margin: 0 }}>
        {label}
      </h3>
    </div>
  )

  const sectionBody = { padding: isMobile ? '16px' : '22px 28px', display: 'flex', flexDirection: 'column', gap: 22 }

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: 'var(--text-secondary)', letterSpacing: '0.05em',
    textTransform: 'uppercase', marginBottom: 10
  }
  const selectStyle = {
    width: '100%', background: 'var(--bg-secondary)', color: 'var(--text-primary)',
    border: '1px solid var(--border-green)', borderRadius: 10,
    padding: '12px 16px', fontSize: 14, fontFamily: 'Inter',
    appearance: 'none', cursor: 'pointer'
  }
  const chipStyle = (active) => ({
    padding: '8px 16px', borderRadius: 20, cursor: 'pointer',
    border: `1px solid ${active ? 'var(--australe-green)' : 'var(--border-green)'}`,
    background: active ? 'rgba(45,112,96,0.15)' : 'transparent',
    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
    fontSize: 13, fontWeight: active ? 600 : 400, transition: 'all 150ms'
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative' }}>
      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
      <Header onReset={handleReset} t={t} toggleLang={toggleLang} lang={lang} />

      {/* ── HERO ──────────────────────────────────────────────── */}
      {view === VIEWS.HERO && (
        <main style={{ maxWidth: 960, margin: '0 auto' }}>
          <Hero t={t} onStart={() => { setView(VIEWS.FORM); setActiveSection(0) }} />
        </main>
      )}

      {/* ── Barre de progression sticky ─────────────────────── */}
      {view === VIEWS.FORM && (
        <div style={{
          position: 'sticky',
          top: 65,
          zIndex: 40,
          background: 'rgba(10,17,14,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-green)',
          padding: '12px 24px'
        }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Labels des sections — masqués sur mobile */}
            {!isMobile && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                {SECTION_LABELS[lang].map((label, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: i === activeSection ? 700 : 400,
                      color: i <= activeSection ? 'var(--text-primary)' : 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {i + 1}. {label}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {/* Barres de progression */}
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 99,
                  background: i <= activeSection
                    ? 'var(--australe-green)'
                    : 'rgba(45,112,96,0.15)',
                  transition: 'background 300ms ease'
                }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FORMULAIRE ───────────────────────────────────────── */}
      {view === VIEWS.FORM && (
        <main style={{ maxWidth: 680, margin: '0 auto', padding: isMobile ? '20px 16px 100px' : '40px 24px 100px' }}
          className="animate-fadeInUp">

          <h2 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 24, color: 'var(--text-primary)', marginBottom: 24 }}>
            {t.formTitle}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Section 1 - Équipe */}
            <div style={{ ...sectionCard, position: 'relative' }}>
              <span style={{ position: 'absolute', top: 12, right: 14, width: 32, height: 32, borderRadius: '50%', background: 'rgba(196,163,90,0.12)', border: '1px solid rgba(196,163,90,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, pointerEvents: 'none', userSelect: 'none', zIndex: 1, flexShrink: 0 }}>👥</span>
              {makeSectionHeader(1, t.sectionTeam)}
              <div style={sectionBody}>
                <div onFocus={() => setActiveSection(s => Math.max(s, 0))}>
                  <label style={labelStyle}>{t.q1Label}</label>
                  <select style={selectStyle} value={answers.teamSize}
                    onChange={e => { updateAnswer('teamSize', e.target.value); setActiveSection(s => Math.max(s, 0)) }}>
                    <option value="">-</option>
                    {t.q1Options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>{t.q2Label}</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {t.q2Options.map(o => (
                      <button key={o}
                        onClick={() => { toggleMulti('functions', o); setActiveSection(s => Math.max(s, 0)) }}
                        style={chipStyle(answers.functions.includes(o))}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Secteur - optionnel, discret */}
                <div style={{ opacity: 0.85 }}>
                  <label style={{ ...labelStyle, color: 'var(--text-muted)', fontWeight: 500 }}>
                    {t.sectorOptional}
                  </label>
                  <select
                    style={{ ...selectStyle, color: 'var(--text-secondary)', fontSize: 13 }}
                    value={answers.sector}
                    onChange={e => updateAnswer('sector', e.target.value)}>
                    <option value="">{t.sectorSelect}</option>
                    {t.q3Options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2 - Tech */}
            <div style={{ ...sectionCard, position: 'relative' }}>
              <span style={{ position: 'absolute', top: 12, right: 14, width: 32, height: 32, borderRadius: '50%', background: 'rgba(196,163,90,0.12)', border: '1px solid rgba(196,163,90,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, pointerEvents: 'none', userSelect: 'none', zIndex: 1, flexShrink: 0 }}>💻</span>
              {makeSectionHeader(2, t.sectionTech)}
              <div style={sectionBody}>
                <div>
                  <label style={labelStyle}>{t.q4Label}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
                    {t.q4Options.map(opt => {
                      const active = answers.ecosystem === opt.id
                      return (
                        <button key={opt.id}
                          onClick={() => { updateAnswer('ecosystem', opt.id); setActiveSection(s => Math.max(s, 1)) }}
                          style={{
                            padding: '14px 18px', borderRadius: 12, cursor: 'pointer',
                            border: `1px solid ${active ? 'var(--australe-green)' : 'var(--border-green)'}`,
                            background: active ? 'rgba(45,112,96,0.12)' : 'var(--bg-secondary)',
                            textAlign: 'left', transition: 'all 150ms', position: 'relative'
                          }}>
                          {active && (
                            <span style={{
                              position: 'absolute', top: 10, right: 12,
                              width: 18, height: 18, borderRadius: '50%',
                              background: 'var(--australe-green)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 10, color: 'white'
                            }}>✓</span>
                          )}
                          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginBottom: 4 }}>{opt.label}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{opt.desc}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>{t.q5Label}</label>
                  {t.q5Groups.map(group => (
                    <div key={group.group} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>{group.group}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                        {group.items.map(item => (
                          <button key={item}
                            onClick={() => { toggleMulti('dailyTools', item); setActiveSection(s => Math.max(s, 1)) }}
                            style={chipStyle(answers.dailyTools.includes(item))}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <label style={labelStyle}>{t.q6Label}</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {[
                      { id: 'yes', label: t.q6Options[0] },
                      { id: 'no', label: t.q6Options[1] },
                      { id: 'unknown', label: t.q6Options[2] }
                    ].map(o => (
                      <button key={o.id}
                        onClick={() => { updateAnswer('dsiValidation', o.id); setActiveSection(s => Math.max(s, 1)) }}
                        style={chipStyle(answers.dsiValidation === o.id)}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 - Tâches */}
            <div style={{ ...sectionCard, position: 'relative' }}>
              <span style={{ position: 'absolute', top: 12, right: 14, width: 32, height: 32, borderRadius: '50%', background: 'rgba(196,163,90,0.12)', border: '1px solid rgba(196,163,90,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, pointerEvents: 'none', userSelect: 'none', zIndex: 1, flexShrink: 0 }}>🎯</span>
              {makeSectionHeader(3, t.sectionTasks)}
              <div style={{ padding: '20px 28px 24px' }}>
                <label style={labelStyle}>{t.tasksLabel}</label>
                <TaskSelector t={t} lang={lang} selectedTasks={answers.selectedTasks} onToggle={toggleTask} />
              </div>
            </div>

            {/* Section 4 - Contraintes */}
            <div style={{ ...sectionCard, position: 'relative' }}>
              <span style={{ position: 'absolute', top: 12, right: 14, width: 32, height: 32, borderRadius: '50%', background: 'rgba(196,163,90,0.12)', border: '1px solid rgba(196,163,90,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, pointerEvents: 'none', userSelect: 'none', zIndex: 1, flexShrink: 0 }}>🔒</span>
              {makeSectionHeader(4, t.sectionConstraints)}
              <div style={sectionBody}>
                {/* Budget */}
                <div>
                  <label style={labelStyle}>{t.q8Label}</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {t.q8Options.map(opt => {
                      const selected = answers.budget === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            updateAnswer('budget', opt.id);
                            setActiveSection(prev => Math.max(prev, 3));
                          }}
                          style={{
                            padding: '14px 18px',
                            borderRadius: 10,
                            cursor: 'pointer',
                            border: `1px solid ${selected ? 'var(--australe-green)' : 'var(--border-green)'}`,
                            background: selected ? 'rgba(45,112,96,0.12)' : 'transparent',
                            textAlign: 'left',
                            transition: 'all 150ms',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{
                              fontWeight: 600, fontSize: 14,
                              color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
                              marginBottom: 3
                            }}>
                              {opt.label}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                              {opt.desc}
                            </div>
                          </div>
                          {selected && (
                            <span style={{
                              color: 'var(--australe-green)',
                              fontSize: 18, fontWeight: 700, flexShrink: 0, marginLeft: 12
                            }}>✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Sensibilité */}
                <div>
                  <label style={labelStyle}>{t.q9Label}</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {t.q9Options.map(opt => {
                      const active = answers.dataSensitivity === opt.id
                      return (
                        <button key={opt.id}
                          onClick={() => { updateAnswer('dataSensitivity', opt.id); setActiveSection(s => Math.max(s, 3)) }}
                          style={{
                            padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                            border: `1px solid ${active ? 'var(--australe-green)' : 'var(--border-green)'}`,
                            background: active ? 'rgba(45,112,96,0.12)' : 'transparent',
                            textAlign: 'left', transition: 'all 150ms'
                          }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: active ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom: 3 }}>
                            {opt.label}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{opt.desc}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>
                {/* RGPD */}
                <div>
                  <label style={labelStyle}>{t.q10Label}</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {t.q10Options.map(o => (
                      <button key={o}
                        onClick={() => { toggleMulti('rgpdRequirements', o); setActiveSection(s => Math.max(s, 3)) }}
                        style={chipStyle(answers.rgpdRequirements.includes(o))}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA card — masquée sur mobile (sticky bottom btn prend le relais) */}
            <div className="cta-inline" style={{
              background: 'var(--bg-card)', borderRadius: 16,
              border: '1px solid var(--border-green)', padding: '28px 28px 32px', textAlign: 'center'
            }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 22, lineHeight: 1.5 }}>
                {t.analysisNote}
              </p>
              <button onClick={handleSubmit}
                style={{
                  background: 'var(--australe-green)',
                  color: 'var(--text-primary)', borderRadius: 50, padding: '16px 48px',
                  fontSize: 16, fontWeight: 600, fontFamily: 'Inter',
                  border: 'none', cursor: 'pointer', transition: 'all 200ms',
                  width: '100%', maxWidth: 360,
                  boxShadow: '0 0 30px rgba(45,112,96,0.25)'
                }}>
                {t.ctaSubmit} →
              </button>
            </div>

          </div>
        </main>
      )}

      {/* ── LOADING ───────────────────────────────────────────── */}
      {view === VIEWS.LOADING && (
        <main style={{ textAlign: 'center', padding: '60px 24px' }}
          className="animate-fadeInUp">

          {/* Sphère Finance animée */}
          <FinanceSphere size={330} />

          {/* Texte sous la sphère */}
          <p style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 600,
            fontSize: 18,
            color: 'var(--text-primary)',
            marginTop: 32,
            marginBottom: 8
          }}>
            {t.loadingTitle}
          </p>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.5
          }}>
            {t.loadingSubtitle}
          </p>

          {/* Indicateur de progression subtil */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
            marginTop: 24
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--australe-green)',
                animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`
              }} />
            ))}
          </div>
        </main>
      )}

      {/* ── RÉSULTATS ─────────────────────────────────────────── */}
      {view === VIEWS.RESULTS && recommendation && (
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}
          ref={resultsRef}>

          <div id="results-section">

            {/* PDF header */}
            <div className="pdf-header-only" style={{ display: 'none' }}>
              <div style={{ textAlign: 'center', paddingBottom: 24, borderBottom: '1px solid #ddd', marginBottom: 28 }}>
                <div style={{ fontFamily: 'Arial', fontWeight: 800, fontSize: 20, color: '#2D7060' }}>Lab-AI-Finance</div>
                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                  Recommandation personnalisée - {new Date().toLocaleDateString('fr-FR')}
                </div>
                <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>by Augustin Duret</div>
              </div>
            </div>

            {/* Titre + mini-résumé profil */}
            <div className="cascade-1" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
                <h2 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 24, color: 'var(--text-primary)' }}>
                  {t.resultsTitle}
                </h2>
                <PdfExportButton t={t} recommendation={recommendation} answers={answers} lang={lang} />
              </div>

              {/* Mini-résumé profil */}
              {(answers.functions?.length > 0 || (answers.ecosystem && answers.ecosystem !== 'unknown') || answers.dataSensitivity === 'high' || answers.selectedTasks?.length > 0) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  {answers.functions?.slice(0, 3).map(fn => (
                    <span key={fn} style={{
                      background: 'rgba(45,112,96,0.1)', border: '1px solid var(--border-green)',
                      borderRadius: 16, padding: '4px 12px', fontSize: 12,
                      color: 'var(--text-secondary)', fontWeight: 500
                    }}>{fn}</span>
                  ))}
                  {answers.ecosystem && answers.ecosystem !== 'unknown' && (
                    <span style={{
                      background: 'rgba(45,112,96,0.1)', border: '1px solid var(--border-green)',
                      borderRadius: 16, padding: '4px 12px', fontSize: 12,
                      color: 'var(--text-secondary)', fontWeight: 500
                    }}>
                      {answers.ecosystem === 'microsoft365' ? 'Microsoft 365'
                        : answers.ecosystem === 'google' ? 'Google Workspace'
                        : lang === 'fr' ? 'Mixte' : 'Mixed'}
                    </span>
                  )}
                  {answers.dataSensitivity === 'high' && (
                    <span style={{
                      background: 'rgba(196,163,90,0.1)', border: '1px solid rgba(196,163,90,0.25)',
                      borderRadius: 16, padding: '4px 12px', fontSize: 12,
                      color: 'var(--australe-gold)', fontWeight: 500
                    }}>
                      🔒 {lang === 'fr' ? 'Données sensibles' : 'Sensitive data'}
                    </span>
                  )}
                  {answers.selectedTasks?.length > 0 && (
                    <span style={{
                      background: 'rgba(45,112,96,0.1)', border: '1px solid var(--border-green)',
                      borderRadius: 16, padding: '4px 12px', fontSize: 12,
                      color: 'var(--text-muted)', fontWeight: 400
                    }}>
                      {answers.selectedTasks.length} {lang === 'fr' ? 'tâche(s) sélectionnée(s)' : 'task(s) selected'}
                    </span>
                  )}
                  {answers.budget && (
                    <span style={{
                      background: 'rgba(196,163,90,0.08)', border: '1px solid rgba(196,163,90,0.2)',
                      borderRadius: 16, padding: '4px 12px', fontSize: 12,
                      color: 'var(--australe-gold)', fontWeight: 500
                    }}>
                      {answers.budget === 'free' ? t.budgetFree : t.budgetPaid}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Card principale */}
            <div className="cascade-2">
              <ResultsCard
                result={recommendation.primary}
                t={t} lang={lang} isPrimary={true}
                ecosystem={recommendation.ecosystem}
              />
            </div>

            {/* Alternative */}
            {recommendation.secondary && (
              <div className="cascade-3" style={{ marginTop: 16 }}>
                <button
                  onClick={() => setShowSecondary(!showSecondary)}
                  style={{
                    color: 'var(--australe-green-light)', fontSize: 14,
                    background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0'
                  }}>
                  {showSecondary ? t.hideAlternative : t.showAlternative} →
                </button>
                {showSecondary && (
                  <div className="cascade-4" style={{ marginTop: 12 }}>
                    <ResultsCard
                      result={recommendation.secondary}
                      t={t} lang={lang} isPrimary={false}
                      ecosystem={recommendation.ecosystem}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Div d'impression — caché à l'écran, visible uniquement en @media print */}
          <div id="print-target" style={{ display: 'none' }}>
            <div id="print-header">
              <div style={{ fontSize: 20, fontWeight: 800, color: '#2D7060', fontFamily: 'Sora, Arial' }}>
                Lab-AI-Finance
              </div>
              <div className="print-muted" style={{ fontSize: 12, marginTop: 4 }}>
                Recommandation personnalisée · {new Date().toLocaleDateString('fr-FR')}
              </div>
              <div className="print-muted" style={{ fontSize: 11, marginTop: 3 }}>
                by Augustin Duret · linkedin.com/in/augustin-duret
              </div>
            </div>

            {/* Outil recommandé */}
            {recommendation?.primary && (
              <div className="print-card">
                <div className="print-green" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  Outil recommandé
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
                  {TOOLS[recommendation.primary.toolId]?.nameFr || recommendation.primary.toolId}
                </div>

                {/* Pourquoi cet outil */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    Pourquoi cet outil
                  </div>
                  {(TOOLS[recommendation.primary.toolId]?.whyFr || []).map((reason, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                      <span className="print-green" style={{ fontWeight: 700 }}>✓</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                {/* Points de vigilance */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    Points de vigilance
                  </div>
                  {(TOOLS[recommendation.primary.toolId]?.vigilanceFr || []).map((v, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                      <span className="print-gold">⚠</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Budget */}
                <div>
                  <span style={{ fontWeight: 600 }}>Accès & tarifs : </span>
                  {TOOLS[recommendation.primary.toolId]?.budgetFr}
                </div>
              </div>
            )}

            {/* Tâches sélectionnées */}
            {answers?.selectedTasks?.length > 0 && (
              <div className="print-card">
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Vos tâches prioritaires
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {answers.selectedTasks.map(taskId => (
                    <span key={taskId} style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 12,
                      padding: '2px 10px',
                      fontSize: 11
                    }}>
                      {TASKS_BY_ID[taskId]?.labelFr || taskId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Profil utilisateur */}
            <div className="print-card">
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Votre profil
              </div>
              {answers?.functions?.length > 0 && (
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>Fonctions : </span>
                  {answers.functions.join(', ')}
                </div>
              )}
              {answers?.ecosystem && answers.ecosystem !== 'unknown' && (
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>Écosystème IT : </span>
                  {answers.ecosystem === 'microsoft365' ? 'Microsoft 365'
                    : answers.ecosystem === 'google' ? 'Google Workspace'
                    : 'Mixte'}
                </div>
              )}
              {answers?.sector && (
                <div>
                  <span style={{ fontWeight: 600 }}>Secteur : </span>
                  {answers.sector}
                </div>
              )}
            </div>

            <div className="print-muted" style={{ textAlign: 'center', fontSize: 11, marginTop: 24 }}>
              lab-ai-finance-production.up.railway.app
            </div>
          </div>

          {/* Recommencer */}
          <div className="cascade-5" style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <button onClick={handleReset}
              style={{
                border: '1px solid var(--border-green)', color: 'var(--text-secondary)',
                background: 'transparent', borderRadius: 8,
                padding: '10px 24px', fontSize: 14, cursor: 'pointer', transition: 'opacity 150ms'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              ♻️ {t.ctaReset}
            </button>
          </div>
        </main>
      )}

      {/* CTA sticky mobile */}
      {view === VIEWS.FORM && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          padding: '20px 16px 16px',
          background: 'linear-gradient(transparent, var(--bg-primary) 40%)',
          zIndex: 40
        }} className="md:hidden">
          <button onClick={handleSubmit}
            style={{
              background: 'var(--australe-green)',
              color: 'var(--text-primary)', borderRadius: 50, padding: '14px', fontSize: 15, fontWeight: 600,
              width: '100%', border: 'none', cursor: 'pointer'
            }}>
            {t.ctaSubmit} →
          </button>
        </div>
      )}

      <Footer t={t} lang={lang} />
      </div>
    </div>
  )
}
