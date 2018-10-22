export class HttpTool {
  static init() {
    HttpTool.overrideXMLHttpRequest();
    HttpTool.overrideFetch();
  }

  static overrideXMLHttpRequest() {
    (function(open) {
      XMLHttpRequest.prototype.open = function() {
        this.addEventListener(
          'readystatechange',
          function() {
            console.log('HTTP - ready state = ' + JSON.stringify(this));
          },
          false
        );
        this.addEventListener('load', function() {
          // do something with the response text
          console.log('HTTP - load: ' + this.responseText);
        });
        open.apply(this, arguments);
      };
    })(XMLHttpRequest.prototype.open);
  }

  static overrideFetch() {
    (function(fetchP) {
      window.fetch = function() {
        console.log('fetch call with ', arguments);
        return fetchP.apply(this, arguments).then(res => {
          console.log('fetch return ', res);
          return res;
        });
      };
    })(window.fetch);
  }
}
