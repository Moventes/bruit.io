import { BruitConfigModel } from './bruit-config.model';
import { FormField } from './form-field.model';
import { BruitError } from './bruit-error.model';

export class BruitConfig implements BruitConfigModel {
  apiKey: string;
  labels = {
    title: 'bruit.io',
    subTitle: 'send a feedback',
    send: 'send',
    cancel: 'cancel'
  };
  logs = {
    levels: {
      debug: true,
      info: true,
      warn: true,
      error: true,
      network: true,
      click: true
    },
    lines: 100
  };
  form: Array<FormField>;

  constructor(config: BruitConfigModel) {
    this.apiKey = config.apiKey;
    this.form = config.form;
    if (config.logs) {
      if (config.logs.levels) {
        this.logs.levels = {
          ...this.logs.levels,
          ...config.logs.levels
        };
      }
      if (config.logs.lines) {
        this.logs.lines = config.logs.lines;
      }
    }
    if (config.labels) {
      this.labels = {
        ...this.labels,
        ...config.labels
      };
    }
  }

  static haveError(config: BruitConfigModel): BruitError | void {
    if (!config) {
      return {
        code: 1,
        text: 'config is missing'
      };
    }
    if (!config.apiKey) {
      return {
        code: 2,
        text: 'apiKey is missing'
      };
    }
    if (!config.form) {
      return {
        code: 2,
        text: 'form is missing'
      };
    }
    return this.haveFormError(config.form);
  }

  private static haveFormError(form: Array<FormField>): BruitError | void {
    if (!Array.isArray(form)) {
      return {
        code: 3,
        text: 'config form must be an array'
      };
    }
    if (form.length === 0) {
      return {
        code: 3,
        text: 'config form must have at least one field'
      };
    }
    if (!form.every(field => !!field.label && !!field.type)) {
      return {
        code: 3,
        text: 'all config form field must have a label and a type'
      };
    }
    return;
  }
}
