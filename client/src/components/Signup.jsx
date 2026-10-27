import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../api/client'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      // Backend එකට දත්ත යැවීම
      const response = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      })

      const data = response.data;

      // Token සහ User විස්තර LocalStorage එකේ ගබඩා කිරීම
      if (data.token) {
        localStorage.setItem('secureai_token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      setMessage(data.message || 'ලියාපදිංචිය සාර්ථකයි!')
      
      // සාර්ථකව Dashboard වෙත යැවීම
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)

    } catch (requestError) {
      console.error("Registration Error Details:", requestError);
      setError(
        requestError.response?.data?.message || 
        requestError.message || 
        'Unable to create your account. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-logo">
          <img className="brand-image" src="/security.jpg" alt="" />
          <div>
            <h2>SecureAI</h2>
            <span>Security Awareness Platform</span>
          </div>
        </Link>

        <div className="auth-intro">
          <span className="section-tag">GET STARTED</span>

          <h1>
            Build Better
            <span> Security Habits</span>
          </h1>

          <p>
            Create your SecureAI account and discover your cybersecurity risk
            level through intelligent assessments and awareness training.
          </p>

          <div className="auth-benefit">
            <span>✓</span>
            Complete personalized risk assessments
          </div>

          <div className="auth-benefit">
            <span>✓</span>
            Identify cybersecurity weaknesses
          </div>

          <div className="auth-benefit">
            <span>✓</span>
            Improve through awareness training
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-heading">
            <h2>Create Account</h2>
            <p>Start your cybersecurity awareness journey.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="example@email.com"
                required
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                required
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                required
                value={form.confirmPassword}
                onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
              />
            </div>

            <label className="terms-row">
              <input type="checkbox" required />
              <span>
                I agree to the Terms of Service and Privacy Policy.
              </span>
            </label>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
              <span>→</span>
            </button>
          </form>

          {error && <p className="form-message error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          {message && <p className="form-message success-message" style={{ color: 'green', marginTop: '10px' }}>{message}</p>}

          <p className="auth-switch">
            Already have an account?
            <Link to="/login"> Sign In</Link>
          </p>

          <Link to="/" className="back-home">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register