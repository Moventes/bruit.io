import html2canvas from '@bruit/html2canvas';
import { BrtScreenInfo } from '@bruit/types';

export class ScreenTool {
  static getInfo(): BrtScreenInfo {
    return {
      height: window.screen.height,
      width: window.screen.width,
      pixelRatio: window.devicePixelRatio
    };
  }

  static async getScreenshot(): Promise<string> {
    const div = document.body;
    const options = {
      background: 'white',
      height: div.clientHeight,
      width: div.clientWidth,
      logging: false
    };
    try {
      const canvas = await html2canvas(div, options);
      const base64 = await canvas.toDataURL();
      return base64;
    } catch (error) {
      console.error(error);
    }
  }
}
