import { useCallback, useEffect, useMemo, useState } from 'react'
import content from '../data/content.json'
import type { AppState, MasteryStatus, Term, TermProgress, WeekPlan } from '../types'
import {
  addDays,
  createDefaultProgress,
  getDefaultState,
  getNextReviewDate,
  getWeekLabel,
  getWeekNumber,
  loadState,
  saveState,
  statusFromRating,
  todayISO,
} from '../utils'

export const ALL_TERMS = content.terms as Term[]
export const WEEK_PLAN = content.plan as WeekPlan[]

export function useAppState() {
  const [state, setState] = useState<AppState>(() => loadState())
  const today = todayISO()

  useEffect(() => {
    saveState(state)
  }, [state])

  const getProgress = useCallback(
    (id: number): TermProgress => state.termProgress[id] ?? createDefaultProgress(),
    [state.termProgress],
  )

  const currentWeekNum = getWeekNumber(state.startDate, today)
  const currentWeekLabel = getWeekLabel(currentWeekNum)

  const todayNewTerms = useMemo(() => {
    return ALL_TERMS.filter((term) => {
      const weekNum = parseInt(term.week.replace('第', '').replace('周', ''), 10)
      if (weekNum !== currentWeekNum) return false
      const progress = getProgress(term.id)
      return progress.status === 'not_started'
    })
  }, [currentWeekNum, getProgress])

  const todayReviewTerms = useMemo(() => {
    return ALL_TERMS.filter((term) => {
      const progress = getProgress(term.id)
      if (progress.status === 'not_started') return false
      if (progress.status === 'mastered' && !progress.nextReviewAt) return false
      if (!progress.nextReviewAt) return progress.status === 'learning'
      return progress.nextReviewAt <= today
    })
  }, [getProgress, today])

  const stats = useMemo(() => {
    const counts: Record<MasteryStatus, number> = {
      not_started: 0,
      learning: 0,
      familiar: 0,
      mastered: 0,
    }
    ALL_TERMS.forEach((term) => {
      const status = getProgress(term.id).status
      counts[status]++
    })
    const total = ALL_TERMS.length
    const learned = total - counts.not_started
    const mastered = counts.mastered
    return { counts, total, learned, mastered, percent: Math.round((mastered / total) * 100) }
  }, [getProgress])

  const weekStats = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const label = getWeekLabel(i + 1)
      const weekTerms = ALL_TERMS.filter((t) => t.week === label)
      const mastered = weekTerms.filter((t) => getProgress(t.id).status === 'mastered').length
      return {
        week: label,
        total: weekTerms.length,
        mastered,
        percent: weekTerms.length ? Math.round((mastered / weekTerms.length) * 100) : 0,
      }
    })
  }, [getProgress])

  const recordReview = useCallback(
    (termId: number, rating: 'unknown' | 'known' | 'mastered') => {
      setState((prev: AppState) => {
        const existing = prev.termProgress[termId] ?? createDefaultProgress()
        const isFirstLearn = existing.status === 'not_started'
        const learnedAt = existing.learnedAt ?? today
        const newReviewCount = isFirstLearn ? 0 : existing.reviewCount + 1
        const nextReviewAt = rating === 'mastered' && newReviewCount >= 4
          ? null
          : getNextReviewDate(learnedAt, isFirstLearn ? 0 : newReviewCount)

        const updated: TermProgress = {
          ...existing,
          status: statusFromRating(rating, existing.status),
          reviewCount: isFirstLearn ? 0 : existing.reviewCount + 1,
          learnedAt,
          lastReviewAt: today,
          nextReviewAt: rating === 'unknown' ? today : nextReviewAt ?? addDays(today, 1),
        }

        const checkIn = prev.checkIns[today] ?? {
          date: today,
          reviewedCount: 0,
          newLearnedCount: 0,
          durationMinutes: 0,
        }

        return {
          ...prev,
          termProgress: { ...prev.termProgress, [termId]: updated },
          checkIns: {
            ...prev.checkIns,
            [today]: {
              ...checkIn,
              reviewedCount: checkIn.reviewedCount + 1,
              newLearnedCount: checkIn.newLearnedCount + (isFirstLearn ? 1 : 0),
            },
          },
        }
      })
    },
    [today],
  )

  const resetProgress = useCallback(() => {
    if (confirm('确定要清空所有学习进度吗？此操作不可恢复。')) {
      setState(getDefaultState(state.startDate))
    }
  }, [state.startDate])

  return {
    state,
    today,
    currentWeekNum,
    currentWeekLabel,
    todayNewTerms,
    todayReviewTerms,
    stats,
    weekStats,
    getProgress,
    recordReview,
    resetProgress,
  }
}
