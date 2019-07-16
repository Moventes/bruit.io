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












        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = baseUrl + version + '/dist/bruit/bruit.js';
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
    }
})();