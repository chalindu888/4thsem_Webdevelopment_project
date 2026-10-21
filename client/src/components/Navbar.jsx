import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { SESSION_EVENT } from '../services/session'

const APP_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/assessment', label: 'Assessment' },
  { to: '/awareness', label: 'Learn' },
  { to: '/results', label: 'Results' },
]

// Section anchors on the home page, shown to visitors who aren't logged in.
const PUBLIC_LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#assessment', label: 'How it works' },
  { href: '/#awareness', label: 'Topics' },
  { href: '/#about', label: 'About' },
]

const MENU_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'grid' },
  { to: '/profile', label: 'My Profile', icon: 'user' },
  { to: '/results', label: 'Assessment Results', icon: 'history' },
]

function readSession() {
  const token = localStorage.getItem('secureai_token')
  if (!token) return null

  try {
    const user = JSON.parse(localStorage.getItem('user')) || {}
    return { name: user.name || 'User', email: user.email || '' }
  } catch {
    return { name: 'User', email: '' }
  }
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'
}

function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState(readSession)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)

  // Keep in sync with logins/logouts in other tabs and profile edits in this one.
  useEffect(() => {
    const sync = () => setUser(readSession())
    window.addEventListener('storage', sync)
    window.addEventListener(SESSION_EVENT, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(SESSION_EVENT, sync)
    }
  }, [])

  // Close the profile menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return

    const handlePointer = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false)
    }
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('touchstart', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('touchstart', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [menuOpen])

  const closeAll = () => {
    setMenuOpen(false)
    setMobileOpen(false)
  }

  const toggleMenu = () => {
    setMobileOpen(false)
    setMenuOpen((open) => !open)
  }

  // Arrow keys move between menu items, like a native menu.
  const handleMenuKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const items = [...panelRef.current.querySelectorAll('[role="menuitem"]')]
    const current = items.indexOf(document.activeElement)
    const step = event.key === 'ArrowDown' ? 1 : -1
    items[(current + step + items.length) % items.length]?.focus()
  }

  const handleSignOut = () => {
    localStorage.removeItem('secureai_token')
    localStorage.removeItem('user')
    closeAll()
    setUser(null)
    navigate('/login')
  }

  const navLinkClass = ({ isActive }) => (isActive ? 'topnav-link is-active' : 'topnav-link')

  const links = user
    ? APP_LINKS.map((link) => (
        <NavLink key={link.to} to={link.to} className={navLinkClass} onClick={closeAll}>
          {link.label}
        </NavLink>
      ))
    : PUBLIC_LINKS.map((link) => (
        <a key={link.href} href={link.href} className="topnav-link" onClick={closeAll}>
          {link.label}
        </a>
      ))

  return (
    <header className="topnav">
      <div className="topnav-inner">
        <Link to="/" className="topnav-brand" onClick={closeAll}>
          <img src="/security.jpg" alt="" />
          <span>SecureAI</span>
        </Link>

        <nav className="topnav-links" aria-label="Main">
          {links}
        </nav>

        <div className="topnav-actions">
          {user ? (
            <div className="topnav-menu" ref={menuRef}>
              <button
                ref={triggerRef}
                type="button"
                className="topnav-trigger"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-controls="topnav-profile-menu"
                aria-label={`Account menu for ${user.name}`}
                onClick={toggleMenu}
              >
                <span className="topnav-avatar">{getInitials(user.name)}</span>
                <Icon name="chevron" className="topnav-chevron" />
              </button>

              <div
                id="topnav-profile-menu"
                ref={panelRef}
                className={menuOpen ? 'topnav-panel is-open' : 'topnav-panel'}
                role="menu"
                aria-label="Account"
                onKeyDown={handleMenuKeyDown}
              >
                <div className="topnav-panel-header">
                  <span className="topnav-avatar topnav-avatar-lg">{getInitials(user.name)}</span>
                  <div>
                    <strong>{user.name}</strong>
                    {user.email && <span>{user.email}</span>}
                  </div>
                </div>

                <div className="topnav-panel-group">
                  {MENU_LINKS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      role="menuitem"
                      className="topnav-panel-item"
                      onClick={closeAll}
                    >
                      <Icon name={item.icon} />
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="topnav-panel-group">
                  <button
                    type="button"
                    role="menuitem"
                    className="topnav-panel-item topnav-signout"
                    onClick={handleSignOut}
                  >
                    <Icon name="logout" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="topnav-btn topnav-btn-ghost">Log in</Link>
              <Link to="/register" className="topnav-btn topnav-btn-primary">Get started</Link>
            </>
          )}

          <button
            type="button"
            className="topnav-burger"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            aria-controls="topnav-mobile"
            onClick={() => {
              setMenuOpen(false)
              setMobileOpen((open) => !open)
            }}
          >
            <Icon name={mobileOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      <nav
        id="topnav-mobile"
        className={mobileOpen ? 'topnav-mobile is-open' : 'topnav-mobile'}
        aria-label="Main mobile"
      >
        {links}
      </nav>
    </header>
  )
}

const ICON_PATHS = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  history: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 3',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  chevron: 'M6 9l6 6 6-6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M18 6 6 18M6 6l12 12',
}

function Icon({ name, className = 'topnav-icon' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

export default Navbar
