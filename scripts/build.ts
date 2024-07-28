import { cp } from 'fs/promises';

import { build } from 'vite';

import { resolvePath } from '../vite.base.config';
import pageConfig from '../vite.page.config';
import backgroundConfig from '../vite.background.config';

async function buildChromeExtension() {
  await build(pageConfig);

  await build(backgroundConfig);

  cp(resolvePath('src/public'), resolvePath('dist'), {
    recursive: true,
  });
}

buildChromeExtension();
