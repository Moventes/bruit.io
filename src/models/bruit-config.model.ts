import { FormField } from './form-field.model';
export interface BruitConfigModel {
  apiKey: string;
  labels?: {
    title?: string;
    introduction?: string;
    button?: string;
  };
  logs?: {
    levels?: {
      debug?: boolean;
      info?: boolean;
      warn?: boolean;
      error?: boolean;
      network?: boolean;
      click?: boolean;
    };
    maxLines?: number;
  };
  colors?: {
    header?: string;
    body?: string;
    background?: string;
    errors?: string;
    focus?: string;
  };
  closeModalOnSubmit?: boolean;
  durationBeforeClosing?: number;
  form: Array<FormField>;
}
