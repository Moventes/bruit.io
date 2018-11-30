import {
  defineCustomElements
} from './esm/es5/bruit.define.js';


export function defineBruitElements(brtCoreConfig, opts) {
  var r = defineCustomElements(window, opts);
  window.addEventListener('load', function () {
    var modal = document.getElementsByTagName('bruit-core');
    if (modal.length <= 0) {
      var bruitCore = document.createElement('bruit-core');
      if (brtCoreConfig) {
        bruitCore.config = brtCoreConfig;
      }
      document.body.appendChild(bruitCore);
    }
  }, false);
  return r;
}
