import { BrtLog } from '@bruit/types';
import { BrtLogType } from '@bruit/types/dist/enums/brt-log-type';
import { BruitCoreConfig } from '../models/bruit-core-config.class';
import { ClickTool } from './click';
import { HttpTool } from './http';
import { UrlTool } from './url';

export class ConsoleTool {
  private static bruitCoreConfig: BruitCoreConfig;
  private static logByLevel: { [level: string]: Array<BrtLog> } = {};

  static init(bruitCoreConfig: BruitCoreConfig) {
    if (
      !(
        !!(<any>window).cordova ||
        (document.URL.indexOf('http://localhost') !== 0 && document.URL.indexOf('http://127.0.0.1') !== 0)
      )
    ) {
      (<any>console).overloadable = false;
      console.info('BRUIT.IO - logs reports are disabled in localhost mode');
    } else {
      (<any>console).overloadable = true;
    }
    (<any>console).overloadable = true;

    ConsoleTool.bruitCoreConfig = bruitCoreConfig;
    ConsoleTool.configure();
  }

  private static addEventHandlers() {
    if ((<any>console).overloadable) {
      window.addEventListener('online', () => {
        console.warn('EVENT -------------------- ONLINE --------------------');
      });
      window.addEventListener('offline', () => {
        console.warn('EVENT -------------------- OFFLINE --------------------');
      });
      // already loged by browser
      // window.addEventListener('error', e => {
      //   console.error('EVENT -------------------- ERROR --------------------', e.error.stack);
      // });
      window.addEventListener('abort', e => {
        console.warn('EVENT -------------------- ABORT --------------------', e.target);
      });
    }
  }

  private static configure() {
    if (typeof (<any>JSON).decycle !== 'function') {
      (<any>JSON).decycle = function decycle(object, replacer) {
        const objects = new WeakMap();
        return (function derez(value, path) {
          let old_path;
          let nu;
          if (replacer !== undefined) {
            value = replacer(value);
          }
          if (
            typeof value === 'object' &&
            value !== null &&
            !(value instanceof Boolean) &&
            !(value instanceof Date) &&
            !(value instanceof Number) &&
            !(value instanceof RegExp) &&
            !(value instanceof String)
          ) {
            old_path = objects.get(value);
            if (old_path !== undefined) {
              return { $ref: old_path };
            }
            objects.set(value, path);
            if (Array.isArray(value)) {
              nu = [];
              value.forEach(function (element, i) {
                nu[i] = derez(element, path + '[' + i + ']');
              });
            } else {
              nu = {};
              Object.keys(value).forEach(function (name) {
                if (value.hasOwnProperty(name)) {
                  nu[name] = derez(value[name], path + '[' + JSON.stringify(name) + ']');
                }
              });
            }
            return nu;
          } else if (typeof value !== 'function') {
            return value;
          } else {
            return null;
          }
        })(object, '$');
      };
    }

    if (typeof (<any>JSON).retrocycle !== 'function') {
      (<any>JSON).retrocycle = function retrocycle($) {
        const px = /^\$(?:\[(?:\d+|'(?:[^\\'\u0000-\u001f]|\\([\\'\/bfnrt]|u[0-9a-zA-Z]{4}))*')\])*$/;
        (function rez(value) {
          if (value && typeof value === 'object') {
            if (Array.isArray(value)) {
              value.forEach(function (element, i) {
                if (typeof element === 'object' && element !== null) {
                  const path = element.$ref;
                  if (typeof path === 'string' && px.test(path)) {
                    value[i] = eval(path);
                  } else {
                    rez(element);
                  }
                }
              });
            } else {
              Object.keys(value).forEach(function (name) {
                const item = value[name];
                if (typeof item === 'object' && item !== null) {
                  const path = item.$ref;
                  if (typeof path === 'string' && px.test(path)) {
                    value[name] = eval(path);
                  } else {
                    rez(item);
                  }
                }
              });
            }
          }
        })($);
        return $;
      };
    }

    if ((<any>console).overloadable) {
      if (!(<any>console).overloaded) {
        (<any>console).overloaded = {};
      }

      if (!(<any>console).overloaded.logArray) {
        (<any>console).overloaded.logArray = true;
        (<any>console).logArray = () => {
          return Object.entries(ConsoleTool.bruitCoreConfig.logCacheLength)
            .filter(v => v[1] > 0 && ConsoleTool.logByLevel[v[0]])
            .map(v => ConsoleTool.logByLevel[v[0]])
            .reduce((logArray, logsLevel) => logArray.concat(logsLevel), [])
            .sort((logA, logB) => logA.timestamp.getTime() - logB.timestamp.getTime());
        };
      }
      if (!(<any>console).overloaded.click) {
        (<any>console).overloaded.click = true;
        (<any>console).click = function () {
          return ConsoleTool.handleLogMessage(BrtLogType.CLICK, arguments);
        };
        ClickTool.init();
      }
      if (!(<any>console).overloaded.url) {
        (<any>console).overloaded.url = true;
        (<any>console).url = function () {
          return ConsoleTool.handleLogMessage(BrtLogType.URL, arguments);
        };
        UrlTool.init();
      }
      if (!(<any>console).overloaded.network) {
        (<any>console).overloaded.network = true;
        (<any>console).network = function () {
          return ConsoleTool.handleLogMessage(BrtLogType.NETWORK, arguments);
        };
        HttpTool.init(ConsoleTool.bruitCoreConfig.addQueryParamsToLog);
      }
      if (!(<any>console).overloaded.log) {
        (<any>console).overloaded.log = true;
        const _log = console.log;
        console.log = function () {
          return _log.apply(console, ConsoleTool.handleLogMessage(BrtLogType.LOG, arguments));
        };
      }
      if (!(<any>console).overloaded.debug) {
        (<any>console).overloaded.debug = true;
        const _debug = console.debug;
        console.debug = function () {
          return _debug.apply(console, ConsoleTool.handleLogMessage(BrtLogType.DEBUG, arguments));
        };
      }
      if (!(<any>console).overloaded.error) {
        (<any>console).overloaded.error = true;
        const _error = console.error;
        console.error = function () {
          const args = ConsoleTool.handleLogMessage(BrtLogType.ERROR, arguments);
          args.push(new Error().stack);
          return _error.apply(console, args);
        };
      }
      if (!(<any>console).overloaded.warn) {
        (<any>console).overloaded.warn = true;
        const _warn = console.warn;
        console.warn = function () {
          return _warn.apply(console, ConsoleTool.handleLogMessage(BrtLogType.WARN, arguments));
        };
      }
      if (!(<any>console).overloaded.info) {
        (<any>console).overloaded.info = true;
        const _info = console.info;
        console.info = function () {
          return _info.apply(console, ConsoleTool.handleLogMessage(BrtLogType.INFO, arguments));
        };
      }
      ConsoleTool.addEventHandlers();
    } else {
      // console.info('BRUIT.IO - console already overloaded or disabled');
    }
  }

  private static handleLogMessage(type: BrtLogType, args: IArguments): Array<any> {
    if (type && args && args.length > 0) {
      const parentArgs = Array.from(args);

      const currentLog = {
        type: type,
        timestamp: new Date(),
        arguments: []
      };

      parentArgs.forEach(arg => {
        if (typeof arg === 'object') {
          try {
            arg = JSON.stringify((<any>JSON).decycle(arg));
          } catch (err) {
            arg = '';
          }
        }
        currentLog.arguments.push(arg);
      });
      if (!Array.isArray(ConsoleTool.logByLevel[currentLog.type])) {
        ConsoleTool.logByLevel[currentLog.type] = [];
      }
      ConsoleTool.logByLevel[currentLog.type].push(currentLog);
      if (ConsoleTool.logByLevel[currentLog.type].length > ConsoleTool.bruitCoreConfig.logCacheLength[currentLog.type]) {
        ConsoleTool.logByLevel[currentLog.type].shift();
      }
      return parentArgs;
    } else {
      return [];
    }
  }
}
