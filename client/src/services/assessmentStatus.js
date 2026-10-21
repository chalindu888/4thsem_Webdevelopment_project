// Maps stored assessment answers to a display label and a status tone (success / warning / danger).
const STATUS = {
  riskLevel: {
    'LOW RISK': ['Low risk', 'success'],
    'MEDIUM RISK': ['Medium risk', 'warning'],
    'HIGH RISK': ['High risk', 'danger'],
  },
  passwordHabits: { strong: ['Strong', 'success'], mixed: ['Fair', 'warning'], weak: ['Weak', 'danger'] },
  phishingAwareness: { high: ['High', 'success'], medium: ['Moderate', 'warning'], low: ['Low', 'danger'] },
  twoFactorAuth: { enabled: ['Enabled', 'success'], some: ['Partial', 'warning'], none: ['Not enabled', 'danger'] },
}

export function statusOf(field, value) {
  const [label, tone] = STATUS[field]?.[value] || [value, 'neutral']
  return { label, tone }
}

// Same thresholds the backend uses for the overall risk level.
export const toneForScore = (score) => (score < 40 ? 'danger' : score < 70 ? 'warning' : 'success')
