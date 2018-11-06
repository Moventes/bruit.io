import { BruitConfigModel } from './bruit-config.model';
import { FormField } from './form-field.model';
import { BruitError } from './bruit-error.model';
import { ComponentConfig } from '../config/config';

export class BruitConfig implements BruitConfigModel {
  apiKey: string;
  labels = {
    title: 'bruit.io',
    introduction: 'send a feedback',
    button: 'send'
  };
  logs = {
    levels: {
      log: true,
      debug: true,
      info: true,
      warn: true,
      error: true,
      network: true,
      click: true,
      url: true
    },
    maxLines: 100
  };
  colors = {
    header: '#2D8297',
    body: '#eee',
    background: '#444444ee',
    errors: '#c31313',
    focus: '#1f5a69'
  };
  closeModalOnSubmit = false;
  durationBeforeClosing = 1500;
  form: Array<FormField>;

  constructor(config: BruitConfigModel) {
    this.apiKey = config.apiKey;
    this.form = config.form.map((field, index) => {
      field.id = index + '-' + field.type;
      return field;
    });
    if (config.logs) {
      if (config.logs.levels) {
        this.logs.levels = {
          ...this.logs.levels,
          ...config.logs.levels
        };
      }
      if (config.logs.maxLines) {
        this.logs.maxLines = config.logs.maxLines;
      }
    }
    if (config.labels) {
      this.labels = {
        ...this.labels,
        ...config.labels
      };
    }
    if (config.colors) {
      this.colors = {
        ...this.colors,
        ...config.colors
      };
    }
    if (typeof config.closeModalOnSubmit === 'boolean') {
      this.closeModalOnSubmit = config.closeModalOnSubmit;
    }
    if (typeof config.durationBeforeClosing === 'number') {
      this.durationBeforeClosing = config.durationBeforeClosing;
    }
    if (config.apiUrl) {
      ComponentConfig.BRUIT_IO_API_URL = config.apiUrl;
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
    const agreementField = form.find(field => field.id === 'agreement');
    if (!agreementField) {
      return {
        code: 4,
        text: 'agreement field is missing'
      };
    }
    if (agreementField.type !== 'checkbox') {
      return {
        code: 4,
        text: 'agreement field must be a checkbox'
      };
    }
    return;
  }
}
