import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const UNREACHABLE = JSON.stringify({
  success: false,
  message: 'Server unreachable. Start the app with "npm run dev" in the project folder.',
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // The frontend calls /api/... on its own origin; Vite forwards it to Express.
    // No hard-coded backend port in the client and no CORS during development.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: (proxy) => {
          // Backend not running: reply with a clear JSON error instead of a bare 500.
          proxy.on('error', (error, req, res) => {
            if (typeof res.writeHead !== 'function' || res.headersSent) return
            res.writeHead(503, { 'Content-Type': 'application/json' })
            res.end(UNREACHABLE)
          })
        },
      },
    },
  },
})
