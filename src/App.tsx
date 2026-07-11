import { useState } from 'react'
import { Calendar } from './components/Calendar'
import { Dashboard } from './components/Dashboard'
import { IconCalendar, IconCards, IconHome, IconPlan } from './components/Icons'
import { PlanView } from './components/PlanView'
import { ReviewSession } from './components/ReviewSession'
import { useAppState } from './hooks/useAppState'
import './App.css'

type Tab = 'home' | 'review' | 'calendar' | 'plan'

const TABS: { id: Tab; label: string; title: string; Icon: typeof IconHome }[] = [
  { id: 'home', label: '概览', title: '概览', Icon: IconHome },
  { id: 'review', label: '复习', title: '复习', Icon: IconCards },
  { id: 'calendar', label: '日历', title: '日历', Icon: IconCalendar },
  { id: 'plan', label: '规划', title: '8 周规划', Icon: IconPlan },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const {
    state,
    today,
    currentWeekLabel,
    todayNewTerms,
    todayReviewTerms,
    advanceSegments,
    sampleSegmentReview,
    stats,
    weekStats,
    recordReview,
    resetProgress,
  } = useAppState()

  const currentTab = TABS.find((t) => t.id === tab)!

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__top">
          <p className="app-header__subtitle">AI Agent · {currentWeekLabel}</p>
          {tab === 'home' && (
            <button type="button" className="btn-text" onClick={resetProgress}>
              重置
            </button>
          )}
        </div>
        <h1 className="large-title">{currentTab.title}</h1>
      </header>

      <main className="app-main">
        {tab === 'home' && (
          <Dashboard
            stats={stats}
            weekStats={weekStats}
            currentWeekLabel={currentWeekLabel}
            todayNewCount={todayNewTerms.length}
            todayReviewCount={todayReviewTerms.length}
            startDate={state.startDate}
          />
        )}
        {tab === 'review' && (
          <ReviewSession
            newTerms={todayNewTerms}
            reviewTerms={todayReviewTerms}
            advanceSegments={advanceSegments}
            sampleSegmentReview={sampleSegmentReview}
            onRate={recordReview}
          />
        )}
        {tab === 'calendar' && <Calendar state={state} today={today} />}
        {tab === 'plan' && <PlanView currentWeekLabel={currentWeekLabel} />}
      </main>

      <nav className="app-nav" aria-label="主导航">
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id
          return (
            <button
              key={id}
              type="button"
              className={`app-nav__item ${active ? 'app-nav__item--active' : ''}`}
              onClick={() => setTab(id)}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="app-nav__icon" filled={active} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
