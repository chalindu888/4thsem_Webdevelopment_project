import { useState } from 'react'
import { Link } from 'react-router-dom'
import modules from '../data/modules'
import Navbar from '../components/Navbar'
import { getCompletedModules } from '../services/progress'
import { createTilt } from '../utils/tilt'
import './awareness.css'

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']

const LEVEL_TONE = {
  Beginner: 'emerald',
  Intermediate: 'amber',
  Advanced: 'rose',
}

// Line icon per module, keyed by module id.
const MODULE_ICONS = {
  'phishing-awareness': 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
  'password-security': 'M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4',
  'device-security': 'M4 5h16a1 1 0 0 1 1 1v10H3V6a1 1 0 0 1 1-1zM1 19h22M9 9.5l2 2 4-4',
  'social-engineering': 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  'network-security': 'M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01',
  'ai-deepfake-threats': 'M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM9 9h6v6H9z',
}

const TILT_DEGREES = 7
const cardTilt = createTilt(TILT_DEGREES)

function Awareness() {
  const [level, setLevel] = useState('All')
  const [completedIds] = useState(getCompletedModules)

  const visible = level === 'All' ? modules : modules.filter((module) => module.level === level)
  const completedCount = modules.filter((module) => completedIds.includes(module.id)).length
  const progress = Math.round((completedCount / modules.length) * 100)
  const nextModule = modules.find((module) => !completedIds.includes(module.id))

  return (
    <div className="aw">
      <Navbar />

      <main className="aw-container">
        <div className="aw-glow" aria-hidden="true" />

        {/* ================= HEADER ================= */}
        <header className="aw-header">
          <div className="aw-header-text">
            <p className="aw-eyebrow">Security awareness</p>
            <h1>Learning modules</h1>
            <p className="aw-lead">
              Short, practical lessons that build safer digital habits, from spotting phishing to
              recognising AI-driven scams.
            </p>
          </div>

          <div className="aw-progress-card">
            <div className="aw-progress-top">
              <span>Your progress</span>
              <strong>
                {completedCount}
                <span>/{modules.length} completed</span>
              </strong>
            </div>

            <div
              className="aw-progress-bar"
              role="progressbar"
              aria-label="Modules completed"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <span style={{ width: `${progress}%` }} />
            </div>

            {nextModule ? (
              <Link to={`/awareness/${nextModule.id}`} className="aw-continue">
                {completedCount ? 'Continue with' : 'Start with'} <strong>{nextModule.title}</strong>
                <ArrowIcon />
              </Link>
            ) : (
              <p className="aw-continue is-done">All modules complete — great work.</p>
            )}
          </div>
        </header>

        {/* ================= FILTERS ================= */}
        <div className="aw-toolbar">
          <div className="aw-filters" role="group" aria-label="Filter by difficulty">
            {LEVELS.map((option) => {
              const count = option === 'All' ? modules.length : modules.filter((module) => module.level === option).length
              return (
                <button
                  key={option}
                  type="button"
                  className={level === option ? 'aw-filter is-active' : 'aw-filter'}
                  aria-pressed={level === option}
                  onClick={() => setLevel(option)}
                >
                  {option}
                  <span>{count}</span>
                </button>
              )
            })}
          </div>

          <p className="aw-count" aria-live="polite">
            Showing {visible.length} {visible.length === 1 ? 'module' : 'modules'}
          </p>
        </div>

        {/* ================= MODULE GRID ================= */}
        {/* key replays the staggered entrance whenever the filter changes */}
        <ul className="aw-grid" key={level}>
          {visible.map((module, index) => {
            const completed = completedIds.includes(module.id)
            const tone = LEVEL_TONE[module.level]

            return (
              <li
                key={module.id}
                className={`aw-card tone-${tone}${completed ? ' is-completed' : ''}`}
                style={{ '--i': index }}
                {...cardTilt}
              >
                <div className="aw-card-top">
                  <span className="aw-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d={MODULE_ICONS[module.id]} />
                    </svg>
                  </span>

                  {completed ? (
                    <span className="aw-done">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                      Completed
                    </span>
                  ) : (
                    <span className="aw-number">{String(modules.indexOf(module) + 1).padStart(2, '0')}</span>
                  )}
                </div>

                <h2>{module.title}</h2>
                <p className="aw-summary">{module.summary}</p>

                <div className="aw-meta">
                  <span className={`aw-level tone-${tone}`}>{module.level}</span>
                  <span className="aw-meta-item">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2" /></svg>
                    {module.duration}
                  </span>
                  <span className="aw-meta-item">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z" /></svg>
                    {module.lessons.length} lessons
                  </span>
                </div>

                {/* The link's ::after covers the card, so the whole card is clickable */}
                <Link to={`/awareness/${module.id}`} className="aw-cta" aria-label={`${completed ? 'Review' : 'Start'} ${module.title}`}>
                  {completed ? 'Review module' : 'Start module'}
                  <ArrowIcon />
                </Link>
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg className="aw-arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export default Awareness
