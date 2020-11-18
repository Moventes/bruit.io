import { BrtCoreConfig, BrtError } from '@bruit/types';

function objTrimed(obj) {
  if (!obj) return null;
  return Object.keys(obj).reduce((newObj, key) => {
    const keyTrimmed = key.trim();
    let value = obj[key];
    if (typeof value === 'object') {
      value = objTrimed(value);
    }
    newObj[keyTrimmed] = value;
    return newObj;
  }, {});
}
export class BruitCoreConfig implements BrtCoreConfig {
  logCacheLength = {
    log: 100,
    debug: 100,
    info: 100,
    warn: 100,
    error: 100,
    network: 100,
    click: 100,
    url: 100
  };
  addQueryParamsToLog = false;

  constructor(config: BrtCoreConfig) {
    const configTrim: BrtCoreConfig = objTrimed(config);
    // console.log('config : ', configTrim);
    if (configTrim && configTrim.logCacheLength) {
      this.logCacheLength = {
        ...this.logCacheLength,
        ...configTrim.logCacheLength
      };
      this.addQueryParamsToLog = configTrim.addQueryParamsToLog || false;
    }
  }


  static haveError(config: BrtCoreConfig): BrtError | void {
    if (config) {
      if (config.logCacheLength) {
        if (!Object.keys(config.logCacheLength).every(v => config.logCacheLength[v] >= 0)) {
          return {
            code: 101,
            text: 'core config logCacheLength'
          };
        }
      }
    } else {
      // error
    }
  }
}
