import { Component, Prop, Element } from '@stencil/core';
import { BruitConfig } from '../../models/bruit-config.model';
import { ConsoleTool } from '../../bruit-tools/console';
import { HttpTool } from '../../bruit-tools/http';
import { ClickTool } from '../../bruit-tools/click';
import { Field } from '../../models/field.model';
import { Feedback } from '../../api/feedback';

@Component({
  tag: 'bruit-modal',
  styleUrl: 'bruit-modal.css',
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

  format(): string {
    return this.config.apiKey || '';
  }

  newFeedback() {
    const feedback = new Feedback(this.config.apiKey, this.data);
    feedback
      .init(this.dataFn)
      .then(() => {
        console.log('feedback is initialized! open form');
        const res = [{ label: 'test form', value: 'youhoooo', type: 'text' }];
        return feedback.send(res);
      })
      .then(() => {
        console.log('feedback is send!');
      });
  }

  render() {
    return (
      <span>
        <div>Hello, World! I'm Bruit, my apiKey is {this.format()}</div>
        <a onClick={() => this.newFeedback()} innerHTML={this._innerBruitElement} />
      </span>
    );
  }
}
