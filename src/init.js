import {
  defineCustomElements
} from './esm/es5/bruit.define.js';
import {
  appendCore
} from './appendCore';


export function defineBruitElements(brtCoreConfig, opts) {
  var r = defineCustomElements(window, opts);
  window.addEventListener('load', function () {
    appendCore(brtCoreConfig);
  }, false);
  return r;
}
