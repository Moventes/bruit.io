# bruit-io

<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                         | Type                                    |
| -------- | --------- | --------------------------------------------------- | --------------------------------------- |
| `config` | `config`  |                                                     | `BrtConfig \| string`                   |
| `dataFn` | --        | FN or PROMISE return field array to add in feedback | `() => BrtData[] \| Promise<BrtData[]>` |
| `data`   | --        | field array to add in feedback                      | `BrtData[]`                             |


## Events

| Event     | Detail   | Description                                                                                            |
| --------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `onError` | BrtError | emit bruit-error on internal error or config error ex : BruitIo.addEventListener('onError',error=>...) |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
