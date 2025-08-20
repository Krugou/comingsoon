import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        graphics: 'graphics/index.html',
        dashboard: 'dashboard/controls.html',
        standalone: 'examples/index.html'
      }
    }
  },
  server: {
    port: 3000
  }
})