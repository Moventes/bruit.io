import { Component, Prop, Element, State, Watch } from '@stencil/core';
import { BruitConfigModel } from '../../models/bruit-config.model';
import { BruitConfig } from '../../models/bruit-config.class';
import { ConsoleTool } from '../../bruit-tools/console';
import { HttpTool } from '../../bruit-tools/http';
import { ClickTool } from '../../bruit-tools/click';
import { Field } from '../../models/field.model';
import { Feedback } from '../../api/feedback';

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
        console.log('feedback is initialized! open form');
        this.modalOpened = true;
        const res = [{ label: 'test form', value: 'youhoooo', type: 'text' }];
        return feedback.send(res, this.data, this.dataFn);
      })
      .then(() => {
        console.log('feedback is send!');
      });
  }

  cancelFeedback() {
    this.modalOpened = false;
    if (this._currentFeedback) {
      this._currentFeedback = undefined;
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
    return <a onClick={() => this.newFeedback()} innerHTML={this._innerBruitElement} />;
  }

  modal() {
    return (
      <div class={'modal-wrapper ' + (this.modalOpened ? 'open' : 'close')} onClick={() => this.cancelFeedback()}>
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
        <a class="btn-close" onClick={() => this.cancelFeedback()}>
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
          <i class="fa fa-thumbs-o-up" aria-hidden="true" />
          <h1>Good Job!</h1>
        </div>
      </div>
    );
  }
}
