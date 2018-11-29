/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';


import {
  BrtConfig,
  BrtData,
} from '@bruit/types';


export namespace Components {

  interface BruitIo {
    'config': BrtConfig | string;
    /**
    * field array to add in feedback
    */
    'data': Array<BrtData>;
    /**
    * FN or PROMISE return field array to add in feedback
    */
    'dataFn': () => Array<BrtData> | Promise<Array<BrtData>>;
  }
  interface BruitIoAttributes extends StencilHTMLAttributes {
    'config'?: BrtConfig | string;
    /**
    * field array to add in feedback
    */
    'data'?: Array<BrtData>;
    /**
    * FN or PROMISE return field array to add in feedback
    */
    'dataFn'?: () => Array<BrtData> | Promise<Array<BrtData>>;
    /**
    * emit bruit-error on internal error or config error ex : BruitIo.addEventListener('onError',error=>...)
    */
    'onOnError'?: (event: CustomEvent) => void;
  }

  interface BruitModal {
    'config': BrtConfig | string;
    /**
    * field array to add in feedback
    */
    'data': Array<BrtData>;
    /**
    * FN or PROMISE return field array to add in feedback
    */
    'dataFn': () => Array<BrtData> | Promise<Array<BrtData>>;
  }
  interface BruitModalAttributes extends StencilHTMLAttributes {
    'config'?: BrtConfig | string;
    /**
    * field array to add in feedback
    */
    'data'?: Array<BrtData>;
    /**
    * FN or PROMISE return field array to add in feedback
    */
    'dataFn'?: () => Array<BrtData> | Promise<Array<BrtData>>;
    /**
    * emit bruit-error on internal error or config error ex : BruitIo.addEventListener('onError',error=>...)
    */
    'onOnError'?: (event: CustomEvent) => void;
  }
}

declare global {
  interface StencilElementInterfaces {
    'BruitIo': Components.BruitIo;
    'BruitModal': Components.BruitModal;
  }

  interface StencilIntrinsicElements {
    'bruit-io': Components.BruitIoAttributes;
    'bruit-modal': Components.BruitModalAttributes;
  }


  interface HTMLBruitIoElement extends Components.BruitIo, HTMLStencilElement {}
  var HTMLBruitIoElement: {
    prototype: HTMLBruitIoElement;
    new (): HTMLBruitIoElement;
  };

  interface HTMLBruitModalElement extends Components.BruitModal, HTMLStencilElement {}
  var HTMLBruitModalElement: {
    prototype: HTMLBruitModalElement;
    new (): HTMLBruitModalElement;
  };

  interface HTMLElementTagNameMap {
    'bruit-io': HTMLBruitIoElement
    'bruit-modal': HTMLBruitModalElement
  }

  interface ElementTagNameMap {
    'bruit-io': HTMLBruitIoElement;
    'bruit-modal': HTMLBruitModalElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
