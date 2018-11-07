<p align="center">
  <h1 align="center">Bruit.io</h1>
  <p align="center">BRuit is a User Issues Tool</p>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@moventes/bruit">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/@moventes/bruit.svg?style=flat">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img alt="License" src="https://img.shields.io/npm/l/@moventes/bruit.svg">
  </a>
    <a href="https://stenciljs.com/">
    <img alt="Built With Stencil" src="https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square">
  </a>
</p>
<p align="center">
available on
</p>
<p align="center">
    <img alt="html/js" src="https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" height="40px">
    <img alt="Angular" src="https://angular.io/assets/images/logos/angular/angular.svg" height="45px">
    <img alt="React" src="https://camo.githubusercontent.com/98a9b62f324b8a13275cc57dc4293f0ee315f85f/68747470733a2f2f73616e6473746f726d2e64652f5f5265736f75726365732f50657273697374656e742f333238353431366538353033623263383335346333323162636436393063663535306238623264332f52656163742d4c6f676f2e737667" height="35px">
    <img alt="Ember" src="https://upload.wikimedia.org/wikipedia/fr/6/69/Ember.js_Logo_and_Mascot.png" height="35px">
</p>

Bruit is a webComponent for user review ...

# Getting started

<a href="https://bruit.io/"><button>start on bruit.io</button></a>

# Table of Contents

**[Install](#install)**<br>
**[Usage](#usage)**<br>
**[Configuration](#Configuration)**<br>
&nbsp;&nbsp;&nbsp;&nbsp;**[BrtConfig](#BrtConfig)**<br>
&nbsp;&nbsp;&nbsp;&nbsp;**[BrtField](#BrtField)**<br>
&nbsp;&nbsp;&nbsp;&nbsp;**[BrtLabels](#BrtLabels)**<br>
&nbsp;&nbsp;&nbsp;&nbsp;**[BrtColors](#BrtColors)**<br>
&nbsp;&nbsp;&nbsp;&nbsp;**[BrtLogLevels](#BrtLogLevels)**<br>
&nbsp;&nbsp;&nbsp;&nbsp;**[BrtData](#BrtData)**<br>
&nbsp;&nbsp;&nbsp;&nbsp;**[BrtError](#BrtError)**<br>
**[Contributing](#Contributing)**<br>
**[Having troubles ?](#Having-troubles-?)**<br>

# Install

```bash
npm install @bruit/component --save
```

or

```html
<script src="https://unpkg.com/@bruit/component/dist/bruit.js"></script>
```

# Usage

```html
<bruit-io> element to click </bruit-io>
```

with properties :

- [_config_](#configuration) (required)
- _data_ (optional)
- _dataFn_ (optional)
- _onError_ (event) (optional)

**Integration frameworks :**

<p align="center">
  <a href="#html">
    <img alt="html/js" src="https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" width="100px">
  </a>
  <a href="#angular">
    <img alt="Angular" src="https://angular.io/assets/images/logos/angular/angular.svg" width="110px">
  </a>
    <a href="#react">
    <img alt="React" src="https://camo.githubusercontent.com/98a9b62f324b8a13275cc57dc4293f0ee315f85f/68747470733a2f2f73616e6473746f726d2e64652f5f5265736f75726365732f50657273697374656e742f333238353431366538353033623263383335346333323162636436393063663535306238623264332f52656163742d4c6f676f2e737667" width="100px">
  </a>
    <a href="#ember">
    <img alt="Ember" src="https://upload.wikimedia.org/wikipedia/fr/6/69/Ember.js_Logo_and_Mascot.png" width="100px">
  </a>
</p>

## Configuration

`bruit-io` webComponent has a `config` property.

`config` property take a [BrtConfig](#brtconfig) value.

### _BrtConfig_

BrtConfig is a JSON for configure and customize bruit component

| attribute             | type            | description                                                                  | required | default value                   |
| --------------------- | --------------- | ---------------------------------------------------------------------------- | -------- | ------------------------------- |
| **apiKey**            | string          | your personal api key                                                        | yes      | -                               |
| **form**              | array<BrtField> | your personal api key                                                        | yes      | -                               |
| closeModalOnSubmit    | boolean         | true for close modal directly on submit form and send feedback in background | no       | false                           |
| durationBeforeClosing | number          | time ( milliseconds ) before closing modal after sending                     | no       | 1500                            |
| labels                | BrtLabels       | labels of the modal (title/button/...)                                       | no       | see                             |
| logLevels             | BrtLogLevels    | type and number of log to send                                               | no       | see                             |
| maxLogLines           | number          | number of log to send                                                        | no       | 100                             |
| colors                | BrtColors       | modal theming                                                                | no       | see                             |
| apiUrl                | string          | if you want use your own api for send feedback                               | no       | <https://api.bruit.io/feedback> |

- import if using Typescript :

```javascript
import { BrtConfig } from '@moventes/bruit';
```

### _BrtField_

- description
- format
- default value :

- import if using Typescript :

```javascript
import { BrtField } from '@moventes/bruit';
```

### _BrtLabels_

- default value :

```json
{
  "title": "bruit.io",
  "introduction": "send a feedback",
  "button": "send"
}
```

- import if using Typescript :

```javascript
import { BrtLabels } from '@moventes/bruit';
```

### _BrtColors_

- default value :

```json
{
  "header": "#2D8297",
  "body": "#eee",
  "background": "#444444ee",
  "errors": "#c31313",
  "focus": "#1f5a69"
}
```

- import if using Typescript :

```javascript
import { BrtColors } from '@moventes/bruit';
```

### _BrtLogLevels_

- default value :

```json
{
  "log": true,
  "debug": true,
  "info": true,
  "warn": true,
  "error": true,
  "network": true,
  "click": true,
  "url": true
}
```

- import if using Typescript :

```javascript
import { BrtLogLevels } from '@moventes/bruit';
```

### _BrtData_

- import if using Typescript :

```javascript
import { BrtData } from '@moventes/bruit';
```

### _BrtError_

- import if using Typescript :

```javascript
import { BrtError } from '@moventes/bruit';
```

# Integration frameworks

## HTML

## Angular

## React

## Ember

# Contributing

xxx

# Having troubles ?

- issues Github
- stackoverflow
