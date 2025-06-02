import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/our-lolmanager-guild/',
  plugins: [react()],
})
