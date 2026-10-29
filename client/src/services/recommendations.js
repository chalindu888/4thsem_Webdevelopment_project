import modules from '../data/modules'

// Advice for each weak answer, linked to the module that covers it.
const ADVICE = {
  twoFactorAuth: {
    none: ['high', 'Turn on 2FA', 'Start with email and banking.'],
    some: ['medium', 'Turn on 2FA everywhere', 'Cover all important accounts.'],
    module: 'password-security',
  },
  passwordHabits: {
    weak: ['high', 'Stop reusing passwords', 'Use a unique one for each site.'],
    mixed: ['medium', 'Replace reused passwords', 'A password manager makes it easy.'],
    module: 'password-security',
  },
  phishingAwareness: {
    low: ['high', 'Learn to spot phishing', 'Take the short module.'],
    medium: ['medium', 'Brush up on phishing', 'Review the warning signs.'],
    module: 'phishing-awareness',
  },
}

const FIELDS = ['passwordHabits', 'phishingAwareness', 'twoFactorAuth']
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

export const PRIORITY_TONE = { high: 'danger', medium: 'warning', low: 'neutral' }

// Advice for an assessment's weak answers, most urgent first.
// With completedIds, tops up to three items with lessons not finished yet.
export function buildRecommendations(assessment, completedIds = null) {
  if (!assessment) {
    return [{
      priority: 'high',
      title: 'Take your first assessment',
      description: 'Takes about 2 minutes.',
      to: '/assessment',
    }]
  }

  const recommendations = FIELDS
    .map((field) => {
      const advice = ADVICE[field][assessment[field]]
      if (!advice) return null
      const [priority, title, description] = advice
      return { priority, title, description, to: `/awareness/${ADVICE[field].module}` }
    })
    .filter(Boolean)
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])

  if (completedIds) {
    for (const module of modules) {
      if (recommendations.length >= 3) break
      if (completedIds.includes(module.id)) continue
      if (recommendations.some((item) => item.to === `/awareness/${module.id}`)) continue
      recommendations.push({
        priority: 'low',
        title: module.title,
        description: `${module.duration} · ${module.level}`,
        to: `/awareness/${module.id}`,
      })
    }
  }

  return recommendations
}
