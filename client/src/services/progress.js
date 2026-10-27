// Learning module completion, stored per browser.
const KEY = 'secureai_completed_modules'

export function getCompletedModules() {
  try {
    const ids = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(ids) ? ids : []
  } catch {
    return []
  }
}

export function setModuleCompleted(id, completed) {
  const ids = getCompletedModules().filter((existing) => existing !== id)
  if (completed) ids.push(id)
  localStorage.setItem(KEY, JSON.stringify(ids))
  return ids
}
