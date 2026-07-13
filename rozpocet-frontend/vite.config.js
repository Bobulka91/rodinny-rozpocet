import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // simuluje prohlížeč pro testy
    globals: true, // umožní používat describe/it/expect bez importu
    setupFiles: './src/setupTests.js', // načte jest-dom matchery (toBeInTheDocument, atd.
  },
})