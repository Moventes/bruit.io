import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'bruit',
  srcDir: 'src',
  bundles: [{ components: ['bruit-modal', 'bruit-io', 'bruit-rating'] }],
  outputTargets: [
    {
      type: 'dist',
    },
    {
      type: 'dist-self-contained',
      dir: 'dist2',
    },
    {
      type: 'www',
      serviceWorker: null
    }
  ],

  plugins: [sass()],
  hashFileNames: false
};
