import { useState, useRef, useEffect, useCallback } from 'react';
import { useIsMobile } from '../hooks/useIsMobile.js';

const GREEN  = '#2D7060';
const GREENL = '#3D9478';
const GOLD   = '#C4A35A';
const BG     = '#0D1610';
const CARD   = '#151E18';
const BORDER = 'rgba(45,112,96,0.22)';
const MAX    = 10;

// Icône chat pour la bulle flottante
function BubbleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path
        d="M13 2C6.925 2 2 6.477 2 12c0 2.136.69 4.115 1.863 5.73L2.5 22.5l5.23-1.327A11.07 11.07 0 0 0 13 22c6.075 0 11-4.477 11-10S19.075 2 13 2Z"
        fill="white" fillOpacity="0.92"
      />
      <circle cx="8.5"  cy="12" r="1.4" fill={GREEN}/>
      <circle cx="13"   cy="12" r="1.4" fill={GREEN}/>
      <circle cx="17.5" cy="12" r="1.4" fill={GREEN}/>
    </svg>
  );
}

// Avatar Finn en header et messages
function FinnBadge({ size = 34 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `linear-gradient(135deg, ${GREENL}, ${GREEN})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 0 0 2px rgba(196,163,90,0.35)`,
      fontSize: size * 0.42,
      fontFamily: 'Sora, sans-serif',
      fontWeight: 800,
      color: 'rgba(255,255,255,0.95)',
      letterSpacing: '-0.02em',
      userSelect: 'none',
    }}>F</div>
  );
}

function getOpening(lang, hasProfile) {
  if (lang === 'fr') {
    return hasProfile
      ? "Hey ! 👋 J'ai jeté un œil à ton analyse — des questions sur l'outil recommandé ?"
      : "Hey ! 👋 Moi c'est Finn, ton copilote Finance × IA. Pose-moi n'importe quelle question !";
  }
  return hasProfile
    ? "Hey! 👋 Checked out your analysis — any questions about the recommended tool?"
    : "Hey! 👋 I'm Finn, your Finance × AI copilot. Ask me anything!";
}

export default function ChatBot({ lang = 'fr', userProfile, recommendation }) {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showDots, setShowDots] = useState(false);
  const [count, setCount]       = useState(0);
  const [inited, setInited]     = useState(false);
  const [pulse, setPulse]       = useState(true);

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const windowRef  = useRef(null);
  const loadTimer  = useRef(null);

  const isMobile   = useIsMobile(640);
  const hasProfile = Boolean(recommendation?.primary?.toolId);
  const atLimit    = count >= MAX;

  // Message d'ouverture
  useEffect(() => {
    if (open && !inited) {
      setMessages([{ role: 'assistant', content: getOpening(lang, hasProfile) }]);
      setInited(true);
      setPulse(false);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open, inited, lang, hasProfile]);

  // Auto-scroll
  useEffect(() => {
    if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
  }, [messages, open]);

  // Fermer au clic extérieur
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (windowRef.current?.contains(e.target)) return;
      if (document.getElementById('finn-fab')?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  // Échap
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open]);

  useEffect(() => () => clearTimeout(loadTimer.current), []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || atLimit) return;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);
    setCount(c => c + 1);
    clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => setShowDots(true), 280);

    try {
      const tasks = userProfile?.selectedTasks;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next,
          userProfile: hasProfile ? {
            toolId:    recommendation.primary.toolId,
            ecosystem: userProfile?.ecosystem || '',
            tasks:     Array.isArray(tasks) ? tasks.join(', ') : (tasks || ''),
            budget:    userProfile?.budget    || '',
          } : null,
          lang,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Erreur serveur');
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err) {
      const fallback = lang === 'fr' ? 'Petit bug de ma part... réessaie ! 😅' : 'My bad, try again! 😅';
      setMessages(prev => [...prev, { role: 'assistant', content: err.message || fallback }]);
    } finally {
      clearTimeout(loadTimer.current);
      setLoading(false);
      setShowDots(false);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [input, loading, atLimit, messages, hasProfile, recommendation, userProfile, lang]);

  const handleKey = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }, [send]);

  // Dimensions responsives
  const chatW = isMobile ? Math.min(window.innerWidth - 20, 360) : 360;
  const chatH = isMobile ? Math.min(window.innerHeight - 120, 500) : 480;
  const chatR = isMobile ? 10 : 24;
  const chatB = isMobile ? 88 : 88;

  return (
    <>
      {/* ── Bouton flottant ──────────────────────────────── */}
      <button
        id="finn-fab"
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Ouvrir Finn — Assistant Finance IA"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          width: 56, height: 56, borderRadius: '50%',
          background: open
            ? `linear-gradient(135deg, #1a4a38, ${GREEN})`
            : `linear-gradient(135deg, ${GREEN}, ${GREENL})`,
          border: `2.5px solid ${GOLD}`,
          boxShadow: open
            ? `0 2px 20px rgba(45,112,96,0.6)`
            : `0 4px 20px rgba(45,112,96,0.4), 0 0 0 0 rgba(196,163,90,0)`,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          transform: open ? 'rotate(0deg) scale(0.95)' : 'rotate(0deg) scale(1)',
          padding: 0, outline: 'none',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = open ? 'scale(0.95)' : 'scale(1)'; }}
      >
        {open
          ? <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 20, lineHeight: 1 }}>✕</span>
          : <BubbleIcon />
        }

        {/* Pastille d'invitation */}
        {pulse && !open && (
          <span style={{
            position: 'absolute', top: -2, right: -2,
            width: 14, height: 14, borderRadius: '50%',
            background: GOLD, border: '2.5px solid #0D1610',
            animation: 'finnDot 1.6s ease-in-out infinite',
          }} />
        )}
      </button>

      {/* ── Fenêtre chat ─────────────────────────────────── */}
      {open && (
        <div
          ref={windowRef}
          role="dialog"
          aria-label="Finn — Assistant Finance IA"
          aria-modal="true"
          style={{
            position: 'fixed',
            bottom: chatB, right: chatR,
            zIndex: 999,
            width: chatW, height: chatH,
            background: BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 20,
            boxShadow: '0 16px 56px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            animation: 'finnFadeInUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '14px 16px 12px', flexShrink: 0,
            background: `linear-gradient(135deg, rgba(45,112,96,0.16), rgba(196,163,90,0.06))`,
            borderBottom: `1px solid ${BORDER}`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <FinnBadge size={38} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                color: '#EFF5F1', fontWeight: 700, fontSize: 15,
                fontFamily: 'Sora, sans-serif', lineHeight: 1.15,
              }}>Finn</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5, marginTop: 2,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#4ade80', flexShrink: 0,
                  boxShadow: '0 0 6px #4ade80',
                }} />
                <span style={{ color: GOLD, fontSize: 11, opacity: 0.85, letterSpacing: '0.03em' }}>
                  Finance × IA Copilot
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#6A8A7A', cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#EFF5F1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#6A8A7A'; }}
            >✕</button>
          </div>

          {/* Messages */}
          <div
            role="log"
            aria-live="polite"
            style={{
              flex: 1, overflowY: 'auto',
              padding: '16px 14px 8px',
              display: 'flex', flexDirection: 'column', gap: 12,
              scrollbarWidth: 'thin',
              scrollbarColor: `${BORDER} transparent`,
            }}
          >
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 8,
              }}>
                {/* Avatar Finn visible seulement sur son premier message consécutif */}
                {m.role === 'assistant' ? (
                  <FinnBadge size={26} />
                ) : (
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(45,112,96,0.2)',
                    border: `1px solid rgba(45,112,96,0.3)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12,
                  }}>👤</div>
                )}
                <div style={{
                  maxWidth: '78%',
                  background: m.role === 'user'
                    ? `linear-gradient(135deg, ${GREEN}, #1d5a45)`
                    : CARD,
                  border: m.role === 'user' ? 'none' : `1px solid ${BORDER}`,
                  borderRadius: m.role === 'user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  padding: '10px 14px',
                  fontSize: 13.5,
                  color: '#EFF5F1',
                  lineHeight: 1.6,
                  wordBreak: 'break-word',
                  boxShadow: m.role === 'user'
                    ? '0 2px 12px rgba(45,112,96,0.3)'
                    : '0 1px 4px rgba(0,0,0,0.3)',
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* Dots de chargement */}
            {showDots && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <FinnBadge size={26} />
                <div style={{
                  background: CARD, border: `1px solid ${BORDER}`,
                  borderRadius: '18px 18px 18px 4px',
                  padding: '12px 18px',
                  display: 'flex', gap: 5, alignItems: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: GOLD, opacity: 0.7,
                      animation: `finnPulse 1.3s ease-in-out ${i * 0.18}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Limite de session */}
            {atLimit && (
              <div style={{
                textAlign: 'center', fontSize: 12, color: '#5A7A6A',
                padding: '10px 12px',
                background: 'rgba(45,112,96,0.06)',
                borderRadius: 10,
                border: `1px solid rgba(45,112,96,0.12)`,
                marginTop: 4,
              }}>
                {lang === 'fr'
                  ? '🙏 Limite de session atteinte — recharge la page pour continuer'
                  : '🙏 Session limit reached — reload to continue'}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Compteur discret */}
          {!atLimit && count > 0 && (
            <div style={{
              textAlign: 'right', fontSize: 10, color: 'rgba(90,122,106,0.35)',
              padding: '0 16px 2px', flexShrink: 0,
            }}>
              {count}/{MAX}
            </div>
          )}

          {/* Zone de saisie */}
          <div style={{
            padding: '10px 12px 14px', flexShrink: 0,
            borderTop: `1px solid ${BORDER}`,
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={atLimit
                ? (lang === 'fr' ? 'Session terminée' : 'Session ended')
                : (lang === 'fr' ? 'Une question pour Finn...' : 'Ask Finn anything...')}
              disabled={atLimit || loading}
              maxLength={400}
              autoComplete="off"
              aria-label={lang === 'fr' ? 'Message pour Finn' : 'Message to Finn'}
              style={{
                flex: 1, height: 40,
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 12,
                padding: '0 14px',
                color: '#EFF5F1', fontSize: 13.5,
                outline: 'none',
                opacity: atLimit ? 0.4 : 1,
                fontFamily: 'Inter, sans-serif',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(45,112,96,0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(45,112,96,0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = BORDER;
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="button"
              onClick={send}
              disabled={atLimit || loading || !input.trim()}
              aria-label={lang === 'fr' ? 'Envoyer' : 'Send'}
              style={{
                width: 40, height: 40, flexShrink: 0,
                background: input.trim() && !loading && !atLimit
                  ? `linear-gradient(135deg, ${GREEN}, ${GREENL})`
                  : 'rgba(45,112,96,0.12)',
                border: `1px solid ${input.trim() && !loading && !atLimit ? GREEN : BORDER}`,
                borderRadius: 12,
                color: '#EFF5F1', fontSize: 18,
                cursor: input.trim() && !loading && !atLimit ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                boxShadow: input.trim() && !loading && !atLimit
                  ? '0 2px 8px rgba(45,112,96,0.35)' : 'none',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 9h14M9 2l7 7-7 7" stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" opacity={input.trim() && !loading && !atLimit ? 1 : 0.35}/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
