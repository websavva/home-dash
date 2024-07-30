import { defineConfig, mergeConfig } from 'vitest/config';

import { resolvePath } from './vite.base.config';
import pageViteConfig from './vite.page.config';

export default mergeConfig(
  pageViteConfig,

  defineConfig({
    root: resolvePath('src'),

    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],

      watch: false,
    },
  }),
);
