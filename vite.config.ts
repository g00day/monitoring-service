import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import path from 'node:path'



export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (url) => url.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@api': path.resolve(import.meta.dirname, "./src/api"),
      '@assets': path.resolve(import.meta.dirname, './src/assets'),
      '@components': path.resolve(import.meta.dirname, './src/components'),
      '@pages': path.resolve(import.meta.dirname, "./src/pages/"),
      '@ui': path.resolve(import.meta.dirname, "./src/components/ui"),
      '@layout':  path.resolve(import.meta.dirname, './src/components/layout'),
      '@sections': path.resolve(import.meta.dirname, './src/sections'),
      '@hooks': path.resolve(import.meta.dirname, "./src/hooks"),
      '@utils': path.resolve(import.meta.dirname, "./src/utils")
    },
  },
})
