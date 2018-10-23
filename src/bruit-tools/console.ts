export class ConsoleTool {
  private static BUFFER_SIZE = 100;
  private static logArray = [];

  static init() {
    ConsoleTool.BUFFER_SIZE = 100;
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

    if (!(<any>console).overloaded) {
      console.log('[FeedlogService] - will overload console');

      (<any>console).overloaded = true;

      (<any>console).click = function() {
        return ConsoleTool.handleLogMessage('click', arguments);
      };

      (<any>console).http = function() {
        return ConsoleTool.handleLogMessage('http', arguments);
      };

      const _log = console.log;
      (<any>console).logArray = function() {
        return JSON.parse(JSON.stringify(ConsoleTool.logArray));
      };

      // if (
      //   !!(<any>window).cordova ||
      //   (document.URL.indexOf('http://localhost') !== 0 && document.URL.indexOf('http://127.0.0.1') !== 0)
      // ) {
      console.log = function() {
        return _log.apply(console, ConsoleTool.handleLogMessage('log', arguments));
      };

      const _debug = console.debug;
      console.debug = function() {
        return _debug.apply(console, ConsoleTool.handleLogMessage('log', arguments));
      };

      const _error = console.error;
      console.error = function() {
        const args = ConsoleTool.handleLogMessage('error', arguments);
        args.push(new Error().stack);
        return _error.apply(console, args);
      };

      const _warn = console.warn;
      console.warn = function() {
        return _warn.apply(console, ConsoleTool.handleLogMessage('warn', arguments));
      };

      const _info = console.info;
      console.info = function() {
        return _info.apply(console, ConsoleTool.handleLogMessage('log', arguments));
      };
      // }
    } else {
      console.log('[FeedlogService] - console already overloaded');
    }
  }

  private static handleLogMessage(type: string, args: IArguments): Array<any> {
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
      ConsoleTool.logArray.push(thisLog);
      if (ConsoleTool.logArray.length > ConsoleTool.BUFFER_SIZE) {
        ConsoleTool.logArray.shift();
      }
      return parentArgs;
    } else {
      return [];
    }
  }
}
