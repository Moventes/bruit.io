import { Api } from './api';
import { FormField } from './../models/form-field.model';
import { FeedbackModel } from './../models/feedback.model';
import { Cookies } from '../models/cookies.model';
import { NavigatorInfo } from '../models/navigator-info.model';
import { ScreenInfo } from '../models/screen-info.model';
import { Log } from '../models/log.model';
import { Field } from '../models/field.model';
import { ScreenTool } from '../bruit-tools/screen';
import { NavigatorTool } from '../bruit-tools/navigator';

export class Feedback implements FeedbackModel {
  //FeedbackModel:
  apiKey: string;
  canvas: string;
  url: string;
  cookies: Cookies;
  navigator: NavigatorInfo;
  display: ScreenInfo;
  logs: Array<Log>;
  fields: Array<Field>;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.url = NavigatorTool.getUrl();
    this.cookies = NavigatorTool.getCookies();
    this.navigator = NavigatorTool.getInfo();
    this.display = ScreenTool.getInfo();
    this.logs = (<any>console).logArray();
  }

  init(): Promise<void> {
    // take screenShot
    return ScreenTool.getScreenshot().then(screenshot => {
      this.canvas = screenshot;
      return;
    });
  }

  send(
    formData: Array<FormField>,
    data: Array<Field> = [],
    dataFn?: () => Array<Field> | Promise<Array<Field>>
  ): Promise<void> {
    return this.getDataFromFn(dataFn).then((dataFromFn: Array<Field>) => {
      this.fields = [
        ...formData.map(ff => <Field>{ type: ff.type, value: ff.value, label: ff.label }),
        ...data,
        ...dataFromFn
      ];
      return Api.postFeedback({
        apiKey: this.apiKey,
        canvas: this.canvas,
        url: this.url,
        cookies: this.cookies,
        navigator: this.navigator,
        display: this.display,
        logs: this.logs,
        fields: this.fields
      });
    });
  }

  private getDataFromFn(dataFn?: () => Array<Field> | Promise<Array<Field>>): Promise<Array<Field>> {
    // dataFn (function or promise)
    if (dataFn) {
      if (typeof dataFn === 'function') {
        Promise.resolve((<() => Array<Field>>dataFn)());
      } else if (typeof dataFn === 'object' && (<Promise<Array<Field>>>dataFn).then) {
        return <Promise<Array<Field>>>dataFn;
      }
    } else {
      return Promise.resolve([]);
    }
  }
}
