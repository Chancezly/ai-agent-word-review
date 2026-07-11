import { useState } from 'react'
import type { Term } from '../types'

interface FlashcardProps {
  term: Term
  onRate: (rating: 'unknown' | 'known' | 'mastered') => void
  index: number
  total: number
}

export function Flashcard({ term, onRate, index, total }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false)

  const handleFlip = () => setFlipped((f) => !f)

  const handleRate = (rating: 'unknown' | 'known' | 'mastered') => {
    onRate(rating)
    setFlipped(false)
  }

  return (
    <div className="flashcard-section">
      <div className="flashcard-meta">
        <span className="pill">{term.category}</span>
        <span className="pill pill--muted">{term.week}</span>
        <span className="flashcard-counter">
          {index + 1} / {total}
        </span>
      </div>

      <button
        type="button"
        className={`flashcard ${flipped ? 'flashcard--flipped' : ''}`}
        onClick={handleFlip}
        aria-label={flipped ? '点击返回正面' : '点击翻转查看释义'}
      >
        <div className="flashcard__inner">
          <div className="flashcard__face flashcard__front">
            <p className="flashcard__hint">轻点翻转</p>
            <h2 className="flashcard__english">{term.english}</h2>
            <p className="flashcard__front-tip">回忆中文含义</p>
          </div>
          <div className="flashcard__face flashcard__back">
            <div className="flashcard__bilingual">
              <h2 className="flashcard__english flashcard__english--back">{term.english}</h2>
              <p className="flashcard__chinese">{term.chinese}</p>
            </div>
            <p className="flashcard__explanation">{term.explanation}</p>
            <div className="flashcard__standard">
              <strong>掌握标准</strong>
              <p>{term.masteryStandard}</p>
            </div>
          </div>
        </div>
      </button>

      {flipped ? (
        <div className="flashcard-actions">
          <p className="flashcard-quiz-prompt">你掌握这个词了吗？</p>
          <button type="button" className="btn btn--tinted btn--red" onClick={() => handleRate('unknown')}>
            不认识
          </button>
          <button type="button" className="btn btn--tinted btn--orange" onClick={() => handleRate('known')}>
            认识
          </button>
          <button type="button" className="btn btn--filled btn--green" onClick={() => handleRate('mastered')}>
            已掌握
          </button>
        </div>
      ) : (
        <p className="flashcard-tip">先看英文，回忆中文后再翻转对照</p>
      )}
    </div>
  )
}
