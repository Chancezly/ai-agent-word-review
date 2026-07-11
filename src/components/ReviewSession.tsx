import { useState } from 'react'
import type { Term } from '../types'
import { IconChevron } from './Icons'
import { Flashcard } from './Flashcard'
import { LearnList } from './LearnList'

interface ReviewSessionProps {
  newTerms: Term[]
  reviewTerms: Term[]
  onRate: (termId: number, rating: 'unknown' | 'known' | 'mastered') => void
}

type Phase = 'menu' | 'learn' | 'quiz'

export function ReviewSession({ newTerms, reviewTerms, onRate }: ReviewSessionProps) {
  const [phase, setPhase] = useState<Phase>('menu')
  const [queue, setQueue] = useState<Term[]>([])
  const [index, setIndex] = useState(0)

  const quizQueue = [...newTerms, ...reviewTerms]

  const startQuiz = (terms: Term[]) => {
    setQueue(terms)
    setIndex(0)
    setPhase('quiz')
  }

  const handleRate = (rating: 'unknown' | 'known' | 'mastered') => {
    const current = queue[index]
    if (!current) return
    onRate(current.id, rating)
    if (index + 1 < queue.length) {
      setIndex((i) => i + 1)
    } else {
      setPhase('menu')
      setQueue([])
      setIndex(0)
    }
  }

  if (phase === 'learn') {
    return (
      <LearnList
        terms={newTerms}
        onStartReview={() => startQuiz(quizQueue)}
        onBack={() => setPhase('menu')}
      />
    )
  }

  if (phase === 'quiz') {
    const current = queue[index]
    if (!current) {
      return (
        <div className="review-done">
          <div className="review-done__icon">✓</div>
          <h2>本次复习完成</h2>
          <p>进度已保存，系统会根据你的评分安排下次复习。</p>
          <button type="button" className="btn btn--filled" onClick={() => setPhase('menu')}>
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

  const menuOptions = [
    {
      key: 'learn',
      title: '今日学习',
      count: newTerms.length,
      desc: '中英对照浏览本周新词',
      disabled: newTerms.length === 0,
      action: () => setPhase('learn'),
    },
    {
      key: 'quiz-all',
      title: '开始复习',
      count: quizQueue.length,
      desc: newTerms.length > 0 ? '先测新词，再测到期复习' : '测验到期复习词',
      disabled: quizQueue.length === 0,
      action: () => startQuiz(quizQueue),
    },
    {
      key: 'quiz-review',
      title: '仅复习到期',
      count: reviewTerms.length,
      desc: '跳过新词，只测间隔复习',
      disabled: reviewTerms.length === 0,
      action: () => startQuiz(reviewTerms),
    },
  ]

  return (
    <div className="review-start">
      <p className="review-start__desc">
        建议先浏览「今日学习」熟悉新词，再进入复习自评。翻转卡片后可对照中英双语。
      </p>

      <section className="grouped-section">
        <h3 className="section-header">学习流程</h3>
        <div className="inset-group">
          {menuOptions.map((opt, i) => (
            <button
              key={opt.key}
              type="button"
              className={`list-cell ${i < menuOptions.length - 1 ? 'list-cell--border' : ''}`}
              disabled={opt.disabled}
              onClick={opt.action}
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

      {quizQueue.length === 0 && (
        <p className="empty-state">今日任务已完成，明天再来。</p>
      )}
    </div>
  )
}
