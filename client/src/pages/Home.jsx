import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import '../App.css'

function Home() {
  return (
    <div className="app">
      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="container navbar-content">
          <div className="brand">
            <img className="brand-image" src="/security.jpg" alt="" />

            <div>
              <h2>SecureAI</h2>
              <span>Security Awareness Platform</span>
            </div>
          </div>

          <nav className="nav-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#assessment">Assessment</a>
            <a href="#awareness">Awareness</a>
            <a href="#about">About</a>
          </nav>

          <div className="nav-actions">
            <Link to="/login" className="button-link">
              <button className="login-btn">Login</button>
            </Link>

            <Link to="/register" className="button-link">
              <button className="primary-btn">Get Started</button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ================= HERO ================= */}
        <section className="hero-section" id="home">
          <div className="hero-animation">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={heroImage}
              aria-label="Animated SecureAI threat awareness visual"
            >
              <source src="/security-awareness.mp4" type="video/mp4" />
            </video>
            <span className="hero-animation-label">LIVE THREAT AWARENESS</span>
          </div>

          <div className="container hero-container">
            <div className="hero-content">
              <div className="hero-badge">
                <span>●</span>
                AI-Powered Cybersecurity Awareness
              </div>

              <h1>
                Understand Your
                <span> Security Risk</span>
                <br />
                Before Attackers Do
              </h1>

              <p className="hero-description">
                Assess your cybersecurity habits, identify vulnerabilities and
                receive personalized AI-powered recommendations to improve your
                digital security awareness.
              </p>

              <div className="hero-buttons">
                <Link to="/assessment" className="button-link">
                  <button className="primary-btn large-btn">
                    Start Free Assessment
                    <span>→</span>
                  </button>
                </Link>

                <Link to="/awareness" className="button-link">
                  <button className="secondary-btn large-btn">
                    Explore Awareness Training
                  </button>
                </Link>
              </div>

              <div className="hero-trust">
                <div>
                  <strong>10+</strong>
                  <span>Security Categories</span>
                </div>

                <div>
                  <strong>AI</strong>
                  <span>Recommendations</span>
                </div>

                <div>
                  <strong>100%</strong>
                  <span>Personalized</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= RISK SCORE ================= */}
        <section className="risk-score-section" aria-labelledby="risk-score-title">
          <div className="container risk-score-container">
            <div className="risk-score-heading">
              <span className="section-tag">SECURITY ASSESSMENT</span>
              <h2 id="risk-score-title">
                Understand Your Current
                <span> Security Risk</span>
              </h2>
              <p>
                Review an example risk profile and discover the areas that need
                attention before they become security problems.
              </p>
            </div>

            <div className="security-card">
              <div className="security-card-header">
                <div>
                  <p>Security Assessment</p>
                  <h3>Your Risk Score</h3>
                </div>
                <div className="status-dot"></div>
              </div>

              <div className="score-wrapper">
                <div className="score-circle">
                  <div className="score-inner">
                    <strong>68</strong>
                    <span>/ 100</span>
                  </div>
                </div>

                <div className="risk-label">
                  <span>Current Risk Level</span>
                  <strong>HIGH RISK</strong>
                </div>
              </div>

              <div className="category-list">
                <RiskBar title="Password Security" value="72%" percentage={72} />
                <RiskBar title="Phishing Awareness" value="55%" percentage={55} />
                <RiskBar title="Device Security" value="81%" percentage={81} />
              </div>

              <div className="recommendation-box">
                <span className="recommendation-icon"></span>
                <div>
                  <strong>AI Recommendation</strong>
                  <p>
                    Enable multi-factor authentication on your important
                    accounts to reduce account compromise risks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="features-section" id="features">
          <div className="container">
            <div className="section-heading">
              <span className="section-tag">PLATFORM FEATURES</span>

              <h2>
                Everything You Need to Improve Your
                <span> Cybersecurity Awareness</span>
              </h2>

              <p>
                Our platform combines security assessments, awareness training
                and intelligent recommendations in one place.
              </p>
            </div>

            <div className="feature-grid">
              <FeatureCard
                icon=""
                title="Security Risk Assessment"
                description="Complete an intelligent questionnaire that evaluates your security habits across multiple cybersecurity categories."
              />

              <FeatureCard
                icon=""
                title="AI Recommendations"
                description="Receive personalized security recommendations based on the weaknesses detected during your assessment."
              />

              <FeatureCard
                icon=""
                title="Awareness Training"
                description="Learn important cybersecurity concepts through structured security awareness learning modules."
              />

              <FeatureCard
                icon=""
                title="Risk Dashboard"
                description="Monitor your security score, assessment history, weak areas and improvement progress."
              />

              <FeatureCard
                icon=""
                title="Knowledge Quizzes"
                description="Test your knowledge after completing security awareness modules and monitor your learning progress."
              />

              <FeatureCard
                icon=""
                title="Threat Awareness"
                description="Improve your ability to recognize phishing, social engineering, malware and modern AI-based threats."
              />
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="process-section" id="assessment">
          <div className="container">
            <div className="section-heading">
              <span className="section-tag">HOW IT WORKS</span>

              <h2>
                Improve Your Security in
                <span> Four Simple Steps</span>
              </h2>

              <p>
                Understand your vulnerabilities and follow personalized
                recommendations to improve your cybersecurity behavior.
              </p>
            </div>

            <div className="process-grid">
              <ProcessCard
                number="01"
                icon=""
                title="Create Account"
                description="Register securely and create your personal cybersecurity awareness profile."
              />

              <ProcessCard
                number="02"
                icon=""
                title="Take Assessment"
                description="Answer cybersecurity questions covering your everyday digital security practices."
              />

              <ProcessCard
                number="03"
                icon=""
                title="Analyze Risk"
                description="The system calculates your overall and category-specific cybersecurity risk."
              />

              <ProcessCard
                number="04"
                icon=""
                title="Improve Security"
                description="Follow personalized AI recommendations and complete awareness training modules."
              />
            </div>
          </div>
        </section>

        {/* ================= SECURITY CATEGORIES ================= */}
        <section className="categories-section" id="awareness">
          <div className="container categories-container">
            <div className="categories-content">
              <span className="section-tag">SECURITY COVERAGE</span>

              <h2>
                Assess Your Risk Across Important
                <span> Security Areas</span>
              </h2>

              <p>
                SecureAI analyzes different cybersecurity behaviors to identify
                areas where your personal security practices can be improved.
              </p>

              <div className="category-items">
                <SecurityCategory
                  icon=""
                  title="Password Security"
                  text="Password strength, reuse and password management."
                />

                <SecurityCategory
                  icon=""
                  title="Phishing Awareness"
                  text="Email, message and website phishing detection."
                />

                <SecurityCategory
                  icon=""
                  title="Device Security"
                  text="Device updates, locking and application security."
                />

                <SecurityCategory
                  icon=""
                  title="Network Security"
                  text="Wi-Fi safety and secure network practices."
                />

                <SecurityCategory
                  icon=""
                  title="Social Engineering"
                  text="Protection from manipulation and impersonation."
                />

                <SecurityCategory
                  icon=""
                  title="AI & Deepfake Threats"
                  text="Awareness of emerging AI-generated cyber threats."
                />
              </div>
            </div>

            {/* ================= RISK OVERVIEW ================= */}
            <div className="risk-summary-card">
              <div className="summary-header">
                <span>Security Risk Overview</span>
                <span className="live-label">● LIVE</span>
              </div>

              <div className="summary-score">
                <span>Overall Security Score</span>

                <strong>68%</strong>

                <div className="summary-progress">
                  <div style={{ width: '68%' }}></div>
                </div>
              </div>

              <div className="summary-list">
                <SummaryItem
                  name="Password Security"
                  value="High Risk"
                  className="danger"
                />

                <SummaryItem
                  name="Phishing Awareness"
                  value="Medium"
                  className="warning"
                />

                <SummaryItem
                  name="Network Security"
                  value="Low Risk"
                  className="success"
                />

                <SummaryItem
                  name="Device Security"
                  value="Medium"
                  className="warning"
                />
              </div>

              <div className="summary-tip">
                <span></span>

                <div>
                  <strong>Priority Improvement</strong>

                  <p>
                    Strengthen password security and enable MFA for your
                    important accounts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="cta-section">
          <div className="container cta-container">
            <div>
              <img
                src="/security.jpg"
                alt="Security Illustration"
                className="cta-security-img"
              />

              <h2>How Secure Are Your Digital Habits?</h2>

              <p>
                Complete your security risk assessment and discover which areas
                of your cybersecurity behavior need improvement.
              </p>

              <Link to="/assessment" className="button-link">
                <button className="cta-button">
                  Start Your Security Assessment
                  <span>→</span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="footer" id="about">
        <div className="container footer-content">
          <div className="footer-brand">
            <div className="brand">
              <img className="brand-image" src="/security.jpg" alt="" />

              <div>
                <h2>SecureAI</h2>
                <span>Security Awareness Platform</span>
              </div>
            </div>

            <p>
              AI Security Awareness & Risk Assessment System designed to improve
              cybersecurity knowledge and safer digital behavior.
            </p>
          </div>

          <div className="footer-links">
            <div>
              <strong>Platform</strong>

              <a href="#assessment">Assessment</a>

              <a href="#awareness">Awareness</a>

              <a href="#features">Features</a>
            </div>

            <div>
              <strong>Security</strong>

              <a href="#home">Privacy</a>

              <a href="#home">Security</a>

              <a href="#home">Terms</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <p>
              © 2026 SecureAI — AI Security Awareness & Risk Assessment System
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* =====================================================
   REUSABLE COMPONENTS
===================================================== */

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{description}</p>

      <button>
        Learn More <span>→</span>
      </button>
    </div>
  )
}

function ProcessCard({ number, icon, title, description }) {
  return (
    <div className="process-card">
      <span className="process-number">{number}</span>

      <div className="process-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  )
}

function RiskBar({ title, value, percentage }) {
  return (
    <div className="risk-item">
      <div>
        <span>{title}</span>

        <strong>{value}</strong>
      </div>

      <div className="risk-progress">
        <div style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}

function SecurityCategory({ icon, title, text }) {
  return (
    <div className="security-category">
      <div className="security-category-icon">
        {icon}
      </div>

      <div>
        <h3>{title}</h3>

        <p>{text}</p>
      </div>
    </div>
  )
}

function SummaryItem({ name, value, className }) {
  return (
    <div className="summary-item">
      <span>{name}</span>

      <strong className={className}>
        {value}
      </strong>
    </div>
  )
}

export default Home