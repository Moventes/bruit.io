import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'bruit',
  srcDir: 'src',
  bundles: [{ components: ['bruit-modal', 'bruit-io', 'bruit-rating'] }],
  outputTargets: [
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: null
    }
  ],
  copy: [
    { src: 'init.js', dest: './../init.js' },
    { src: 'core.js', dest: './../core.js' },
    { src: 'appendCore.js', dest: './../appendCore.js' },
    { src: 'start.js', dest: './../start.js' }
  ],
  plugins: [sass()],
  hashFileNames: false
};
