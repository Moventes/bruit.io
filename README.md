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

Bruit is a webComponent for user review ...

# Getting started

<a href="https://bruit.io/"><button>start on bruit.io</button></a>

# Table of Contents

**[Install](#install)**<br>
**[Usage](#usage)**<br>
**[Configuration](#BrtConfig)**<br>
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
npm install @moventes/bruit --save
```

or

```html
<script src="https://unpkg.com/@moventes/bruit/dist/bruit.js"></script>
```

# Usage

```html
<bruit-io> element to click </bruit-io>
```

**with properties:**

- config (required)
- data (optional)
- dataFn (optional)
- onError (optional)

**Integration frameworks:**

<p align="center">
  <a href="#html">
    <img alt="html/js" src="https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" width="100px">
  </a>
  <a href="#angular">
    <img alt="Angular" src="https://angular.io/assets/images/logos/angular/angular.svg" width="100px">
  </a>
    <a href="#react">
    <img alt="React" src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="100px">
  </a>
    <a href="#ember">
    <img alt="Ember" src="https://upload.wikimedia.org/wikipedia/fr/6/69/Ember.js_Logo_and_Mascot.png" width="100px">
  </a>
</p>

## BrtConfig

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
| apiUrl                | string          | if you want use you own api for send feedback                                | no       | <https://api.bruit.io/feedback> |

- import if using Typescript :

```javascript
import { BrtConfig } from '@moventes/bruit';
```

### BrtField

- description
- format
- default value :

- import if using Typescript :

```javascript
import { BrtField } from '@moventes/bruit';
```

### BrtLabels

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

### BrtColors

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

### BrtLogLevels

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

### BrtData

- import if using Typescript :

```javascript
import { BrtData } from '@moventes/bruit';
```

### BrtError

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
