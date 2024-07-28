import { mergeConfig } from 'vite';

import { baseConfig, resolvePath } from './vite.base.config';

const config = mergeConfig(baseConfig, {
  root: resolvePath('src/scripts'),

  build: {
    lib: {
      entry: {
        'background': resolvePath('src/background/index.ts'),
      },

      formats: ['es'],
    },
  },
});


export default config;
