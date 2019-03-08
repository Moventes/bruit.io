import html2canvas from '@bruit/html2canvas';
import { BrtScreenInfo } from '@bruit/types';
import { BruitIoConfig } from '../models/bruit-io-config.class';

export class ScreenTool {
  static getInfo(): BrtScreenInfo {
    return {
      height: window.screen.height,
      width: window.screen.width,
      pixelRatio: window.devicePixelRatio
    };
  }

  static getScaleFromWidth(width: number): number {
    return width / screen.width;
  }

  static async getScreenshot(bruitIoConfig: BruitIoConfig): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      const div = document.body;
      const options = {
        background: 'white',
        height: div.scrollHeight,
        width: div.scrollWidth,
        scale: bruitIoConfig.screenshot && bruitIoConfig.screenshot.desiredWidth ? ScreenTool.getScaleFromWidth(bruitIoConfig.screenshot.desiredWidth) : window.devicePixelRatio,
        logging: false,
        imageTimeout: 1500
      };
      try {
        const canvas = await html2canvas(div, options);
        canvas.toBlob((result: Blob) => {
          resolve(result);
        }, bruitIoConfig.screenshot.imageType, bruitIoConfig.screenshot.compression)
      } catch (error) {
        console.error(error);
        reject(error);
      }
    })
  }
}
