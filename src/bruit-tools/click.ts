export class ClickTool {
  static init() {
    window.addEventListener('click', event => {
      const splittedUrl = event.srcElement.baseURI.split('/');
      const screenName = splittedUrl[splittedUrl.length - 1];
      if (['ION-ICON'].indexOf(event.srcElement.nodeName) >= 0) {
        ClickTool.logClick('[' + screenName + '] - icon.click() - ', event.srcElement.getAttribute('name'));
      } else if (['ION-LABEL', 'DIV', 'SPAN', 'P'].indexOf(event.srcElement.nodeName) >= 0) {
        this.logClickOnDomElement(screenName, 'label', event.srcElement);
      } else if (['ION-INPUT', 'INPUT'].indexOf(event.srcElement.nodeName) >= 0) {
        ClickTool.logClick(
          '[' + screenName + '] - input[' + event.srcElement.getAttribute('type') + '].click() - ',
          event.srcElement.innerHTML
        );
      } else if (['ION-BUTTON', 'BUTTON'].indexOf(event.srcElement.nodeName) >= 0) {
        this.logClickOnDomElement(screenName, 'button', event.srcElement);
      } else {
        this.logClickOnDomElement(screenName, 'any', event.srcElement);
      }
    });
  }

  private static logClickOnDomElement(screenName, logText, srcElement: Element) {
    const preffix = '[' + screenName + '] - ' + logText + '.click() - ';
    if (srcElement.textContent && srcElement.textContent.trim().length > 0) {
      ClickTool.logClick(preffix, srcElement.textContent);
    } else if (srcElement.innerHTML && srcElement.innerHTML.trim().length > 0) {
      ClickTool.logClick(preffix, srcElement.innerHTML);
    } else {
      ClickTool.logClick(preffix, srcElement.outerHTML);
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
