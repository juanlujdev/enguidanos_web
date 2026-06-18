import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/enguidanos_web/',
  build: { outDir: 'dist' },
})
