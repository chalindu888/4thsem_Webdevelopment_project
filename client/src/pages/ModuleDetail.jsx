import { Link, useParams } from 'react-router-dom'
import modules, { getModuleById } from '../data/modules'

function ModuleDetail() {
  const { moduleId } = useParams()
  const module = getModuleById(moduleId)

  if (!module) {
    return (
      <div className="simple-page">
        <ModuleNavbar />

        <main className="placeholder-page">
          <span className="section-tag">MODULE NOT FOUND</span>

          <h1>We couldn't find that module</h1>

          <p>The learning module you're looking for doesn't exist or may have been moved.</p>

          <Link to="/awareness">
            <button className="primary-btn">← Back to Modules</button>
          </Link>
        </main>
      </div>
    )
  }

  const index = modules.indexOf(module)
  const previous = modules[index - 1]
  const next = modules[index + 1]

  return (
    <div className="simple-page">
      <ModuleNavbar />

      <main className="module-detail">
        <Link to="/awareness" className="module-back-link">
          ← Back to Modules
        </Link>

        <header className="module-detail-header">
          <div className="module-icon">{module.icon}</div>

          <div>
            <div className="module-detail-meta">
              <span className="module-level">{module.level}</span>
              <span>Module {index + 1} of {modules.length}</span>
              <span>{module.duration}</span>
            </div>

            <h1>{module.title}</h1>

            <p>{module.summary}</p>
          </div>
        </header>

        <section className="module-detail-section">
          <h2>What you'll learn</h2>

          {module.lessons.map((lesson, lessonIndex) => (
            <article className="module-lesson" key={lesson.heading}>
              <span className="module-lesson-number">{lessonIndex + 1}</span>

              <div>
                <h3>{lesson.heading}</h3>
                <p>{lesson.body}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="module-detail-section module-tips">
          <h2>Security tips</h2>

          <ul>
            {module.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <nav className="module-pagination">
          {previous ? (
            <Link to={`/awareness/${previous.id}`}>← {previous.title}</Link>
          ) : (
            <span />
          )}

          {next ? (
            <Link to={`/awareness/${next.id}`}>{next.title} →</Link>
          ) : (
            <Link to="/assessment">Take the Assessment →</Link>
          )}
        </nav>
      </main>
    </div>
  )
}

function ModuleNavbar() {
  return (
    <div className="simple-navbar">
      <Link to="/" className="simple-brand">
         SecureAI
      </Link>

      <div>
        <Link to="/awareness">Modules</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </div>
  )
}

export default ModuleDetail
