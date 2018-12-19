import { BrtNavigatorInfo, BrtCookies, BrtPermissions } from '@bruit/types';
import { BrtPermissionName } from '@bruit/types/dist/enums/brt-permission-name';
import { BrtPermissionStatus } from '@bruit/types/dist/enums/brt-permission-status';

export class NavigatorTool {
  static async getInfo(): Promise<BrtNavigatorInfo> {
    try {
      const [permissions, storage] = await Promise.all([
        NavigatorTool.getPermissions(),
        NavigatorTool.getStorageInformation()
      ]);
      const { cookieEnabled, userAgent, platform, language, doNotTrack } = window.navigator;
      const network = this.getNetworkInformation();
      const plugins = this.getPluginsInformation();
      return {
        cookieEnabled,
        userAgent,
        platform,
        language,
        doNotTrack,
        permissions,
        network,
        storage,
        plugins
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static getNetworkInformation(): BrtNetwork {
    if ('connection' in window.navigator) {
      const { downlink, effectiveType, type } = window.navigator['connection'];
      return { downlink, effectiveType, type };
    } else {
      return null;
    }
  }

  static getPluginsInformation(): Array<string> {
    if ('plugins' in window.navigator) {
      const plugins = [];
      for (let i = 0; i < window.navigator.plugins.length; i++) {
        const plugin = window.navigator.plugins.item(i);
        if (plugin) plugins.push(plugin.name);
      }
      return plugins;
    } else {
      return null;
    }
  }

  static async getStorageInformation(): Promise<BrtStorageEstimate> {
    return navigator.storage.estimate();
  }

  static getCookies(): BrtCookies {
    return document.cookie
      .split('; ')
      .map(c => c.split('='))
      .filter(cookie => cookie.length === 2 && cookie[0][0] !== '_')
      .reduce((acc, cur) => {
        acc[cur[0]] = cur[1];
        return acc;
      }, {});
  }

  static getUrl(): string {
    return window.location.href;
  }

  static async getPermissions(): Promise<BrtPermissions> {
    if (navigator && (<any>navigator).permissions && (<any>navigator).permissions.query) {
      const permissionsQueries = Object.keys(BrtPermissionName).map(permissionKey =>
        (<any>navigator).permissions
          .query({ name: BrtPermissionName[permissionKey] })
          .then(pStatus => {
            pStatus.name = BrtPermissionName[permissionKey];
            return pStatus;
          })
          .catch(() => Promise.resolve({ unsupported: true }))
      );

      return Promise.all(permissionsQueries).then(permisionsStatus =>
        permisionsStatus
          .filter(pStatus => !pStatus.unsupported && pStatus.state !== BrtPermissionStatus.PROMPT)
          .reduce((acc, pStatus) => {
            acc[pStatus.name] = pStatus.state;
            return acc;
          }, {})
      );
    } else {
      return Promise.resolve({});
    }
  }
}
