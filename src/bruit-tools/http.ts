import { BrtLogHttp } from '@bruit/types';
import { BrtHttpRequest } from '@bruit/types/dist/enums/brt-http-request';
import { BrtLogHttpType } from '@bruit/types/dist/enums/brt-log-http-type';

export class HttpTool {

  private static addQueryParamsToLog: boolean;

  static init(addQueryParamsToLog: boolean = false) {
    HttpTool.overrideXMLHttpRequest();
    HttpTool.overrideFetch();
    HttpTool.addQueryParamsToLog = addQueryParamsToLog;
  }

  static overrideXMLHttpRequest() {
    (function (open) {
      XMLHttpRequest.prototype.open = function () {
        const method = arguments[0];
        const url = arguments[1];
        HttpTool.logCall(method, url);

        this._oldonreadystatechange = this.onreadystatechange;
        this.onreadystatechange = function (e) {
          if (this.readyState === 2 && !JSON.stringify(this.status).startsWith('2')) {
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
    (function (fetchP) {
      window.fetch = function () {
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

  private static logCall(method: string, url: string, headers?: any, body?: any) {
    const requestLog: BrtLogHttp = {
      type: BrtLogHttpType.REQUEST,
      timestamp: new Date(),
      method: BrtHttpRequest[method.toUpperCase()],
      url: HttpTool.addQueryParamsToLog ? url : url.split('?')[0],
      body,
      headers
    };
    HttpTool.logHttp(requestLog);
  }

  private static logResponse(method: string, url: string, status: any, response?: any, timestamp?: Date) {
    const requestLog: BrtLogHttp = {
      type: BrtLogHttpType.RESPONSE,
      timestamp: timestamp || new Date(),
      method: BrtHttpRequest[method.toUpperCase()],
      url,
      status,
      response
    };
    HttpTool.logHttp(requestLog);
  }

  private static logResponseHeaders(method: string, url: string, status: any, timestamp?: Date) {
    const requestLog: BrtLogHttp = {
      type: BrtLogHttpType.RESPONSE_HEADER,
      timestamp: timestamp || new Date(),
      method: BrtHttpRequest[method.toUpperCase()],
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
