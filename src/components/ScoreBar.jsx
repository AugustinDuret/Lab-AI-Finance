export default function ScoreBar({ score, size = 'md' }) {
  const color = score >= 75 ? '#2D7060' : score >= 60 ? '#C4A35A' : '#6B7280'
  const h = size === 'sm' ? '3px' : '6px'

  return (
    <div style={{
      background: 'rgba(255,255,255,0.07)',
      borderRadius: 99, height: h, overflow: 'hidden', width: '100%'
    }}>
      <div style={{
        width: `${score}%`, height: '100%', background: color,
        borderRadius: 99, transition: 'width 0.9s ease'
      }} />
    </div>
  )
}
