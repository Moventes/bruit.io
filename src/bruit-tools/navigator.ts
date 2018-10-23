import { Cookies } from './../models/cookies.model';
import { NavigatorInfo } from './../models/navigator-info.model';

export class NavigatorTool {
  static getInfo(): NavigatorInfo {
    return {
      cookieEnabled: window.navigator.cookieEnabled,
      userAgent: window.navigator.userAgent,
      platform: window.navigator.platform,
      language: window.navigator.language,
      doNotTrack: window.navigator.doNotTrack
    };
  }

  static getCookies(): Cookies {
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
