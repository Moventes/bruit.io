import { Component, Prop, Element } from '@stencil/core';
import { BruitConfig } from '../../models/bruit-config.model';
import { ConsoleTool } from '../../bruit-tools/console';
import { HttpTool } from '../../bruit-tools/http';

@Component({
  tag: 'bruit-modal',
  styleUrl: 'bruit-modal.css',
  shadow: false
})
export class BruitModal {
  @Prop()
  config: BruitConfig;

  @Element()
  bruitElement: HTMLElement;

  innerBruitElement: string = '';

  componentWillLoad() {
    console.log('bruit started ...');
    this.innerBruitElement = this.bruitElement.innerHTML;
    this.bruitElement.innerHTML = '';
    ConsoleTool.init();
    HttpTool.init();
  }

  format(): string {
    return this.config.title || '';
  }

  allLog() {
    console.log((console as any).logArray());
  }

  render() {
    return (
      <span>
        <div>Hello, World! I'm Bruit, my title is {this.format()}</div>
        <a onClick={this.allLog} innerHTML={this.innerBruitElement} />
      </span>
    );
  }
}
