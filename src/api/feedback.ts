import { BrtFeedback, BrtCookies, BrtNavigatorInfo, BrtScreenInfo, BrtLog, BrtData, BrtField } from '@bruit/types';

import { Api } from './api';
import { ScreenTool } from '../bruit-tools/screen';
import { NavigatorTool } from '../bruit-tools/navigator';

export class Feedback implements BrtFeedback {
  //FeedbackModel:
  apiKey: string;
  canvas: string;
  url: string;
  cookies: BrtCookies;
  navigator: BrtNavigatorInfo;
  display: BrtScreenInfo;
  logs: Array<BrtLog>;
  data: Array<BrtData>;

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

  /**
   *
   * @param formData
   * @param data
   * @param dataFn
   */
  send(
    formData: Array<BrtField>,
    data: Array<BrtData> = [],
    dataFn?: () => Array<BrtData> | Promise<Array<BrtData>>
  ): Promise<any> {
    const agreementField = formData.find(field => field.id === 'agreement');
    const agreement = agreementField ? agreementField.value : true;
    return this.getDataFromFn(dataFn).then((dataFromFn: Array<BrtData>) => {
      this.data = [
        ...formData.map(ff => <BrtData>{ type: ff.type, value: ff.value, label: ff.label, id: ff.id }),
        ...data,
        ...dataFromFn
      ];
      return Api.postFeedback({
        apiKey: this.apiKey,
        canvas: agreement ? this.canvas : undefined,
        url: agreement ? this.url : undefined,
        cookies: agreement ? this.cookies : undefined,
        navigator: agreement ? this.navigator : undefined,
        display: agreement ? this.display : undefined,
        logs: agreement ? this.logs : undefined,
        data: this.data
      });
    });
  }

  /**
   *
   * @param dataFn a function that return an Array<Field> or an Promise<Array<Field>>
   *
   * @return a promise of Array<Field>
   */
  private getDataFromFn(dataFn?: () => Array<BrtData> | Promise<Array<BrtData>>): Promise<Array<BrtData>> {
    // dataFn (function or promise)
    if (dataFn) {
      if (typeof dataFn === 'function') {
        Promise.resolve((<() => Array<BrtData>>dataFn)());
      } else if (typeof dataFn === 'object' && (<Promise<Array<BrtData>>>dataFn).then) {
        return <Promise<Array<BrtData>>>dataFn;
      }
    } else {
      return Promise.resolve([]);
    }
  }
}
