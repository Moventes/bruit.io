import { BrtNavigatorInfo, BrtCookies, BrtPermissions } from '@bruit/types';
import { BrtPermissionName } from '@bruit/types/dist/enums/brt-permission-name';
import { BrtPermissionStatus } from '@bruit/types/dist/enums/brt-permission-status';

export class NavigatorTool {
  static getInfo(): Promise<BrtNavigatorInfo> {
    return NavigatorTool.getPermissions().then(permissions => ({
      cookieEnabled: window.navigator.cookieEnabled,
      userAgent: window.navigator.userAgent,
      platform: window.navigator.platform,
      language: window.navigator.language,
      doNotTrack: window.navigator.doNotTrack,
      permissions
    }));
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

  static getPermissions(): Promise<BrtPermissions> {
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
