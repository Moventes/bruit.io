import { Component, Prop, Element } from '@stencil/core';
import { BruitConfig } from '../../models/bruit-config.model';
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
  config: BruitConfig;
  @Prop()
  data: Array<Field>;
  @Prop()
  dataFn: () => Array<Field> | Promise<Array<Field>>;

  // dom element of bruit-modal component
  @Element()
  bruitElement: HTMLElement;

  // private properties of bruit-modal class
  private _innerBruitElement: string = '';

  componentWillLoad() {
    console.log('bruit started ...');
    this._innerBruitElement = this.bruitElement.innerHTML;
    this.bruitElement.innerHTML = '';
    ConsoleTool.init();
    HttpTool.init();
    ClickTool.init();
  }

  newFeedback() {
    const feedback = new Feedback(this.config.apiKey);
    feedback
      .init()
      .then(() => {
        console.log('feedback is initialized! open form');
        const res = [{ label: 'test form', value: 'youhoooo', type: 'text' }];
        return feedback.send(res, this.data, this.dataFn);
      })
      .then(() => {
        console.log('feedback is send!');
      });
  }

  render() {
    return (
      <span>
        <a onClick={() => this.newFeedback()} innerHTML={this._innerBruitElement} />

        <div class="modal-wrapper">
          <div class="modal">
            <div class="head">
              <a class="btn-close trigger" href="#">
                <i class="fa fa-times" aria-hidden="true" />
              </a>
            </div>
            <div class="content">
              <div class="good-job">
                <i class="fa fa-thumbs-o-up" aria-hidden="true" />
                <h1>Good Job!</h1>
              </div>
            </div>
          </div>
        </div>
      </span>
    );
  }
}
