import { defineConfig } from 'vite'

export default defineConfig({
  // GitHub Pages serves this repository below /xiaoyu-ai-agent/.
  // Relative assets also keep local preview and custom domains working.
  base: './',
})
