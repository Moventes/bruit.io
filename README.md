<p align="center">
  <h1 align="center">Bruit.io</h1>
  <p align="center">BRuit is a User Issues Tool</p>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@bruit/component">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/@bruit/component.svg?style=flat">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img alt="License" src="https://img.shields.io/npm/l/@bruit/component.svg">
  </a>
    <a href="https://stenciljs.com/">
    <img alt="Built With Stencil" src="https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square">
  </a>
</p>
<p align="center">
available on
</p>
<p align="center">
    <img alt="javascript" src="https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg" height="40px">
    <img alt="Angular" src="https://cdn.worldvectorlogo.com/logos/angular-icon-1.svg" height="40px">
    <img alt="React" src="https://camo.githubusercontent.com/98a9b62f324b8a13275cc57dc4293f0ee315f85f/68747470733a2f2f73616e6473746f726d2e64652f5f5265736f75726365732f50657273697374656e742f333238353431366538353033623263383335346333323162636436393063663535306238623264332f52656163742d4c6f676f2e737667" height="40px">
    <!-- <img alt="Ember" src="https://upload.wikimedia.org/wikipedia/fr/6/69/Ember.js_Logo_and_Mascot.png" height="40px"> -->
    <img alt="Vue" src="https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg" height="40px">
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
  <a href="#javascript">
    <img alt="Javascript" src="https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg" height="90px">
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="#angular">
    <img alt="Angular" src="https://cdn.worldvectorlogo.com/logos/angular-icon-1.svg" height="90px">
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="#react">
    <img alt="React" src="https://camo.githubusercontent.com/98a9b62f324b8a13275cc57dc4293f0ee315f85f/68747470733a2f2f73616e6473746f726d2e64652f5f5265736f75726365732f50657273697374656e742f333238353431366538353033623263383335346333323162636436393063663535306238623264332f52656163742d4c6f676f2e737667" height="90px">
  </a>
  <!-- &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="#ember">
    <img alt="Ember" src="https://upload.wikimedia.org/wikipedia/fr/6/69/Ember.js_Logo_and_Mascot.png" height="90px">
  </a> -->
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="#vue">
    <img alt="Vue" src="https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg" height="90px">
  </a>
</p>

## Configuration

`bruit-io` webComponent has a `config` property.

`config` property take a [BrtConfig](#brtconfig) value.

### _BrtConfig_

BrtConfig is a JSON for configure and customize `bruit-io` component

| attribute             | type                          | description                                                                  | required | default value                   |
| --------------------- | ----------------------------- | ---------------------------------------------------------------------------- | -------- | ------------------------------- |
| **apiKey**            | string                        | your personal api key                                                        | yes      | -                               |
| **form**              | array<[BrtField](#brtfield)>  | your personal api key                                                        | yes      | -                               |
| closeModalOnSubmit    | boolean                       | true for close modal directly on submit form and send feedback in background | no       | false                           |
| durationBeforeClosing | number                        | time ( milliseconds ) before closing modal after sending                     | no       | 1500                            |
| labels                | [BrtLabels](#brtlabels)       | labels of the modal (title/button/...)                                       | no       | [see](#brtlabels)               |
| logLevels             | [BrtLogLevels](#BrtLogLevels) | type and number of log to send                                               | no       | [see](#BrtLogLevels)            |
| maxLogLines           | number                        | number of log to send                                                        | no       | 100                             |
| colors                | [BrtColors](#BrtColors)       | modal theming                                                                | no       | [see](#BrtColors)               |
| apiUrl                | string                        | if you want use your own api for send feedback                               | no       | <https://api.bruit.io/feedback> |

- import if using Typescript :

```javascript
import { BrtConfig } from '@bruit/component';
```

### _BrtField_

- description
- format

- import if using Typescript :

```javascript
import { BrtField } from '@bruit/component';
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
import { BrtLabels } from '@bruit/component';
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
import { BrtColors } from '@bruit/component';
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
import { BrtLogLevels } from '@bruit/component';
```

### _BrtData_

- import if using Typescript :

```javascript
import { BrtData } from '@bruit/component';
```

### _BrtError_

- import if using Typescript :

```javascript
import { BrtError } from '@bruit/component';
```

# Integration frameworks

## JavaScript

Integrating `bruit-io` component to a project without a JavaScript framework is straight forward. If you're using a simple HTML page, you can add bruit component via a script tag.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script src="https://unpkg.com/@bruit/component/dist/test-components.js"></script>
</head>
<body>
  <bruit-io></bruit-io>
    <script>
    var bruitCmp = document.querySelector('bruit-io');
    bruitCmp.config = {
      apiKey: 'xxxxxxxxxxxxxxxxx',
      form: [...]
    };
  </script>
</body>
</html>
```

[_from stencil documentation_](https://github.com/ionic-team/stencil-site/blob/master/src/docs/framework-integration/javascript.md)

## Angular

Using `bruit-io` component within an Angular CLI project is a two-step process. We need to:

1. Include the `CUSTOM_ELEMENTS_SCHEMA` in the modules that use the components
1. Call `defineCustomElements(window)` from `main.ts` (or some other appropriate place)

### Including the Custom Elements Schema

Including the `CUSTOM_ELEMENTS_SCHEMA` in the module allows the use of the web components in the HTML markup without the compiler producing errors. Here is an example of adding it to `AppModule`:

```tsx
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
```

The `CUSTOM_ELEMENTS_SCHEMA` needs to be included in any module that uses custom elements.

### Calling defineCustomElements

Bruit component include a main function that is used to load the components in the collection. That function is called `defineCustomElements()` and it needs to be called once during the bootstrapping of your application. One convenient place to do this is in `main.ts` as such:

```tsx
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { defineCustomElements } from '@bruit/component/dist/loader';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
defineCustomElements(window);
```

[_from stencil documentation_](https://github.com/ionic-team/stencil-site/edit/master/src/docs/framework-integration/angular.md)

## React

With an application built using the `create-react-app` script the easiest way to include the `bruit-io` component is to call `defineCustomElements(window)` from the `index.js` file.

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { defineCustomElements } from '@bruit/component/dist/loader';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
defineCustomElements(window);
```

[_from stencil documentation_](https://github.com/ionic-team/stencil-site/blob/master/src/docs/framework-integration/react.md)

<!-- ## Ember -->

## Vue

In order to use the `bruit-io` component within the Vue app, the application must be modified to define the custom elements and to inform the Vue compiler which elements to ignore during compilation. This can all be done within the `main.js` file. For example:

```tsx
import Vue from 'vue';
import App from './App.vue';
import { defineCustomElements } from '@bruit/component/dist/loader';

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/bruit-\w*/];

defineCustomElements(window);

new Vue({
  render: h => h(App)
}).$mount('#app');
```

[_from stencil documentation_](https://github.com/ionic-team/stencil-site/blob/master/src/docs/framework-integration/vue.md)

# Contributing

xxx

# Having troubles ?

- issues Github
- stackoverflow
