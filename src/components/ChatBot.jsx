import { useState, useRef, useEffect, useCallback } from 'react';
import { useIsMobile } from '../hooks/useIsMobile.js';

const GREEN = '#2D7060';
const GOLD  = '#C4A35A';
const BG    = '#0A110E';
const BG2   = '#111D16';
const MAX   = 10;

function FinnAvatar({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}>
      <rect width="36" height="36" rx="18" fill="#1a4a38"/>
      <rect width="36" height="36" rx="18" fill={GREEN} opacity="0.85"/>
      <circle cx="18" cy="15" r="7.5" fill="#0A110E" opacity="0.55"/>
      <rect x="13" y="12" width="3" height="4" rx="1.5" fill={GOLD}/>
      <rect x="20" y="12" width="3" height="4" rx="1.5" fill={GOLD}/>
      <path d="M14 20.5 Q18 23.5 22 20.5"
        stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <line x1="18" y1="7.5" x2="18" y2="4"
        stroke={GOLD} strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="18" cy="3" r="1.5" fill={GOLD}/>
    </svg>
  );
}

function getOpening(lang, hasProfile) {
  if (lang === 'fr') {
    return hasProfile
      ? "Hey ! 👋 Je suis Finn, ton copilote IA Finance. J'ai vu ton analyse — des questions ?"
      : "Salut ! 👋 Je suis Finn, ton copilote IA Finance. Une question sur l'IA ou la Finance ? Je suis là !";
  }
  return hasProfile
    ? "Hey! 👋 I'm Finn, your Finance AI copilot. Saw your analysis — any questions?"
    : "Hey! 👋 I'm Finn, your Finance AI copilot. Ask me anything about AI or Finance!";
}

export default function ChatBot({ lang = 'fr', userProfile, recommendation }) {
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [showDots, setShowDots]   = useState(false);
  const [count, setCount]         = useState(0);
  const [inited, setInited]       = useState(false);
  const [firstOpen, setFirstOpen] = useState(true);

  const bottomRef   = useRef(null);
  const inputRef    = useRef(null);
  const windowRef   = useRef(null);
  const loadTimer   = useRef(null);

  const isMobile   = useIsMobile(480);
  const hasProfile = Boolean(recommendation?.primary?.toolId);
  const atLimit    = count >= MAX;

  useEffect(() => {
    if (open && !inited) {
      setMessages([{ role: 'assistant', content: getOpening(lang, hasProfile) }]);
      setInited(true);
      setFirstOpen(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, inited, lang, hasProfile]);

  useEffect(() => {
    if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      const bubble = document.getElementById('finn-bubble');
      if (windowRef.current?.contains(e.target)) return;
      if (bubble?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open]);

  useEffect(() => {
    return () => clearTimeout(loadTimer.current);
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || atLimit) return;

    const userMsg = { role: 'user', content: text };
    const next    = [...messages, userMsg];

    setMessages(next);
    setInput('');
    setLoading(true);
    setCount(c => c + 1);

    clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => setShowDots(true), 300);

    try {
      const tasks = userProfile?.selectedTasks;
      const tasksStr = Array.isArray(tasks) ? tasks.join(', ') : (tasks || '');

      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next,
          userProfile: hasProfile ? {
            toolId:    recommendation.primary.toolId,
            ecosystem: userProfile?.ecosystem || '',
            tasks:     tasksStr,
            budget:    userProfile?.budget    || '',
          } : null,
          lang,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Erreur serveur');
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);

    } catch (err) {
      const fallback = lang === 'fr'
        ? 'Petit bug de ma part... réessaie ! 😅'
        : 'My bad, small bug... try again! 😅';
      setMessages(prev => [...prev, { role: 'assistant', content: err.message || fallback }]);
    } finally {
      clearTimeout(loadTimer.current);
      setLoading(false);
      setShowDots(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [input, loading, atLimit, messages, hasProfile, recommendation, userProfile, lang]);

  const handleKey = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }, [send]);

  const chatW = isMobile ? Math.min(window.innerWidth - 16, 340) : 320;
  const chatR = isMobile ? 8 : 24;

  return (
    <>
      <button
        id="finn-bubble"
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Ouvrir Finn — Assistant IA Finance"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          width: 54, height: 54, borderRadius: '50%',
          background: `linear-gradient(135deg, ${GREEN}, #1a4a38)`,
          border: `2px solid ${GOLD}`,
          boxShadow: open
            ? `0 4px 24px rgba(45,112,96,0.55)`
            : `0 4px 16px rgba(45,112,96,0.35)`,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s, box-shadow 0.2s',
          padding: 0,
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <FinnAvatar size={32} />
        {firstOpen && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            width: 12, height: 12, borderRadius: '50%',
            background: GOLD, border: '2px solid #0A110E',
            animation: 'finnDot 1.5s ease-in-out infinite',
          }} />
        )}
      </button>

      {open && (
        <div
          ref={windowRef}
          role="dialog"
          aria-label="Finn - Assistant IA Finance"
          aria-modal="true"
          style={{
            position: 'fixed',
            bottom: 90, right: chatR,
            zIndex: 1000,
            width: chatW, height: 430,
            background: BG,
            border: `1px solid rgba(45,112,96,0.28)`,
            borderRadius: 16,
            boxShadow: '0 8px 40px rgba(0,0,0,0.65)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            animation: 'finnFadeInUp 0.2s ease',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '11px 14px', flexShrink: 0,
            background: `linear-gradient(135deg, rgba(45,112,96,0.14), rgba(196,163,90,0.07))`,
            borderBottom: `1px solid rgba(45,112,96,0.18)`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FinnAvatar size={32} />
              <div>
                <div style={{
                  color: '#F0F4F1', fontWeight: 700, fontSize: 14,
                  fontFamily: 'Sora, sans-serif', lineHeight: 1.2,
                }}>Finn</div>
                <div style={{ color: GOLD, fontSize: 10, letterSpacing: '0.05em', opacity: 0.9 }}>
                  Finance AI Copilot
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              style={{
                background: 'none', border: 'none',
                color: '#5A7A6A', cursor: 'pointer',
                fontSize: 17, padding: '4px 6px', lineHeight: 1,
                borderRadius: 6, transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#F0F4F1'}
              onMouseLeave={e => e.currentTarget.style.color = '#5A7A6A'}
            >✕</button>
          </div>

          {/* Messages */}
          <div
            role="log"
            aria-live="polite"
            aria-label="Messages"
            style={{
              flex: 1, overflowY: 'auto',
              padding: '10px 12px',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}
          >
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                {m.role === 'assistant' && (
                  <span style={{
                    fontSize: 9, color: GOLD, fontWeight: 700,
                    letterSpacing: '0.06em', marginBottom: 3, paddingLeft: 4,
                  }}>FINN</span>
                )}
                <div style={{
                  background: m.role === 'user'
                    ? `linear-gradient(135deg, ${GREEN}, #1a5040)`
                    : BG2,
                  border: m.role === 'user'
                    ? 'none'
                    : `1px solid rgba(45,112,96,0.16)`,
                  borderRadius: m.role === 'user'
                    ? '14px 14px 4px 14px'
                    : '14px 14px 14px 4px',
                  padding: '8px 12px',
                  fontSize: 13, color: '#F0F4F1',
                  lineHeight: 1.55,
                  maxWidth: '85%', wordBreak: 'break-word',
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {showDots && (
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{
                  background: BG2,
                  border: `1px solid rgba(45,112,96,0.16)`,
                  borderRadius: '14px 14px 14px 4px',
                  padding: '10px 16px',
                  display: 'flex', gap: 5, alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: GOLD,
                      animation: `finnPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {atLimit && (
              <div style={{
                textAlign: 'center', fontSize: 11, color: '#5A7A6A',
                padding: '8px 0 4px',
                borderTop: `1px solid rgba(45,112,96,0.12)`,
                marginTop: 4,
              }}>
                {lang === 'fr'
                  ? '🙏 Limite de session atteinte — recharge la page pour continuer'
                  : '🙏 Session limit reached — reload to continue'}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {!atLimit && count > 0 && (
            <div style={{
              textAlign: 'right', fontSize: 10,
              color: 'rgba(90,122,106,0.4)',
              padding: '0 14px 2px', flexShrink: 0,
            }}>
              {count}/{MAX}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '8px 12px 12px', flexShrink: 0,
            borderTop: `1px solid rgba(45,112,96,0.14)`,
            display: 'flex', gap: 8,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={atLimit
                ? (lang === 'fr' ? 'Session terminée' : 'Session ended')
                : (lang === 'fr' ? 'Une question pour Finn...' : 'Ask Finn...')}
              disabled={atLimit || loading}
              maxLength={400}
              autoComplete="off"
              aria-label={lang === 'fr' ? 'Message pour Finn' : 'Message to Finn'}
              style={{
                flex: 1,
                background: BG2,
                border: `1px solid rgba(45,112,96,0.22)`,
                borderRadius: 8,
                padding: '8px 12px',
                color: '#F0F4F1', fontSize: 13,
                outline: 'none',
                opacity: atLimit ? 0.45 : 1,
                fontFamily: 'Inter, sans-serif',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(45,112,96,0.5)'}
              onBlur={e  => e.target.style.borderColor = 'rgba(45,112,96,0.22)'}
            />
            <button
              type="button"
              onClick={send}
              disabled={atLimit || loading || !input.trim()}
              aria-label={lang === 'fr' ? 'Envoyer' : 'Send'}
              style={{
                background: input.trim() && !loading && !atLimit
                  ? GREEN : 'rgba(45,112,96,0.16)',
                border: 'none', borderRadius: 8,
                padding: '8px 13px',
                color: '#F0F4F1', fontSize: 16, flexShrink: 0,
                cursor: input.trim() && !loading && !atLimit
                  ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
              }}
            >→</button>
          </div>
        </div>
      )}
    </>
  );
}
