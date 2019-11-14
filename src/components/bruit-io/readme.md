# bruit-io



<!-- Auto Generated Below -->


## Properties

| Property | Attribute    | Description                                         | Type                                    | Default     |
| -------- | ------------ | --------------------------------------------------- | --------------------------------------- | ----------- |
| `config` | `brt-config` |                                                     | `BrtConfig \| string`                   | `undefined` |
| `data`   | --           | field array to add in feedback                      | `BrtData[]`                             | `undefined` |
| `dataFn` | --           | FN or PROMISE return field array to add in feedback | `() => BrtData[] \| Promise<BrtData[]>` | `undefined` |


## Events

| Event      | Description                                                                                            | Type               |
| ---------- | ------------------------------------------------------------------------------------------------------ | ------------------ |
| `brtError` | emit bruit-error on internal error or config error ex : BruitIo.addEventListener('onError',error=>...) | `CustomEvent<any>` |
| `ready`    |                                                                                                        | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
