import { Component, Prop, State, Watch, EventEmitter, Event, Element, Method } from '@stencil/core';
import { BrtError, BrtField, BrtData, BrtCoreConfig } from '@bruit/types';
import { BrtFieldType } from '@bruit/types/dist/enums/brt-field-type';
import { BruitCoreConfig } from '../../models/bruit-core-config.class';
import { BruitIoConfig } from '../../models/bruit-io-config.class';
import { ConsoleTool } from '../../bruit-tools/console';
import { Feedback } from '../../api/feedback';
import { SubmitButtonState } from '../../enums/submitButtonState.enum';

@Component({
  tag: 'bruit-core',
  styleUrl: 'bruit-core.scss',
  shadow: false // set to true when all browser support shadowDom
})
export class BruitCore {
  // attributs on bruit-io component

  // configuration
  @Prop()
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
      ConsoleTool.init(this._bruitCoreConfig.logCacheLength);
    } else {
      this.onError.emit(configError);
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
  @Event() onError: EventEmitter;

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
  bruitCoreElement: HTMLStencilElement;

  /**
   * fired on component loading before render()
   */
  componentWillLoad() {
    // console.info('[BRUIT.IO] - bruit started ...');
    // first init
    this.initConfig(this.config);
  }

  /**
   * called on click on component
   * init a feedback, wait user submit, send feedback
   */
  @Method()
  newFeedback(
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
        const feedback = new Feedback(this._bruitIoConfig.apiKey);

        //create a new feedback

        // init feedback (screenshot) -> open modal =>  wait user submit
        return feedback
          .init()
          .then(() => this.openModal())
          .then(() => this.waitOnSubmit())
          .then(dataFromModal => {
            //user submit with data dataFromModal
            const sendFeedback = feedback.send(dataFromModal, data, dataFn);
            // if the configuration says that the modal must be closed directly
            if (this._bruitIoConfig.closeModalOnSubmit) {
              // close the modal and send feedback
              this.closeModal();
              return sendFeedback;
            } else {
              // else, we display de loader
              this.setSubmitButtonState(SubmitButtonState.LOADING);
              // send feedback
              return sendFeedback.then(() => {
                // we display the "validation" for <durationBeforeClosing> milliseconds
                this.setSubmitButtonState(SubmitButtonState.CHECKED);
                return new Promise(resolve => {
                  setTimeout(() => resolve(), this._bruitIoConfig.durationBeforeClosing);
                });
              });
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
          this.onError.emit(err);
          if (err && err.text) {
            this.modalError = err;
          } else {
            this.modalError = {
              code: 0,
              text: 'An Unexpected Error Occurred'
            };
          }
          console.error('BRUIT.IO error : ', err);
          setTimeout(() => this.destroyFeedback(), 3000);
        }
      });
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
      });
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
    const form: HTMLElement = this.bruitCoreElement.querySelector('#bruit-io-form');
    const button_close: HTMLElement = this.bruitCoreElement.querySelector('#bruit-io-btn-close');
    const modal_wrapper: HTMLElement = this.bruitCoreElement.querySelector('#bruit-io-wrapper');

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
      .map(field => document.getElementById(field.id))
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
          buttonClassList.remove('onClick');
          buttonClassList.add('validate');
          break;
        }
        case SubmitButtonState.LOADING: {
          buttonClassList.add('onClick');
          buttonClassList.remove('validate');
          break;
        }
        default: {
          buttonClassList.remove('validate', 'onClick');
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
      return <p class="error">missing config</p>;
    }
  }

  modal() {
    return (
      <div
        id="bruit-io-wrapper"
        class={this.modalOpened ? 'open' : 'close'}
        style={{ 'background-color': this._bruitIoConfig ? this._bruitIoConfig.colors.background : 'transparent' }}
      >
        <div
          class="modal"
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
      <div class="head" style={{ 'background-color': this._bruitIoConfig.colors.header }}>
        <h1 class="title">{this._bruitIoConfig.labels.title}</h1>
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
        <div class="sub-head">
          <p>{this._bruitIoConfig.labels.introduction}</p>
        </div>
      );
    } else {
      return;
    }
  }
  modalContent() {
    return (
      <div class="content" style={{ 'background-color': this._bruitIoConfig.colors.body }}>
        {this.modalSubHeader()}
        <form id="bruit-io-form">
          <fieldset id="bruit-io-fieldset">
            {this.modalFields()}
            <div class="button-container">{this.modalSubmitButtonOrError()}</div>
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
          style={{ color: this._bruitIoConfig.colors.header, 'border-color': this._bruitIoConfig.colors.header }}
        >
          <svg class="svg-icon" viewBox="0 0 20 20">
            <path
              class="no-color"
              fill={this._bruitIoConfig.colors.header}
              d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
            />
          </svg>
          <span id="button-submit-label">{this._bruitIoConfig.labels.button}</span>
        </button>
      );
    } else {
      return (
        <div id="bruit-io-footer-error" class="error">
          <svg class="svg-icon" viewBox="0 0 20 20">
            <path d="M18.344,16.174l-7.98-12.856c-0.172-0.288-0.586-0.288-0.758,0L1.627,16.217c0.339-0.543-0.603,0.668,0.384,0.682h15.991C18.893,16.891,18.167,15.961,18.344,16.174 M2.789,16.008l7.196-11.6l7.224,11.6H2.789z M10.455,7.552v3.561c0,0.244-0.199,0.445-0.443,0.445s-0.443-0.201-0.443-0.445V7.552c0-0.245,0.199-0.445,0.443-0.445S10.455,7.307,10.455,7.552M10.012,12.439c-0.733,0-1.33,0.6-1.33,1.336s0.597,1.336,1.33,1.336c0.734,0,1.33-0.6,1.33-1.336S10.746,12.439,10.012,12.439M10.012,14.221c-0.244,0-0.443-0.199-0.443-0.445c0-0.244,0.199-0.445,0.443-0.445s0.443,0.201,0.443,0.445C10.455,14.021,10.256,14.221,10.012,14.221" />
          </svg>
          <p>{this.modalError.text}</p>
          <a onClick={() => this.destroyFeedback()}>
            <svg class="svg-icon big" viewBox="0 0 20 20">
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
        default: {
          const err = { code: 116, text: `"${field.type}" field type is not supported` };
          console.error('BRUIT.IO error : ', err);
          this.onError.emit(err);
          return <span class="error">error</span>;
        }
      }
    });
  }

  inputField(field: BrtField) {
    return (
      <div class="group">
        <input
          id={field.id}
          name={field.id}
          onInput={e => {
            field.value = e.target['value'];
            if (!!field.value) {
              e.srcElement.classList.add('has-value');
            } else {
              e.srcElement.classList.remove('has-value');
            }
          }}
          type={field.type}
          value={field.value}
          class={!!field.value ? 'has-value' : ''}
          required={!!field.required}
        />
        <span class="bar" />
        <label htmlFor={field.id}>{field.label}</label>
      </div>
    );
  }

  textareaField(field: BrtField) {
    return (
      <div class="group">
        <textarea
          id={field.id}
          name={field.id}
          onInput={e => {
            field.value = e.target['value'];
            if (!!field.value) {
              e.srcElement.classList.add('has-value');
            } else {
              e.srcElement.classList.remove('has-value');
            }
          }}
          value={field.value}
          class={!!field.value ? 'has-value' : ''}
          required={!!field.required}
        />
        <span class="bar" />
        <label htmlFor={field.id}>{field.label}</label>
      </div>
    );
  }

  checkboxField(field: BrtField) {
    return (
      <div class="group">
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
          class="checkbox-label"
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

  theming() {
    return (
      <style>
        {'bruit-core .group .bar:before, bruit-core .group .bar:after{' +
          'background-color: ' +
          this._bruitIoConfig.colors.focus +
          '}' +
          'bruit-core .group input:not([type="checkbox"]):invalid ~.bar:before, bruit-core .group input:not([type="checkbox"]):invalid ~.bar:after{' +
          'background-color: ' +
          this._bruitIoConfig.colors.errors +
          '}' +
          'bruit-core button#bruit-io-submit-button:hover{' +
          'background-color: ' +
          this._bruitIoConfig.colors.header +
          '!important ;' +
          'color: white !important;' +
          '}' +
          'bruit-core button#bruit-io-submit-button.onClick{' +
          'border-color: #bbbbbb!important;' +
          'border-left-color: ' +
          this._bruitIoConfig.colors.header +
          '!important;}' +
          'bruit-core .group input[type="checkbox"]:checked+label, bruit-core .group input[type="checkbox"]+label:after{' +
          'border-color: ' +
          this._bruitIoConfig.colors.focus +
          '}' +
          'bruit-core .group input:not([type="checkbox"]).has-value:invalid~label, bruit-core .group input:not([type="checkbox"]):focus:invalid~label{' +
          'color: ' +
          this._bruitIoConfig.colors.errors +
          '}' +
          'bruit-core .group input:not([type="checkbox"]).has-value~label, bruit-core .group input:not([type="checkbox"]):focus~label{' +
          'color: ' +
          this._bruitIoConfig.colors.focus +
          '}' +
          'bruit-core .group textarea.has-value~label, bruit-core .group textarea:focus~label{' +
          'color: ' +
          this._bruitIoConfig.colors.focus +
          '}' +
          'bruit-core .group textarea.has-value:invalid~label{' +
          'color: ' +
          this._bruitIoConfig.colors.errors +
          '}'}
      </style>
    );
  }
}
