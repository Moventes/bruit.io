import {
  BrtFeedback,
  BrtCookies,
  BrtNavigatorInfo,
  BrtScreenInfo,
  BrtLog,
  BrtData,
  BrtField,
  BrtServiceWorker
} from '@bruit/types';

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
  serviceWorkers: Array<BrtServiceWorker>;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.url = NavigatorTool.getUrl();
    this.cookies = NavigatorTool.getCookies();

    this.display = ScreenTool.getInfo();
    if ((<any>console).overloadable && (<any>console).overloaded && (<any>console).overloaded.logArray) {
      this.logs = (<any>console).logArray();
    } else {
      this.logs = [];
    }
  }

  public async init(): Promise<void> {
    try {
      const [screenshot, navigator, serviceWorkers] = await Promise.all([
        ScreenTool.getScreenshot(),
        NavigatorTool.getInfo(),
        NavigatorTool.getServiceWorkersList()
      ]);

      this.canvas = screenshot;
      this.navigator = navigator;
      this.serviceWorkers = serviceWorkers;
    } catch (e) {
      throw e;
    }
  }

  /**
   *
   * @param formData
   * @param data
   * @param dataFn
   */
  public async send(
    formData: Array<BrtField>,
    data: Array<BrtData> = [],
    dataFn?: () => Array<BrtData> | Promise<Array<BrtData>>
  ): Promise<any> {
    try {
      const agreementField = formData.find(field => field.id === 'agreement');
      const agreement = agreementField ? agreementField.value : true;
      const dataFromFn: Array<BrtData> = await this.getDataFromFn(dataFn);

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
        serviceWorkers: agreement ? this.serviceWorkers : undefined,
        data: this.data
      });
    } catch (e) {
      throw e;
    }
  }

  /**
   *
   * @param dataFn a function that return an Array<Field> or an Promise<Array<Field>>
   *
   * @return a promise of Array<Field>
   */
  private async getDataFromFn(dataFn?: () => Array<BrtData> | Promise<Array<BrtData>>): Promise<Array<BrtData>> {
    // dataFn (function or promise)
    if (dataFn) {
      if (typeof dataFn === 'function') {
        return dataFn();
      } else if (typeof dataFn === 'object' && (<Promise<Array<BrtData>>>dataFn).then) {
        return <Promise<Array<BrtData>>>dataFn;
      }
    } else {
      return [];
    }
  }
}
