import { mergeConfig, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { baseConfig, resolvePath } from './vite.base.config';

const sassPartialsSrc = resolvePath('src/page/sass/partials');

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [react()],

    root: resolvePath('src/page'),

    build: {
      emptyOutDir: true,
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: ["@use 'sass:map';", "@use 'context' as *;"].join(
            '\n',
          ),
          includePaths: [sassPartialsSrc],
        },
      },
    },

    server: {
      port: 3e3,
    },
  }),
);
