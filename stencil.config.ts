import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'bruit',
  outputTargets: [
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: null
    }
  ]
};
