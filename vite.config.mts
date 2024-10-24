/// <reference types="vitest" />
/// <reference types="vite-plugin-svgr/client" />
import {defineConfig, transformWithEsbuild} from 'vite'
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: {
    port: 9000,
  },
  publicDir: 'public',
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return 'vendor';
          } else if (!id.includes("/static/lang/")) {
            return 'index';
          }
        }
      }
    }
  },
  plugins: [
    react(), viteTsconfigPaths(), svgrPlugin(),
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/))  return null

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        })
      },
    },
  ],

  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },

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

  define: process.env.NODE_ENV === 'development' ? { global: 'window' } : {},
});
