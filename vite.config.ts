import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Splitting inteligente de chunks: vendor, queries, state e ui
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@tanstack')) return 'queries'
            if (id.includes('zustand')) return 'state'
            return 'vendor'
          }
          if (id.includes('/src/components/ui/') || id.includes('\\src\\components\\ui\\')) {
            return 'ui'
          }
          return undefined
        },
      },
    },
  },
})
