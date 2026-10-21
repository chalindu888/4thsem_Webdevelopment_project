import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api, { clearSession, getErrorMessage } from '../api/client'
import modules from '../data/modules'
import { getCompletedModules } from '../services/progress'
import { statusOf, toneForScore } from '../services/assessmentStatus'
import { createTilt } from '../utils/tilt'
import './dashboard.css'

const CATEGORIES = [
  { field: 'passwordHabits', label: 'Password habits' },
  { field: 'phishingAwareness', label: 'Phishing awareness' },
  { field: 'twoFactorAuth', label: 'Two-factor authentication' },
]

// Advice for each weak answer, linked to the module that covers it.
const ADVICE = {
  twoFactorAuth: {
    none: ['high', 'Enable two-factor authentication', 'Start with email, banking and social accounts — they unlock everything else.'],
    some: ['medium', 'Extend 2FA to every important account', 'Accounts without 2FA are the easiest way in for attackers.'],
    module: 'password-security',
  },
  passwordHabits: {
    weak: ['high', 'Stop reusing passwords', 'One breached site exposes every account that shares its password.'],
    mixed: ['medium', 'Replace your reused passwords', 'A password manager makes unique passwords effortless.'],
    module: 'password-security',
  },
  phishingAwareness: {
    low: ['high', 'Complete phishing awareness training', 'Learn the warning signs attackers rely on you missing.'],
    medium: ['medium', 'Sharpen your phishing detection', 'Review the red flags in messages, links and sender addresses.'],
    module: 'phishing-awareness',
  },
}

const statTilt = createTilt(8)
const quickTilt = createTilt(6)

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }
const PRIORITY_TONE = { high: 'danger', medium: 'warning', low: 'neutral' }
const TONE_ACCENT = { success: 'emerald', warning: 'amber', danger: 'rose', neutral: 'slate' }

function readFirstName() {
  try {
    const user = JSON.parse(localStorage.getItem('user')) || {}
    return (user.name || 'there').split(' ')[0]
  } catch {
    return 'there'
  }
}

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function timeAgo(value) {
  const seconds = (new Date(value) - Date.now()) / 1000
  const units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]]
  const format = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit)
  }
  return 'just now'
}

function buildRecommendations(latest, completedIds) {
  if (!latest) {
    return [{
      priority: 'high',
      title: 'Take your first assessment',
      description: 'Answer three quick questions to get your security score and personalised advice.',
      to: '/assessment',
    }]
  }

  const recommendations = CATEGORIES
    .map(({ field }) => {
      const advice = ADVICE[field][latest[field]]
      if (!advice) return null
      const [priority, title, description] = advice
      return { priority, title, description, to: `/awareness/${ADVICE[field].module}` }
    })
    .filter(Boolean)
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])

  // Top up with modules the user hasn't finished yet.
  for (const module of modules) {
    if (recommendations.length >= 3) break
    if (completedIds.includes(module.id)) continue
    if (recommendations.some((item) => item.to === `/awareness/${module.id}`)) continue
    recommendations.push({
      priority: 'low',
      title: `Explore ${module.title}`,
      description: module.summary,
      to: `/awareness/${module.id}`,
    })
  }

  return recommendations
}

function Dashboard() {
  const navigate = useNavigate()
  const [firstName] = useState(readFirstName)
  const [completedIds] = useState(getCompletedModules)
  const [history, setHistory] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [quickVisible, setQuickVisible] = useState(false)
  const quickRef = useRef(null)

  // Reveal the quick actions when they scroll into view instead of animating off-screen.
  useEffect(() => {
    const section = quickRef.current
    if (!section || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setQuickVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.15 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    api.get('/assessment')
      .then(({ data }) => {
        setHistory(data.assessments)
        setStatus('ready')
      })
      .catch((requestError) => {
        if (requestError.response?.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setError(getErrorMessage(requestError))
        setStatus('error')
      })
  }, [navigate])

  const latest = history[0]
  const previous = history[1]
  const scoreChange = latest && previous ? latest.riskScore - previous.riskScore : null
  const completedCount = modules.filter((module) => completedIds.includes(module.id)).length
  const recommendations = buildRecommendations(latest, completedIds)
  const loading = status === 'loading'

  return (
    <div className="db">
      <Navbar />

      <main className="db-container">
        <div className="db-glow" aria-hidden="true" />

        {/* ================= HEADER ================= */}
        <header className="db-header">
          <div>
            <p className="db-eyebrow">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1>{greeting()}, <span className="db-name">{firstName}</span></h1>
            <p className="db-subtitle">
              {latest
                ? `Your last security assessment was ${timeAgo(latest.createdAt)}.`
                : 'Here’s an overview of your cybersecurity posture and learning progress.'}
            </p>
          </div>

          <div className="db-header-actions">
            {latest && (
              <Link to="/results" className="db-btn db-btn-secondary">View report</Link>
            )}
            <Link to="/assessment" className="db-btn db-btn-primary">
              <Icon name="plus" />
              New assessment
            </Link>
          </div>
        </header>

        {status === 'error' && (
          <div className="db-alert" role="alert">
            <Icon name="alert" />
            <span>{error}</span>
          </div>
        )}

        {/* ================= STAT CARDS ================= */}
        <section className="db-stats" aria-label="Key metrics">
          <StatCard
            label="Security score"
            icon="shield"
            accent="teal"
            loading={loading}
            index={0}
            value={latest ? <CountUp value={latest.riskScore} delay={200} /> : '—'}
            aside={latest && <ScoreGauge score={latest.riskScore} />}
            unit={latest ? '/100' : null}
            footer={
              scoreChange !== null ? (
                <span className={`db-delta tone-${scoreChange >= 0 ? 'success' : 'danger'}`}>
                  {scoreChange >= 0 ? '↑' : '↓'} {Math.abs(scoreChange)} pts since last assessment
                </span>
              ) : (
                <span>{latest ? 'Your first assessment' : 'No assessment yet'}</span>
              )
            }
          />

          <StatCard
            label="Risk level"
            icon="activity"
            accent={latest ? TONE_ACCENT[statusOf('riskLevel', latest.riskLevel).tone] : 'slate'}
            loading={loading}
            index={1}
            value={latest ? <Pill {...statusOf('riskLevel', latest.riskLevel)} large live /> : '—'}
            footer={<span>{latest ? `${history.length} assessment${history.length === 1 ? '' : 's'} on record` : 'Take an assessment to find out'}</span>}
          />

          <StatCard
            label="Modules completed"
            icon="book"
            accent="indigo"
            index={2}
            value={<CountUp value={completedCount} delay={300} />}
            unit={`/${modules.length}`}
            footer={<Meter value={(completedCount / modules.length) * 100} tone="indigo" label="Module completion" delay={400} />}
          />

          <StatCard
            label="Quiz average"
            icon="check"
            accent="amber"
            index={3}
            value="—"
            footer={<Pill label="Quizzes coming soon" tone="neutral" />}
          />
        </section>

        {/* ================= MAIN PANELS ================= */}
        <div className="db-grid">
          <section className="db-card accent-teal">
            <header className="db-card-header">
              <span className="db-card-icon"><Icon name="shield" /></span>
              <div>
                <h2>Security risk overview</h2>
                <p>Category scores from your latest assessment.</p>
              </div>
              {latest && (
                <Link to="/results" className="db-link">
                  View report <Icon name="arrow" />
                </Link>
              )}
            </header>

            <div className="db-card-body">
            {loading && <Skeleton rows={3} />}

            {status !== 'loading' && !latest && (
              <div className="db-empty">
                <Icon name="shield" />
                <strong>No risk data yet</strong>
                <p>Complete an assessment to see how you score in each category.</p>
                <Link to="/assessment" className="db-btn db-btn-secondary">Start assessment</Link>
              </div>
            )}

            {latest && (
              <ul className="db-risk-list">
                {CATEGORIES.map(({ field, label }, index) => {
                  const score = latest.breakdown?.[field] ?? 0
                  const delay = 350 + index * 150
                  return (
                    <li key={field} className="db-risk-row">
                      <div className="db-risk-meta">
                        <span>{label}</span>
                        <div>
                          <Pill {...statusOf(field, latest[field])} />
                          <strong><CountUp value={score} delay={delay} />%</strong>
                        </div>
                      </div>
                      <Meter value={score} tone={toneForScore(score)} label={`${label} score`} delay={delay} />
                    </li>
                  )
                })}
              </ul>
            )}
            </div>
          </section>

          <section className="db-card accent-violet">
            <header className="db-card-header">
              <span className="db-card-icon"><Icon name="activity" /></span>
              <div>
                <h2>Recommended actions</h2>
                <p>Prioritised by the risk they address.</p>
              </div>
              {!loading && (
                <span className="db-count">{recommendations.length}</span>
              )}
            </header>

            <div className="db-card-body">
            {loading ? (
              <Skeleton rows={3} />
            ) : (
              <ul className="db-actions">
                {recommendations.map((item, index) => (
                  <li key={item.title} style={{ '--i': index }}>
                    <Link to={item.to} className={`db-action priority-${item.priority}`}>
                      <div className="db-action-text">
                        <strong>{item.title}</strong>
                        <p>{item.description}</p>
                      </div>
                      <Pill
                        label={item.priority === 'low' ? 'Suggested' : `${item.priority} priority`}
                        tone={PRIORITY_TONE[item.priority]}
                        live={item.priority !== 'low'}
                      />
                      <Icon name="chevron" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            </div>
          </section>
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <section ref={quickRef} className={quickVisible ? 'db-quick is-visible' : 'db-quick'}>
          <h2 className="db-section-label">Quick actions</h2>

          <div className="db-quick-grid">
            <QuickLink index={0} accent="teal" to="/assessment" icon="clipboard" title="New assessment" text="Evaluate your current security habits" />
            <QuickLink index={1} accent="indigo" to="/awareness" icon="book" title="Learning modules" text={`${modules.length - completedCount} of ${modules.length} modules left to complete`} />
            <QuickLink index={2} accent="sky" to="/results" icon="chart" title="Latest results" text="Review your most recent report" />
            <QuickLink index={3} accent="violet" to="/profile" icon="user" title="Profile & security" text="Manage your account and activity" />
          </div>
        </section>
      </main>
    </div>
  )
}

/* =====================================================
   REUSABLE COMPONENTS
===================================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Counts from 0 up to `value` with an ease-out curve.
function CountUp({ value, duration = 1000, delay = 0 }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion) return
    let frame
    let start

    const tick = (now) => {
      start ??= now + delay
      const progress = Math.min(Math.max((now - start) / duration, 0), 1)
      setDisplay(Math.round(value * (1 - (1 - progress) ** 3)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration, delay])

  return prefersReducedMotion ? value : display
}

function StatCard({ label, icon, accent = 'slate', value, unit, aside, footer, loading, index = 0 }) {
  return (
    <article className={`db-stat accent-${accent}`} style={{ '--i': index }} {...statTilt}>
      <div className="db-stat-top">
        <span className="db-label">{label}</span>
        <span className="db-stat-icon"><Icon name={icon} /></span>
      </div>

      {loading ? (
        <Skeleton rows={2} />
      ) : (
        <>
          <div className="db-stat-row">
            <div className="db-stat-value">
              {value}
              {unit && <span className="db-stat-unit">{unit}</span>}
            </div>
            {aside}
          </div>
          <div className="db-stat-footer">{footer}</div>
        </>
      )}
    </article>
  )
}

// Small ring that draws itself in up to the score.
function ScoreGauge({ score }) {
  const radius = 16
  const circumference = 2 * Math.PI * radius
  return (
    <svg className="db-gauge" viewBox="0 0 40 40" aria-hidden="true" style={{ '--offset': circumference * (1 - score / 100), '--length': circumference }}>
      <circle className="db-gauge-track" cx="20" cy="20" r={radius} />
      <circle className="db-gauge-value" cx="20" cy="20" r={radius} strokeDasharray={circumference} />
    </svg>
  )
}

// `live` adds a soft pulsing ring around the dot.
function Pill({ label, tone, large, live }) {
  return (
    <span className={`db-pill tone-${tone}${large ? ' db-pill-lg' : ''}${live ? ' is-live' : ''}`}>
      <span className="db-pill-dot" />
      {label}
    </span>
  )
}

// The fill animates from 0 to `value` after `delay` ms (see .db-meter in dashboard.css).
function Meter({ value, tone, label, delay = 0 }) {
  return (
    <div
      className={`db-meter tone-${tone}`}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
    >
      <span style={{ '--value': `${value}%`, '--delay': `${delay}ms` }} />
    </div>
  )
}

function QuickLink({ to, icon, title, text, accent = 'slate', index = 0 }) {
  return (
    <Link to={to} className={`db-quick-card accent-${accent}`} style={{ '--i': index }} {...quickTilt}>
      <span className="db-quick-icon"><Icon name={icon} /></span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      <Icon name="arrow" />
    </Link>
  )
}

function Skeleton({ rows }) {
  return (
    <div className="db-skeleton" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, index) => <span key={index} />)}
    </div>
  )
}

const ICON_PATHS = {
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
  check: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  clipboard: 'M9 2h6v4H9zM16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 12h6M9 16h4',
  chart: 'M3 3v18h18M7 15l4-4 3 3 5-6',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  plus: 'M12 5v14M5 12h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  chevron: 'M9 6l6 6-6 6',
  alert: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
}

function Icon({ name }) {
  return (
    <svg
      className="db-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

export default Dashboard
