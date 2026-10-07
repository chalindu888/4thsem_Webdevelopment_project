import { Link } from 'react-router-dom'
import { useState } from 'react'
import api from '../api/client'

function Assessment() {
  const [form, setForm] = useState({ passwordHabits: '', phishingAwareness: '', twoFactorAuth: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (Object.values(form).some((value) => !value)) {
      setError('Please answer every assessment question.')
      return
    }

    setLoading(true)

    try {
      const { data } = await api.post('/assessment', form)
      setResult(data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to submit assessment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="simple-page">
      <div className="simple-navbar">
        <Link to="/" className="simple-brand">
          🛡️ SecureAI
        </Link>

        <Link to="/dashboard">Dashboard</Link>
      </div>

      <main className="placeholder-page">
        <div className="placeholder-icon">📋</div>

        <span className="section-tag">SECURITY ASSESSMENT</span>

        <h1>Cybersecurity Risk Assessment</h1>

        <p>
          Answer a series of questions about your digital security habits. Your
          responses will be analyzed to calculate your cybersecurity risk.
        </p>

        <div className="assessment-info-grid">
          <InfoCard value="20" title="Questions" />

          <InfoCard value="10" title="Categories" />

          <InfoCard value="5-10 min" title="Estimated Time" />
        </div>

        <form className="assessment-form" onSubmit={handleSubmit}>
          <label className="form-group">
            <span>Password Habits</span>
            <select value={form.passwordHabits} onChange={(event) => setForm({ ...form, passwordHabits: event.target.value })}>
              <option value="">Select an answer</option>
              <option value="strong">Unique, strong passwords</option>
              <option value="mixed">A mix of strong and reused passwords</option>
              <option value="weak">Mostly reused or weak passwords</option>
            </select>
          </label>
          <label className="form-group">
            <span>Phishing Awareness</span>
            <select value={form.phishingAwareness} onChange={(event) => setForm({ ...form, phishingAwareness: event.target.value })}>
              <option value="">Select an answer</option>
              <option value="high">I can confidently identify phishing</option>
              <option value="medium">I sometimes recognize phishing</option>
              <option value="low">I need help identifying phishing</option>
            </select>
          </label>
          <label className="form-group">
            <span>Two-factor authentication</span>
            <select value={form.twoFactorAuth} onChange={(event) => setForm({ ...form, twoFactorAuth: event.target.value })}>
              <option value="">Select an answer</option>
              <option value="enabled">Enabled on important accounts</option>
              <option value="some">Enabled on some accounts</option>
              <option value="none">Not enabled</option>
            </select>
          </label>
          <button className="primary-btn large-btn" type="submit" disabled={loading}>
            {loading ? 'Calculating...' : 'Begin Assessment →'}
          </button>
        </form>

        {error && <p className="form-message error-message">{error}</p>}
        {result && (
          <div className="result-preview">
            <span>Security Score</span>
            <strong>{result.riskScore} / 100</strong>
            <div className="result-risk">{result.riskLevel}</div>
          </div>
        )}
      </main>
    </div>
  )
}

function InfoCard({ value, title }) {
  return (
    <div className="assessment-info-card">
      <strong>{value}</strong>
      <span>{title}</span>
    </div>
  )
}

export default Assessment