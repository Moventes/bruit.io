# bruit-io

<!-- Auto Generated Below -->

## Properties

| Property | Attribute | Description                                         | Type                                |
| -------- | --------- | --------------------------------------------------- | ----------------------------------- |
| `config` | --        |                                                     | `BruitConfigModel`                  |
| `dataFn` | --        | FN or PROMISE return field array to add in feedback | `() => Field[] \| Promise<Field[]>` |
| `data`   | --        | field array to add in feedback                      | `Field[]`                           |

## Events

| Event     | Detail   | Description                                                                                            |
| --------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `onError` | BrtError | emit bruit-error on internal error or config error ex : BruitIo.addEventListener('onError',error=>...) |

---

_Built with [StencilJS](https://stenciljs.com/)_
