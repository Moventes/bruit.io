
export default function start(config) {
    if (window && window.addEventListener && document) {
        window.addEventListener('load', function () {
            var bruitCore = document.getElementsByTagName('bruit-core')[0];
            let brtCoreConfig = config;
            const alreadyInBody = !!bruitCore;
            for (let i = 0; i < document.scripts.length; i++) {
                if (document.scripts.item(i).hasAttribute('data-brt-config')) {
                    brtCoreConfig = JSON.parse(document.scripts.item(i).getAttribute('data-brt-config'));
                    break;
                }
            }
            if (!bruitCore) {
                var bruitCore = document.createElement('bruit-core');
            }
            if (brtCoreConfig) {
                bruitCore.setAttribute('brt-config', JSON.stringify(brtCoreConfig));
            }
            if (!alreadyInBody) {
                document.body.appendChild(bruitCore);
            }
        });
    }
}