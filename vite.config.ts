import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  base: "/idata2301-group8-frontend/",
  plugins: [react(), tsconfigPaths()],
})
