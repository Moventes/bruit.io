import { BruitConfig } from '../models/bruit-config.class';
import { BrtLogLevels, BrtLog, BrtLogType } from '@bruit/types';

export class ConsoleTool {
  private static BUFFER_SIZE = 100;
  private static logByLevel: { [level: string]: Array<BrtLog> } = {};

  static init(config: BruitConfig) {
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
    ConsoleTool.BUFFER_SIZE = Math.max(config.maxLogLines, ConsoleTool.BUFFER_SIZE);
    ConsoleTool.configure();
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
              value.forEach(function(element, i) {
                nu[i] = derez(element, path + '[' + i + ']');
              });
            } else {
              nu = {};
              Object.keys(value).forEach(function(name) {
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
              value.forEach(function(element, i) {
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
              Object.keys(value).forEach(function(name) {
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

    if (!(<any>console).overloaded && (<any>console).overloadable) {
      (<any>console).overloaded = true;

      (<any>console).logArray = function(levels: BrtLogLevels, maxLines: number = ConsoleTool.BUFFER_SIZE) {
        return Object.entries(levels)
          .filter(v => v[1])
          .map(v => ConsoleTool.logByLevel[v[0]])
          .reduce((logArray, logsLevel) => logArray.concat(logsLevel), [])
          .sort((logA, logB) => logA.timestamp.getTime() - logB.timestamp.getTime())
          .slice(0, maxLines);
      };

      (<any>console).click = function() {
        return ConsoleTool.handleLogMessage(BrtLogType.CLICK, arguments);
      };

      (<any>console).url = function() {
        return ConsoleTool.handleLogMessage(BrtLogType.URL, arguments);
      };

      (<any>console).network = function() {
        return ConsoleTool.handleLogMessage(BrtLogType.NETWORK, arguments);
      };

      const _log = console.log;
      console.log = function() {
        return _log.apply(console, ConsoleTool.handleLogMessage(BrtLogType.LOG, arguments));
      };

      const _debug = console.debug;
      console.debug = function() {
        return _debug.apply(console, ConsoleTool.handleLogMessage(BrtLogType.DEBUG, arguments));
      };

      const _error = console.error;
      console.error = function() {
        const args = ConsoleTool.handleLogMessage(BrtLogType.ERROR, arguments);
        args.push(new Error().stack);
        return _error.apply(console, args);
      };

      const _warn = console.warn;
      console.warn = function() {
        return _warn.apply(console, ConsoleTool.handleLogMessage(BrtLogType.WARN, arguments));
      };

      const _info = console.info;
      console.info = function() {
        return _info.apply(console, ConsoleTool.handleLogMessage(BrtLogType.INFO, arguments));
      };
    } else {
      // console.info('BRUIT.IO - console already overloaded or disabled');
    }
  }

  private static handleLogMessage(type: BrtLogType, args: IArguments): Array<any> {
    if (type && args && args.length > 0) {
      const parentArgs = Array.from(args);

      const thisLog = {
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
        thisLog.arguments.push(arg);
      });
      if (!Array.isArray(ConsoleTool.logByLevel[thisLog.type])) {
        ConsoleTool.logByLevel[thisLog.type] = [];
      }
      ConsoleTool.logByLevel[thisLog.type].push(thisLog);
      if (ConsoleTool.logByLevel[thisLog.type].length > ConsoleTool.BUFFER_SIZE) {
        ConsoleTool.logByLevel[thisLog.type].shift();
      }
      return parentArgs;
    } else {
      return [];
    }
  }
}
