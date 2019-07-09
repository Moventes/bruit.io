import { BrtCoreConfig, BrtError } from '@bruit/types';
import * as Config from '../config/config.json';

export class BruitCoreConfig implements BrtCoreConfig {
  apiKey: string;
  apiUrl: string = Config['BRUIT_IO_API_URL'];
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
    this.apiKey = config.apiKey;
    if (config.apiUrl) {
      this.apiUrl = config.apiUrl;
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
      if (!config.apiKey && (!config.apiUrl || config.apiUrl === Config['BRUIT_IO_API_URL'])) {
        return {
          code: 101,
          text: 'apiKey is missing'
        };
      }
    } else {
      return {
        code: 100,
        text: 'config is missing'
      };
    }
  }
}
