/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';


import {
  BruitConfig,
} from './models/bruit-config.model';
import {
  Field,
} from './models/field.model';


export namespace Components {

  interface BruitModal {
    'config': BruitConfig;
    'data': Array<Field>;
    'dataFn': () => Array<Field> | Promise<Array<Field>>;
  }
  interface BruitModalAttributes extends StencilHTMLAttributes {
    'config'?: BruitConfig;
    'data'?: Array<Field>;
    'dataFn'?: () => Array<Field> | Promise<Array<Field>>;
  }
}

declare global {
  interface StencilElementInterfaces {
    'BruitModal': Components.BruitModal;
  }

  interface StencilIntrinsicElements {
    'bruit-modal': Components.BruitModalAttributes;
  }


  interface HTMLBruitModalElement extends Components.BruitModal, HTMLStencilElement {}
  var HTMLBruitModalElement: {
    prototype: HTMLBruitModalElement;
    new (): HTMLBruitModalElement;
  };

  interface HTMLElementTagNameMap {
    'bruit-modal': HTMLBruitModalElement
  }

  interface ElementTagNameMap {
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
