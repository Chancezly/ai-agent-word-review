import { ProgressBar } from './ProgressBar'
import { STATUS_COLORS, STATUS_LABELS, type MasteryStatus } from '../types'

interface DashboardProps {
  stats: {
    counts: Record<MasteryStatus, number>
    total: number
    learned: number
    mastered: number
    percent: number
  }
  weekStats: { week: string; total: number; mastered: number; percent: number }[]
  currentWeekLabel: string
  todayNewCount: number
  todayReviewCount: number
  startDate: string
}

export function Dashboard({
  stats,
  weekStats,
  currentWeekLabel,
  todayNewCount,
  todayReviewCount,
  startDate,
}: DashboardProps) {
  return (
    <div className="dashboard">
      <section className="hero-card">
        <div className="hero-card__content">
          <p className="hero-card__eyebrow">{currentWeekLabel}</p>
          <h2 className="hero-card__title">学习进行中</h2>
          <p className="hero-card__meta">
            起点 {startDate} · 待学 {todayNewCount} · 待复习 {todayReviewCount}
          </p>
        </div>
        <div className="hero-card__ring" aria-label={`已掌握 ${stats.percent}%`}>
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" className="ring-bg" />
            <circle
              cx="60"
              cy="60"
              r="52"
              className="ring-fill"
              style={{ strokeDasharray: `${stats.percent * 3.27} 327` }}
            />
          </svg>
          <div className="hero-card__ring-label">
            <strong>{stats.percent}%</strong>
            <span>已掌握</span>
          </div>
        </div>
      </section>

      <section className="grouped-section">
        <div className="stats-row">
          <div className="stat-cell">
            <span className="stat-cell__value">{stats.mastered}</span>
            <span className="stat-cell__label">已掌握</span>
          </div>
          <div className="stat-cell">
            <span className="stat-cell__value">{stats.learned}</span>
            <span className="stat-cell__label">已开始</span>
          </div>
          <div className="stat-cell">
            <span className="stat-cell__value">{stats.total}</span>
            <span className="stat-cell__label">总术语</span>
          </div>
          <div className="stat-cell">
            <span className="stat-cell__value">{todayReviewCount + todayNewCount}</span>
            <span className="stat-cell__label">今日</span>
          </div>
        </div>
      </section>

      <section className="grouped-section">
        <h3 className="section-header">总体进度</h3>
        <div className="inset-group">
          <div className="inset-group__cell inset-group__cell--padded">
            <ProgressBar
              value={stats.mastered}
              max={stats.total}
              label="掌握进度"
              sublabel={`${stats.mastered} / ${stats.total}`}
            />
            <div className="status-list">
              {(Object.keys(STATUS_LABELS) as MasteryStatus[]).map((status) => (
                <div key={status} className="status-list__item">
                  <span className="status-list__dot" style={{ background: STATUS_COLORS[status] }} />
                  <span>{STATUS_LABELS[status]}</span>
                  <span className="status-list__count">{stats.counts[status]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grouped-section">
        <h3 className="section-header">8 周进度</h3>
        <div className="inset-group">
          <div className="inset-group__cell inset-group__cell--padded">
            <div className="week-progress-list">
              {weekStats.map((w) => (
                <ProgressBar
                  key={w.week}
                  value={w.mastered}
                  max={w.total}
                  label={w.week}
                  sublabel={`${w.mastered}/${w.total}`}
                  color={w.percent === 100 ? 'var(--system-green)' : 'var(--tint)'}
                  size="sm"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
