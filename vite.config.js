import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [
    react({
      jsxRuntime: 'classic'
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: false,
  define: {
    global: 'globalThis',
  },
  build: {
    target: 'es2015',
    rollupOptions: {
      external: [],
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    },
  },
});