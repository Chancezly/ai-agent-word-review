import { useMemo, useState } from 'react'
import type { AppState } from '../types'
import {
  formatDate,
  getCalendarDays,
  getMonthLabel,
  getWeekNumber,
  WEEKDAY_LABELS,
} from '../utils'
import { ALL_TERMS } from '../hooks/useAppState'

interface CalendarProps {
  state: AppState
  today: string
}

export function Calendar({ state, today }: CalendarProps) {
  const todayDate = new Date()
  const [viewYear, setViewYear] = useState(todayDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(todayDate.getMonth())

  const days = getCalendarDays(viewYear, viewMonth)

  const dayMeta = useMemo(() => {
    const meta: Record<string, { checkIn: boolean; dueCount: number; weekNum: number }> = {}

    Object.keys(state.checkIns).forEach((date) => {
      meta[date] = {
        checkIn: true,
        dueCount: 0,
        weekNum: getWeekNumber(state.startDate, date),
      }
    })

    ALL_TERMS.forEach((term) => {
      const progress = state.termProgress[term.id]
      if (!progress?.nextReviewAt) return
      if (progress.nextReviewAt <= today || progress.nextReviewAt.startsWith(String(viewYear))) {
        const d = progress.nextReviewAt
        if (!meta[d]) {
          meta[d] = { checkIn: false, dueCount: 0, weekNum: getWeekNumber(state.startDate, d) }
        }
        if (d <= today) meta[d].dueCount++
      }
    })

    return meta
  }, [state, today, viewYear])

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const startDate = state.startDate
  const currentWeekStart = getWeekNumber(startDate, today)

  return (
    <div className="calendar-view">
      <section className="grouped-section">
        <div className="inset-group calendar">
          <div className="calendar__header">
            <button type="button" className="btn-icon" onClick={prevMonth} aria-label="上个月">
              ‹
            </button>
            <h3>{getMonthLabel(viewYear, viewMonth)}</h3>
            <button type="button" className="btn-icon" onClick={nextMonth} aria-label="下个月">
              ›
            </button>
          </div>

          <div className="calendar__legend">
            <span><i className="dot dot--done" /> 已打卡</span>
            <span><i className="dot dot--today" /> 今天</span>
            <span><i className="dot dot--week" /> 学习周</span>
          </div>

          <div className="calendar__weekdays">
            {WEEKDAY_LABELS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="calendar__grid">
            {days.map((date, i) => {
              if (!date) return <div key={`empty-${i}`} className="calendar__day calendar__day--empty" />

              const iso = formatDate(date)
              const isToday = iso === today
              const isStart = iso === startDate
              const meta = dayMeta[iso]
              const weekNum = getWeekNumber(startDate, iso)
              const isCurrentWeek = weekNum === currentWeekStart

              return (
                <div
                  key={iso}
                  className={[
                    'calendar__day',
                    isToday ? 'calendar__day--today' : '',
                    meta?.checkIn ? 'calendar__day--done' : '',
                    isCurrentWeek ? 'calendar__day--active-week' : '',
                    isStart ? 'calendar__day--start' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="calendar__date">{date.getDate()}</span>
                  {isStart && <span className="calendar__badge">起</span>}
                  {meta?.checkIn && <span className="calendar__check" />}
                  {isCurrentWeek && !isToday && <span className="calendar__week-tag">{weekNum}</span>}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <p className="calendar__hint">
        起点 {startDate} · 第 {currentWeekStart} 周 · 复习间隔 2 / 4 / 7 / 14 天
      </p>
    </div>
  )
}
