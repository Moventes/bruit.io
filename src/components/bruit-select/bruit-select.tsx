import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'bruit-select',
  styleUrl: 'bruit-select.scss',
  shadow: false
})
export class BruitSelect {

  @Prop()
  id: string;

  @Prop()
  options: Array<string>;

  @Prop()
  value: string;

  @Prop()
  required: boolean;

  render() {
    return (
      <select id={this.id} required={this.required}>
        {[
          <option value=""></option>,
          ...this.options.map(option => <option value={option}>{option}</option>)
        ]}
      </select>
    );
  }

}
