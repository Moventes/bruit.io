import { BrtLabels } from './brt-labels.model';
import { BrtColors } from './brt-colors.model';
import { BrtLogLevels } from './brt-log-levels.model';
import { BrtField } from './brt-field.model';

export interface BrtConfig {
  apiKey: string;
  form: Array<BrtField>;

  labels?: BrtLabels;
  logLevels?: BrtLogLevels;
  maxLogLines?: number;
  colors?: BrtColors;
  closeModalOnSubmit?: boolean;
  durationBeforeClosing?: number;
  apiUrl?: string;
}
