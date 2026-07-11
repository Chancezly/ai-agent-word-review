import { WEEK_PLAN } from '../hooks/useAppState'
import type { WeekPlan } from '../types'

interface PlanViewProps {
  currentWeekLabel: string
}

export function PlanView({ currentWeekLabel }: PlanViewProps) {
  return (
    <div className="plan-view">
      <p className="plan-view__intro">当前处于 {currentWeekLabel}</p>

      {WEEK_PLAN.map((item: WeekPlan) => {
        const isCurrent = item.week === currentWeekLabel
        return (
          <section key={item.week} className="grouped-section">
            <h3 className="section-header">
              {item.week}
              {isCurrent && <span className="section-header__badge">当前</span>}
            </h3>
            <article className={`inset-group plan-item ${isCurrent ? 'plan-item--current' : ''}`}>
              <div className="inset-group__cell inset-group__cell--padded">
                <h4 className="plan-item__theme">{item.theme}</h4>
                <dl className="plan-item__details">
                  <div>
                    <dt>核心术语</dt>
                    <dd>{item.coreTerms}</dd>
                  </div>
                  <div>
                    <dt>项目任务</dt>
                    <dd>{item.project}</dd>
                  </div>
                  <div>
                    <dt>完成标准</dt>
                    <dd>{item.completionStandard}</dd>
                  </div>
                </dl>
              </div>
            </article>
          </section>
        )
      })}
    </div>
  )
}
