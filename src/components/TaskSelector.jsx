import { useState } from 'react'
import { TASK_CATEGORIES } from '../data/tasks.js'

export default function TaskSelector({ t, lang, selectedTasks, onToggle }) {
  const [openCat, setOpenCat] = useState('fpna')

  return (
    <div style={{
      border: '1px solid var(--border-green)',
      borderRadius: 12,
      overflow: 'hidden'
    }}>
      <p style={{ color: 'var(--text-muted)', fontSize: 12, padding: '10px 16px 10px', borderBottom: '1px solid var(--border-green)' }}>
        {t.tasksHint}
      </p>
      {TASK_CATEGORIES.map((cat, index) => {
        const count = cat.tasks.filter(task => selectedTasks.includes(task.id)).length
        const isOpen = openCat === cat.id
        return (
          <div key={cat.id}>
            {/* Header accordéon */}
            <button
              onClick={() => setOpenCat(isOpen ? null : cat.id)}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '13px 18px',
                background: isOpen ? 'var(--bg-card)' : 'var(--bg-secondary)',
                border: 'none',
                borderTop: index > 0 ? '1px solid var(--border-green)' : 'none',
                cursor: 'pointer',
                transition: 'background 150ms'
              }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', fontFamily: 'Inter' }}>
                {lang === 'fr' ? cat.labelFr : cat.labelEn}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {count > 0 && (
                  <span style={{
                    background: 'var(--australe-green)', color: 'white',
                    borderRadius: 12, padding: '2px 8px',
                    fontSize: 11, fontWeight: 700
                  }}>{count}</span>
                )}
                <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{isOpen ? '▲' : '▼'}</span>
              </div>
            </button>

            {/* Body accordéon */}
            {isOpen && (
              <div style={{
                padding: '8px 10px 10px',
                background: 'var(--bg-primary)',
                borderTop: '1px solid var(--border-green)',
                display: 'flex', flexDirection: 'column', gap: 3
              }}>
                {cat.tasks.map(task => {
                  const selected = selectedTasks.includes(task.id)
                  return (
                    <button
                      key={task.id}
                      onClick={() => onToggle(task.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 8,
                        background: selected ? 'rgba(45,112,96,0.1)' : 'transparent',
                        border: `1px solid ${selected ? 'var(--australe-green)' : 'transparent'}`,
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'all 100ms', width: '100%'
                      }}>
                      {/* Checkbox custom */}
                      <span style={{
                        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                        border: `2px solid ${selected ? 'var(--australe-green)' : 'var(--text-muted)'}`,
                        background: selected ? 'var(--australe-green)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 100ms'
                      }}>
                        {selected && <span style={{ color: 'white', fontSize: 10, lineHeight: 1 }}>✓</span>}
                      </span>
                      <span style={{
                        fontSize: 13,
                        color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontWeight: selected ? 500 : 400,
                        lineHeight: 1.4,
                        flex: 1
                      }}>
                        {lang === 'fr' ? task.labelFr : task.labelEn}
                      </span>
                      {task.sensible && (
                        <span style={{ fontSize: 10, color: 'var(--australe-gold)', opacity: 0.8, flexShrink: 0 }}>
                          🔒 sensible
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
