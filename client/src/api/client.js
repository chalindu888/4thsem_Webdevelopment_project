import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('secureai_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Turns an axios error into a message a user can act on.
export function getErrorMessage(error) {
  if (error.response) {
    const { status, data } = error.response
    if (data?.message) return data.message
    if (status === 401) return 'Your session has expired. Please log in again.'
    if (status === 403) return 'You do not have permission to do that.'
    if (status === 404) return 'That service could not be found on the server. Start the backend from the project root folder with "npm run server" (not from the backend/ folder).'
    if (status >= 500) return 'The server ran into a problem. Please try again in a moment.'
    return `Request failed with status ${status}.`
  }

  if (error.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.'
  if (error.request) return `Cannot reach the server at ${api.defaults.baseURL}. Make sure the backend is running (npm run server).`

  return error.message || 'Something went wrong. Please try again.'
}

export function clearSession() {
  localStorage.removeItem('secureai_token')
  localStorage.removeItem('user')
}

export default api
