export default function Header({ onReset, t, toggleLang, lang }) {
  return (
    <header style={{
      background: 'rgba(10,17,14,0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-green)',
      position: 'sticky', top: 0, zIndex: 50
    }}>
      <div style={{
        maxWidth: 1024, margin: '0 auto',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div
          onClick={onReset}
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--australe-green), #1a4a3a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(196,163,90,0.3)',
            flexShrink: 0
          }}>
            <span style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 13, color: 'var(--australe-gold)' }}>AI</span>
          </div>
          <span style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>
            Lab-AI-Finance
          </span>
        </div>

        {/* Language switcher avec drapeaux */}
        <button
          onClick={toggleLang}
          title={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            border: '1px solid var(--border-green)',
            borderRadius: 8, padding: '5px 12px',
            background: 'transparent', cursor: 'pointer',
            transition: 'all 150ms'
          }}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>
            {lang === 'fr' ? '🇬🇧' : '🇫🇷'}
          </span>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>
            {lang === 'fr' ? 'EN' : 'FR'}
          </span>
        </button>
      </div>
    </header>
  )
}
