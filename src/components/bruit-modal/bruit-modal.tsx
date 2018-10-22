import { Component, Prop } from '@stencil/core';
import { BruitConfig } from '../../models/bruit-config.model';

@Component({
  tag: 'bruit-modal',
  styleUrl: 'bruit-modal.css',
  shadow: false
})
export class BruitModal {
  @Prop()
  config: BruitConfig;

  componentDidLoad() {
    console.log(this);
  }

  format(): string {
    return this.config.title || '';
  }

  render() {
    return <div>Hello, World! I'm Bruit, my title is {this.format()}</div>;
  }
}
