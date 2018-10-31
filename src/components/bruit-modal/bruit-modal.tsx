import { Component, Prop, State, Watch } from '@stencil/core';
import { BruitConfigModel } from '../../models/bruit-config.model';
import { BruitConfig } from '../../models/bruit-config.class';
import { ConsoleTool } from '../../bruit-tools/console';
import { HttpTool } from '../../bruit-tools/http';
import { ClickTool } from '../../bruit-tools/click';
import { Field } from '../../models/field.model';
import { Feedback } from '../../api/feedback';
import { FormField } from '../../models/form-field.model';

@Component({
  tag: 'bruit-modal',
  styleUrl: 'bruit-modal.scss',
  shadow: false
})
export class BruitModal {
  // attributs on bruit-modal component
  @Prop()
  config: BruitConfigModel;

  @Watch('config')
  initConfig(newConfig: BruitConfigModel) {
    let configError = BruitConfig.haveError(newConfig);
    if (!configError) {
      this._config = new BruitConfig(newConfig);
    } else {
      //emit error
      console.error(configError);
    }
  }

  @Prop()
  data: Array<Field>;

  @Prop()
  dataFn: () => Array<Field> | Promise<Array<Field>>;

  @State()
  modalOpened: boolean = false;
  @State()
  modalFormField: Array<FormField> = [];

  private _currentFeedback: Feedback;
  @State()
  _config: BruitConfig;

  componentWillLoad() {
    console.log('bruit started ...');

    ConsoleTool.init();
    HttpTool.init();
    ClickTool.init();
    //first init
    this.initConfig(this.config);
  }

  newFeedback() {
    if (this._currentFeedback) {
      this._currentFeedback = undefined;
    }
    const feedback = new Feedback(this.config.apiKey);
    feedback
      .init()
      .then(() => {
        console.log('feedback is initialized! open modal');
        return this.openModal();
      })
      .then(dataFromModal => {
        console.log('feedback is initialized! modal closed, res = ', dataFromModal);
        return feedback.send(dataFromModal, this.data, this.dataFn);
      })
      .then(() => {
        this.modalOpened = false;
        if (this._currentFeedback) {
          this._currentFeedback = undefined;
        }
        console.log('feedback is send!');
      })
      .catch(err => {
        if (err === 'close') {
          if (this._currentFeedback) {
            this._currentFeedback = undefined;
          }
          console.log('feedback canceled');
        } else {
          //error !!!
          console.error(err);
        }
      });
  }

  openModal(): Promise<Array<FormField>> {
    document.getElementById('bruit-modal-submit-button').classList.remove('validate', 'onClick');
    this.modalFormField = JSON.parse(JSON.stringify(this._config.form));
    this.modalOpened = true;

    return new Promise((resolve, reject) => {
      // ----------- validation du formulaire -------------
      const form = document.getElementById('bruit-modal-form');
      const onSubmit = e => {
        e.preventDefault();
        this.disabledFormField();
        console.log('--->', e);
        document.getElementById('bruit-modal-submit-button').classList.add('onClick');
        setTimeout(() => {
          document.getElementById('bruit-modal-submit-button').classList.remove('onClick');
          document.getElementById('bruit-modal-submit-button').classList.add('validate');

          setTimeout(() => {
            //this.modalOpened = false;
            if (true) {
              //add spinner
              form.removeEventListener('submit', onSubmit, false);
              resolve(this.modalFormField);
            }
          }, 1000);
        }, 2000);
      };
      form.removeEventListener('submit', onSubmit, false);
      form.addEventListener('submit', onSubmit, false);

      //------------------ close modal ----------------------
      const button_close = document.getElementById('bruit-modal-btn-close');
      const modal_wrapper = document.getElementById('bruit-modal-wrapper');
      const closeModalFn = () => {
        this.modalOpened = false;
        this.modalFormField = [];
        console.log('ho!');
        reject('close');
      };
      button_close.removeEventListener('click', closeModalFn, false);
      button_close.addEventListener('click', closeModalFn, { once: true });
      modal_wrapper.removeEventListener('click', closeModalFn, false);
      modal_wrapper.addEventListener('click', closeModalFn, { once: true });
    });
  }

  disabledFormField() {
    this.modalFormField.map(field => document.getElementById(field.id)).forEach(domField => {
      domField.setAttribute('disabled', 'true');
    });
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
          // emit error
          break;
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
