import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api, { clearSession, getErrorMessage } from '../api/client'
import Navbar from '../components/Navbar'
import { statusOf } from '../services/assessmentStatus'
import { buildRecommendations, PRIORITY_TONE } from '../services/recommendations'
import './results.css'

const CATEGORIES = [
  {
    field: 'passwordHabits',
    title: 'Password Habits',
    answers: { strong: 'Unique, strong passwords', mixed: 'A mix of strong and reused passwords', weak: 'Mostly reused or weak passwords' },
  },
  {
    field: 'phishingAwareness',
    title: 'Phishing Awareness',
    answers: { high: 'Confidently identifies phishing', medium: 'Sometimes recognizes phishing', low: 'Needs help identifying phishing' },
  },
  {
    field: 'twoFactorAuth',
    title: 'Two-factor authentication',
    answers: { enabled: 'Enabled on important accounts', some: 'Enabled on some accounts', none: 'Not enabled' },
  },
]

const formatDateTime = (value) =>
  new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const passed = location.state?.assessment ?? null
  // ?id= keeps the same report on refresh; without it, show the latest assessment.
  const requestedId = searchParams.get('id') || passed?.id || null

  const [assessment, setAssessment] = useState(passed)
  const [status, setStatus] = useState(passed ? 'ready' : 'loading')
  const [error, setError] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  // Captured once: "Assessment saved." shows only right after saving, not after a refresh.
  const [justSaved] = useState(Boolean(location.state?.justSaved))

  // Router state survives a page refresh, so clear it once it has been read.
  useEffect(() => {
    if (location.state) navigate(`${location.pathname}${location.search}`, { replace: true, state: null })
  }, [location.state, location.pathname, location.search, navigate])

  useEffect(() => {
    if (passed) return

    api.get(requestedId ? `/assessment/${requestedId}` : '/assessment/latest')
      .then(({ data }) => {
        setAssessment(data.assessment)
        setStatus('ready')
      })
      .catch((requestError) => {
        const code = requestError.response?.status
        if (code === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        // No assessment yet (or it was deleted) is an empty state, not an error.
        if (code === 404) {
          setStatus('empty')
          return
        }
        setError(getErrorMessage(requestError))
        setStatus('error')
      })
  }, [passed, requestedId, navigate])

  const handleDelete = async () => {
    setDeleting(true)
    setError('')
    try {
      await api.delete(`/assessment/${assessment.id}`)
      navigate('/dashboard', { replace: true, state: { flash: 'Assessment deleted.' } })
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      setDeleting(false)
      setConfirmingDelete(false)
    }
  }

  const risk = assessment ? statusOf('riskLevel', assessment.riskLevel) : null
  const advice = assessment ? buildRecommendations(assessment) : []

  return (
    <div className="simple-page">
      <Navbar />

      <main className="rs">
        <span className="section-tag">ASSESSMENT RESULTS</span>
        <h1>Your Security Risk Report</h1>

        {status === 'loading' && (
          <div className="rs-skeleton" aria-busy="true" aria-label="Loading your report">
            <span /><span /><span />
          </div>
        )}

        {status === 'empty' && (
          <div className="rs-empty">
            <strong>No assessment yet</strong>
            <p>Take a short assessment to get your security score.</p>
            <Link to="/assessment" className="rs-btn rs-btn-primary">Take assessment</Link>
          </div>
        )}

        {status === 'error' && (
          <div className="rs-empty">
            <p className="rs-error" role="alert">{error}</p>
            <button type="button" className="rs-btn rs-btn-secondary" onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
        )}

        {status === 'ready' && assessment && (
          <>
            <div className="rs-meta">
              {justSaved && <p className="rs-saved" role="status">Assessment saved.</p>}
              <p>Submitted on {formatDateTime(assessment.createdAt)}</p>
              {assessment.notes && (
                <p className="rs-notes"><span>Notes:</span> {assessment.notes}</p>
              )}
            </div>

            <section className="rs-score" aria-label="Security score">
              <span className="rs-label">Security Score</span>
              <strong>
                {assessment.riskScore}
                <span> / 100</span>
              </strong>
              <span className={`rs-badge tone-${risk.tone}`}>{risk.label}</span>
            </section>

            <section className="rs-grid" aria-label="Category breakdown">
              {CATEGORIES.map(({ field, title, answers }) => {
                const tone = statusOf(field, assessment[field]).tone
                return (
                  <article key={field} className={`rs-card tone-${tone}`}>
                    <h2>{title}</h2>
                    <p>{answers[assessment[field]] ?? assessment[field]}</p>
                  </article>
                )
              })}
            </section>

            <section className="rs-advice" aria-labelledby="rs-advice-title">
              <h2 id="rs-advice-title">Recommendations</h2>
              {advice.length ? (
                <ul>
                  {advice.map((item) => (
                    <li key={item.title}>
                      <Link to={item.to} className={`rs-advice-item tone-${PRIORITY_TONE[item.priority]}`}>
                        <span className="rs-advice-text">
                          <strong>{item.title}</strong>
                          <span>{item.description}</span>
                        </span>
                        <span className="rs-advice-priority">{item.priority === 'high' ? 'High priority' : 'Medium priority'}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rs-advice-clear">No weak areas found. Keep up the good habits.</p>
              )}
            </section>

            {error && <p className="rs-error" role="alert">{error}</p>}

            <div className="rs-actions">
              {confirmingDelete ? (
                <div className="rs-confirm" role="alertdialog" aria-label="Confirm delete">
                  <span>Delete this assessment? This can’t be undone.</span>
                  <button type="button" className="rs-btn rs-btn-danger" onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Deleting…' : 'Yes, delete'}
                  </button>
                  <button type="button" className="rs-btn rs-btn-secondary" onClick={() => setConfirmingDelete(false)} disabled={deleting}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/assessment" state={{ editAssessment: assessment }} className="rs-btn rs-btn-secondary">
                    Edit answers
                  </Link>
                  <button type="button" className="rs-btn rs-btn-danger" onClick={() => setConfirmingDelete(true)}>
                    Delete
                  </button>
                  <Link to="/profile" state={{ tab: 'activity' }} className="rs-btn rs-btn-primary">
                    All assessments
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Results
