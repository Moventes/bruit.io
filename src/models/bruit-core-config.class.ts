import { BrtCoreConfig, BrtError } from '@bruit/types';

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
    if (config && config.logCacheLength) {
      this.logCacheLength = {
        ...this.logCacheLength,
        ...config.logCacheLength
      };
      this.addQueryParamsToLog = config.addQueryParamsToLog || false;
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
