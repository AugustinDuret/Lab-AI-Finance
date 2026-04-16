import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
  server: {
    proxy: {
      // In dev, proxy /api calls to the local Express server (port 3001)
      '/api': 'http://localhost:3001',
    },
  },
})
