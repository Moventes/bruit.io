import { BrtConfig, BrtError, BrtField } from '@bruit/types';
import { BrtFieldType } from '@bruit/types/dist/enums/brt-field-type';
import * as Config from '../config/config.json';

export class BruitIoConfig implements BrtConfig {
  apiKey: string;
  apiUrl: string = Config['BRUIT_IO_API_URL'];
  labels = {
    title: 'bruit.io',
    introduction: '',
    button: 'send'
  };
  colors = {
    header: '#2D8297',
    body: '#eee',
    background: '#444444ee',
    errors: '#c31313',
    focus: '#1f5a69'
  };
  closeModalOnSubmit = false;
  durationBeforeClosing = 1000;
  form: Array<BrtField>;
  screenshot = {
    maxWidth: null,
    maxHeight: null,
    imageType: 'image/png',
    compression: 0.9
  };
  elementToRenderSelector: string;

  constructor(config: BrtConfig) {
    this.apiKey = config.apiKey;

    this.form = config.form.map((field, index) => {
      field.id = field.id
        ? field.id.trim().toLowerCase()
        : `${index}-${field.label
            .trim()
            .replace(/[^A-Za-z\s]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase()}`;
      return field;
    });

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
      this.apiUrl = config.apiUrl;
    }
    if (config.screenshot) {
      this.screenshot = {
        ...this.screenshot,
        ...config.screenshot
      };
    }
    if (config.elementToRenderSelector) {
      this.elementToRenderSelector = config.elementToRenderSelector;
    }
  }

  static haveError(config: BrtConfig): BrtError | void {
    if (!config) {
      return {
        code: 100,
        text: 'config is missing'
      };
    }
    if (
      !config.apiKey &&
      (!config.apiUrl || config.apiUrl === Config['BRUIT_IO_API_URL'])
    ) {
      return {
        code: 101,
        text: 'apiKey is missing'
      };
    }
    if (!config.form) {
      return {
        code: 102,
        text: 'form is missing'
      };
    }
    return this.haveFormError(config.form);
  }

  private static haveFormError(form: Array<BrtField>): BrtError | void {
    if (!Array.isArray(form)) {
      return {
        code: 110,
        text: 'config form must be an array'
      };
    }
    if (form.length === 0) {
      return {
        code: 111,
        text: 'config form must have at least one field'
      };
    }
    if (!form.every(field => !!field.label && !!field.type)) {
      return {
        code: 112,
        text: 'all config form field must have a label and a type'
      };
    }
    const agreementField = form.find(field => field.id === 'agreement');
    if (!agreementField) {
      return {
        code: 113,
        text: 'agreement field is missing'
      };
    }
    if (agreementField.type !== BrtFieldType.CHECKBOX) {
      return {
        code: 114,
        text: 'agreement field must be a checkbox'
      };
    }
    // control of unicity of IDs
    if (
      form
        .map(field => field.id)
        .filter(id => !!id)
        .find((id, index, a) => a.indexOf(id) !== index && a.indexOf(id) >= 0)
    ) {
      return {
        code: 115,
        text: 'form field must have unique id'
      };
    }
    // control types
    const allTypes = Object.keys(BrtFieldType).map(
      BrtFieldTypeKey => BrtFieldType[BrtFieldTypeKey]
    );
    const badTypes = form
      .map(field => field.type)
      .filter(type => !allTypes.includes(type));
    if (badTypes.length > 0) {
      return {
        code: 116,
        text: `types ${badTypes.toString()} are not suported`
      };
    }
    return;
  }
}
