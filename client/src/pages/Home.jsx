import { useEffect, useRef, useState } from 'react'
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
import ScrollReactive from '../components/ScrollReactive'
import modules from '../data/modules'
import '../App.css'
import './home.css'

const EASE = [0.22, 1, 0.36, 1]

const FEATURES = [
  { icon: 'clipboard', title: 'Risk check', to: '/assessment', text: 'Score your security habits in 2 minutes.' },
  { icon: 'spark', title: 'Recommendations', to: '/results', text: 'See what to fix first.' },
  { icon: 'book', title: 'Lessons', to: '/awareness', text: 'Six short lessons on real threats.' },
  { icon: 'chart', title: 'Dashboard', to: '/dashboard', text: 'Track your score over time.' },
  { icon: 'check', title: 'Progress', to: '/awareness', text: 'See what you have finished.' },
  { icon: 'alert', title: 'Threats', to: '/awareness/phishing-awareness', text: 'Spot phishing and scams early.' },
]

const METRICS = [
  { value: modules.length, label: 'Lessons' },
  { value: 2, label: 'To check', suffix: ' min' },
  { value: 100, label: 'Max score' },
  { value: 3, label: 'Risk areas' },
]

const EXAMPLE_BARS = [
  { label: 'Passwords', value: 60, tone: 'warning' },
  { label: 'Phishing', value: 90, tone: 'success' },
  { label: '2FA', value: 20, tone: 'danger' },
]

const STEPS = [
  { title: 'Sign up', text: 'It takes seconds.' },
  { title: 'Take the check', text: 'Answer 3 quick questions.' },
  { title: 'See your score', text: 'Find your weak spots.' },
  { title: 'Improve', text: 'Follow the steps and lessons.' },
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
  const heroImageY = useTransform(scrollY, [0, 800], [0, 240])
  const heroImageScale = useTransform(scrollY, [0, 800], [1.05, 1.15])
  // Scrolling "dives" into the hero: it zooms toward the viewer and fades away.
  const heroDiveScale = useTransform(scrollY, [0, 650], [1, 1.18])
  const heroDiveOpacity = useTransform(scrollY, [0, 550], [1, 0])
  const cueOpacity = useTransform(scrollY, [0, 200], [1, 0])
  const parallax = (value) => (reduceMotion ? undefined : value)

  return (
    // reducedMotion="user": Framer Motion skips transform animations for reduced-motion users
    <MotionConfig reducedMotion="user">
    <div className="hm">
      <motion.div className="hm-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <DepthNav progress={progress} />
      <Navbar />

      <main>
        {/* ================= HERO ================= */}
        <section className="hm-hero" id="home">
          {/* Background artwork: drifts slower than the page and zooms in slightly while scrolling */}
          <div className="hm-hero-media" aria-hidden="true">
            <motion.div className="hm-hero-image" style={{ y: parallax(heroImageY), scale: parallax(heroImageScale) }} />
            <div className="hm-hero-shade" />
          </div>

          <motion.div className="hm-hero-dive" style={{ scale: parallax(heroDiveScale), opacity: parallax(heroDiveOpacity) }}>
          <div className="hm-container hm-hero-grid">
            <motion.div className="hm-hero-copy" variants={group} initial="hidden" animate="show">
              <motion.p className="hm-eyebrow" variants={item}>
                <span className="hm-eyebrow-dot" />
                Cybersecurity made simple
              </motion.p>

              <motion.h1 variants={item}>
                Know your <span className="hm-gradient-text">security risk</span> in 2 minutes
              </motion.h1>

              <motion.p className="hm-lead" variants={item}>
                Take a quick check, see your weak spots and fix them step by step.
              </motion.p>

              <motion.div className="hm-hero-actions" variants={item}>
                <Link to="/assessment" className="hm-btn hm-btn-primary">
                  Start free check <Icon name="arrow" />
                </Link>
                <Link to="/awareness" className="hm-btn hm-btn-ghost">Browse lessons</Link>
              </motion.div>

              <motion.dl className="hm-hero-trust" variants={item}>
                <div><dt>Lessons</dt><dd>{modules.length}</dd></div>
                <div><dt>Score</dt><dd>0–100</dd></div>
                <div><dt>Time</dt><dd>~2 min</dd></div>
              </motion.dl>
            </motion.div>
          </div>
          </motion.div>

          <motion.a href="#features" className="hm-scroll-cue" style={{ opacity: parallax(cueOpacity) }}>
            <span className="hm-mouse" aria-hidden="true"><span /></span>
            Scroll to dive in
          </motion.a>
        </section>

        {/* ================= METRICS ================= */}
        <section className="hm-metrics" aria-label="SecureAI at a glance">
          <DepthLayer>
          <div className="hm-container">
            <ScrollWindow speed={20}>
              <AppWindow title="At a glance" compact>
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
          </DepthLayer>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="hm-section" id="features">
          <DepthLayer>
          <div className="hm-container">
            <SectionHeading
              eyebrow="Platform"
              title={<>Everything in <span className="hm-gradient-text">one place</span></>}
              text="Check, learn and improve — all in one app."
            />

            <motion.div className="hm-window-grid" variants={group} {...inView}>
              {FEATURES.map((feature, index) => (
                // Middle column drifts faster than the outer ones for depth.
                <ScrollWindow key={feature.title} speed={index % 3 === 1 ? 70 : 30}>
                  <motion.div variants={item} className="hm-fill">
                    <AppWindow title={feature.title} interactive>
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
          </DepthLayer>
        </section>

        {/* ================= RISK VISUALIZER ================= */}
        <section className="hm-section hm-section-tint" id="assessment">
          <DepthLayer>
          <div className="hm-container">
            <SectionHeading
              eyebrow="Your score"
              title={<>See your risk <span className="hm-gradient-text">at a glance</span></>}
              text="One score, plus a breakdown for each area."
            />

            <div className="hm-visualizer-stage">
              <ScrollWindow speed={50}>
                <AppWindow title="Your results" status="Example" interactive>
                  <div className="hm-visualizer">
                    <div className="hm-visualizer-score">
                      <ScoreRing score={68} large />
                      <span className="hm-pill tone-warning">Medium risk</span>
                      <p>Your score</p>
                    </div>
                    <div className="hm-visualizer-detail">
                      <Bars />
                      <motion.ul className="hm-checks" variants={group} {...inView}>
                        {['Clear next steps', 'Track your progress', 'A lesson for each weak spot'].map((text) => (
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
                <FloatingBadge tone="success" icon="chart" title="+8 pts" text="this week" delay={0.6} />
              </ScrollWindow>
            </div>
          </div>
          </DepthLayer>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="hm-section" id="steps">
          <DepthLayer>
          <div className="hm-container">
            <SectionHeading
              eyebrow="How it works"
              title={<>Four <span className="hm-gradient-text">simple steps</span></>}
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
          </DepthLayer>
        </section>

        {/* ================= LEARNING HIGHLIGHTS ================= */}
        <section className="hm-section hm-section-tint" id="awareness">
          <DepthLayer>
          <div className="hm-container">
            <SectionHeading
              eyebrow="Lessons"
              title={<>Learn the threats <span className="hm-gradient-text">that matter</span></>}
              text="Short lessons you can finish in minutes."
            />

            <div className="hm-learning">
              <ScrollWindow speed={40}>
                <AppWindow title="Watch" status="Playing">
                  <div className="hm-video">
                    <video autoPlay muted loop playsInline preload="metadata" aria-label="Security awareness animation">
                      <source src="/security-awareness.mp4" type="video/mp4" />
                    </video>
                  </div>
                </AppWindow>
              </ScrollWindow>

              <ScrollWindow speed={80}>
                <AppWindow title={`All lessons (${modules.length})`} interactive>
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
          </DepthLayer>
        </section>

        {/* ================= CTA ================= */}
        <section className="hm-section hm-cta-wrap" id="start">
          <DepthLayer>
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
                  <motion.h2 variants={item}>How secure are you?</motion.h2>
                  <motion.p variants={item}>Find out in 2 minutes. It is free.</motion.p>
                  <motion.div variants={item}>
                    <Link to="/assessment" className="hm-btn hm-btn-light">Get started <Icon name="arrow" /></Link>
                  </motion.div>
                </motion.div>
              </div>
            </ScrollWindow>
          </div>
          </DepthLayer>
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
            <p>Simple security checks and lessons.</p>
          </div>

          <nav className="hm-footer-links" aria-label="Footer">
            <div>
              <strong>Platform</strong>
              <Link to="/assessment">Assessment</Link>
              <Link to="/awareness">Lessons</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
            <div>
              <strong>Explore</strong>
              <a href="#features">Features</a>
              <a href="#assessment">Your score</a>
              <a href="#awareness">Lessons</a>
            </div>
          </nav>
        </div>

        <div className="hm-container hm-footer-bottom">
          <p>© 2026 SecureAI</p>
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
// Parallax at its own speed, flips into place in 3D, and leans with the scroll wheel.
function ScrollWindow({ speed = 40, className, children }) {
  return (
    <ScrollReactive reveal speed={speed} className={className}>
      {children}
    </ScrollReactive>
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

// Sections come up from the distance, sharpen in the middle of the screen,
// then move past the viewer as the next one arrives — scrolling feels like moving deeper.
function DepthLayer({ children }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.68, 1], [0.86, 1, 1, 1.12])
  const opacity = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [0.25, 1, 1, 0])

  return (
    <motion.div ref={ref} style={reduceMotion ? undefined : { scale, opacity, transformOrigin: 'center 40%' }}>
      {children}
    </motion.div>
  )
}

const DEPTH_STOPS = [
  { id: 'home', label: 'Start' },
  { id: 'features', label: 'Features' },
  { id: 'assessment', label: 'Your score' },
  { id: 'steps', label: 'How it works' },
  { id: 'awareness', label: 'Lessons' },
  { id: 'start', label: 'Get started' },
]

// Fixed rail showing how deep into the page you are; click a stop to glide there.
function DepthNav({ progress }) {
  const [active, setActive] = useState(DEPTH_STOPS[0].id)

  useEffect(() => {
    const sections = DEPTH_STOPS.map((stop) => document.getElementById(stop.id)).filter(Boolean)
    // A section is "current" while it crosses the middle band of the screen.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const index = DEPTH_STOPS.findIndex((stop) => stop.id === active)

  return (
    <nav className="hm-depth" aria-label="Page sections">
      <span className="hm-depth-count">
        {String(index + 1).padStart(2, '0')}
        <span> / {String(DEPTH_STOPS.length).padStart(2, '0')}</span>
      </span>
      <div className="hm-depth-rail">
        <motion.span className="hm-depth-fill" style={{ scaleY: progress }} aria-hidden="true" />
        {DEPTH_STOPS.map((stop) => (
          <a
            key={stop.id}
            href={`#${stop.id}`}
            className={stop.id === active ? 'hm-depth-stop is-active' : 'hm-depth-stop'}
            aria-current={stop.id === active ? 'location' : undefined}
          >
            <span className="hm-depth-label">{stop.label}</span>
            <span className="hm-depth-dot" aria-hidden="true" />
          </a>
        ))}
      </div>
    </nav>
  )
}

function SectionHeading({ eyebrow, title, text }) {
  return (
    <motion.header className="hm-heading" variants={group} {...inView}>
      <motion.p className="hm-eyebrow" variants={item}>{eyebrow}</motion.p>
      <motion.h2 variants={item}>{title}</motion.h2>
      {text && <motion.p className="hm-sub" variants={item}>{text}</motion.p>}
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
