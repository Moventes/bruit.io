# bruit-io

<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                      | Default     |
| -------- | --------- | ----------- | ------------------------- | ----------- |
| `config` | `config`  |             | `BrtCoreConfig \| string` | `undefined` |


## Events

| Event     | Description                                                                                            | Detail |
| --------- | ------------------------------------------------------------------------------------------------------ | ------ |
| `onError` | emit bruit-error on internal error or config error ex : BruitIo.addEventListener('onError',error=>...) | void   |


## Methods

### `newFeedback(bruitIoConfig: BruitIoConfig, data?: BrtData[], dataFn?: () => BrtData[] | Promise<BrtData[]>) => Promise<void>`

called on click on component
init a feedback, wait user submit, send feedback

#### Parameters

| Name            | Type                                    | Description |
| --------------- | --------------------------------------- | ----------- |
| `bruitIoConfig` | `BruitIoConfig`                         |             |
| `data`          | `BrtData[]`                             |             |
| `dataFn`        | `() => BrtData[] \| Promise<BrtData[]>` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
