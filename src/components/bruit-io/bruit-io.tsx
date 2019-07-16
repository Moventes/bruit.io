import { BrtConfig, BrtData, BrtError } from '@bruit/types';
import { Component, Element, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';
import { BruitIoConfig } from '../../models/bruit-io-config.class';
@Component({
  tag: 'bruit-io',
  styleUrl: 'bruit-io.scss',
  shadow: false // set to true when all browser support shadowDom
})
export class BruitIo {
  // attributs on bruit-io component

  // configuration
  @Prop({
    attr: 'brt-config',
    mutable: true,
  })
  config: BrtConfig | string;

  /**
   * test validity of config and assign to internal config
   * @param newConfig the new value of config
   */
  @Watch('config')
  initConfig(newConfig: BrtConfig | string) {
    // console.log('initConfig ', newConfig);
    // console.log('initConfig ', typeof newConfig);
    // console.log('initConfig ', newConfig['__proto__'].constructor.name);
    let _newConfig: BrtConfig;
    let configError: BrtError | void;
    if (typeof newConfig === 'string') {
      try {
        _newConfig = JSON.parse(newConfig) as BrtConfig;
      } catch(error) {
        console.log(error)
        console.log('for',newConfig);
        configError = {
          code: 100,
          text: 'bad config format (must be a json or stringified json)'
        };
      }
    } else {
      _newConfig = newConfig as BrtConfig;
    }
    if (!configError) {
      configError = BruitIoConfig.haveError(_newConfig);
    }
    if (!configError) {
      this._config = new BruitIoConfig(_newConfig);
    } else {
      this.onError.emit(configError);
      console.error(configError);
    }
  }

  /**
   * field array to add in feedback
   */
  @Prop({
    attr: 'brt-data',
    mutable: true,
  })
  data: Array<BrtData>;

  /**
   * FN or PROMISE
   * return field array to add in feedback
   */
  @Prop({
    attr: 'brt-data-fn',
    mutable: true,
  })
  dataFn: () => Array<BrtData> | Promise<Array<BrtData>>;


  //SETTER
  @Method()
  async setConfig(conf: BrtConfig | string){
    // console.log('setConfig ', conf);
    // console.log('setConfig ', typeof conf);
    // console.log('setConfig ', conf['__proto__'].constructor.name);

    this.config = conf;
  }

  @Method()
  async setData(datap:Array<BrtData>){
    // console.log('setData ', datap)
    this.data = datap;
  }

  @Method()
  async setDataFn(fnp:() => Array<BrtData> | Promise<Array<BrtData>>){
    // console.log('setDataFn ', fnp)
    this.dataFn = fnp;
  }

  // TODO: Issue https://github.com/ionic-team/stencil/issues/724
  // Instead of generic, replace with EventEmitter<BrtError> once issue solved
  /**
   * emit bruit-error on internal error or config error
   * ex : BruitIo.addEventListener('onError',error=>...)
   */
  @Event() onError: EventEmitter;

  @Event()
  onReady: EventEmitter;

  componentDidLoad() {
    this.onReady.emit(true);
  }
  /**
   * the current and complete config
   */
  @State()
  _config: BruitIoConfig;

  // dom element of bruit-io component
  @Element()
  bruitIoElement: HTMLBruitIoElement;
  private _haveInnerElement: boolean;

  /**
   * fired on component loading before render()
   */
  componentWillLoad() {
    // first init
    if(this.config && !this._config){
      // console.log('componentWillLoad config')
      this.initConfig(this.config);
    }
    
    this._haveInnerElement = !!this.bruitIoElement['innerHTML'] ? !!this.bruitIoElement['innerHTML'].trim() : false;
  }

  /**
   * called on click on component
   * init a feedback, wait user submit, send feedback
   */
  newFeedback() {
    const modal = document.getElementsByTagName('bruit-core')[0];
    if (modal) {
      modal.newFeedbackWithModal(this._config, this.data, this.dataFn);
    } else {
      //error
    }
  }

  // --------------------- TSX - HTML ------------------
  // "render()" is called after "componentWillLoad()" and when the state change

  render() {
    if (this._config) {
      return this.principalButton();
    } else {
      return <p class="bruit-error">missing config</p>;
    }
  }

  principalButton() {
    if (this._haveInnerElement) {
      return (
        <a onClick={() => this.newFeedback()} class="bruit-button">
          <slot />
        </a>
      );
    } else {
      return (
        <a onClick={() => this.newFeedback()} class="bruit-button">
          <svg viewBox="0 0 96 96" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M73.3,35.3h-8.9c-1.4-2.5-3.4-4.6-5.8-6.2l5.2-5.2l-4.5-4.5l-6.9,6.9C51,26,49.6,25.8,48,25.8
s-3,0.2-4.5,0.5l-6.9-6.9L32.2,24l5.1,5.2c-2.3,1.6-4.3,3.7-5.7,6.2h-8.9v6.3h6.6c-0.2,1-0.3,2.1-0.3,3.2V48h-6.3v6.3H29v3.2
c0,1.1,0.1,2.1,0.3,3.2h-6.6V67h8.9c3.3,5.7,9.4,9.5,16.4,9.5s13.1-3.8,16.4-9.5h8.9v-6.3h-6.6c0.2-1,0.3-2.1,0.3-3.2v-3.2h6.3V48
H67v-3.2c0-1.1-0.1-2.1-0.3-3.2h6.6V35.3z M54.3,60.7H41.7v-6.3h12.7V60.7z M54.3,48H41.7v-6.3h12.7V48z"
            />
          </svg>
        </a>
      );
    }
  }
}
