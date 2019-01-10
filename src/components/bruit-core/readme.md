# bruit-io

<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                      | Default     |
| -------- | --------- | ----------- | ------------------------- | ----------- |
| `config` | `config`  |             | `BrtCoreConfig \| string` | `undefined` |


## Events

| Event     | Description                                                                                            | Type                |
| --------- | ------------------------------------------------------------------------------------------------------ | ------------------- |
| `onError` | emit bruit-error on internal error or config error ex : BruitIo.addEventListener('onError',error=>...) | `CustomEvent<void>` |


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



### `send(apiKey: any, agreement: any, data: any, dataFn: any) => Promise<any>`



#### Parameters

| Name        | Type  | Description |
| ----------- | ----- | ----------- |
| `apiKey`    | `any` |             |
| `agreement` | `any` |             |
| `data`      | `any` |             |
| `dataFn`    | `any` |             |

#### Returns

Type: `Promise<any>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
