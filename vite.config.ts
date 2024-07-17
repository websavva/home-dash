import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const sassPartialsSrc = path.resolve(__dirname, './src/sass/partials');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 3e3,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ['sass:map', 'base']
          .map((partial) => `@use '${partial}';`)
          .join('\n'),
        includePaths: [sassPartialsSrc],
      },
    },
  },
});
