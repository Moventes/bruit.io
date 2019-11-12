import { Component, Prop } from '@stencil/core';
// import { colorLuminance } from './f-tool.module';

@Component({
  tag: 'bruit-select',
  styleUrl: 'bruit-select.scss'
})
export class BruitSelectComponent {
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
