import { Link } from 'react-router-dom'
import { useState } from 'react'
import api from '../api/client'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!form.email || !form.password) {
      setError('Enter your email and password.')
      return
    }

    setLoading(true)

    try {
      const { data } = await api.post('/auth/login', form)
      localStorage.setItem('secureai_token', data.token)
      setMessage('Signed in successfully.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to sign in. Please try again.')
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
          <span className="section-tag">SECURE ACCESS</span>

          <h1>
            Welcome Back to
            <span> SecureAI</span>
          </h1>

          <p>
            Sign in to continue your cybersecurity awareness journey, monitor
            your risk score and access personalized security recommendations.
          </p>

          <div className="auth-benefit">
            <span>✓</span>
            Track your cybersecurity risk score
          </div>

          <div className="auth-benefit">
            <span>✓</span>
            View personalized AI recommendations
          </div>

          <div className="auth-benefit">
            <span>✓</span>
            Continue your security awareness training
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-heading">
            <h2>Sign In</h2>

            <p>Enter your account details to continue.</p>
          </div>

          <form onSubmit={handleSubmit}>
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
              <div className="label-row">
                <label>Password</label>

                <button type="button" className="forgot-button">
                  Forgot password?
                </button>
              </div>

              <input
                type="password"
                placeholder="Enter your password"
                required
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
            </div>

            <div className="remember-row">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
              <span>→</span>
            </button>
          </form>

          {error && <p className="form-message error-message">{error}</p>}
          {message && <p className="form-message success-message">{message}</p>}

          <div className="auth-divider">
            <span></span>
            <p>New to SecureAI?</p>
            <span></span>
          </div>

          <Link to="/register" className="auth-secondary-button">
            Create New Account
          </Link>

          <Link to="/" className="back-home">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login