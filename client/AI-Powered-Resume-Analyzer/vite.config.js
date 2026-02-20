import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
        '/auth': {
            target: 'https://resume-evaluator-i1z7.onrender.com',
            changeOrigin: true,
            secure: false,
        },
        '/api': {
            target: 'https://resume-evaluator-i1z7.onrender.com',
            changeOrigin: true,
            secure: false,
        },
    }
  }
})
