import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /\.(jsx|js)$/,
    exclude: /\.(tsx|ts)$/,
  },
  define: {
    global: 'globalThis',
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    rollupOptions: {
      external: [],
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    },
  },
  // Completely disable TypeScript checking
  typescript: {
    check: false,
    build: false
  }
});