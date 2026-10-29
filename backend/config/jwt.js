// One place to read the JWT signing secret.
// Production must set JWT_SECRET; the fallback exists only for local development,
// so tokens can never be signed with a publicly known secret in production.
const DEV_SECRET = 'secureai-development-secret';

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is not configured');
  }
  return DEV_SECRET;
};

module.exports = { getJwtSecret };
