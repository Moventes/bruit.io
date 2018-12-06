export function appendCore(brtCoreConfig) {
  var modal = document.getElementsByTagName('bruit-core');
  if (modal.length <= 0) {
    var bruitCore = document.createElement('bruit-core');
    if (brtCoreConfig) {
      bruitCore.config = brtCoreConfig;
    }
    document.body.appendChild(bruitCore);
  }
}
