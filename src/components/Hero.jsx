export default function Hero({ t, onStart }) {
  return (
    <section style={{
      textAlign: 'center',
      padding: 'clamp(48px, 8vw, 96px) 24px',
      maxWidth: 720,
      margin: '0 auto'
    }} className="animate-fadeInUp">

      {/* Badge pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '8px 18px', borderRadius: 50, marginBottom: 32,
        background: 'rgba(45,112,96,0.12)',
        border: '1px solid var(--border-green)'
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--australe-gold)', display: 'inline-block', flexShrink: 0
        }} />
        <span style={{ color: 'var(--australe-gold)', fontSize: 13, fontWeight: 500, fontFamily: 'Inter' }}>
          Lab-AI-Finance
        </span>
      </div>

      {/* Titre */}
      <h1 style={{
        fontFamily: 'Sora',
        fontWeight: 800,
        fontSize: 'clamp(30px, 5vw, 52px)',
        lineHeight: 1.15,
        color: 'var(--text-primary)',
        marginBottom: 24
      }}>
        {t.heroTitle.split('\n')[0]}<br />
        <span style={{ color: 'var(--australe-gold)' }}>{t.heroTitle.split('\n')[1]}</span>
      </h1>

      {/* Subtitle */}
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: 'clamp(15px, 2vw, 18px)',
        lineHeight: 1.65,
        maxWidth: 520,
        margin: '0 auto 40px'
      }}>
        {t.heroSubtitle}
      </p>

      {/* CTA */}
      <button
        onClick={onStart}
        style={{
          background: 'var(--australe-green)',
          color: 'var(--text-primary)',
          borderRadius: 50,
          padding: '16px 40px',
          fontSize: 16,
          fontWeight: 600,
          fontFamily: 'Inter',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 200ms',
          boxShadow: '0 0 40px rgba(45,112,96,0.3)'
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        {t.heroCta} →
      </button>

      {/* Note sous CTA */}
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 16 }}>
        {t.heroTime} · Sans inscription
      </p>
    </section>
  )
}
