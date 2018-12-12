import { Component, Prop, Watch, State, EventEmitter, Event } from '@stencil/core';
// import { colorLuminance } from './f-tool.module';

@Component({
  tag: 'bruit-rating',
  styleUrl: 'bruit-rating.scss'
})
export class BruitRatingComponent {
  @Prop({ mutable: true, reflectToAttr: true })
  value: number = 1;
  @Watch('value')
  watchValue(newValue: number, oldValue: number) {
    if (!newValue || newValue <= 0) {
      this.value = 1;
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
  onColor: string = '#ffd83d';
  @Watch('onColor')
  watchOnColor(newValue: string, oldValue: string) {
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
    this.watchOnColor(this.onColor, null);
  }

  componentWillUpdate() {
    this.setStars();
  }

  setStars() {
    if (this.value && this.value <= this.max && this.value > 0 && this.max && this.max > 1) {
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
      <div class="star" onClick={() => (this.value = value)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
          <path
            d="M17.5,12.5h-8.5l6.8,5-2.6,8.1,6.8-5,6.8,5-2.6-8.1,6.8-5h-8.5l-2.6-8.1z"
            fill={on ? this.onColor : this.offColor}
            stroke={on ? this.onBorderColor : this.offColor}
          />
        </svg>
      </div>
    );
  }
}
