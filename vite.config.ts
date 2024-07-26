import path, { join } from 'path';

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
        additionalData: ["@use 'sass:map';", "@use 'context' as *;"].join('\n'),
        includePaths: [sassPartialsSrc],
      },
    },
  },
});
