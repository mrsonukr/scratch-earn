import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // Set base to root for hosting
  server: {
    host: true,       // Listen on all addresses (0.0.0.0)
    port: 5173,       // Optional: default is 5173
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
