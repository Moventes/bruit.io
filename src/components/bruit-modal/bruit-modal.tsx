import { Component, Prop, Element, State, Watch } from '@stencil/core';
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

  // dom element of bruit-modal component
  @Element()
  bruitElement: HTMLElement;

  // private properties of bruit-modal class
  private _innerBruitElement: string = '';

  @State()
  modalOpened: boolean = false;

  private _currentFeedback: Feedback;
  @State()
  _config: BruitConfig;

  componentWillLoad() {
    console.log('bruit started ...');
    this._innerBruitElement = this.bruitElement.innerHTML;
    this.bruitElement.innerHTML = '';
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
    this.modalOpened = true;

    return new Promise((resolve, reject) => {
      // ----------- validation du formulaire -------------
      const button_send = document.getElementById('bruit-modal-button-send');
      const sendFormFn = () => {
        this.modalOpened = false;
        if (true) {
          button_send.removeEventListener('click', sendFormFn, false);
          resolve([{ label: 'field in form', value: 'youhoooo', type: 'text' }]);
        }
      };
      button_send.removeEventListener('click', sendFormFn, false);
      button_send.addEventListener('click', sendFormFn, false);

      //------------------ close modal ----------------------
      const button_close = document.getElementById('bruit-modal-btn-close');
      const modal_wrapper = document.getElementById('bruit-modal-wrapper');
      const closeModalFn = () => {
        this.modalOpened = false;
        console.log('ho!');
        reject('close');
      };
      button_close.removeEventListener('click', closeModalFn, false);
      button_close.addEventListener('click', closeModalFn, { once: true });
      modal_wrapper.removeEventListener('click', closeModalFn, false);
      modal_wrapper.addEventListener('click', closeModalFn, { once: true });
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
    return <a onClick={() => this.newFeedback()} innerHTML={this._innerBruitElement} />;
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
          <h1>Good Job!</h1>
          <button id="bruit-modal-button-send">{this._config.labels.send}</button>
        </div>
      </div>
    );
  }
}
