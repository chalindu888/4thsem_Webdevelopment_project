import { Link } from 'react-router-dom'

function Awareness() {
  const modules = [
    {
      icon: '🎣',
      title: 'Phishing Awareness',
      level: 'Beginner',
    },
    {
      icon: '🔑',
      title: 'Password Security',
      level: 'Beginner',
    },
    {
      icon: '📱',
      title: 'Device Security',
      level: 'Intermediate',
    },
    {
      icon: '👥',
      title: 'Social Engineering',
      level: 'Intermediate',
    },
    {
      icon: '📡',
      title: 'Network Security',
      level: 'Intermediate',
    },
    {
      icon: '🤖',
      title: 'AI & Deepfake Threats',
      level: 'Advanced',
    },
  ]

  return (
    <div className="simple-page">
      <div className="simple-navbar">
        <Link to="/" className="simple-brand">
          🛡️ SecureAI
        </Link>

        <Link to="/dashboard">Dashboard</Link>
      </div>

      <main className="awareness-container">
        <div className="page-heading">
          <span className="section-tag">
            SECURITY AWARENESS
          </span>

          <h1>Learning Modules</h1>

          <p>
            Develop practical cybersecurity knowledge and safer digital
            behavior.
          </p>
        </div>

        <div className="module-grid">
          {modules.map((module) => (
            <div className="module-card" key={module.title}>
              <div className="module-icon">
                {module.icon}
              </div>

              <span className="module-level">
                {module.level}
              </span>

              <h3>{module.title}</h3>

              <p>
                Learn important security concepts, practical safety techniques
                and common cyber threats.
              </p>

              <button>
                Start Module →
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Awareness