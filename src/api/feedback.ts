import { FeedbackModel } from './../models/feedback.model';
import { Cookies } from '../models/cookies.model';
import { NavigatorInfo } from '../models/navigator-info.model';
import { ScreenInfo } from '../models/screen-info.model';
import { Log } from '../models/log.model';
import { Field } from '../models/field.model';
import { ScreenTool } from '../bruit-tools/screen';
import { NavigatorTool } from '../bruit-tools/navigator';

export class Feedback implements FeedbackModel {
  apiKey: string;
  canvas: string;
  url: string;
  cookies: Cookies;
  navigator: NavigatorInfo;
  display: ScreenInfo;
  additionnalInfosEnabled: boolean;
  logs: Array<Log>;
  fields: Array<Field>;

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

  // dataFn :((()=>Array<Field>>)|Promise<Array<Field>>)
  initAsync(dataFn: any): Promise<void> {
    // take screenShot
    const promises = [
      ScreenTool.getScreenshot().then(screenshot => {
        this.canvas = screenshot;
        return;
      })
    ];

    // call dataFn
    if (dataFn) {
      if (typeof dataFn === 'function') {
        this.pushNewData(dataFn());
      } else if (typeof dataFn === 'object' && dataFn.then) {
        promises.push(
          dataFn().then(newData => {
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

  private pushNewData(newData: Array<Field>) {
    if (Array.isArray(newData)) {
      this._data.push(...newData);
    }
  }
}
