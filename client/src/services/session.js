// Fired after the stored user changes (e.g. name edited on the profile page)
// so components like the Navbar can refresh without a reload.
export const SESSION_EVENT = 'secureai-session-change'

export const notifySessionChange = () => window.dispatchEvent(new Event(SESSION_EVENT))
