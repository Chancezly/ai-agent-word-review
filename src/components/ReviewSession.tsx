import { useState } from 'react'
import type { Term } from '../types'
import { IconChevron } from './Icons'
import { Flashcard } from './Flashcard'

interface ReviewSessionProps {
  newTerms: Term[]
  reviewTerms: Term[]
  onRate: (termId: number, rating: 'unknown' | 'known' | 'mastered') => void
}

type SessionMode = 'mixed' | 'new' | 'review'

export function ReviewSession({ newTerms, reviewTerms, onRate }: ReviewSessionProps) {
  const [queue, setQueue] = useState<Term[]>([])
  const [index, setIndex] = useState(0)
  const [started, setStarted] = useState(false)

  const startSession = (selectedMode: SessionMode) => {
    const terms =
      selectedMode === 'new'
        ? newTerms
        : selectedMode === 'review'
          ? reviewTerms
          : [...reviewTerms, ...newTerms]
    setQueue(terms)
    setIndex(0)
    setStarted(true)
  }

  const handleRate = (rating: 'unknown' | 'known' | 'mastered') => {
    const current = queue[index]
    if (!current) return
    onRate(current.id, rating)
    if (index + 1 < queue.length) {
      setIndex((i) => i + 1)
    } else {
      setStarted(false)
      setQueue([])
      setIndex(0)
    }
  }

  if (!started) {
    const options = [
      {
        mode: 'mixed' as const,
        title: '今日全部',
        count: reviewTerms.length + newTerms.length,
        desc: '复习优先，再学新词',
        disabled: reviewTerms.length + newTerms.length === 0,
      },
      {
        mode: 'review' as const,
        title: '待复习',
        count: reviewTerms.length,
        desc: '间隔复习到期词',
        disabled: reviewTerms.length === 0,
      },
      {
        mode: 'new' as const,
        title: '本周新词',
        count: newTerms.length,
        desc: newTerms[0]?.week ? `${newTerms[0].week} 未开始` : '当前周未开始',
        disabled: newTerms.length === 0,
      },
    ]

    return (
      <div className="review-start">
        <p className="review-start__desc">
          闪卡模式：先看英文，回忆后再翻转。系统会自动安排第 2 / 4 / 7 / 14 天的复习。
        </p>

        <section className="grouped-section">
          <h3 className="section-header">选择范围</h3>
          <div className="inset-group">
            {options.map((opt, i) => (
              <button
                key={opt.mode}
                type="button"
                className={`list-cell ${i < options.length - 1 ? 'list-cell--border' : ''}`}
                disabled={opt.disabled}
                onClick={() => startSession(opt.mode)}
              >
                <div className="list-cell__body">
                  <span className="list-cell__title">{opt.title}</span>
                  <span className="list-cell__subtitle">{opt.desc}</span>
                </div>
                <span className="list-cell__value">{opt.count}</span>
                <IconChevron className="list-cell__chevron" />
              </button>
            ))}
          </div>
        </section>

        {reviewTerms.length + newTerms.length === 0 && (
          <p className="empty-state">今日任务已完成，明天再来。</p>
        )}
      </div>
    )
  }

  const current = queue[index]
  if (!current) {
    return (
      <div className="review-done">
        <div className="review-done__icon">✓</div>
        <h2>本次复习完成</h2>
        <p>进度已保存，系统会根据你的评分安排下次复习。</p>
        <button type="button" className="btn btn--filled" onClick={() => setStarted(false)}>
          完成
        </button>
      </div>
    )
  }

  return (
    <Flashcard
      term={current}
      index={index}
      total={queue.length}
      onRate={handleRate}
    />
  )
}
