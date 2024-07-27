import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const sassPartialsSrc = path.resolve(__dirname, './src/page/sass/partials');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 3e3,
  },

  root: path.resolve(__dirname, './src/page'),

  build: {
    emptyOutDir: true,

    outDir: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/page'),
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
