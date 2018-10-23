import { FormField } from './form-field.model';
export interface BruitConfig {
  apiKey: string;
  labels: {
    title: string;
    subTitle: string;
    send: string;
    cancel: string;
  };
  logs?: {
    levels: {
      debug: boolean;
      info: boolean;
      warn: boolean;
      error: boolean;
      network: boolean;
      click: boolean;
    };
    lines: number;
  };
  form: Array<FormField>;
}
