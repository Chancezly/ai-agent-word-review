import { REVIEW_INTERVALS, type AppState, type MasteryStatus, type TermProgress } from './types'

export function todayISO(): string {
  return formatDate(new Date())
}

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(iso: string, days: number): string {
  const date = parseDate(iso)
  date.setDate(date.getDate() + days)
  return formatDate(date)
}

export function daysBetween(from: string, to: string): number {
  const a = parseDate(from)
  const b = parseDate(to)
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

export function getWeekNumber(startDate: string, date: string): number {
  const diff = daysBetween(startDate, date)
  return Math.max(1, Math.min(8, Math.floor(diff / 7) + 1))
}

export function getWeekLabel(weekNum: number): string {
  return `第${weekNum}周`
}

export function parseWeekLabel(week: string): number {
  return parseInt(week.replace('第', '').replace('周', ''), 10)
}

export function shuffleSample<T>(items: T[], count: number): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, Math.min(count, copy.length))
}

export const SEGMENT_SAMPLE_SIZE = 10

export function createDefaultProgress(): TermProgress {
  return {
    status: 'not_started',
    reviewCount: 0,
    learnedAt: null,
    lastReviewAt: null,
    nextReviewAt: null,
    note: '',
  }
}

export function getNextReviewDate(learnedAt: string, reviewCount: number): string | null {
  if (reviewCount >= REVIEW_INTERVALS.length) return null
  return addDays(learnedAt, REVIEW_INTERVALS[reviewCount])
}

export function isDueForReview(progress: TermProgress, today: string): boolean {
  if (progress.status === 'not_started') return false
  if (progress.status === 'mastered' && !progress.nextReviewAt) return false
  if (!progress.nextReviewAt) return progress.status === 'learning'
  return progress.nextReviewAt <= today
}

export function getDefaultState(startDate: string): AppState {
  return {
    startDate,
    termProgress: {},
    checkIns: {},
  }
}

export function loadState(): AppState {
  const raw = localStorage.getItem('ai-agent-word-review')
  if (!raw) return getDefaultState(todayISO())
  try {
    return JSON.parse(raw) as AppState
  } catch {
    return getDefaultState(todayISO())
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem('ai-agent-word-review', JSON.stringify(state))
}

export function statusFromRating(rating: 'unknown' | 'known' | 'mastered', current: MasteryStatus): MasteryStatus {
  if (rating === 'unknown') return 'learning'
  if (rating === 'known') return current === 'mastered' ? 'mastered' : 'familiar'
  return 'mastered'
}

export function getCalendarDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startPad = first.getDay()
  const days: (Date | null)[] = Array(startPad).fill(null)
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d))
  }
  while (days.length % 7 !== 0) days.push(null)
  return days
}

export function getMonthLabel(year: number, month: number): string {
  return `${year}年${month + 1}月`
}

export const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六']
