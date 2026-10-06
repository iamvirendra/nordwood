import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxy = { '/api': { target: `http://127.0.0.1:${process.env.PORT || env.PORT || 3001}` } };
  return { plugins: [react()], server: { strictPort: true, proxy }, preview: { proxy } };
})
