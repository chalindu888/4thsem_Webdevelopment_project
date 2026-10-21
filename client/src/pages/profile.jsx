import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Profile() {
  const navigate = useNavigate()

  // 1. User state with fallback values
  const [user, setUser] = useState({
    name: 'User',
    email: 'user@example.com',
  })
  const [loading, setLoading] = useState(true)

  // Edit profile form state
  const [nameInput, setNameInput] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // 2. Read user data & verify authentication
  useEffect(() => {
    try {
      const token = localStorage.getItem('secureai_token')
      const storedUserData = localStorage.getItem('user')

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      if (storedUserData) {
        const parsed = JSON.parse(storedUserData)
        const loadedUser = {
          name: parsed.name || 'User',
          email: parsed.email || 'user@example.com',
        }
        setUser(loadedUser)
        setNameInput(loadedUser.name)
      }
    } catch (err) {
      console.warn('Fallback: Error parsing user data from localStorage', err)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  // Handle Profile Update (LocalStorage update)
  const handleUpdateProfile = (e) => {
    e.preventDefault()
    if (!nameInput.trim()) return

    const updatedUser = { ...user, name: nameInput.trim() }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))

    setSaveMessage('Profile details successfully updated!')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  // Handle Sign Out
  const handleSignOut = () => {
    localStorage.removeItem('secureai_token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Generate User Initials for Avatar
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  if (loading) return null

  return (
    <div className="simple-page">
      {/* ================= NAVBAR ================= */}
      <header className="simple-navbar">
        <Link to="/" className="simple-brand">
          🛡️ SecureAI
        </Link>

        <div>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/assessment">Assessment</Link>
          <Link to="/awareness">Awareness</Link>
          <button className="signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="dashboard-container">
        {/* ================= BREADCRUMB / HEADING ================= */}
        <div className="dashboard-welcome">
          <div>
            <span className="section-tag">ACCOUNT & SECURITY</span>
            <h1>Profile Dashboard</h1>
            <p>Manage your account credentials, security preferences, and awareness progress.</p>
          </div>

          <Link to="/dashboard">
            <button className="secondary-btn">← Back to Dashboard</button>
          </Link>
        </div>

        {/* ================= PROFILE HERO CARD ================= */}
        <div className="profile-hero-card">
          <div className="profile-hero-left">
            <div className="profile-large-avatar">{userInitials}</div>
            <div className="profile-hero-info">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <div className="profile-badge-row">
                <span className="badge-active">● Active Account</span>
                <span className="badge-tier">Tier: Standard Awareness</span>
              </div>
            </div>
          </div>

          <div className="profile-hero-actions">
            <Link to="/assessment">
              <button className="primary-btn">Take Assessment</button>
            </Link>
          </div>
        </div>

        {/* ================= MAIN PROFILE GRID ================= */}
        <div className="profile-main-grid">
          {/* Column 1: Personal Details Form */}
          <section className="dashboard-panel">
            <div className="panel-heading">
              <h2>Personal Information</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input-disabled"
                />
                <span className="input-helper">Email cannot be changed directly for security reasons.</span>
              </div>

              {saveMessage && <div className="form-message success-message">{saveMessage}</div>}

              <button type="submit" className="primary-btn" style={{ marginTop: '10px' }}>
                Save Changes
              </button>
            </form>
          </section>

          {/* Column 2: Security & Privacy Status */}
          <section className="dashboard-panel">
            <div className="panel-heading">
              <h2>Security Health & Preferences</h2>
            </div>

            <div className="security-item-row">
              <div>
                <strong>Two-Factor Authentication (2FA)</strong>
                <p>Enhance login security by requiring an extra verification method.</p>
              </div>
              <button
                type="button"
                className={twoFactorEnabled ? 'toggle-btn active' : 'toggle-btn'}
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              >
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="security-item-row">
              <div>
                <strong>Current Risk Score</strong>
                <p>Calculated from your latest cybersecurity risk assessment.</p>
              </div>
              <span className="score-pill orange-pill">68 / 100 (High Risk)</span>
            </div>

            <div className="security-item-row">
              <div>
                <strong>Password Hygiene</strong>
                <p>Last checked password rotation and strength status.</p>
              </div>
              <span className="score-pill green-pill">Strong</span>
            </div>

            <div className="security-item-row">
              <div>
                <strong>Active Sessions</strong>
                <p>You are currently logged into 1 active browser session.</p>
              </div>
              <button className="signout-btn" onClick={handleSignOut}>
                Log Out
              </button>
            </div>
          </section>
        </div>

        {/* ================= QUICK STATS / ACTIVITY ================= */}
        <div className="profile-quick-stats">
          <div className="profile-stat-box">
            <span>🛡️</span>
            <div>
              <p>Risk Level</p>
              <strong className="orange-text">High</strong>
            </div>
          </div>

          <div className="profile-stat-box">
            <span>📚</span>
            <div>
              <p>Awareness Progress</p>
              <strong>4 of 10 Modules</strong>
            </div>
          </div>

          <div className="profile-stat-box">
            <span>✅</span>
            <div>
              <p>Assessment Status</p>
              <strong>Completed</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
