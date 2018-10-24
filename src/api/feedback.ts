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

  //class Feedback:
  private _data: Array<Field>;

  constructor(apiKey: string, data: Array<Field> = []) {
    this.apiKey = apiKey;
    this._data = data;
    this.url = NavigatorTool.getUrl();
    this.cookies = NavigatorTool.getCookies();
    this.navigator = NavigatorTool.getInfo();
    this.display = ScreenTool.getInfo();
    this.logs = (<any>console).logArray();
  }

  init(dataFn: () => Array<Field> | Promise<Array<Field>>): Promise<void> {
    // take screenShot
    const promises = [
      ScreenTool.getScreenshot().then(screenshot => {
        this.canvas = screenshot;
        return;
      })
    ];

    // call dataFn (function or promise)
    if (dataFn) {
      if (typeof dataFn === 'function') {
        this.pushNewData((<() => Array<Field>>dataFn)());
      } else if (typeof dataFn === 'object' && (<Promise<Array<Field>>>dataFn).then) {
        promises.push(
          (<Promise<Array<Field>>>dataFn).then(newData => {
            this.pushNewData(newData);
            return;
          })
        );
      }
    }

    return Promise.all(promises).then(() => {
      return;
    });
  }

  send(formData: Array<FormField>): Promise<void> {
    this.fields = [...formData.map(ff => <Field>{ type: ff.type, value: ff.value, label: ff.label }), ...this._data];
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
  }

  private pushNewData(newData: Array<Field>) {
    if (Array.isArray(newData)) {
      this._data.push(...newData);
    }
  }
}
