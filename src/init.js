import { appendCore } from './appendCore';
import { defineCustomElements } from './esm/loader.mjs';


export function init(brtCoreConfig, opts) {
  var r = defineCustomElements(window, opts);
  window.addEventListener('load', function () {
    appendCore(brtCoreConfig);
  }, false);
  return r;
}
