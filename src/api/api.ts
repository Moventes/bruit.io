import { BrtFeedback } from '@bruit/types';
import { ComponentConfig } from '../config/config';
export class Api {
  static postFeedback(feedback: BrtFeedback): Promise<any> {
    return fetch(ComponentConfig.BRUIT_IO_API_URL, {
      method: 'POST',
      body: JSON.stringify(feedback),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
      .then(response => Api.handleErrors(response))
      .then(() => {
        // var contentType = response.headers.get('content-type');
        // if (contentType && contentType.indexOf('application/json') !== -1) {
        //   return response.json();
        // } else {
        //   return;
        // }
        return;
      });
  }

  static handleErrors(response) {
    if (!response.ok) {
      return Promise.reject(response);
    }
    return response;
  }
}
