import { Component, h, Prop, Watch, EventEmitter, State, Event } from '@stencil/core';

@Component({
  tag: 'bruit-rating',
  styleUrl: 'bruit-rating.scss',
  shadow: false
})
export class BruitRating {

  @Prop({ mutable: true, reflectToAttr: true })
  value: number = 0;
  @Watch('value')
  watchValue(newValue: number, oldValue: number) {
    if (!newValue || newValue < 0) {
      this.value = 0;
    } else if (newValue > this.max) {
      this.value = this.max;
    }

    if (this.value !== oldValue) {
      this.valueChange.emit(this.value);
    }
  }

  @Event()
  valueChange: EventEmitter;

  @Prop({ mutable: true, reflectToAttr: true })
  max: number = 5;
  @Watch('max')
  watchMax(newValue: number) {
    if (!newValue || newValue <= 0) {
      this.max = 5;
    }

    if (this.value > this.max) {
      this.value = this.max;
    }
  }

  @Prop()
  color: string = '#ffd83d';
  @Watch('color')
  watchColor(newValue: string, oldValue: string) {
    if (newValue && newValue !== oldValue) {
      this.onBorderColor = newValue; //colorLuminance(newValue, -0.2);
    }
  }

  @Prop()
  offColor: string = '#c0c0c0';

  @State()
  onBorderColor: string = '#eac328';

  stars: Array<boolean>;

  componentWillLoad() {
    this.setStars();
    this.watchColor(this.color, null);
  }

  componentWillUpdate() {
    this.setStars();
  }

  setStars() {
    if (typeof this.value === 'number' && this.value <= this.max && this.value >= 0 && this.max && this.max > 1) {
      const stars = new Array(this.max);
      for (let i = 0; i < stars.length; i++) {
        stars[i] = i < this.value ? true : false;
      }
      this.stars = stars;
    } else {
      throw new Error('value or max has a bad value');
    }
  }

  render() {
    return <div id="bruitRating">{this.starsRating()}</div>;
  }

  starsRating() {
    return this.stars.map((on, index) => this.star(index + 1, on));
  }

  star(value: number, on: boolean) {
    return (
      <div class="bruit-star" onClick={() => (this.value = value)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
          <path
            d="M17.5,12.5h-8.5l6.8,5-2.6,8.1,6.8-5,6.8,5-2.6-8.1,6.8-5h-8.5l-2.6-8.1z"
            fill={on ? this.color : this.offColor}
            stroke={on ? this.onBorderColor : this.offColor}
          />
        </svg>
      </div>
    );
  }

}
