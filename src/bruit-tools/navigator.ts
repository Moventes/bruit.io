import { BrtNavigatorInfo, BrtCookies } from '@bruit/types';

export class NavigatorTool {
  static getInfo(): BrtNavigatorInfo {
    return {
      cookieEnabled: window.navigator.cookieEnabled,
      userAgent: window.navigator.userAgent,
      platform: window.navigator.platform,
      language: window.navigator.language,
      doNotTrack: window.navigator.doNotTrack
    };
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
}
