import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"


// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.BASE_URL || "/",
    plugins: [react(), tsconfigPaths()],
    server: {
      proxy: {
        '/api-iam': {
          target: env.IAM_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api-iam/, ''),
          headers: {
            'Origin': env.REQUEST_ORIGIN || 'http://localhost:5173'
          }
        },
        '/api-event': {
          target: env.EVENT_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-event/, '')
        },
        '/api-order': {
          target: env.ORDER_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-order/, '')
        }
      }
    }
  };
})

