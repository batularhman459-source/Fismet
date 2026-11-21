import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages liefert die Seite unter /Fismet/ aus (Name des Repos).
// Lokal (npm run dev) bleibt es bei /; npm run preview zeigt es wie online.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/Fismet/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
}))
