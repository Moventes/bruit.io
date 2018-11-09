<p align="center">
  <h1 align="center">Bruit.io</h1>
  <p align="center">BRuit is a User Issues Tool</p>
  <p align="center"><b>🚨 ERROR CODES 🚨</b></p>
</p>

# _BrtError_

```ts
interface BrtError {
  code: number;
  text: string;
}
```

# CODES

a code is formated with tree number:

| code | text              | Description                                                               |
| ---- | ----------------- | ------------------------------------------------------------------------- |
| 100  | config is missing | your config is missing, give a `BrtConfig` to component property `config` |
| 101  | config is missing | your config is missing, give a `BrtConfig` to property `config`           |
