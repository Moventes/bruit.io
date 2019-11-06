import { BrtFeedback } from '@bruit/types';
import LZString from 'lz-string';
import { NavigatorTool } from '../bruit-tools/navigator.js';
import * as Config from '../config/config.json';

export class Api {
  static postFeedback(feedback: BrtFeedback, apiUrl?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const screenshot = feedback.canvas;
      delete feedback.canvas;
      const formData = new FormData();
      let FeedbackCompressed;
      let compression: string;
      if (NavigatorTool.navigatorDoesNotSupportsUtf16()) {
        FeedbackCompressed = LZString.compressToBase64(JSON.stringify(JSON['decycle'] ? JSON['decycle'](feedback) : feedback));
        compression = 'base64'
      } else {
        FeedbackCompressed = LZString.compressToUTF16(JSON.stringify(JSON['decycle'] ? JSON['decycle'](feedback) : feedback));
        compression = 'utf16'
      }
      formData.append('feedback', FeedbackCompressed);

      if (screenshot) {
        formData.append('screenshot', screenshot, 'screenshot.png');
      }

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${apiUrl || Config['BRUIT_IO_API_URL']}/${compression}`, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 || (xhr.readyState === 2 && xhr.status === 200)) {
          if (JSON.stringify(xhr.status).startsWith('2') || xhr.status === 304) {
            resolve();
          } else {
            try {
              const body = JSON.parse(xhr.responseText);
              reject({ ...xhr, code: 900, text: (body ? body.message : null) || 'An Unexpected Error Occurred' });
            } catch {
              reject({ ...xhr, code: 900, text: 'An Unexpected Error Occurred' });
            }
          }
        }
      };
      xhr.send(formData);
    });
  }

  // static postFeedback(feedback: BrtFeedback): Promise<any> {
  //   return fetch(ComponentConfig.BRUIT_IO_API_URL, {
  //     method: 'POST',
  //     body: JSON.stringify(feedback),
  //     headers: new Headers({ 'Content-Type': 'text/plain' })
  //   })
  //   .then(response => Api.handleErrors(response))
  //   .then(() => {
  //     // var contentType = response.headers.get('content-type');
  //     // if (contentType && contentType.indexOf('application/json') !== -1) {
  //     //   return response.json();
  //     // } else {
  //     //   return;
  //     // }
  //     return;
  //   });

  // }

  // static handleErrors(response: Response): Promise<any> {
  //   if (!response.ok) {
  //     if (response.body) {
  //       return response.json().then(body => {
  //         return Promise.reject({ ...body, code: 900, text: body.message || 'An Unexpected Error Occurred' });
  //       });
  //     } else {
  //       return Promise.reject(response);
  //     }
  //   }
  //   return Promise.resolve(response);
  // }
}
