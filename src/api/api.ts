import { FeedbackModel } from './../models/feedback.model';
export class Api {
  static postFeedback(feedback: FeedbackModel): Promise<void> {
    console.log(':) send feedback : ', feedback);
    return Promise.resolve();
  }
}
