import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api, { clearSession, getErrorMessage } from '../api/client'
import { notifySessionChange } from '../services/session'
import { statusOf } from '../services/assessmentStatus'
import './profile.css'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'security', label: 'Security' },
  { id: 'activity', label: 'Activity' },
]

const TWO_FACTOR_KEY = 'secureai_2fa_preference'

function readUser() {
  try {
    const parsed = JSON.parse(localStorage.getItem('user')) || {}
    return { name: parsed.name || 'User', email: parsed.email || '' }
  } catch {
    return { name: 'User', email: '' }
  }
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'
}

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

const formatDateTime = (value) =>
  new Date(value).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

function Profile() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(readUser)
  // "All assessments" on the results page opens the Activity tab directly.
  const [activeTab, setActiveTab] = useState(() =>
    TABS.some((tab) => tab.id === location.state?.tab) ? location.state.tab : 'overview',
  )
  const [history, setHistory] = useState([])
  const [historyStatus, setHistoryStatus] = useState('loading')
  const [historyError, setHistoryError] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => localStorage.getItem(TWO_FACTOR_KEY) === 'on')
  const tabRefs = useRef({})

  useEffect(() => {
    api.get('/assessment')
      .then(({ data }) => {
        setHistory(data.assessments)
        setHistoryStatus('ready')
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setHistoryError(getErrorMessage(error))
        setHistoryStatus('error')
      })
  }, [navigate])

  const latest = history[0]

  const handleSignOut = () => {
    clearSession()
    notifySessionChange()
    navigate('/login')
  }

  const handleNameSaved = (name) => {
    const updatedUser = { ...user, name }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    notifySessionChange()
  }

  const toggleTwoFactor = () => {
    const next = !twoFactorEnabled
    setTwoFactorEnabled(next)
    localStorage.setItem(TWO_FACTOR_KEY, next ? 'on' : 'off')
  }

  // Arrow keys move between tabs, like a native tab list.
  const handleTabKeyDown = (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    if (!step) return
    const index = TABS.findIndex((tab) => tab.id === activeTab)
    const next = TABS[(index + step + TABS.length) % TABS.length].id
    setActiveTab(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="pf">
      <Navbar />

      <main className="pf-container">
        {/* ================= PROFILE HEADER ================= */}
        <section className="pf-hero">
          <div className="pf-hero-main">
            <div className="pf-avatar-ring">
              <div className="pf-avatar">{getInitials(user.name)}</div>
            </div>

            <div className="pf-identity">
              <div className="pf-name-row">
                <h1>{user.name}</h1>
                <span className="pf-tier">
                  <span className="pf-tier-dot" />
                  Standard tier
                </span>
              </div>

              {user.email && <p className="pf-email">{user.email}</p>}

              <div className="pf-badges">
                <span className="pf-badge pf-badge-success">
                  <Icon name="check" />
                  Active account
                </span>
                {latest ? (
                  <span className="pf-badge">
                    <Icon name="shield" />
                    Assessed {formatDate(latest.createdAt)}
                  </span>
                ) : (
                  historyStatus === 'ready' && (
                    <span className="pf-badge pf-badge-warning">
                      <Icon name="alert" />
                      Assessment pending
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="pf-hero-actions">
            <Link to="/assessment" className="pf-btn pf-btn-light">
              {latest ? 'Retake assessment' : 'Take assessment'}
            </Link>
          </div>

          <dl className="pf-hero-stats">
            <HeroStat label="Security score" value={latest ? `${latest.riskScore}/100` : '—'} />
            <HeroStat
              label="Risk level"
              value={latest ? <StatusPill {...statusOf('riskLevel', latest.riskLevel)} /> : '—'}
            />
            <HeroStat label="Assessments" value={historyStatus === 'ready' ? history.length : '—'} />
            <HeroStat label="2FA preference" value={twoFactorEnabled ? 'On' : 'Off'} />
          </dl>
        </section>

        {/* ================= TABS ================= */}
        <div className="pf-tabs" role="tablist" aria-label="Profile sections" onKeyDown={handleTabKeyDown}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              ref={(node) => { tabRefs.current[tab.id] = node }}
              type="button"
              role="tab"
              id={`pf-tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`pf-panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={activeTab === tab.id ? 'pf-tab is-active' : 'pf-tab'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.id === 'activity' && historyStatus === 'ready' && (
                <span className="pf-tab-count">{history.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* key forces a remount so the fade-in plays on every tab switch */}
        <div
          key={activeTab}
          className="pf-panel"
          role="tabpanel"
          id={`pf-panel-${activeTab}`}
          aria-labelledby={`pf-tab-${activeTab}`}
        >
          {activeTab === 'overview' && (
            <div className="pf-grid">
              <ProfileForm user={user} onSave={handleNameSaved} />
              <PostureCard latest={latest} status={historyStatus} error={historyError} />
            </div>
          )}

          {activeTab === 'security' && (
            <SecuritySettings
              latest={latest}
              twoFactorEnabled={twoFactorEnabled}
              onToggleTwoFactor={toggleTwoFactor}
              onSignOut={handleSignOut}
            />
          )}

          {activeTab === 'activity' && (
            <ActivityLog history={history} status={historyStatus} error={historyError} />
          )}
        </div>
      </main>
    </div>
  )
}

/* =====================================================
   SECTIONS
===================================================== */

function ProfileForm({ user, onSave }) {
  const [name, setName] = useState(user.name)
  const [saved, setSaved] = useState(false)
  const trimmed = name.trim()
  const unchanged = trimmed === user.name

  useEffect(() => {
    if (!saved) return
    const timer = setTimeout(() => setSaved(false), 2500)
    return () => clearTimeout(timer)
  }, [saved])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!trimmed || unchanged) return
    onSave(trimmed)
    setSaved(true)
  }

  return (
    <section className="pf-card">
      <header className="pf-card-header">
        <h2>Personal information</h2>
        <p>Update how your name appears across SecureAI.</p>
      </header>

      <form className="pf-form" onSubmit={handleSubmit}>
        <label className="pf-field">
          <span>Full name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setSaved(false)
            }}
            placeholder="Enter your name"
            maxLength={60}
            required
          />
        </label>

        <label className="pf-field">
          <span>Email address</span>
          <div className="pf-input-locked">
            <input type="email" value={user.email} disabled />
            <Icon name="lock" />
          </div>
          <small>Your email is used to sign in and can't be changed here.</small>
        </label>

        <footer className="pf-card-footer">
          <span className={saved ? 'pf-saved is-visible' : 'pf-saved'} role="status">
            <Icon name="check" />
            Changes saved
          </span>
          <button type="submit" className="pf-btn pf-btn-primary" disabled={!trimmed || unchanged}>
            Save changes
          </button>
        </footer>
      </form>
    </section>
  )
}

function PostureCard({ latest, status, error }) {
  return (
    <section className="pf-card">
      <header className="pf-card-header">
        <h2>Security posture</h2>
        <p>Based on your most recent risk assessment.</p>
      </header>

      {status === 'loading' && <Skeleton rows={3} />}
      {status === 'error' && <p className="pf-error" role="alert">{error}</p>}
      {status === 'ready' && !latest && (
        <EmptyState
          title="No assessment yet"
          text="Complete a short assessment to see your security score and weak areas."
        />
      )}

      {latest && (
        <div className="pf-posture">
          <ScoreRing score={latest.riskScore} tone={statusOf('riskLevel', latest.riskLevel).tone} />

          <ul className="pf-posture-list">
            <PostureItem title="Password habits" {...statusOf('passwordHabits', latest.passwordHabits)} />
            <PostureItem title="Phishing awareness" {...statusOf('phishingAwareness', latest.phishingAwareness)} />
            <PostureItem title="Two-factor authentication" {...statusOf('twoFactorAuth', latest.twoFactorAuth)} />
          </ul>
        </div>
      )}
    </section>
  )
}

function SecuritySettings({ latest, twoFactorEnabled, onToggleTwoFactor, onSignOut }) {
  return (
    <section className="pf-card pf-card-flush">
      <header className="pf-card-header">
        <h2>Security settings</h2>
        <p>Manage sign-in protection and review your security health.</p>
      </header>

      <div className="pf-rows">
        <div className="pf-row">
          <div className="pf-row-text">
            <strong id="pf-2fa-label">Two-factor authentication</strong>
            <p>Require a verification code in addition to your password when signing in.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={twoFactorEnabled}
            aria-labelledby="pf-2fa-label"
            className="pf-switch"
            onClick={onToggleTwoFactor}
          >
            <span className="pf-switch-thumb" />
          </button>
        </div>

        <div className="pf-row">
          <div className="pf-row-text">
            <strong>Current risk score</strong>
            <p>Calculated from your latest cybersecurity risk assessment.</p>
          </div>
          {latest ? (
            <div className="pf-row-value">
              <span className="pf-row-metric">{latest.riskScore}/100</span>
              <StatusPill {...statusOf('riskLevel', latest.riskLevel)} />
            </div>
          ) : (
            <Link to="/assessment" className="pf-btn pf-btn-secondary">Run assessment</Link>
          )}
        </div>

        <div className="pf-row">
          <div className="pf-row-text">
            <strong>Password hygiene</strong>
            <p>How unique and strong your passwords are, as reported in your assessment.</p>
          </div>
          {latest ? <StatusPill {...statusOf('passwordHabits', latest.passwordHabits)} /> : <StatusPill label="Unknown" tone="neutral" />}
        </div>

        <div className="pf-row">
          <div className="pf-row-text">
            <strong>Phishing awareness</strong>
            <p>Your confidence in recognizing phishing emails, messages and sites.</p>
          </div>
          {latest ? <StatusPill {...statusOf('phishingAwareness', latest.phishingAwareness)} /> : <StatusPill label="Unknown" tone="neutral" />}
        </div>

        <div className="pf-row">
          <div className="pf-row-text">
            <strong>Active session</strong>
            <p>You're signed in on this browser. Sign out when using a shared device.</p>
          </div>
          <button type="button" className="pf-btn pf-btn-danger" onClick={onSignOut}>
            <Icon name="logout" />
            Sign out
          </button>
        </div>
      </div>
    </section>
  )
}

function ActivityLog({ history, status, error }) {
  return (
    <section className="pf-card pf-card-flush">
      <header className="pf-card-header">
        <h2>Activity log</h2>
        <p>Your 20 most recent security assessments.</p>
      </header>

      {status === 'loading' && <div className="pf-card-body"><Skeleton rows={4} /></div>}
      {status === 'error' && <div className="pf-card-body"><p className="pf-error" role="alert">{error}</p></div>}
      {status === 'ready' && history.length === 0 && (
        <div className="pf-card-body">
          <EmptyState title="No activity yet" text="Assessments you complete will appear here." />
        </div>
      )}

      {history.length > 0 && (
        <ol className="pf-timeline">
          {history.map((item, index) => {
            const risk = statusOf('riskLevel', item.riskLevel)
            const previous = history[index + 1]
            const change = previous ? item.riskScore - previous.riskScore : null

            return (
              <li key={item.id} className="pf-event">
                <span className={`pf-event-dot tone-${risk.tone}`} />
                <div className="pf-event-text">
                  <strong>Completed security assessment</strong>
                  <time dateTime={item.createdAt}>{formatDateTime(item.createdAt)}</time>
                </div>
                <div className="pf-row-value">
                  <span className="pf-row-metric">{item.riskScore}/100</span>
                  {change !== null && change !== 0 && (
                    <span className={change > 0 ? 'pf-delta is-up' : 'pf-delta is-down'}>
                      {change > 0 ? '+' : ''}{change}
                    </span>
                  )}
                  <StatusPill {...risk} />
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

/* =====================================================
   SMALL COMPONENTS
===================================================== */

function StatusPill({ label, tone }) {
  return (
    <span className={`pf-pill tone-${tone}`}>
      <span className="pf-pill-dot" />
      {label}
    </span>
  )
}

function HeroStat({ label, value }) {
  return (
    <div className="pf-hero-stat">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function PostureItem({ title, ...status }) {
  return (
    <li className="pf-posture-item">
      <span>{title}</span>
      <StatusPill {...status} />
    </li>
  )
}

function ScoreRing({ score, tone }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius

  return (
    <div className={`pf-ring tone-${tone}`} role="img" aria-label={`Security score ${score} out of 100`}>
      <svg viewBox="0 0 100 100">
        <circle className="pf-ring-track" cx="50" cy="50" r={radius} />
        <circle
          className="pf-ring-value"
          cx="50"
          cy="50"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
        />
      </svg>
      <div className="pf-ring-label">
        <strong>{score}</strong>
        <span>of 100</span>
      </div>
    </div>
  )
}

function EmptyState({ title, text }) {
  return (
    <div className="pf-empty">
      <strong>{title}</strong>
      <p>{text}</p>
      <Link to="/assessment" className="pf-btn pf-btn-secondary">Take assessment</Link>
    </div>
  )
}

function Skeleton({ rows }) {
  return (
    <div className="pf-skeleton" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, index) => <span key={index} />)}
    </div>
  )
}

const ICON_PATHS = {
  check: 'M20 6 9 17l-5-5',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  alert: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  lock: 'M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5z',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
}

function Icon({ name }) {
  return (
    <svg
      className="pf-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

export default Profile
