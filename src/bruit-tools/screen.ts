import html2canvas from '@bruit/html2canvas';
import { BrtScreenInfo } from '@bruit/types';
import { BrtScreenshot } from '@bruit/types/dist/interfaces/brt-screenshot';

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

  static getScaleFromHeight(height: number): number {
    return height / screen.height;
  }

  static async getScreenshot(screenshotConfig?: BrtScreenshot): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      const div = screenshotConfig && screenshotConfig.elementToRenderSelector ? document.querySelector(screenshotConfig.elementToRenderSelector) : document.body;
      const options = {
        background: 'white',
        height: div.scrollHeight,
        width: div.scrollWidth,
        logging: false,
        imageTimeout: 1500,
        scale: null
      };
      let imageType = 'image/png';
      let compression = 0.5;
      if (screenshotConfig) {
        const scaleFromWidth = screenshotConfig.maxWidth ? ScreenTool.getScaleFromWidth(screenshotConfig.maxWidth) : window.devicePixelRatio;
        const scaleFromHeight = screenshotConfig.maxHeight ? ScreenTool.getScaleFromHeight(screenshotConfig.maxHeight) : window.devicePixelRatio;
        options.scale = Math.min(scaleFromWidth, scaleFromHeight);
        if (screenshotConfig.imageType) imageType = screenshotConfig.imageType;
        if (screenshotConfig.compression) compression = screenshotConfig.compression;
      }
      try {
        const canvas = await html2canvas(div, options);
        canvas.toBlob((result: Blob) => {
          resolve(result);
        }, imageType, compression)
      } catch (error) {
        console.error(error);
        reject(error);
      }
    })
  }
}
