import { BrtError, BrtCoreConfig } from '@bruit/types';

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

  constructor(config: BrtCoreConfig) {
    if (config.logCacheLength) {
      this.logCacheLength = {
        ...this.logCacheLength,
        ...config.logCacheLength
      };
    }
  }

  static haveError(config: BrtCoreConfig): BrtError | void {
    if (config) {
      if (config.logCacheLength) {
        if (!Object.entries(config.logCacheLength).every(v => v[1] >= 0)) {
          return {
            code: 101,
            text: 'core config logCacheLength'
          };
        }
      }
    }
  }
}
