import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api, { clearSession, getErrorMessage } from '../api/client'
import Navbar from '../components/Navbar'

const ANSWER_LABELS = {
  passwordHabits: {
    title: 'Password Habits',
    strong: 'Unique, strong passwords',
    mixed: 'A mix of strong and reused passwords',
    weak: 'Mostly reused or weak passwords',
  },
  phishingAwareness: {
    title: 'Phishing Awareness',
    high: 'Confidently identifies phishing',
    medium: 'Sometimes recognizes phishing',
    low: 'Needs help identifying phishing',
  },
  twoFactorAuth: {
    title: 'Two-factor authentication',
    enabled: 'Enabled on important accounts',
    some: 'Enabled on some accounts',
    none: 'Not enabled',
  },
}

function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const passedAssessment = location.state?.assessment
  const [assessment, setAssessment] = useState(passedAssessment || null)
  const [loading, setLoading] = useState(!passedAssessment)
  const [error, setError] = useState('')

  // After a page refresh the router state is gone, so load the latest saved result instead.
  useEffect(() => {
    if (passedAssessment) return

    api.get('/assessment/latest')
      .then(({ data }) => setAssessment(data.assessment))
      .catch((requestError) => {
        if (requestError.response?.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setError(getErrorMessage(requestError))
      })
      .finally(() => setLoading(false))
  }, [passedAssessment, navigate])

  return (
    <div className="simple-page">
      <Navbar />

      <main className="placeholder-page">
        <div className="placeholder-icon"></div>

        <span className="section-tag">ASSESSMENT RESULTS</span>

        <h1>Your Security Risk Report</h1>

        {loading && <p>Loading your results...</p>}

        {error && (
          <>
            <p className="form-message error-message" role="alert">{error}</p>
            <Link to="/assessment">
              <button className="primary-btn">Take the Assessment</button>
            </Link>
          </>
        )}

        {assessment && (
          <>
            <p>
              Submitted on {new Date(assessment.createdAt).toLocaleString()}.
            </p>

            <div className="result-preview">
              <span>Security Score</span>

              <strong>{assessment.riskScore} / 100</strong>

              <div className="result-risk">
                {assessment.riskLevel}
              </div>
            </div>

            <div className="assessment-info-grid">
              {Object.entries(ANSWER_LABELS).map(([field, labels]) => (
                <div className="assessment-info-card" key={field}>
                  <strong>{labels.title}</strong>
                  <span>{labels[assessment[field]] || assessment[field]}</span>
                </div>
              ))}
            </div>

            <Link to="/dashboard">
              <button className="primary-btn">
                Return to Dashboard
              </button>
            </Link>
          </>
        )}
      </main>
    </div>
  )
}

export default Results
