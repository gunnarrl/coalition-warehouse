import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    '/api': {
      target: 'http://localhost:30905',
      changeOrigin: true,
      secure: false,
    },
  },
})
