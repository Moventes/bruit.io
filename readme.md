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

# Getting Started

<a href="https://bruit.io/"><button>start on bruit.io</button></a>

### Table of Contents

**[usage](#usage)**<br>
**[configuration](#configuration)**<br>
**[types](#types)**<br>
**[customization](#customization)**<br>
**[about](#about)**<br>

# usage

# configuration

| attribute             | type           | about                                                                        | required | default value   |
| --------------------- | -------------- | ---------------------------------------------------------------------------- | -------- | --------------- |
| **apiKey**            | string         | your personal api key                                                        | yes      | -               |
| **form**              | array of field | your personal api key                                                        | yes      | -               |
| closeModalOnSubmit    | boolean        | true for close modal directly on submit form and send feedback in background | no       | false           |
| durationBeforeClosing | number         | time ( milliseconds ) before closing modal after sending                     | no       | 1500            |
| labels                | labels object  | labels of the modal (title/button/...)                                       | no       |
| logs                  | logs object    | type and number of log to send                                               | no       | all - 100 lines |
| colors                | colors object  | modal theming                                                                | no       |
| apiUrl                | string         | if you want use you own api for send feedback                                | no       | api.bruit.io    |

# types

## field (formField)

## bruitConfig

# customization

# about bruit.io
