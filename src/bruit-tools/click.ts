export class ClickTool {
  static init() {
    window.addEventListener('click', event => {
      this.logClick({
        url: window.location.href,
        xpath: this.getXPath(event['path']),
        dom: event.srcElement.outerHTML
      });
    });
  }

  private static getXPath(path: Array<Element>) {
    if (path.length) {
      path.pop();
      return path
        .map(elem => elem.nodeName)
        .reverse()
        .join('.');
    } else {
      return '';
    }
  }

  static logClick(...args) {
    if ((<any>console).click) {
      (<any>console).click(...args);
    } else {
      console.log(...args);
    }
  }
}
