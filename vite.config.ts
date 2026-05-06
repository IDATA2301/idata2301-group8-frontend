import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"


// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: "/",
    plugins: [react(), tsconfigPaths()],
    server: {
      proxy: {
        '/api-iam': {
          target: env.IAM_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-iam/, ''),
          configure: (proxy, options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Request sent to target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Response received from target:', proxyRes.statusCode, req.url);
            });
          }
        }
      }
    }
  }
})

