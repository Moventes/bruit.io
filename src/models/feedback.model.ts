import { Field } from './field.model';
import { NavigatorInfo } from './navigator-info.model';
import { ScreenInfo } from './screen-info.model';
import { Cookies } from './cookies.model';
import { Log } from './log.model';

export interface FeedbackModel {
  apiKey: string;
  canvas: string;
  url: string;
  cookies: Cookies;
  navigator: NavigatorInfo;
  display: ScreenInfo;
  additionnalInfosEnabled: boolean;
  logs: Array<Log>;
  fields: Array<Field>;
}
