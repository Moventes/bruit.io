import { ComponentConfig } from '../config/config';
import { FeedbackModel } from './../models/feedback.model';
export class Api {
  static postFeedback(feedback: FeedbackModel): Promise<any> {
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
