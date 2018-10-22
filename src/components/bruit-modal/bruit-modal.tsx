import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'bruit-modal',
  styleUrl: 'bruit-modal.css',
  shadow: false
})
export class BruitModal {
  @Prop()
  first: string;
  @Prop()
  middle: string;
  @Prop()
  last: string;

  format(): string {
    return (this.first || '') + (this.middle ? ` ${this.middle}` : '') + (this.last ? ` ${this.last}` : '');
  }

  render() {
    return <div>Hello, World! I'm {this.format()}</div>;
  }
}
