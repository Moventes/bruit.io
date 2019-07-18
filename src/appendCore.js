export function appendModal(brtModalConfig) {
  var modal = document.getElementsByTagName('bruit-modal');
  if (modal.length <= 0) {
    var bruitModal = document.createElement('bruit-modal');
    if (brtModalConfig) {
      bruitModal.config = brtModalConfig;
    }
    document.body.appendChild(bruitModal);
  }
}
