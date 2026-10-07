import { Link } from 'react-router-dom'

function Admin() {
  return (
    <div className="simple-page">
      <div className="simple-navbar">
        <Link to="/" className="simple-brand">
          🛡️ SecureAI Admin
        </Link>

        <Link to="/">Logout</Link>
      </div>

      <main className="placeholder-page">
        <div className="placeholder-icon">
          ⚙️
        </div>

        <span className="section-tag">
          ADMINISTRATION
        </span>

        <h1>Admin Dashboard</h1>

        <p>
          Administrators will manage users, assessment questions, learning
          modules and platform statistics here.
        </p>
      </main>
    </div>
  )
}

export default Admin