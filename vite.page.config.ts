import { mergeConfig, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import _VitePluginReactRemoveAttributes from 'vite-plugin-react-remove-attributes';

import { baseConfig, resolvePath } from './vite.base.config';

import breakpoints from './src/page/sass/partials/breakpoints.json';

const sassPartialsSrc = resolvePath('src/page/sass/partials');

const mediaQueryDeclarations = Object.entries(breakpoints)
  .map(([name, size]) => [
    [`$max-${name}: "(max-width: ${size}px)";`],
    [`$min-${name}: "(min-width: ${size + 1}px)";`],
  ])
  .flat();

const VitePluginReactRemoveAttributes = ((
  _VitePluginReactRemoveAttributes as any
).default ||
  _VitePluginReactRemoveAttributes) as typeof _VitePluginReactRemoveAttributes;

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      react(),
      VitePluginReactRemoveAttributes({
        attributes: ['data-testid'],
      }),
    ],

    root: resolvePath('src/page'),

    build: {
      emptyOutDir: true,
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: [
            "@use 'sass:map';",
            "@use 'context' as *;",
            ...mediaQueryDeclarations,
          ].join('\n'),
          includePaths: [sassPartialsSrc],
        },
      },
    },

    server: {
      port: 3e3,
    },
  }),
);
