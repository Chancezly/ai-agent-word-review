import type { Term } from '../types'

interface LearnListProps {
  terms: Term[]
  onStartReview: () => void
  onBack: () => void
}

export function LearnList({ terms, onStartReview, onBack }: LearnListProps) {
  return (
    <div className="learn-list">
      <p className="learn-list__intro">
        浏览今日新词的中英对照，熟悉后再进入复习自评。
      </p>

      <section className="grouped-section">
        <h3 className="section-header">今日新词 · {terms.length} 个</h3>
        <div className="inset-group learn-list__group">
          {terms.map((term, i) => (
            <article
              key={term.id}
              className={`learn-item ${i < terms.length - 1 ? 'learn-item--border' : ''}`}
            >
              <div className="learn-item__header">
                <span className="pill">{term.category}</span>
                <span className="pill pill--muted">{term.week}</span>
              </div>
              <div className="learn-item__bilingual">
                <h3 className="learn-item__english">{term.english}</h3>
                <p className="learn-item__chinese">{term.chinese}</p>
              </div>
              <p className="learn-item__explanation">{term.explanation}</p>
              <p className="learn-item__standard">
                <span>掌握标准</span> {term.masteryStandard}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="learn-list__actions">
        <button type="button" className="btn btn--filled btn--block" onClick={onStartReview}>
          开始复习自评
        </button>
        <button type="button" className="btn btn--plain btn--block" onClick={onBack}>
          返回
        </button>
      </div>
    </div>
  )
}
