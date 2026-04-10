export default function Footer({ t, lang }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-green)',
      marginTop: 80,
      padding: '40px 24px 36px',
      position: 'relative',
      zIndex: 1,
    }}>
      <div style={{
        maxWidth: 720,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}>

        {/* Question */}
        <p style={{
          fontSize: 15,
          color: 'var(--text-secondary)',
          margin: 0,
          fontWeight: 400,
          letterSpacing: '0.01em',
        }}>
          {lang === 'fr' ? 'Vous voulez en discuter ?' : 'Want to discuss this?'}
        </p>

        {/* Séparateur discret */}
        <div style={{
          width: 32,
          height: 1,
          background: 'var(--border-green)',
        }} />

        {/* Bouton LinkedIn */}
        <a
          href="https://www.linkedin.com/in/augustin-duret"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            padding: '10px 20px',
            borderRadius: 10,
            border: '1px solid var(--border-green)',
            background: 'rgba(45,112,96,0.05)',
            transition: 'all 200ms',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(45,112,96,0.12)';
            e.currentTarget.style.borderColor = 'rgba(45,112,96,0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(45,112,96,0.05)';
            e.currentTarget.style.borderColor = 'var(--border-green)';
          }}
        >
          {/* Logo LinkedIn SVG */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="24" rx="4" fill="#0A66C2"/>
            <path
              d="M7.5 9.5H5V19H7.5V9.5ZM6.25 8.5C7.08 8.5 7.75 7.83 7.75 7C7.75 6.17 7.08 5.5 6.25 5.5C5.42 5.5 4.75 6.17 4.75 7C4.75 7.83 5.42 8.5 6.25 8.5ZM19 19H16.5V14.25C16.5 13.01 15.49 12 14.25 12C13.01 12 12 13.01 12 14.25V19H9.5V9.5H12V10.76C12.57 10.04 13.5 9.5 14.5 9.5C16.99 9.5 19 11.51 19 14V19Z"
              fill="white"
            />
          </svg>

          <span style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--text-primary)',
            fontFamily: 'Inter',
          }}>
            Augustin Duret
          </span>

          <span style={{
            width: 1,
            height: 14,
            background: 'var(--border-green)',
            display: 'inline-block',
          }} />

          <span style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--text-muted)',
            letterSpacing: '0.03em',
          }}>
            LinkedIn
          </span>
        </a>

        {/* Baseline + année */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 4,
        }}>
          <span style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            fontFamily: 'Sora',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}>
            Lab-AI-Finance
          </span>
          <span style={{ color: 'var(--border-green)', fontSize: 10 }}>·</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {new Date().getFullYear()}
          </span>
        </div>

      </div>
    </footer>
  );
}
