import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // extra safety in case another tool touches JSX:
  esbuild: {
    jsx: 'automatic'
  }
})
