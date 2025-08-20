import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        graphics: 'graphics/index.html',
        'name-tag-chyron': 'graphics/name-tag-chyron.html',
        dashboard: 'dashboard/controls.html',
        'name-tag-dashboard': 'dashboard/name-tag-chyron.html',
        standalone: 'examples/index.html'
      }
    }
  },
  server: {
    port: 3000
  }
})