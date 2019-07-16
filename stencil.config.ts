import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'bruit',
  srcDir: 'src',
  bundles: [{ components: ['bruit-core', 'bruit-io', 'bruit-rating'] }],
  outputTargets: [
    {
      type: 'dist',
      copy: [
        { src: 'init.js', dest: './../init.js' },
        { src: 'core.js', dest: './../core.js' },
        { src: 'appendCore.js', dest: './../appendCore.js' },
        { src: 'start.js', dest: './../start.js' }
      ]
    },
    {
      type: 'www',
      serviceWorker: null
    }
  ],

  plugins: [sass()],
  hashFileNames: false
};
