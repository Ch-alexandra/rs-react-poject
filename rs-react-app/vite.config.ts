import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/rs-react-poject/',
  plugins: [react()],
  server: {
    proxy: {
      '/rickandmorty': {
        target: 'https://rickandmortyapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rickandmorty/, ''),
      },
    },
  },
})
