import html2canvas from 'html2canvas';
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

  static getScaleFromHeight(height: number): number {
    return height / screen.height;
  }

  static async getScreenshot(bruitIoConfig?: BruitIoConfig): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      const div = bruitIoConfig.elementToRenderSelector ? document.querySelector(bruitIoConfig.elementToRenderSelector) : document.body;
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
      if (bruitIoConfig && bruitIoConfig.screenshot) {
        const scaleFromWidth = bruitIoConfig.screenshot.maxWidth ? ScreenTool.getScaleFromWidth(bruitIoConfig.screenshot.maxWidth) : window.devicePixelRatio;
        const scaleFromHeight = bruitIoConfig.screenshot.maxHeight ? ScreenTool.getScaleFromHeight(bruitIoConfig.screenshot.maxHeight) : window.devicePixelRatio;
        options.scale = Math.min(scaleFromWidth, scaleFromHeight);
        if (bruitIoConfig.screenshot.imageType) imageType = bruitIoConfig.screenshot.imageType;
        if (bruitIoConfig.screenshot.compression) compression = bruitIoConfig.screenshot.compression;
      }
      try {
        const canvas = await html2canvas(div as HTMLElement, options);
        if (canvas.toBlob) {
          canvas.toBlob((result: Blob) => {
            resolve(result);
          }, imageType, compression)
        } else {
          const dataUrl = await canvas.toDataURL(bruitIoConfig.screenshot.imageType, bruitIoConfig.screenshot.compression);
          resolve(ScreenTool.dataURLtoBlob(dataUrl));
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }
    })
  }

  static dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, uarr8 = new Uint8Array(n);
    while (n--) {
      uarr8[n] = bstr.charCodeAt(n);
    }
    return new Blob([uarr8], { type: mime });
  }

}
