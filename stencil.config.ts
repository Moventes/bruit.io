import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';


export const config: Config = {
  namespace: 'bruit',
  bundles: [{ components: ['bruit-core', 'bruit-io', 'bruit-rating', 'bruit-select'] }],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    }
  ],
  plugins: [
    sass()
  ],
  globalScript: 'src/start.ts'
};
