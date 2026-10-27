// Cursor-following 3D tilt + spotlight for cards.
// Writes CSS variables (--mx, --my, --rx, --ry) straight onto the element so the effect
// follows the pointer without re-rendering React. Styles decide how to use them.

// Only on mouse devices, and never for reduced-motion users.
const canTilt =
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const PROPERTIES = ['--mx', '--my', '--rx', '--ry']

export function createTilt(degrees = 7) {
  return {
    onPointerMove(event) {
      if (!canTilt) return
      const card = event.currentTarget
      const rect = card.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      card.style.setProperty('--mx', `${x * 100}%`)
      card.style.setProperty('--my', `${y * 100}%`)
      card.style.setProperty('--ry', `${(x - 0.5) * degrees}deg`)
      card.style.setProperty('--rx', `${(0.5 - y) * degrees}deg`)
    },
    onPointerLeave(event) {
      for (const property of PROPERTIES) event.currentTarget.style.removeProperty(property)
    },
  }
}
