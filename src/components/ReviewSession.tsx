import { useState } from 'react'
import type { Term, WeekSegment } from '../types'
import { SEGMENT_SAMPLE_SIZE } from '../utils'
import { IconChevron } from './Icons'
import { Flashcard } from './Flashcard'
import { LearnList } from './LearnList'

interface ReviewSessionProps {
  newTerms: Term[]
  reviewTerms: Term[]
  advanceSegments: WeekSegment[]
  sampleSegmentReview: (weekLabel: string, size?: number) => Term[]
  onRate: (termId: number, rating: 'unknown' | 'known' | 'mastered') => void
}

type Phase = 'menu' | 'learn' | 'quiz'

interface LearnContext {
  terms: Term[]
  title: string
  intro: string
  reviewLabel: string
  onReview: () => void
}

export function ReviewSession({
  newTerms,
  reviewTerms,
  advanceSegments,
  sampleSegmentReview,
  onRate,
}: ReviewSessionProps) {
  const [phase, setPhase] = useState<Phase>('menu')
  const [queue, setQueue] = useState<Term[]>([])
  const [index, setIndex] = useState(0)
  const [learnContext, setLearnContext] = useState<LearnContext | null>(null)
  const [quizTitle, setQuizTitle] = useState('')

  const quizQueue = [...newTerms, ...reviewTerms]

  const startQuiz = (terms: Term[], title = '') => {
    setQueue(terms)
    setIndex(0)
    setQuizTitle(title)
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
      setQuizTitle('')
      setLearnContext(null)
    }
  }

  const startAdvanceLearn = (segment: WeekSegment) => {
    setLearnContext({
      terms: segment.unstarted,
      title: `${segment.week} · ${segment.theme}`,
      intro: `提前学习 ${segment.week} 的内容。浏览中英对照后，可自评或随机抽测已学段落。`,
      reviewLabel: '自评本段新词',
      onReview: () => startQuiz(segment.unstarted, `${segment.week} 新词自评`),
    })
    setPhase('learn')
  }

  const startSegmentSample = (segment: WeekSegment) => {
    const sampleCount = Math.min(SEGMENT_SAMPLE_SIZE, segment.reviewPool.length)
    const sampled = sampleSegmentReview(segment.week, sampleCount)
    startQuiz(sampled, `${segment.week} 随机抽测`)
  }

  if (phase === 'learn' && learnContext) {
    return (
      <LearnList
        terms={learnContext.terms}
        title={learnContext.title}
        intro={learnContext.intro}
        reviewLabel={learnContext.reviewLabel}
        onStartReview={learnContext.onReview}
        onBack={() => {
          setLearnContext(null)
          setPhase('menu')
        }}
      />
    )
  }

  if (phase === 'quiz') {
    const current = queue[index]
    if (!current) {
      return (
        <div className="review-done">
          <div className="review-done__icon">✓</div>
          <h2>{quizTitle ? `${quizTitle}完成` : '本次复习完成'}</h2>
          <p>进度已保存，系统会根据你的评分安排下次复习。</p>
          <button type="button" className="btn btn--filled" onClick={() => setPhase('menu')}>
            完成
          </button>
        </div>
      )
    }

    return (
      <>
        {quizTitle && <p className="quiz-banner">{quizTitle}</p>}
        <Flashcard
          term={current}
          index={index}
          total={queue.length}
          onRate={handleRate}
        />
      </>
    )
  }

  const menuOptions = [
    {
      key: 'learn',
      title: '今日学习',
      count: newTerms.length,
      desc: '中英对照浏览本周新词',
      disabled: newTerms.length === 0,
      action: () => {
        setLearnContext({
          terms: newTerms,
          title: '今日新词',
          intro: '浏览本周新词的中英对照，熟悉后再进入复习自评。',
          reviewLabel: '开始复习自评',
          onReview: () => startQuiz(quizQueue),
        })
        setPhase('learn')
      },
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
        建议先浏览「今日学习」熟悉新词，再进入复习自评。学得快可提前学习后续周次，并用随机抽测巩固。
      </p>

      <section className="grouped-section">
        <h3 className="section-header">本周流程</h3>
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

      {advanceSegments.length > 0 && (
        <section className="grouped-section">
          <h3 className="section-header">提前学习</h3>
          <div className="inset-group">
            {advanceSegments.map((segment, i) => {
              const sampleCount = Math.min(SEGMENT_SAMPLE_SIZE, segment.reviewPool.length)
              return (
                <div
                  key={segment.week}
                  className={`advance-segment ${i < advanceSegments.length - 1 ? 'advance-segment--border' : ''}`}
                >
                  <div className="advance-segment__info">
                    <span className="advance-segment__week">{segment.week}</span>
                    <span className="advance-segment__theme">{segment.theme}</span>
                    <span className="advance-segment__meta">
                      {segment.unstarted.length > 0 && `未学 ${segment.unstarted.length}`}
                      {segment.unstarted.length > 0 && segment.reviewPool.length > 0 && ' · '}
                      {segment.reviewPool.length > 0 && `已学 ${segment.reviewPool.length}`}
                    </span>
                  </div>
                  <div className="advance-segment__actions">
                    {segment.unstarted.length > 0 && (
                      <button
                        type="button"
                        className="btn btn--tinted btn--compact"
                        onClick={() => startAdvanceLearn(segment)}
                      >
                        学习
                      </button>
                    )}
                    {segment.reviewPool.length > 0 && (
                      <button
                        type="button"
                        className="btn btn--filled btn--compact btn--green"
                        onClick={() => startSegmentSample(segment)}
                      >
                        随机抽测 {sampleCount} 个
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {quizQueue.length === 0 && advanceSegments.length === 0 && (
        <p className="empty-state">今日任务已完成，明天再来。</p>
      )}
    </div>
  )
}
