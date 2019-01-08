import { BrtFeedback } from '@bruit/types';
import { ComponentConfig } from '../config/config';
export class Api {
  static postFeedback(feedback: BrtFeedback): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', ComponentConfig.BRUIT_IO_API_URL, true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.onreadystatechange = function() {
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

      xhr.send(JSON.stringify(JSON['decycle']?JSON['decycle'](feedback):feedback));
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
