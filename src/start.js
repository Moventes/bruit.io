(function () {

    // Find all script tags
    var scripts = document.getElementsByTagName("script");

    //Find our script
    var reg = /https:\/\/unpkg\.com\/@bruit\/component@.*\/dist\/start\.js\?/
    var scriptUnpkg = null;
    for (i = 0; i < scripts.length; i++) {
        if (scripts[i].src.search(reg) === 0) {
            scriptUnpkg = scripts[i].src;
        }
    }

    if (scriptUnpkg) {


        // split our script
        var tmpSplitAT = scriptUnpkg.split('@');
        var baseUrl = tmpSplitAT[0] + '@' + tmpSplitAT[1] + '@';
        var version = tmpSplitAT[2].split('/')[0];
        var paramsStr = tmpSplitAT[2].split('?')[1]

        // Look through them trying to find unpkg.com/@bruit/component script
        var params = {};
        // Get an array of key=value strings of params
        if (paramsStr && paramsStr.length > 1) {
            var paramsSplitAND = paramsStr.split("&");

            // Split each key=value into array, the construct object
            for (var j = 0; j < paramsSplitAND.length; j++) {
                var kv = paramsSplitAND[j].split("=");
                switch (kv[0]) {
                    case 'apiKey':
                        params.apiKey = kv[1];
                        break;
                    case 'apiUrl':
                        params.apiUrl = decodeURI(kv[1]);
                        break;
                    case 'log.logCacheLength':
                        if (!params.log) {
                            params.log = {};
                        }
                        params.log.logCacheLength = JSON.parse(decodeURI(kv[1]));
                        break;
                    case 'log.addQueryParamsToLog':
                        if (!params.log) {
                            params.log = {};
                        }
                        if (kv[1] === 'false' || kv[1] === false) {
                            params.log.addQueryParamsToLog = false;
                        } else {
                            params.log.addQueryParamsToLog = true;
                        }
                        break;
                }
            }
        }



        var s2 = document.createElement("script");
        s2.type = "text/javascript";
        s2.setAttribute('type', 'module');
        s2.src = 'https://unpkg.com/@bruit/core@2.0.2-plop/lib/core.js?' + paramsStr;
        s2.onload = function () {
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.setAttribute('type', 'module');
            s.src = baseUrl + version + '/dist/bruit/bruit.esm.js';
            s.onload = function () {
                var modal = document.getElementsByTagName('bruit-core');
                if (modal.length <= 0) {
                    var bruitCore = document.createElement('bruit-core');

                    // attach bruitCore with url params

                    bruitCore.config = params;
                    document.body.appendChild(bruitCore);
                }
            };
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
        };
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s2, x);
    }
})();