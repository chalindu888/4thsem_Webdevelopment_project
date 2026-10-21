import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import Navbar from '../components/Navbar'
import modules from '../data/modules'
import '../App.css'
import './home.css'

const EASE = [0.22, 1, 0.36, 1]

const FEATURES = [
  { icon: 'clipboard', title: 'Risk assessment', file: 'assessment', to: '/assessment', text: 'A short questionnaire that scores your everyday security habits from 0 to 100.' },
  { icon: 'spark', title: 'Recommendations', file: 'advice', to: '/results', text: 'Advice ranked by the risk it removes, built from your weakest answers.' },
  { icon: 'book', title: 'Awareness training', file: 'modules', to: '/awareness', text: 'Six practical modules covering phishing, passwords, devices and more.' },
  { icon: 'chart', title: 'Risk dashboard', file: 'dashboard', to: '/dashboard', text: 'Track your score, weak areas and progress across every assessment.' },
  { icon: 'check', title: 'Progress tracking', file: 'progress', to: '/awareness', text: 'Mark modules complete and see what is left to learn at a glance.' },
  { icon: 'alert', title: 'Threat awareness', file: 'threats', to: '/awareness/phishing-awareness', text: 'Spot phishing, social engineering and AI-driven scams before they land.' },
]

const METRICS = [
  { value: modules.length, label: 'Learning modules' },
  { value: 2, label: 'Minutes to assess', suffix: ' min' },
  { value: 100, label: 'Point security score' },
  { value: 3, label: 'Risk areas analysed' },
]

const EXAMPLE_BARS = [
  { label: 'Password habits', value: 60, tone: 'warning' },
  { label: 'Phishing awareness', value: 90, tone: 'success' },
  { label: 'Two-factor authentication', value: 20, tone: 'danger' },
]

const STEPS = [
  { title: 'Create your account', text: 'Sign up in seconds and get a private security profile.' },
  { title: 'Take the assessment', text: 'Answer quick questions about passwords, phishing and 2FA.' },
  { title: 'See your risk', text: 'Get an overall score plus a breakdown for each area.' },
  { title: 'Improve and track', text: 'Follow your recommendations and finish the matching modules.' },
]

// Staggered entrance: replays every time the group re-enters the viewport.
const group = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } }
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: false, amount: 0.2 } }

function Home() {
  const reduceMotion = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })

  // Hero layers drift at different speeds as the page scrolls (parallax depth).
  const heroWindowY = useTransform(scrollY, [0, 700], [0, 90])
  const heroBadgeAY = useTransform(scrollY, [0, 700], [0, -70])
  const heroBadgeBY = useTransform(scrollY, [0, 700], [0, 150])
  const heroImageY = useTransform(scrollY, [0, 800], [0, 240])
  const heroImageScale = useTransform(scrollY, [0, 800], [1.05, 1.15])
  const parallax = (value) => (reduceMotion ? undefined : value)

  return (
    // reducedMotion="user": Framer Motion skips transform animations for reduced-motion users
    <MotionConfig reducedMotion="user">
    <div className="hm">
      <motion.div className="hm-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <Navbar />

      <main>
        {/* ================= HERO ================= */}
        <section className="hm-hero" id="home">
          {/* Background artwork: drifts slower than the page and zooms in slightly while scrolling */}
          <div className="hm-hero-media" aria-hidden="true">
            <motion.div className="hm-hero-image" style={{ y: parallax(heroImageY), scale: parallax(heroImageScale) }} />
            <div className="hm-hero-shade" />
          </div>

          <div className="hm-container hm-hero-grid">
            <motion.div className="hm-hero-copy" variants={group} initial="hidden" animate="show">
              <motion.p className="hm-eyebrow" variants={item}>
                <span className="hm-eyebrow-dot" />
                AI-powered cybersecurity awareness
              </motion.p>

              <motion.h1 variants={item}>
                Understand your <span className="hm-gradient-text">security risk</span> before attackers do
              </motion.h1>

              <motion.p className="hm-lead" variants={item}>
                Assess your habits, uncover weak spots and get personalised recommendations that make
                your digital life measurably safer.
              </motion.p>

              <motion.div className="hm-hero-actions" variants={item}>
                <Link to="/assessment" className="hm-btn hm-btn-primary">
                  Start free assessment <Icon name="arrow" />
                </Link>
                <Link to="/awareness" className="hm-btn hm-btn-ghost">Explore training</Link>
              </motion.div>

              <motion.dl className="hm-hero-trust" variants={item}>
                <div><dt>Modules</dt><dd>{modules.length}</dd></div>
                <div><dt>Score range</dt><dd>0–100</dd></div>
                <div><dt>Time to assess</dt><dd>~2 min</dd></div>
              </motion.dl>
            </motion.div>

            <div className="hm-hero-stage">
              <motion.div
                style={{ y: parallax(heroWindowY) }}
                initial={{ opacity: 0, y: 40, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
              >
                <AppWindow title="Security overview" url="secureai.app/dashboard" status="Live">
                  <div className="hm-preview-score">
                    <ScoreRing score={68} />
                    <div>
                      <span className="hm-muted-label">Current risk level</span>
                      <span className="hm-pill tone-warning">Medium risk</span>
                    </div>
                  </div>
                  <Bars />
                  <div className="hm-preview-tip">
                    <Icon name="spark" />
                    Enable 2FA on email and banking first
                  </div>
                </AppWindow>
              </motion.div>

              <motion.div className="hm-badge-slot hm-badge-a" style={{ y: parallax(heroBadgeAY) }}>
                <FloatingBadge tone="success" icon="check" title="Phishing link spotted" text="Sender domain mismatch" />
              </motion.div>
              <motion.div className="hm-badge-slot hm-badge-b" style={{ y: parallax(heroBadgeBY) }}>
                <FloatingBadge tone="danger" icon="alert" title="2FA not enabled" text="High priority fix" delay={1.2} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= METRICS ================= */}
        <section className="hm-metrics" aria-label="SecureAI at a glance">
          <div className="hm-container">
            <ScrollWindow speed={20}>
              <AppWindow title="Platform at a glance" compact>
                <motion.div className="hm-metrics-grid" variants={group} {...inView}>
                  {METRICS.map((metric) => (
                    <motion.div key={metric.label} className="hm-metric" variants={item}>
                      <strong><CountUp value={metric.value} />{metric.suffix}</strong>
                      <span>{metric.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </AppWindow>
            </ScrollWindow>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="hm-section" id="features">
          <div className="hm-container">
            <SectionHeading
              eyebrow="Platform"
              title={<>Everything you need to <span className="hm-gradient-text">stay secure</span></>}
              text="Assessment, recommendations and training working together, so every weakness you find comes with a way to fix it."
            />

            <motion.div className="hm-window-grid" variants={group} {...inView}>
              {FEATURES.map((feature, index) => (
                // Middle column drifts faster than the outer ones for depth.
                <ScrollWindow key={feature.title} speed={index % 3 === 1 ? 70 : 30}>
                  <motion.div variants={item} className="hm-fill">
                    <AppWindow title={feature.title} url={`${feature.file}.secureai`} interactive>
                      <span className="hm-icon"><Icon name={feature.icon} /></span>
                      <p className="hm-window-text">{feature.text}</p>
                      <Link to={feature.to} className="hm-card-link hm-stretched" aria-label={`Open ${feature.title}`}>
                        Open <Icon name="arrow" />
                      </Link>
                    </AppWindow>
                  </motion.div>
                </ScrollWindow>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= RISK VISUALIZER ================= */}
        <section className="hm-section hm-section-tint" id="assessment">
          <div className="hm-container">
            <SectionHeading
              eyebrow="Risk metrics"
              title={<>See your risk <span className="hm-gradient-text">at a glance</span></>}
              text="Every assessment produces an overall score and a score per area, so you know exactly where to focus first."
            />

            <div className="hm-visualizer-stage">
              <ScrollWindow speed={50}>
                <AppWindow title="Risk visualizer" url="secureai.app/results" status="Example" interactive>
                  <div className="hm-visualizer">
                    <div className="hm-visualizer-score">
                      <ScoreRing score={68} large />
                      <span className="hm-pill tone-warning">Medium risk</span>
                      <p>Overall security score</p>
                    </div>
                    <div className="hm-visualizer-detail">
                      <Bars />
                      <motion.ul className="hm-checks" variants={group} {...inView}>
                        {['Prioritised, linked recommendations', 'Score change between assessments', 'Matching training for every weak area'].map((text) => (
                          <motion.li key={text} variants={item}>
                            <span className="hm-check"><Icon name="check" /></span>
                            {text}
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  </div>
                </AppWindow>
              </ScrollWindow>

              <ScrollWindow speed={-25} className="hm-badge-slot hm-badge-c">
                <FloatingBadge tone="success" icon="chart" title="+8 pts" text="since last assessment" delay={0.6} />
              </ScrollWindow>
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="hm-section">
          <div className="hm-container">
            <SectionHeading
              eyebrow="How it works"
              title={<>Four steps to a <span className="hm-gradient-text">safer you</span></>}
              text="From sign-up to a measurably better score in one sitting."
            />

            <motion.ol className="hm-steps" variants={group} {...inView}>
              {STEPS.map((step, index) => (
                <motion.li key={step.title} className="hm-step" variants={item}>
                  <span className="hm-step-number">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </section>

        {/* ================= LEARNING HIGHLIGHTS ================= */}
        <section className="hm-section hm-section-tint" id="awareness">
          <div className="hm-container">
            <SectionHeading
              eyebrow="Awareness training"
              title={<>Learn the threats <span className="hm-gradient-text">that matter</span></>}
              text="Short, practical modules you can finish in a coffee break."
            />

            <div className="hm-learning">
              <ScrollWindow speed={40}>
                <AppWindow title="Live threat awareness" url="secureai.app/awareness" status="Playing">
                  <div className="hm-video">
                    <video autoPlay muted loop playsInline preload="metadata" aria-label="Security awareness animation">
                      <source src="/security-awareness.mp4" type="video/mp4" />
                    </video>
                  </div>
                </AppWindow>
              </ScrollWindow>

              <ScrollWindow speed={80}>
                <AppWindow title="Learning modules" url={`${modules.length} modules`} interactive>
                  <motion.ul className="hm-module-list" variants={group} {...inView}>
                    {modules.map((module) => (
                      <motion.li key={module.id} variants={item}>
                        <Link to={`/awareness/${module.id}`} className="hm-module-row">
                          <span className={`hm-level level-${module.level.toLowerCase()}`}>{module.level}</span>
                          <strong>{module.title}</strong>
                          <span className="hm-module-time">{module.duration}</span>
                          <Icon name="arrow" />
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </AppWindow>
              </ScrollWindow>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="hm-section hm-cta-wrap">
          <div className="hm-container">
            <ScrollWindow speed={30}>
              <div className="hm-cta">
                <motion.div
                  className="hm-cta-glow"
                  aria-hidden="true"
                  animate={reduceMotion ? undefined : { rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div className="hm-cta-copy" variants={group} {...inView}>
                  <motion.h2 variants={item}>How secure are your digital habits?</motion.h2>
                  <motion.p variants={item}>Take the free assessment and get your personal security score in about two minutes.</motion.p>
                  <motion.div variants={item}>
                    <Link to="/assessment" className="hm-btn hm-btn-light">Get started <Icon name="arrow" /></Link>
                  </motion.div>
                </motion.div>
              </div>
            </ScrollWindow>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="hm-footer" id="about">
        <div className="hm-container hm-footer-grid">
          <div className="hm-footer-brand">
            <div className="hm-brand">
              <img src="/security.jpg" alt="" />
              <strong>SecureAI</strong>
            </div>
            <p>AI security awareness and risk assessment, designed to build safer digital habits.</p>
          </div>

          <nav className="hm-footer-links" aria-label="Footer">
            <div>
              <strong>Platform</strong>
              <Link to="/assessment">Assessment</Link>
              <Link to="/awareness">Training</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
            <div>
              <strong>Explore</strong>
              <a href="#features">Features</a>
              <a href="#assessment">Risk metrics</a>
              <a href="#awareness">Modules</a>
            </div>
          </nav>
        </div>

        <div className="hm-container hm-footer-bottom">
          <p>© 2026 SecureAI — AI Security Awareness &amp; Risk Assessment System</p>
        </div>
      </footer>
    </div>
    </MotionConfig>
  )
}

/* =====================================================
   MOTION BUILDING BLOCKS
===================================================== */

// Moves along Y at its own speed while scrolling through the viewport, scales into view and fades.
function ScrollWindow({ speed = 40, className, children }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.8, 1], [0.92, 1, 1, 0.97])
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.85, 1], [0, 1, 1, 0.55])

  return (
    <motion.div ref={ref} className={className} style={reduceMotion ? undefined : { y, scale, opacity }}>
      {children}
    </motion.div>
  )
}

// Translucent "app window" with a title bar. `interactive` adds the 3D mouse tilt + spotlight.
function AppWindow({ title, url, status, compact, interactive, children }) {
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)
  const spring = { stiffness: 160, damping: 18 }
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [6, -6]), spring)
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-6, 6]), spring)
  const spotX = useTransform(pointerX, (v) => `${v * 100}%`)
  const spotY = useTransform(pointerY, (v) => `${v * 100}%`)
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${spotX} ${spotY}, rgba(229, 32, 47, 0.08), transparent 70%)`
  const tilt = interactive && !reduceMotion

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width)
    pointerY.set((event.clientY - rect.top) / rect.height)
  }
  const handleLeave = () => {
    pointerX.set(0.5)
    pointerY.set(0.5)
  }

  return (
    <motion.div
      className={`hm-window${compact ? ' is-compact' : ''}${interactive ? ' is-interactive' : ''}`}
      style={tilt ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      onPointerMove={tilt ? handleMove : undefined}
      onPointerLeave={tilt ? handleLeave : undefined}
      whileHover={tilt ? { scale: 1.01, rotate: -1 } : undefined}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {tilt && <motion.div className="hm-window-spotlight" style={{ background: spotlight }} aria-hidden="true" />}

      <div className="hm-window-bar">
        <span className="hm-dots" aria-hidden="true"><span /><span /><span /></span>
        <span className="hm-window-title">{title}</span>
        {url && <span className="hm-window-url">{url}</span>}
        {status && <span className="hm-window-status"><span />{status}</span>}
      </div>

      <div className="hm-window-body">{children}</div>
    </motion.div>
  )
}

function FloatingBadge({ tone, icon, title, text, delay = 0 }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className="hm-badge"
      animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <span className={`hm-badge-icon tone-${tone}`}><Icon name={icon} /></span>
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </motion.div>
  )
}

function SectionHeading({ eyebrow, title, text }) {
  return (
    <motion.header className="hm-heading" variants={group} {...inView}>
      <motion.p className="hm-eyebrow" variants={item}>{eyebrow}</motion.p>
      <motion.h2 variants={item}>{title}</motion.h2>
      <motion.p className="hm-sub" variants={item}>{text}</motion.p>
    </motion.header>
  )
}

function Bars() {
  return (
    <ul className="hm-bars">
      {EXAMPLE_BARS.map((bar, index) => (
        <li key={bar.label}>
          <div><span>{bar.label}</span><strong>{bar.value}%</strong></div>
          <span className={`hm-bar tone-${bar.tone}`}>
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: `${bar.value}%` }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.25 + index * 0.14 }}
            />
          </span>
        </li>
      ))}
    </ul>
  )
}

function ScoreRing({ score, large }) {
  const radius = 34
  const circumference = 2 * Math.PI * radius
  return (
    <div className={`hm-ring${large ? ' is-large' : ''}`} role="img" aria-label={`Example security score ${score} out of 100`}>
      <svg viewBox="0 0 80 80">
        <circle className="hm-ring-track" cx="40" cy="40" r={radius} />
        <motion.circle
          className="hm-ring-value"
          cx="40"
          cy="40"
          r={radius}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference * (1 - score / 100) }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
        />
      </svg>
      <strong><CountUp value={score} /></strong>
    </div>
  )
}

// Counts up from 0 each time the number scrolls into view.
function CountUp({ value }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const visible = useInView(ref, { amount: 0.6 })
  const count = useMotionValue(reduceMotion ? value : 0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    if (reduceMotion) return
    if (!visible) {
      count.set(0)
      return
    }
    const controls = animate(count, value, { duration: 1.2, ease: EASE })
    return () => controls.stop()
  }, [visible, value, count, reduceMotion])

  return <motion.span ref={ref}>{rounded}</motion.span>
}

const ICON_PATHS = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  check: 'M20 6 9 17l-5-5',
  alert: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  clipboard: 'M9 2h6v4H9zM16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 12h6M9 16h4',
  spark: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
  chart: 'M3 3v18h18M7 15l4-4 3 3 5-6',
}

function Icon({ name }) {
  return (
    <svg className="hm-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

export default Home
