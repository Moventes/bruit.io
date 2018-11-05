export class HttpTool {
  static init() {
    HttpTool.overrideXMLHttpRequest();
    HttpTool.overrideFetch();
  }

  static overrideXMLHttpRequest() {
    (function(open) {
      XMLHttpRequest.prototype.open = function() {
        const method = arguments[0];
        const url = arguments[1];
        HttpTool.logCall(method, url);

        this._oldonreadystatechange = this.onreadystatechange;
        this.onreadystatechange = function(e) {
          if (this.readyState === 2 && this.status !== 200) {
            HttpTool.logResponseHeaders(method, e.target.responseURL, e.target.status);
          }
          if (this.readyState === 4) {
            HttpTool.logResponse(method, e.target.responseURL, e.target.status, e.target.responseText);
          }
          if (this._oldonreadystatechange) {
            this._oldonreadystatechange.apply(arguments);
          }
        };
        open.apply(this, arguments);
      };
    })(XMLHttpRequest.prototype.open);
  }

  static overrideFetch() {
    (function(fetchP) {
      window.fetch = function() {
        let req = {
          method: 'GET',
          body: undefined,
          headers: undefined,
          url: undefined
        };
        if (typeof arguments[0] === 'string' && arguments.length > 1) {
          //first param => url
          //second param => init obj
          req.body = arguments[1].body || req.body;
          req.headers = arguments[1].headers || req.headers;
          req.method = arguments[1].method || req.method;
          req.url = arguments[0];
        } else if (typeof arguments[0] === 'object') {
          req.headers = arguments[0].headers || req.headers;
          req.method = arguments[0].method || req.method;
          req.url = arguments[0].url;
        } else {
          req.url = arguments[0];
        }
        console.log(arguments);
        HttpTool.logCall(req.method, req.url, req.headers, req.body);
        return fetchP
          .apply(this, arguments)
          .then(res => {
            const now = new Date();
            res
              .json()
              .then(jsn => {
                HttpTool.logResponse(req.method, res.url, res.status, jsn, now);
              })
              .catch(() => {
                HttpTool.logResponse(req.method, res.url, res.status);
              });
            return res;
          })
          .catch(error => {
            HttpTool.logResponse(req.method, req.url, -1, typeof error === 'object' ? error.status : error);
            return Promise.reject(arguments);
          });
      };
    })(window.fetch);
  }

  private static logCall(method: string, url: string, header?: any, body?: any) {
    const requestLog = {
      type: 'request',
      timestamp: new Date(),
      method,
      url,
      body,
      header
    };
    HttpTool.logHttp(requestLog);
  }

  private static logResponse(method: string, url: string, status: any, response?: any, timestamp?: Date) {
    const requestLog = {
      type: 'response',
      timestamp: timestamp || new Date(),
      method,
      url,
      status,
      response
    };
    HttpTool.logHttp(requestLog);
  }

  private static logResponseHeaders(method: string, url: string, status: any, timestamp?: Date) {
    const requestLog = {
      type: 'response-header',
      timestamp: timestamp || new Date(),
      method,
      url,
      status
    };
    HttpTool.logHttp(requestLog);
  }

  private static logHttp(requestLog) {
    if ((<any>console).network) {
      (<any>console).network((<any>JSON).decycle(requestLog));
    } else {
      console.log(requestLog);
    }
  }
}
