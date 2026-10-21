import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  // Read user data and guard against unauthenticated access
  useEffect(() => {
    const token = localStorage.getItem('secureai_token')
    const stored = localStorage.getItem('user')

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    try {
      const parsed = JSON.parse(stored)
      setUser(parsed)
    } catch {
      setUser({ name: 'User', email: '' })
    }
  }, [navigate])

  // Sign Out handler
  const handleSignOut = () => {
    localStorage.removeItem('secureai_token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Derive first name for the greeting
  const firstName = user?.name?.split(' ')[0] || 'User'

  // Derive account initials for the avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  // Don't render until user data is loaded (or redirect has fired)
  if (!user) return null

  return (
    <div className="simple-page">
      {/* ================= DASHBOARD NAVBAR ================= */}
      <div className="simple-navbar">
        <Link to="/" className="simple-brand">
          🛡 SecureAI
        </Link>

        <div>
          <Link to="/assessment">Assessment</Link>
          <Link to="/awareness">Awareness</Link>
          <Link to="/profile">Profile</Link>
          <button className="signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>

      <main className="dashboard-container">
        {/* ================= WELCOME SECTION ================= */}
        <div className="dashboard-welcome">
          <div>
            <span className="section-tag">USER DASHBOARD</span>

            <h1>Welcome back, {firstName}!</h1>

            <p>
              Here is an overview of your current cybersecurity awareness and
              risk level.
            </p>
          </div>

          <Link to="/assessment">
            <button className="primary-btn">
              Start New Assessment
            </button>
          </Link>
        </div>

        {/* ================= USER PROFILE SUMMARY ================= */}
        <div className="dashboard-profile-summary">
          <div className="profile-avatar">{initials}</div>

          <div className="profile-details">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>

          <div className="profile-meta">
            <div>
              <span>Account Status</span>
              <strong className="status-active">Active</strong>
            </div>

            <div>
              <span>Member Since</span>
              <strong>2026</strong>
            </div>
          </div>

          <Link to="/profile" className="profile-link">
            View Profile →
          </Link>
        </div>

        {/* ================= STAT CARDS ================= */}
        <div className="dashboard-stat-grid">
          <div className="dashboard-stat-card">
            <span>🛡</span>

            <div>
              <p>Security Score</p>
              <strong>68%</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <span>⚠️</span>

            <div>
              <p>Risk Level</p>
              <strong className="orange-text">High</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <span>📚</span>

            <div>
              <p>Modules Completed</p>
              <strong>4 / 10</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <span>📝</span>

            <div>
              <p>Quiz Average</p>
              <strong>82%</strong>
            </div>
          </div>
        </div>

        {/* ================= MAIN PANELS ================= */}
        <div className="dashboard-main-grid">
          {/* Security Risk Overview */}
          <section className="dashboard-panel">
            <div className="panel-heading">
              <h2>Security Risk Overview</h2>

              <Link to="/results">View Report</Link>
            </div>

            <RiskRow title="Password Security" percentage={76} />

            <RiskRow title="Phishing Awareness" percentage={52} />

            <RiskRow title="Device Security" percentage={43} />

            <RiskRow title="Network Security" percentage={30} />
          </section>

          {/* Recommended Actions */}
          <section className="dashboard-panel">
            <div className="panel-heading">
              <h2>Recommended Actions</h2>
            </div>

            <Recommendation
              icon="🔑"
              title="Enable MFA"
              description="Enable multi-factor authentication on your important accounts."
            />

            <Recommendation
              icon="🔒"
              title="Improve Password Security"
              description="Avoid password reuse across multiple online services."
            />

            <Recommendation
              icon="🎣"
              title="Review Phishing Training"
              description="Complete the phishing awareness learning module."
            />
          </section>
        </div>

        {/* ================= QUICK LINKS ================= */}
        <div className="dashboard-quick-links">
          <h2>Quick Actions</h2>

          <div className="quick-links-grid">
            <Link to="/assessment" className="quick-link-card">
              <span>📋</span>
              <strong>New Assessment</strong>
              <p>Evaluate your current security habits</p>
            </Link>

            <Link to="/awareness" className="quick-link-card">
              <span>🎓</span>
              <strong>Awareness Training</strong>
              <p>Learn about cybersecurity best practices</p>
            </Link>

            <Link to="/results" className="quick-link-card">
              <span>📊</span>
              <strong>View Results</strong>
              <p>Review your past assessment reports</p>
            </Link>

            <Link to="/profile" className="quick-link-card">
              <span>👤</span>
              <strong>My Profile</strong>
              <p>Manage your account and preferences</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

/* =====================================================
   REUSABLE COMPONENTS
===================================================== */

function RiskRow({ title, percentage }) {
  return (
    <div className="dashboard-risk-row">
      <div>
        <span>{title}</span>
        <strong>{percentage}%</strong>
      </div>

      <div className="dashboard-progress">
        <div style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}

function Recommendation({ icon, title, description }) {
  return (
    <div className="dashboard-recommendation">
      <div className="recommendation-circle">{icon}</div>

      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default Dashboard
