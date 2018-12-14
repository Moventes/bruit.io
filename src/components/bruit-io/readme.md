# bruit-io

<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                         | Type                                    | Default     |
| -------- | --------- | --------------------------------------------------- | --------------------------------------- | ----------- |
| `config` | `config`  |                                                     | `BrtConfig \| string`                   | `undefined` |
| `data`   | --        | field array to add in feedback                      | `BrtData[]`                             | `undefined` |
| `dataFn` | --        | FN or PROMISE return field array to add in feedback | `() => BrtData[] \| Promise<BrtData[]>` | `undefined` |


## Events

| Event     | Description                                                                                            | Detail |
| --------- | ------------------------------------------------------------------------------------------------------ | ------ |
| `onError` | emit bruit-error on internal error or config error ex : BruitIo.addEventListener('onError',error=>...) | void   |
| `onReady` |                                                                                                        | void   |


## Methods

### `start(brtCoreConfig: BrtCoreConfig) => void`



#### Parameters

| Name            | Type            | Description |
| --------------- | --------------- | ----------- |
| `brtCoreConfig` | `BrtCoreConfig` |             |

#### Returns

Type: `void`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
