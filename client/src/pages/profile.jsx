import { Link } from 'react-router-dom'

function Profile() {
  return (
    <div className="simple-page">
      <div className="simple-navbar">
        <Link to="/" className="simple-brand">
          🛡️ SecureAI
        </Link>

        <Link to="/dashboard">Dashboard</Link>
      </div>

      <main className="placeholder-page">
        <div className="placeholder-icon">
          👤
        </div>

        <span className="section-tag">
          USER PROFILE
        </span>

        <h1>My Profile</h1>

        <p>
          User account information, password settings and security preferences
          will be managed here.
        </p>
      </main>
    </div>
  )
}

export default Profile