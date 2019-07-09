(function () {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = 'https://unpkg.com/@bruit/component/latest/dist/bruit.js';
    s.onload = function () {
        var modal = document.getElementsByTagName('bruit-core');
        if (modal.length <= 0) {
            var bruitCore = document.createElement('bruit-core');
            "https://unpkg.com/@bruit/component/latest/dist/start.js?apiKey="


            // Find all script tags

            var scripts = document.getElementsByTagName("script");

            // Look through them trying to find ourselves
            var params = {};
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src.indexOf("https://unpkg.com/@bruit/component/latest/dist/start.js?") > -1) {
                    // Get an array of key=value strings of params

                    var pa = scripts[i].src.split("?").pop().split("&");

                    // Split each key=value into array, the construct js object


                    for (var j = 0; j < pa.length; j++) {
                        var kv = pa[j].split("=");
                        params[kv[0]] = kv[1];
                    }
                }
            }

            bruitCore.config = params;
            document.body.appendChild(bruitCore);
        }
    };
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
})();