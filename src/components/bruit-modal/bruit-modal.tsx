import { Component, Prop, State, Watch, EventEmitter, Event } from '@stencil/core';
import { BruitConfigModel } from '../../models/bruit-config.model';
import { BruitConfig } from '../../models/bruit-config.class';
import { ConsoleTool } from '../../bruit-tools/console';
import { HttpTool } from '../../bruit-tools/http';
import { ClickTool } from '../../bruit-tools/click';
import { Field } from '../../models/field.model';
import { Feedback } from '../../api/feedback';
import { FormField } from '../../models/form-field.model';
import { BruitError } from '../../models/bruit-error.model';

@Component({
  tag: 'bruit-modal',
  styleUrl: 'bruit-modal.scss',
  shadow: false // set to true when all browser support shadowDom
})
export class BruitModal {
  // attributs on bruit-modal component

  // configuration
  @Prop()
  config: BruitConfigModel;

  /**
   * test validity of config and assign to internal config
   * @param newConfig the new value of config
   */
  @Watch('config')
  initConfig(newConfig: BruitConfigModel) {
    let configError = BruitConfig.haveError(newConfig);
    if (!configError) {
      this._config = new BruitConfig(newConfig);
      console.log(this._config);
    } else {
      this.sendError.emit(configError);
      console.error(configError);
    }
  }

  /**
   * field array to add in feedback
   */
  @Prop()
  data: Array<Field>;

  /**
   * FN or PROMISE
   * return field array to add in feedback
   */
  @Prop()
  dataFn: () => Array<Field> | Promise<Array<Field>>;

  /**
   * emit bruit-error on internal error or config error
   * ex : bruitModal.addEventListener('onError',error=>...)
   */
  @Event({
    eventName: 'onError'
  })
  sendError: EventEmitter<BruitError>;

  /**
   * modalOpened boolean manages the modal opening/closing action
   */
  @State()
  modalOpened: boolean = false;

  /**
   * field array to display in current modal (copy of config form)
   */
  @State()
  modalFormField: Array<FormField> = [];

  /**
   * the current feedback (created when the modal opens)
   */
  private _currentFeedback: Feedback;

  /**
   * the current and complete config
   */
  @State()
  _config: BruitConfig;

  /**
   * fired on component loading before render()
   */
  componentWillLoad() {
    console.log('bruit started ...');

    ConsoleTool.init();
    HttpTool.init();
    ClickTool.init();
    //first init
    this.initConfig(this.config);
  }

  /**
   * called on click on component
   * init a feedback, wait user submit, send feedback
   */
  newFeedback() {
    //if there's already a current feedback, we have a probleme!!! => destroy it
    if (this._currentFeedback) {
      this.destroyFeedback();
    }
    //create a new feedback
    const feedback = new Feedback(this.config.apiKey);
    // init feedback (screenshot) -> open modal =>  wait user submit
    feedback
      .init()
      .then(() => this.openModal())
      .then(() => this.waitOnSubmit())
      .then(dataFromModal => {
        //user submit with data dataFromModal
        const sendFeedback = feedback.send(dataFromModal, this.data, this.dataFn);
        // if the configuration says that the modal must be closed directly
        if (this._config.closeModalOnSubmit) {
          // close the modal and send feedback
          this.closeModal();
          return sendFeedback;
        } else {
          // else, we display de loader
          this.submitButtonState(1);
          // send feedback
          return sendFeedback.then(() => {
            // we display the "validation" for <durationBeforeClosing> milliseconds
            this.submitButtonState(2);
            return new Promise(resolve => {
              setTimeout(() => resolve(), this._config.durationBeforeClosing);
            });
          });
        }
      })
      .then(() => {
        // feedback is send !
        this.destroyFeedback();
        // end
      })
      .catch(err => {
        this.destroyFeedback();
        if (err === 'close') {
          //console.log('feedback canceled');
        } else {
          this.sendError.emit(err);
          console.error('BRUIT.IO error : ', err);
        }
      });
  }

  /**
   * close the modal and destroy the _currentFeedback
   */
  destroyFeedback() {
    this.closeModal();
    if (this._currentFeedback) {
      this._currentFeedback = undefined;
    }
  }

  /**
   * reset the modal values and open it
   */
  openModal() {
    this.submitButtonState(0);
    this.modalFormField = JSON.parse(JSON.stringify(this._config.form));
    this.modalOpened = true;
  }

  /**
   * empties values and close the feedback;
   */
  closeModal() {
    this.modalOpened = false;
    this.modalFormField = [];
  }

  /**
   * awaits the closure or submission of the modal by user
   */
  waitOnSubmit(): Promise<Array<FormField>> {
    //getting the three clickable dom element (for submit or close modal)
    const form = document.getElementById('bruit-modal-form');
    const button_close = document.getElementById('bruit-modal-btn-close');
    const modal_wrapper = document.getElementById('bruit-modal-wrapper');
    //show the close button
    button_close.hidden = false;

    return new Promise((resolve, reject) => {
      // ----------- validation du formulaire -------------
      const _onSubmit = e => {
        e.preventDefault();

        //disable modal
        this.disabledFormField();
        button_close.hidden = true;
        // remove event listeners (for memory leaks and disable form)
        button_close.removeEventListener('click', _closeModalFn, false);
        modal_wrapper.removeEventListener('click', _closeModalFn, false);
        form.removeEventListener('submit', _onSubmit, false);

        resolve(this.modalFormField);
      };
      form.addEventListener('submit', _onSubmit, { once: true });

      //------------------ close modal ----------------------

      const _closeModalFn = () => {
        this.closeModal();

        // remove event listeners (for memory leaks and disable form)
        button_close.removeEventListener('click', _closeModalFn, false);
        modal_wrapper.removeEventListener('click', _closeModalFn, false);
        form.removeEventListener('submit', _onSubmit, false);

        reject('close');
      };
      button_close.addEventListener('click', _closeModalFn, { once: true });
      modal_wrapper.addEventListener('click', _closeModalFn, { once: true });
    });
  }

  /**
   * set all form field to disabled
   */
  disabledFormField() {
    this.modalFormField.map(field => document.getElementById(field.id)).forEach(domField => {
      domField.setAttribute('disabled', 'true');
    });
  }

  /**
   * change submit button state
   * state 0 = button send
   * state 1 = loader
   * state 2 = button checked
   * @param state state of the submit button (0|1|2)
   */
  submitButtonState(state: number) {
    const buttonClassList = document.getElementById('bruit-modal-submit-button').classList;
    switch (state) {
      case 2: {
        buttonClassList.remove('onClick');
        buttonClassList.add('validate');
        break;
      }
      case 1: {
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

  // --------------------- TSX - HTML ------------------
  // "render()" is called after "componentWillLoad()" and when the state change

  render() {
    if (this._config) {
      return (
        <span>
          {this.principalButton()}
          {this.modal()}
        </span>
      );
    } else {
      return <p class="error">missing config</p>;
    }
  }

  principalButton() {
    return (
      <a onClick={() => this.newFeedback()}>
        <slot />
      </a>
    );
  }

  modal() {
    return (
      <div id="bruit-modal-wrapper" class={this.modalOpened ? 'open' : 'close'}>
        <div
          class="modal"
          onClick={event => {
            event.stopPropagation();
          }}
        >
          {this.modalHeader()}
          {this.modalContent()}
        </div>
      </div>
    );
  }

  modalHeader() {
    return (
      <div class="head">
        <h1 class="title">{this._config.labels.title}</h1>
        <a id="bruit-modal-btn-close">
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

  modalContent() {
    return (
      <div class="content">
        <div class="good-job">
          <form id="bruit-modal-form">
            <fieldset id="bruit-modal-fieldset">
              {this.modalFields()}
              <div class="button-container">
                <button type="submit" id="bruit-modal-submit-button">
                  <svg class="svg-icon" viewBox="0 0 20 20">
                    <path
                      fill="none"
                      d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                    />
                  </svg>
                  <span id="button-submit-label">{this._config.labels.button}</span>
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }

  modalFields() {
    return this.modalFormField.map(field => {
      switch (field.type) {
        case 'text':
        case 'email': {
          return this.inputField(field);
        }
        case 'textarea': {
          return this.textareaField(field);
        }
        default: {
          const err = { code: 4, text: `"${field.type}" field type is not supported` };
          console.error('BRUIT.IO error : ', err);
          this.sendError.emit(err);
          return <span class="error">error</span>;
        }
      }
    });
  }

  inputField(field: FormField) {
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

  textareaField(field: FormField) {
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
}
