import { Link } from 'react-router-dom'

function Results() {
  return (
    <div className="simple-page">
      <div className="simple-navbar">
        <Link to="/" className="simple-brand">
          🛡️ SecureAI
        </Link>

        <Link to="/dashboard">Dashboard</Link>
      </div>

      <main className="placeholder-page">
        <div className="placeholder-icon">📊</div>

        <span className="section-tag">ASSESSMENT RESULTS</span>

        <h1>Your Security Risk Report</h1>

        <p>
          Your complete security score, category breakdown and AI
          recommendations will appear here.
        </p>

        <div className="result-preview">
          <span>Security Score</span>

          <strong>68 / 100</strong>

          <div className="result-risk">
            HIGH RISK
          </div>
        </div>

        <Link to="/dashboard">
          <button className="primary-btn">
            Return to Dashboard
          </button>
        </Link>
      </main>
    </div>
  )
}

export default Results