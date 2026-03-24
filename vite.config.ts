import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  build: {
    target: 'es2015' // Much more compatible with in-app browsers
  },
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
