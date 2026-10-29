import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api, { clearSession, getErrorMessage } from '../api/client'
import Navbar from '../components/Navbar'

const NOTES_MAX = 300

const QUESTIONS = [
  {
    field: 'passwordHabits',
    label: 'Password Habits',
    error: 'Please choose an answer for password habits.',
    options: [
      ['strong', 'Unique, strong passwords'],
      ['mixed', 'A mix of strong and reused passwords'],
      ['weak', 'Mostly reused or weak passwords'],
    ],
  },
  {
    field: 'phishingAwareness',
    label: 'Phishing Awareness',
    error: 'Please choose an answer for phishing awareness.',
    options: [
      ['high', 'I can confidently identify phishing'],
      ['medium', 'I sometimes recognize phishing'],
      ['low', 'I need help identifying phishing'],
    ],
  },
  {
    field: 'twoFactorAuth',
    label: 'Two-factor authentication',
    error: 'Please choose an answer for two-factor authentication.',
    options: [
      ['enabled', 'Enabled on important accounts'],
      ['some', 'Enabled on some accounts'],
      ['none', 'Not enabled'],
    ],
  },
]

const EMPTY_FORM = { passwordHabits: '', phishingAwareness: '', twoFactorAuth: '', notes: '' }

// Pre-fills the form when editing an existing assessment.
function formFrom(assessment) {
  if (!assessment) return EMPTY_FORM
  return {
    passwordHabits: assessment.passwordHabits ?? '',
    phishingAwareness: assessment.phishingAwareness ?? '',
    twoFactorAuth: assessment.twoFactorAuth ?? '',
    notes: assessment.notes ?? '',
  }
}

function Assessment() {
  const navigate = useNavigate()
  const location = useLocation()
  // Set when arriving from "Edit answers" on the results page.
  const editing = location.state?.editAssessment ?? null
  const [form, setForm] = useState(() => formFrom(editing))
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    // Clear that field's error as soon as it is answered.
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = () => {
    const errors = {}
    for (const question of QUESTIONS) {
      if (!form[question.field]) errors[question.field] = question.error
    }
    if (form.notes.length > NOTES_MAX) errors.notes = `Notes can be at most ${NOTES_MAX} characters.`
    return errors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length) {
      // Move focus to the first problem so keyboard and screen-reader users land on it.
      document.getElementById(`assessment-${Object.keys(errors)[0]}`)?.focus()
      return
    }

    setLoading(true)

    try {
      const payload = {
        passwordHabits: form.passwordHabits,
        phishingAwareness: form.phishingAwareness,
        twoFactorAuth: form.twoFactorAuth,
        notes: form.notes.trim(),
      }

      if (editing) {
        // Update in place, then show the refreshed report.
        const { data } = await api.put(`/assessment/${editing.id}`, payload)
        navigate(`/results?id=${data.assessment.id}`, { replace: true, state: { assessment: data.assessment, justSaved: true } })
        return
      }

      const { data } = await api.post('/assessment', payload)
      // The dashboard shows a success message and reloads, so the new score appears straight away.
      navigate('/dashboard', { state: { savedAssessment: data.assessment } })
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        clearSession()
        navigate('/login', { replace: true, state: { message: getErrorMessage(requestError) } })
        return
      }
      setError(getErrorMessage(requestError))
      setLoading(false)
    }
  }

  return (
    <div className="simple-page">
      <Navbar />

      <main className="placeholder-page">
        <div className="placeholder-icon">📋</div>

        <span className="section-tag">SECURITY ASSESSMENT</span>

        <h1>{editing ? 'Edit your answers' : 'Cybersecurity Risk Assessment'}</h1>

        <p>
          Answer three questions about your digital security habits. Your responses are scored to
          calculate your cybersecurity risk.
        </p>

        <div className="assessment-info-grid">
          <InfoCard value="3" title="Questions" />
          <InfoCard value="3" title="Categories" />
          <InfoCard value="~2 min" title="Estimated Time" />
        </div>

        <form className="assessment-form" onSubmit={handleSubmit} noValidate>
          {QUESTIONS.map((question) => {
            const fieldError = fieldErrors[question.field]
            const id = `assessment-${question.field}`
            return (
              <div className="form-group" key={question.field}>
                <label htmlFor={id}>{question.label}</label>
                <select
                  id={id}
                  value={form[question.field]}
                  onChange={(event) => updateField(question.field, event.target.value)}
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={fieldError ? `${id}-error` : undefined}
                  className={fieldError ? 'is-invalid' : undefined}
                  disabled={loading}
                >
                  <option value="">Select an answer</option>
                  {question.options.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {fieldError && <p className="field-error" id={`${id}-error`}>{fieldError}</p>}
              </div>
            )
          })}

          <div className="form-group">
            <label htmlFor="assessment-notes">Notes (optional)</label>
            <textarea
              id="assessment-notes"
              rows={4}
              maxLength={NOTES_MAX}
              placeholder="e.g. Before enabling a password manager"
              value={form.notes}
              onChange={(event) => updateField('notes', event.target.value)}
              aria-invalid={Boolean(fieldErrors.notes)}
              aria-describedby="assessment-notes-count"
              className={fieldErrors.notes ? 'is-invalid' : undefined}
              disabled={loading}
            />
            <p className="field-hint" id="assessment-notes-count">
              {form.notes.length}/{NOTES_MAX} characters
            </p>
            {fieldErrors.notes && <p className="field-error">{fieldErrors.notes}</p>}
          </div>

          <button className="primary-btn large-btn" type="submit" disabled={loading}>
            {loading ? 'Saving…' : editing ? 'Save changes' : 'Submit Assessment →'}
          </button>

          {editing && (
            <Link to={`/results?id=${editing.id}`} state={{ assessment: editing }} className="assessment-cancel">
              Cancel
            </Link>
          )}
        </form>

        {error && <p className="form-message error-message" role="alert">{error}</p>}
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
