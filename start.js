(function () {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = 'https://unpkg.com/@bruit/component@next/dist/bruit.js';
    s.onload = function () {
        var modal = document.getElementsByTagName('bruit-core');
        if (modal.length <= 0) {
            var bruitCore = document.createElement('bruit-core');
            "https://unpkg.com/@bruit/component@next/dist/start.js?apiKey="


            // Find all script tags

            var scripts = document.getElementsByTagName("script");

            // Look through them trying to find unpkg.com/@bruit/component script
            var params = {};
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src.indexOf("https://unpkg.com/@bruit/component@next/dist/start.js?") > -1) {
                    // Get an array of key=value strings of params
                    var paramsStr = scripts[i].src.split("?").pop();
                    if (paramsStr && paramsStr.length > 1) {
                        var pa = paramsStr.split("&");

                        // Split each key=value into array, the construct object


                        for (var j = 0; j < pa.length; j++) {
                            var kv = pa[j].split("=");
                            switch (kv[0]) {
                                case 'apiUrl':
                                    params[kv[0]] = decodeURI(kv[1])
                                    break;
                                case 'logCacheLength':
                                    params[kv[0]] = parseInt(kv[1])
                                    break;
                                case 'addQueryParamsToLog':
                                    if (kv[1] === 'false') {
                                        params[kv[0]] = false;
                                    } else {
                                        params[kv[0]] = true;
                                    }
                                    break;
                                default:
                                    params[kv[0]] = kv[1];
                                    break;
                            }
                        }
                    }
                }
            }

            // attach bruitCore with url params

            bruitCore.config = params;
            document.body.appendChild(bruitCore);
        }
    };
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
})();