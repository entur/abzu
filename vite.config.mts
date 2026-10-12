/// <reference types="vitest" />
/// <reference types="vite-plugin-svgr/client" />
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import reactComponentToggle from "@entur/rollup-plugin-react-component-toggle";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 9000,
  },
  publicDir: 'public',
  // MapLibre starts its worker with { type: "module" } (see maplibreLib.ts).
  worker: {
    format: 'es',
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  plugins: [
    react(), viteTsconfigPaths(), svgrPlugin(),
      reactComponentToggle({
        componentsPath: "/src/ext",
      }),
  ],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: [],
    }
  },

  // globalThis, not window: dev also applies this to the MapLibre worker,
  // where window doesn't exist and the worker would fail to start.
  define: process.env.NODE_ENV === 'development' ? { global: 'globalThis' } : {},
});
