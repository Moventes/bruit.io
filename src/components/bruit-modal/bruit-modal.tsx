import { Bruit } from '@bruit/core/src/bruit';
import { BrtCoreConfig, BrtData, BrtError, BrtField } from '@bruit/types';
import { BrtFieldType } from '@bruit/types/dist/enums/brt-field-type';
import { BrtScreenshot } from '@bruit/types/dist/interfaces/brt-screenshot';
import { Component, Element, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';
import { SubmitButtonState } from '../../enums/submitButtonState.enum';
import { BruitIoConfig } from '../../models/bruit-io-config.class';

@Component({
  tag: 'bruit-modal',
  styleUrl: 'bruit-modal.scss',
  shadow: false // set to true when all browser support shadowDom
})
export class BruitModal {

  // configuration
  @Prop({ attr: 'brt-config' })
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
    }
    if (!configError) {
      try {
        Bruit.init(_newConfig);
      } catch (error) {
        this.onError.emit(error);
        console.error(error);
      }
    } else {
      this.onError.emit(configError);
      console.error(configError);
    }
  }



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
  private _currentFeedback: Promise<any>;

  /**
   * the current and complete config
   */
  @State()
  _bruitIoConfig: BruitIoConfig;

  // dom element of bruit-io component
  @Element()
  bruitCoreHtmlElement: HTMLElement;

  @State()
  rererenderBool = true;

  rererender() {
    this.rererenderBool = !!this.rererenderBool;
  }

  /**
   * fired on component loading before render()
   */
  componentWillLoad() {
    console.info('[BRUIT.IO] - bruit started ...');
    // first init
    this.initConfig(this.config);
  }



  hideVirtualKeyboard(): Promise<void> {

    let isMobileOrTablet = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) isMobileOrTablet = true; })(navigator.userAgent || navigator.vendor || window['opera' as keyof typeof window]);

    if (isMobileOrTablet) {
      return new Promise((resolve) => {
        document.getElementById('bruit-io-submit-button').focus();
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
  open(
    bruitIoConfig: BruitIoConfig,
    data?: Array<BrtData>,
    dataFn?: () => Array<BrtData> | Promise<Array<BrtData>>
  ) {
    this._bruitIoConfig = bruitIoConfig;
    //if there's already a current feedback, we have a probleme!!! => destroy it
    let preparePromise: Promise<void>;
    if (this._currentFeedback) {
      preparePromise = this.destroyFeedback();
    } else {
      preparePromise = Promise.resolve();
    }
    return preparePromise
      .then(() => {

        return this.openModal()
          .then(() => this.waitOnSubmit())
          .then(dataFromModal => {
            //user submit with data dataFromModal
            // if the configuration says that the modal must be closed directly
            if (this._bruitIoConfig.closeModalOnSubmit) {
              // close the modal and send feedback
              this.closeModal();
              return this.hideVirtualKeyboard().then(() =>
                this.waitRendering().then(() => Bruit.sendFeedbackFromModal(dataFromModal, data, dataFn, this._bruitIoConfig.screenshot))
              );
            } else {
              // else, we display de loader
              this.setSubmitButtonState(SubmitButtonState.LOADING);
              // send feedback
              return this.hideVirtualKeyboard().then(() =>
                this.waitRendering().then(() =>
                  Bruit.sendFeedbackFromModal(dataFromModal, data, dataFn, this._bruitIoConfig.screenshot).then(() => {
                    // we display the "validation" for <durationBeforeClosing> milliseconds
                    this.setSubmitButtonState(SubmitButtonState.CHECKED);
                    return new Promise(resolve => {
                      setTimeout(() => resolve(), this._bruitIoConfig.durationBeforeClosing);
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
          // console.log('feedback canceled');
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

  @Method()
  async sendFeedback(data: BrtData[] = [], dataFn?: () => BrtData[] | Promise<BrtData[]>, agreement: boolean = false, screenshotConfig?: BrtScreenshot) {
    return Bruit.sendFeedback(data, dataFn, agreement, screenshotConfig);
  }

  @Method()
  async sendError(error: string) {
    return Bruit.sendError(error);
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
    const form: HTMLElement = this.bruitCoreHtmlElement.querySelector('#bruit-io-form');
    const button_close: HTMLElement = this.bruitCoreHtmlElement.querySelector('#bruit-io-btn-close');
    const modal_wrapper: HTMLElement = this.bruitCoreHtmlElement.querySelector('#bruit-io-wrapper');

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
    }
    // else {
    //   return <p class="bruit-error">missing config</p>;
    // }
  }

  modal() {
    return (
      <div
        id="bruit-io-wrapper"
        class={this.modalOpened ? 'bruit-open' : 'bruit-close'}
        style={{ 'background-color': this._bruitIoConfig ? this._bruitIoConfig.colors.background : 'transparent' }}
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
      <div class="bruit-head" style={{ 'background-color': this._bruitIoConfig.colors.header }}>
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
      <div class="bruit-content" style={{ 'background-color': this._bruitIoConfig.colors.body }}>
        {this.modalSubHeader()}
        <form id="bruit-io-form">
          <fieldset id="bruit-io-fieldset">
            {this.modalFields()}
            <div class="bruit-button-container">{this.modalSubmitButtonOrError()}</div>
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
          <svg class="bruit-svg-icon" viewBox="0 0 20 20">
            <path
              class="bruit-no-color"
              fill={this._bruitIoConfig.colors.header}
              d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
            />
          </svg>
          <span id="button-submit-label">{this._bruitIoConfig.labels.button}</span>
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
        default: {
          const err = { code: 116, text: `"${field.type}" field type is not supported` };
          console.error('BRUIT.IO error : ', err);
          this.onError.emit(err);
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
            if (!!field.value) {
              e.srcElement['classList'].add('bruit-has-value');
            } else {
              e.srcElement['classList'].remove('bruit-has-value');
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
            if (!!field.value) {
              e.srcElement['classList'].add('bruit-has-value');
            } else {
              e.srcElement['classList'].remove('bruit-has-value');
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
            this.rererender();
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
