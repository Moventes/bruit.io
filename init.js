import {
  defineCustomElements
} from './esm/es5/bruit.define.js';


export function defineBruitElements(win, opts) {
  var r = defineCustomElements(win, opts);
  window.addEventListener('load', function () {
    var modal = document.getElementsByTagName('bruit-modal');
    if (modal.length > 0) {
      document.body.appendChild(document.createElement('bruit-modal'));
    }
  }, false);
  return r;
}
