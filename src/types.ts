export type MasteryStatus = 'not_started' | 'learning' | 'familiar' | 'mastered'

export interface WeekSegment {
  week: string
  weekNum: number
  theme: string
  unstarted: Term[]
  reviewPool: Term[]
}

export interface Term {
  id: number
  category: string
  week: string
  english: string
  chinese: string
  explanation: string
  masteryStandard: string
}

export interface WeekPlan {
  week: string
  theme: string
  coreTerms: string
  project: string
  completionStandard: string
}

export interface TermProgress {
  status: MasteryStatus
  reviewCount: number
  learnedAt: string | null
  lastReviewAt: string | null
  nextReviewAt: string | null
  note: string
}

export interface DailyCheckIn {
  date: string
  reviewedCount: number
  newLearnedCount: number
  durationMinutes: number
}

export interface AppState {
  startDate: string
  termProgress: Record<number, TermProgress>
  checkIns: Record<string, DailyCheckIn>
}

export const REVIEW_INTERVALS = [2, 4, 7, 14] as const

export const STATUS_LABELS: Record<MasteryStatus, string> = {
  not_started: '未开始',
  learning: '学习中',
  familiar: '熟悉',
  mastered: '已掌握',
}

export const STATUS_COLORS: Record<MasteryStatus, string> = {
  not_started: '#8E8E93',
  learning: '#FF9500',
  familiar: '#007AFF',
  mastered: '#34C759',
}
