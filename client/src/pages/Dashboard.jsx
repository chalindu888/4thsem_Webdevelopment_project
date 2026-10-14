import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="simple-page">
      <div className="simple-navbar">
        <Link to="/" className="simple-brand">
           SecureAI
        </Link>

        <div>
          <Link to="/assessment">Assessment</Link>
          <Link to="/awareness">Awareness</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </div>

      <main className="dashboard-container">
        <div className="dashboard-welcome">
          <div>
            <span className="section-tag">USER DASHBOARD</span>

            <h1>Welcome back </h1>

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

        <div className="dashboard-stat-grid">
          <div className="dashboard-stat-card">
            <span></span>

            <div>
              <p>Security Score</p>
              <strong>68%</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <span></span>

            <div>
              <p>Risk Level</p>
              <strong className="orange-text">High</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <span></span>

            <div>
              <p>Modules Completed</p>
              <strong>4 / 10</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <span></span>

            <div>
              <p>Quiz Average</p>
              <strong>82%</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-main-grid">
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

          <section className="dashboard-panel">
            <div className="panel-heading">
              <h2>Recommended Actions</h2>
            </div>

            <Recommendation
              icon=""
              title="Enable MFA"
              description="Enable multi-factor authentication on your important accounts."
            />

            <Recommendation
              icon=""
              title="Improve Password Security"
              description="Avoid password reuse across multiple online services."
            />

            <Recommendation
              icon=""
              title="Review Phishing Training"
              description="Complete the phishing awareness learning module."
            />
          </section>
        </div>
      </main>
    </div>
  )
}

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