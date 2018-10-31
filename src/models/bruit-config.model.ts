import { LogLevels } from './log-levels.model';
import { FormField } from './form-field.model';
export interface BruitConfigModel {
  apiKey: string;
  labels?: {
    title?: string;
    introduction?: string;
    button?: string;
  };
  logs?: {
    levels?: LogLevels;
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
