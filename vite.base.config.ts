import path from 'path';

import { defineConfig } from 'vite';

export const resolvePath = (...paths: string[]) =>
  path.resolve(__dirname, ...paths);

export const baseConfig = defineConfig({
  build: {
    outDir: resolvePath('dist'),
  },

  resolve: {
    alias: {
      '#page': resolvePath('src/page'),
    },
  },
});
