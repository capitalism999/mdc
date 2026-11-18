import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Required for FiveM NUI: the page is served from https://cfx-nui-<resource>/,
  // so all asset URLs must be relative, not absolute.
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
  },
  build: {
    // Same build output is used both as the FiveM NUI resource's html/ folder
    // and (copied/deployed) as the standalone site.
    outDir: '../../resource/html',
    emptyOutDir: true,
  },
})
