export class UrlTool {
  static init() {
    if ('onhashchange' in window) {
      window.addEventListener('hashchange', () => {
        this.logUrl(window.location.href);
      });
      this.logUrl(window.location.href);
    }
  }

  static logUrl(...args) {
    if ((<any>console).url) {
      (<any>console).url(...args);
    } else {
      console.log(...args);
    }
  }
}
