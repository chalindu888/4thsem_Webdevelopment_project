import { Link } from 'react-router-dom'
import modules from '../data/modules'
import Navbar from '../components/Navbar'

function Awareness() {
  return (
    <div className="simple-page">
      <Navbar />

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
            <div className="module-card" key={module.id}>
              <div className="module-icon">
                {module.icon}
              </div>

              <span className="module-level">
                {module.level}
              </span>

              <h3>{module.title}</h3>

              <p>{module.summary}</p>

              <Link to={`/awareness/${module.id}`} className="module-start-link">
                Start Module →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Awareness