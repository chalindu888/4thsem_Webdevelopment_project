import { useEffect, useRef } from 'react'
import {
  motion,
  motionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'

// How hard the page has to be scrolled (px/s) for the full lean.
const MAX_VELOCITY = 2400

// Shared wheel "push": each wheel notch nudges it, and it drops back to 0 shortly after
// the wheel stops. Lets short pages (that can barely scroll) still react to the wheel.
const wheelPush = motionValue(0)
let wheelListening = false

function listenToWheel() {
  if (wheelListening) return
  wheelListening = true
  let release
  window.addEventListener(
    'wheel',
    (event) => {
      const next = wheelPush.get() * 0.6 + event.deltaY * 10
      wheelPush.set(Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, next)))
      clearTimeout(release)
      release = setTimeout(() => wheelPush.set(0), 120)
    },
    { passive: true },
  )
}

/*
  Wraps a section so it reacts to the mouse wheel:
  - lean:   tilts/skews in the scroll direction, proportional to scroll speed,
            and springs back when scrolling stops (scroll up → leans the other way)
  - reveal: flips up into place in 3D while entering the viewport, tilts away while
            leaving, and is slightly out of focus at both ends
*/
function ScrollReactive({ children, className, lean = 1, reveal = false, speed = 0 }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!reduceMotion) listenToWheel()
  }, [reduceMotion])

  const { scrollY } = useScroll()
  const scrollSpeed = useVelocity(scrollY)
  // Whichever is stronger: real scroll speed, or the wheel push (for pages that can't scroll far).
  const drive = useTransform([scrollSpeed, wheelPush], ([speedValue, push]) =>
    Math.abs(speedValue) >= Math.abs(push) ? speedValue : push,
  )
  const velocity = useSpring(drive, { stiffness: 200, damping: 30 })
  const leanRotate = useTransform(velocity, [-MAX_VELOCITY, 0, MAX_VELOCITY], [-7 * lean, 0, 7 * lean], { clamp: true })
  const skewY = useTransform(velocity, [-MAX_VELOCITY, 0, MAX_VELOCITY], [2 * lean, 0, -2 * lean], { clamp: true })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const enterRotate = useTransform(scrollYProgress, [0, 0.3, 0.72, 1], reveal ? [18, 0, 0, -12] : [0, 0, 0, 0])
  const rotateX = useTransform([enterRotate, leanRotate], ([enter, leaning]) => enter + leaning)
  const scale = useTransform(scrollYProgress, [0, 0.28, 0.8, 1], reveal ? [0.9, 1, 1, 0.95] : [1, 1, 1, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.16, 0.86, 1], reveal ? [0, 1, 1, 0.45] : [1, 1, 1, 1])
  const blurAmount = useTransform(scrollYProgress, [0, 0.22, 0.8, 1], reveal ? [6, 0, 0, 3] : [0, 0, 0, 0])
  // Any `filter` (even blur(0)) stops descendants' backdrop-filter glass from seeing the page,
  // so only apply it while there is actual blur.
  const filter = useTransform(blurAmount, (amount) => (amount < 0.05 ? 'none' : `blur(${amount.toFixed(2)}px)`))
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])

  if (reduceMotion) {
    return <div ref={ref} className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX,
        skewY,
        scale,
        opacity,
        y,
        filter: reveal ? filter : undefined,
        transformPerspective: 1200,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReactive
