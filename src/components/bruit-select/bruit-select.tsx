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
    let options = [];
    options.push(<option value=""></option>);
    for (let i = 0; i < this.options.length; i++) {
      options.push(<option value={this.options[i]}>{this.options[i]}</option>);
    }
    return (
      <select id={this.id} required={this.required}>
        {options}
      </select>
    );
  }
}
