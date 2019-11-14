import { Component, h, Prop, Watch, State, EventEmitter, Method, Event, Element } from '@stencil/core';
import { BrtCoreConfig, BrtError, BrtField, BrtData } from '@bruit/types';
import { BrtFieldType } from '@bruit/types/dist/enums/brt-field-type';
import { BruitCoreConfig } from '../../models/bruit-core-config.class';
import { ConsoleTool } from '../../bruit-tools/console';
import { Feedback } from '../../api/feedback';
import { BruitIoConfig } from '../../models/bruit-io-config.class';
import { NavigatorTool } from '../../bruit-tools/navigator';
import { SubmitButtonState } from '../../enums/submitButtonState.enum';

@Component({
  tag: 'bruit-core',
  styleUrl: 'bruit-core.scss',
  shadow: true
})
export class BruitCore {
  // attributs on bruit-io component

  // configuration
  @Prop({ attribute: 'brt-config' })
  config: BrtCoreConfig | string;

  /**
   * test validity of config and assign to internal config
   * @param newConfig the new value of config
   */
  @Watch('config')
  initConfig(newConfig: BrtCoreConfig | string) {
    let _newConfig: BrtCoreConfig;
    let configError: BrtError | void;
    if (newConfig) {
      if (typeof newConfig === 'string') {
        try {
          _newConfig = JSON.parse(newConfig) as BrtCoreConfig;
        } catch {
          configError = {
            code: 100,
            text: 'bad config format (must be a json or stringified json)'
          };
        }
      } else {
        _newConfig = newConfig as BrtCoreConfig;
      }
      if (!configError) {
        configError = BruitCoreConfig.haveError(_newConfig);
      }
    }
    if (!configError) {
      this._bruitCoreConfig = new BruitCoreConfig(_newConfig);
      ConsoleTool.init(this._bruitCoreConfig);
    } else {
      this.brtError.emit(configError);
      console.error(configError);
    }
  }

  /**
   * the current and complete core config
   */
  @State()
  _bruitCoreConfig: BruitCoreConfig;

  // TODO: Issue https://github.com/ionic-team/stencil/issues/724
  // Instead of generic, replace with EventEmitter<BrtError> once issue solved
  /**
   * emit bruit-error on internal error or config error
   * ex : BruitIo.addEventListener('onError',error=>...)
   */
  @Event() brtError: EventEmitter;

  /**
   * modalOpened boolean manages the modal opening/closing action
   */
  @State()
  modalOpened: boolean = false;

  /**
   * field array to display in current modal (copy of config form)
   */
  @State()
  modalBrtField: Array<BrtField> = [];

  /**
   * bruit error to display on bottom of modal
   */
  @State()
  modalError: BrtError;

  /**
   * the current feedback (created when the modal opens)
   */
  private _currentFeedback: Feedback;

  /**
   * the current and complete config
   */
  @State()
  _bruitIoConfig: BruitIoConfig;

  // dom element of bruit-io component
  @Element()
  bruitCoreElement: HTMLBruitCoreElement;

  /**
   * fired on component loading before render()
   */
  componentWillLoad() {
    // console.info('[BRUIT.IO] - bruit started ...');
    // first init
    this.initConfig(this.config);
  }

  hideVirtualKeyboard(): Promise<void> {
    if (NavigatorTool.isMobileOrTablet()) {
      return new Promise(resolve => {
        this.bruitCoreElement.shadowRoot.getElementById('bruit-io-submit-button').focus();
        setTimeout(() => resolve(), 500);
      });
    } else {
      return Promise.resolve();
    }
  }

  waitRendering() {
    return new Promise(resolve => setTimeout(resolve));
  }

  /**
   * called on click on component
   * init a feedback, wait user submit, send feedback
   */
  @Method()
  async newFeedback(
    bruitIoConfig: BruitIoConfig,
    data?: Array<BrtData>,
    dataFn?: () => Array<BrtData> | Promise<Array<BrtData>>
  ) {
    //if there's already a current feedback, we have a probleme!!! => destroy it
    let preparePromise: Promise<void>;
    if (this._currentFeedback) {
      preparePromise = this.destroyFeedback();
    } else {
      preparePromise = Promise.resolve();
    }
    return preparePromise
      .then(() => {
        this._bruitIoConfig = bruitIoConfig;
        const feedback = new Feedback(this._bruitIoConfig);

        //create a new feedback

        // init feedback (screenshot) -> open modal =>  wait user submit
        return this.openModal()
          .then(() => this.waitOnSubmit())
          .then(dataFromModal => {
            //user submit with data dataFromModal
            // if the configuration says that the modal must be closed directly
            if (this._bruitIoConfig.closeModalOnSubmit) {
              // close the modal and send feedback
              this.closeModal();
              return this.hideVirtualKeyboard().then(() =>
                this.waitRendering().then(() =>
                  feedback.send(dataFromModal, data, dataFn)
                )
              );
            } else {
              // else, we display de loader
              this.setSubmitButtonState(SubmitButtonState.LOADING);
              // send feedback
              return this.hideVirtualKeyboard().then(() =>
                this.waitRendering().then(() =>
                  feedback.send(dataFromModal, data, dataFn).then(() => {
                    // we display the "validation" for <durationBeforeClosing> milliseconds
                    this.setSubmitButtonState(SubmitButtonState.CHECKED);
                    return new Promise(resolve => {
                      setTimeout(
                        () => resolve(),
                        this._bruitIoConfig.durationBeforeClosing
                      );
                    });
                  })
                )
              );
            }
          })
          .then(() => {
            // feedback is send !
            return this.destroyFeedback();
            // end
          });
      })
      .catch(err => {
        if (err === 'close') {
          this.destroyFeedback();
          //console.log('feedback canceled');
        } else {
          this.brtError.emit(err);
          if (err && err.text) {
            this.modalError = err;
          } else {
            this.modalError = {
              code: 0,
              text: 'An Unexpected Error Occurred'
            };
          }
          console.error('BRUIT.IO error : ', JSON.stringify(err));
          setTimeout(() => this.destroyFeedback(), 3000);
        }
      });
  }

  @Method()
  async sendFeedback(apiKey, agreement, data, dataFn) {
    return BruitCore.send(apiKey, agreement, data, dataFn);
  }

  static async send(apiKey, agreement, data, dataFn?) {
    if (!apiKey) {
      console.error('[BRUIT] apiKey must be defined !');
      return;
    }

    if (!data) {
      data = [];
    }

    data.push({
      id: 'agreement',
      label: 'agreement',
      value: agreement || false,
      type: 'checkbox'
    });

    var feedback = new Feedback(undefined, apiKey);
    return feedback.send(data, undefined, dataFn);
  }

  static catchError(apiKey, agreement, error) {
    const errorInfos = [];
    errorInfos.push(this.getErrorType(error));
    this.getErrorData(error).forEach(data => {
      errorInfos.push(data);
    });

    BruitCore.send(apiKey, agreement, errorInfos);
  }

  static getErrorType(error: Error): { label: string; value: string } {
    // return error class as type
    return { label: 'Type', value: error.constructor.name };
  }
  /**
   * Search for error keys in error and returns each found keys and its value as BruitData
   */
  static getErrorData(error: Error): any[] {
    const errorData = [];
    const errorDataWantedKeys = ['Message', 'Stack'];
    // add wanted data
    errorDataWantedKeys.forEach(displayKey => {
      const key =
        displayKey.substring(0, 1).toLowerCase() + displayKey.substring(1);
      if (error[key]) {
        errorData.push({ label: displayKey, value: error[key] });
      }
    });
    // add optionnal type-specific data
    Object.keys(error.constructor).forEach(key => {
      const displayKey = key.substring(0, 1).toUpperCase() + key.substring(1);
      if (!errorDataWantedKeys.includes(displayKey)) {
        errorData.push({ label: displayKey, value: error[key] });
      }
    });
    return errorData;
  }

  /**
   * close the modal and destroy the _currentFeedback
   */
  destroyFeedback() {
    return this.closeModal().then(() => {
      if (this._currentFeedback) {
        this._currentFeedback = undefined;
      }
      return;
    });
  }

  /**
   * reset the modal values and open it
   */
  openModal(): Promise<void> {
    this.modalOpened = true;
    this.modalBrtField = JSON.parse(JSON.stringify(this._bruitIoConfig.form));
    return new Promise(resolve => {
      setTimeout(() => {
        this.setSubmitButtonState(SubmitButtonState.SUBMIT);
        resolve();
      }, 300); // we have to wait for opening animation to be done
    });
  }

  /**
   * empties values and close the feedback;
   */
  closeModal() {
    this.modalOpened = false;
    return new Promise(resolve => {
      setTimeout(() => {
        this.modalBrtField = [];
        this.modalError = undefined;
        resolve();
      }, 250);
    });
  }

  /**
   * awaits the closure or submission of the modal by user
   */
  waitOnSubmit(): Promise<Array<BrtField>> {
    //getting the three clickable dom element (for submit or close modal)
    const form: HTMLElement = this.bruitCoreElement.shadowRoot.querySelector(
      '#bruit-io-form'
    );
    const button_close: HTMLElement = this.bruitCoreElement.shadowRoot.querySelector(
      '#bruit-io-btn-close'
    );
    const modal_wrapper: HTMLElement = this.bruitCoreElement.shadowRoot.querySelector(
      '#bruit-io-wrapper'
    );

    //show the close button
    button_close.hidden = false;

    return new Promise((resolve, reject) => {
      // ----------- validation du formulaire -------------
      const _onSubmit = e => {
        e.preventDefault();

        //disable modal
        this.disabledBrtField(this.modalBrtField);
        button_close.hidden = true;
        // remove event listeners (for memory leaks and disable form)
        button_close.removeEventListener('click', _closeModalFn, false);
        modal_wrapper.removeEventListener('click', _closeModalFn, false);
        form.removeEventListener('submit', _onSubmit, false);

        resolve(this.modalBrtField);
      };
      form.addEventListener('submit', _onSubmit, { once: true });

      //------------------ close modal ----------------------

      const _closeModalFn = () => {
        this.closeModal().then(() => {
          // remove event listeners (for memory leaks and disable form)
          button_close.removeEventListener('click', _closeModalFn, false);
          modal_wrapper.removeEventListener('click', _closeModalFn, false);
          form.removeEventListener('submit', _onSubmit, false);

          reject('close');
        });
      };
      button_close.addEventListener('click', _closeModalFn, { once: true });
      modal_wrapper.addEventListener('click', _closeModalFn, { once: true });
    });
  }

  /**
   * set all form field to disabled
   */
  disabledBrtField(brtFields) {
    brtFields
      .map(field => this.bruitCoreElement.shadowRoot.getElementById(field.id))
      .forEach(domField => {
        domField.setAttribute('disabled', 'true');
      });
  }

  /**
   * change submit button state
   * @param state state of the submit button
   */
  setSubmitButtonState(state: SubmitButtonState) {
    const submitButton = document.getElementById('bruit-io-submit-button');
    if (submitButton) {
      const buttonClassList = submitButton.classList;
      switch (state) {
        case SubmitButtonState.CHECKED: {
          buttonClassList.remove('bruit-on-click');
          buttonClassList.add('bruit-validate');
          break;
        }
        case SubmitButtonState.LOADING: {
          buttonClassList.add('bruit-on-click');
          buttonClassList.remove('bruit-validate');
          break;
        }
        default: {
          buttonClassList.remove('bruit-validate', 'bruit-on-click');
          break;
        }
      }
    }
  }

  // --------------------- TSX - HTML ------------------
  // "render()" is called after "componentWillLoad()" and when the state change

  render() {
    if (this._bruitIoConfig) {
      return (
        <span>
          {this.modal()}
          {this.theming()}
        </span>
      );
    } else if (this._bruitCoreConfig) {
      return <span>{this.modal()}</span>;
    } else {
      return <p class="bruit-error">missing config</p>;
    }
  }

  modal() {
    return (
      <div
        id="bruit-io-wrapper"
        class={this.modalOpened ? 'bruit-open' : 'bruit-close'}
        style={{
          'background-color': this._bruitIoConfig
            ? this._bruitIoConfig.colors.background
            : 'transparent'
        }}
        data-html2canvas-ignore
      >
        <div
          class="bruit-modal"
          onClick={event => {
            event.stopPropagation();
          }}
        >
          {this._bruitIoConfig ? this.modalHeader() : undefined}
          {this._bruitIoConfig ? this.modalContent() : undefined}
        </div>
      </div>
    );
  }

  modalHeader() {
    return (
      <div
        class="bruit-head"
        style={{ 'background-color': this._bruitIoConfig.colors.header }}
      >
        <h1 class="bruit-title">{this._bruitIoConfig.labels.title}</h1>
        <a id="bruit-io-btn-close">
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="white"
          >
            <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z" />
          </svg>
        </a>
      </div>
    );
  }

  modalSubHeader() {
    if (this._bruitIoConfig.labels.introduction) {
      return (
        <div class="bruit-sub-head">
          <p>{this._bruitIoConfig.labels.introduction}</p>
        </div>
      );
    } else {
      return;
    }
  }
  modalContent() {
    return (
      <div
        class="bruit-content"
        style={{ 'background-color': this._bruitIoConfig.colors.body }}
      >
        {this.modalSubHeader()}
        <form id="bruit-io-form">
          <fieldset id="bruit-io-fieldset">
            {this.modalFields()}
            <div class="bruit-button-container">
              {this.modalSubmitButtonOrError()}
            </div>
          </fieldset>
        </form>
      </div>
    );
  }

  modalSubmitButtonOrError() {
    if (!this.modalError) {
      return (
        <button
          type="submit"
          id="bruit-io-submit-button"
          style={{
            color: this._bruitIoConfig.colors.header,
            'border-color': this._bruitIoConfig.colors.header
          }}
        >
          <svg class="bruit-svg-icon" viewBox="0 0 20 20">
            <path
              class="bruit-no-color"
              fill={this._bruitIoConfig.colors.header}
              d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
            />
          </svg>
          <span id="button-submit-label">
            {this._bruitIoConfig.labels.button}
          </span>
        </button>
      );
    } else {
      return (
        <div id="bruit-io-footer-error" class="bruit-error">
          <svg class="bruit-svg-icon" viewBox="0 0 20 20">
            <path d="M18.344,16.174l-7.98-12.856c-0.172-0.288-0.586-0.288-0.758,0L1.627,16.217c0.339-0.543-0.603,0.668,0.384,0.682h15.991C18.893,16.891,18.167,15.961,18.344,16.174 M2.789,16.008l7.196-11.6l7.224,11.6H2.789z M10.455,7.552v3.561c0,0.244-0.199,0.445-0.443,0.445s-0.443-0.201-0.443-0.445V7.552c0-0.245,0.199-0.445,0.443-0.445S10.455,7.307,10.455,7.552M10.012,12.439c-0.733,0-1.33,0.6-1.33,1.336s0.597,1.336,1.33,1.336c0.734,0,1.33-0.6,1.33-1.336S10.746,12.439,10.012,12.439M10.012,14.221c-0.244,0-0.443-0.199-0.443-0.445c0-0.244,0.199-0.445,0.443-0.445s0.443,0.201,0.443,0.445C10.455,14.021,10.256,14.221,10.012,14.221" />
          </svg>
          <p>{this.modalError.text}</p>
          <a onClick={() => this.destroyFeedback()}>
            <svg class="bruit-svg-icon bruit-big" viewBox="0 0 20 20">
              <path
                fill="none"
                d="M12.71,7.291c-0.15-0.15-0.393-0.15-0.542,0L10,9.458L7.833,7.291c-0.15-0.15-0.392-0.15-0.542,0c-0.149,0.149-0.149,0.392,0,0.541L9.458,10l-2.168,2.167c-0.149,0.15-0.149,0.393,0,0.542c0.15,0.149,0.392,0.149,0.542,0L10,10.542l2.168,2.167c0.149,0.149,0.392,0.149,0.542,0c0.148-0.149,0.148-0.392,0-0.542L10.542,10l2.168-2.168C12.858,7.683,12.858,7.44,12.71,7.291z M10,1.188c-4.867,0-8.812,3.946-8.812,8.812c0,4.867,3.945,8.812,8.812,8.812s8.812-3.945,8.812-8.812C18.812,5.133,14.867,1.188,10,1.188z M10,18.046c-4.444,0-8.046-3.603-8.046-8.046c0-4.444,3.603-8.046,8.046-8.046c4.443,0,8.046,3.602,8.046,8.046C18.046,14.443,14.443,18.046,10,18.046z"
              />
            </svg>
          </a>
        </div>
      );
    }
  }

  modalFields() {
    return this.modalBrtField.map(field => {
      switch (field.type) {
        case BrtFieldType.TEXT:
        case BrtFieldType.EMAIL: {
          return this.inputField(field);
        }
        case BrtFieldType.CHECKBOX: {
          return this.checkboxField(field);
        }
        case BrtFieldType.TEXTAREA: {
          return this.textareaField(field);
        }
        case BrtFieldType.RATING: {
          return this.ratingField(field);
        }
        case BrtFieldType.SELECT: {
          return this.selectField(field);
        }
        default: {
          const err = { code: 116, text: `"${field.type}" field type is not supported` };
          console.error('BRUIT.IO error : ', JSON.stringify(err));
          this.brtError.emit(err);
          return <span class="bruit-error">error</span>;
        }
      }
    });
  }

  inputField(field: BrtField) {
    return (
      <div class="bruit-group">
        <input
          id={field.id}
          name={field.id}
          onInput={e => {
            field.value = e.target['value'];
            if (e.srcElement['classList']) {
              if (!!field.value) {
                e.srcElement['classList'].add('bruit-has-value');
              } else {
                e.srcElement['classList'].remove('bruit-has-value');
              }
            }
          }}
          type={field.type}
          value={field.value}
          class={!!field.value ? 'bruit-has-value' : ''}
          required={!!field.required}
        />
        <span class="bruit-bar" />
        <label htmlFor={field.id}>{field.label}</label>
      </div>
    );
  }

  textareaField(field: BrtField) {
    return (
      <div class="bruit-group">
        <textarea
          id={field.id}
          name={field.id}
          onInput={e => {
            field.value = e.target['value'];
            if (e.srcElement['classList']) {
              if (!!field.value) {
                e.srcElement['classList'].add('bruit-has-value');
              } else {
                e.srcElement['classList'].remove('bruit-has-value');
              }
            }
          }}
          value={field.value}
          class={!!field.value ? 'bruit-has-value' : ''}
          required={!!field.required}
        />
        <span class="bruit-bar" />
        <label htmlFor={field.id}>{field.label}</label>
      </div>
    );
  }

  checkboxField(field: BrtField) {
    return (
      <div class="bruit-group">
        <input
          id={field.id}
          name={field.id}
          onChange={e => (field.value = e.target['checked'])}
          checked={field.value}
          required={!!field.required}
          type={field.type}
        />
        <label htmlFor={field.id} />
        <a
          class="bruit-checkbox-label"
          onClick={() => {
            field.value = !field.value;
            this.bruitCoreElement.forceUpdate();
          }}
        >
          {field.label}
        </a>
      </div>
    );
  }

  ratingField(field: BrtField) {
    return (
      <div class="bruit-group bruit-without-bar">
        <bruit-rating
          class="bruit-has-value"
          id={field.id}
          color={this._bruitIoConfig.colors.focus}
          offColor="#999"
          value={field.value}
          max={field.max}
          onValueChange={e => (field.value = e.detail)}
        />
        <label htmlFor={field.id}>{field.label}</label>
      </div>
    );
  }

  selectField(field: BrtField) {
    return (
      <div class="bruit-group">
        <bruit-select
          id={field.id}
          options={field.options}
          required={field.required}
          value={field.value}
          onChange={e => {
            field.value = e.target['value'];
            if (!!field.value) {
              e.srcElement['classList'].add('bruit-has-value');
            } else {
              e.srcElement['classList'].remove('bruit-has-value');
            }
          }}
        />
        <label htmlFor={field.id}>{field.label}</label>
      </div>
    );
  }

  theming() {
    return (
      <style>
        {'bruit-core .bruit-group .bruit-bar:before, bruit-core .bruit-group .bruit-bar:after{' +
          'background-color: ' +
          this._bruitIoConfig.colors.focus +
          '}' +
          'bruit-core .bruit-group input:not([type="checkbox"]):invalid ~.bruit-bar:before, bruit-core .bruit-group input:not([type="checkbox"]):invalid ~.bruit-bar:after{' +
          'background-color: ' +
          this._bruitIoConfig.colors.errors +
          '}' +
          'bruit-core button#bruit-io-submit-button:hover{' +
          'background-color: ' +
          this._bruitIoConfig.colors.header +
          '!important ;' +
          'color: white !important;' +
          '}' +
          'bruit-core button#bruit-io-submit-button.bruit-on-click{' +
          'border-color: #bbbbbb!important;' +
          'border-left-color: ' +
          this._bruitIoConfig.colors.header +
          '!important;}' +
          'bruit-core .bruit-group input[type="checkbox"]:checked+label, bruit-core .bruit-group input[type="checkbox"]+label:after{' +
          'border-color: ' +
          this._bruitIoConfig.colors.focus +
          '}' +
          'bruit-core .bruit-group input:not([type="checkbox"]).bruit-has-value:invalid~label, bruit-core .bruit-group input:not([type="checkbox"]):focus:invalid~label{' +
          'color: ' +
          this._bruitIoConfig.colors.errors +
          '}' +
          'bruit-core .bruit-group input:not([type="checkbox"]).bruit-has-value~label, bruit-core .bruit-group input:not([type="checkbox"]):focus~label{' +
          'color: ' +
          this._bruitIoConfig.colors.focus +
          '}' +
          'bruit-core .bruit-group textarea.bruit-has-value~label, bruit-core .bruit-group textarea:focus~label{' +
          'color: ' +
          this._bruitIoConfig.colors.focus +
          '}' +
          'bruit-core .bruit-group textarea.bruit-has-value:invalid~label{' +
          'color: ' +
          this._bruitIoConfig.colors.errors +
          '}'}
      </style>
    );
  }

}
