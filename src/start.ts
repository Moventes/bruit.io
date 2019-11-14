
export default function () {
    if (window && window.addEventListener && document) {
        window.addEventListener('load', function () {
            var modal = document.getElementsByTagName('bruit-core');
            if (modal.length <= 0) {
                let brtCoreConfig;
                for (let i = 0; i < document.scripts.length; i++) {
                    if (document.scripts.item(i).hasAttribute('data-brt-config')) {
                        brtCoreConfig = JSON.parse(document.scripts.item(i).getAttribute('data-brt-config'));
                        break;
                    }
                }
                var bruitCore = document.createElement('bruit-core');
                if (brtCoreConfig) {
                    bruitCore.setAttribute('brt-config', JSON.stringify(brtCoreConfig));
                }
                document.body.appendChild(bruitCore);
            }
        });
    }
}

export function sendFeedback(test) {
    console.log('wazza', test);
}