import { FeedbackModel } from './../models/feedback.model';
export class Api {
  static postFeedback(feedback: FeedbackModel): Promise<void> {
    console.log(`:) send feedback to ${process.env.BRUIT_IO_API_URL}: `, feedback);
    return Promise.resolve();
  }
}
