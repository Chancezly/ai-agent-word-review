interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  sublabel?: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ProgressBar({
  value,
  max = 100,
  label,
  sublabel,
  color = 'var(--accent)',
  size = 'md',
}: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0

  return (
    <div className={`progress-bar progress-bar--${size}`}>
      {(label || sublabel) && (
        <div className="progress-bar__header">
          {label && <span className="progress-bar__label">{label}</span>}
          {sublabel && <span className="progress-bar__sublabel">{sublabel}</span>}
        </div>
      )}
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
    </div>
  )
}
