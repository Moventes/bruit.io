import { BrtClickLogArg } from '@bruit/types';

export class ClickTool {
  /**
   * @param path array of element (from click event)
   *
   * @return string, xpath of clicked element
   */
  static init() {
    window.addEventListener('click', event => {
      this.logClick(<BrtClickLogArg>{
        url: window.location.href,
        xpath: this.getXPath(event['path']),
        dom: event.srcElement.outerHTML
      });
    });
  }

  /**
   * @param path array of element (from click event)
   *
   * @return string, xpath of clicked element
   */
  private static getXPath(path: Array<Element>): string {
    // if is an array and click is in html
    if (Array.isArray(path) && path.length >= 3) {
      // xpath start always with '//'
      // path is an array of dom element start with clicked element, finish with window

      path.pop(); //remove "window"
      path.pop(); // remove "document"
      path.pop(); //remove "html"

      const xpathElements = [];

      path.some(element => {
        xpathElements.push(ClickTool.getElementXpath(element));
        return !!element.id;
      });

      return '//' + xpathElements.reverse().join('/');
    } else {
      return '//';
    }
  }

  /**
   * create xpath element from dom element
   * ex: DIV[@id="idOfDiv"] for <div id="idOfDiv"></div>
   * ex: DIV[1] for <span><div></div><div clickedDiv ></div></span>
   *
   * @param elem Element
   *
   * @return string, the element xpath
   */
  private static getElementXpath(elem: Element): string {
    if (elem.id) {
      //if element have an id => concat `[@id="${elem.id}"]` with the element name
      return `${elem.nodeName}[@id="${elem.id}"]`;
    } else if (elem.previousElementSibling || elem.nextElementSibling) {
      // element havn't id and have sibling => concat his index `[index]` with the element name
      return `${elem.nodeName}[${ClickTool.indexOfElement(elem)}]`;
    } else {
      // element is unique
      return elem.nodeName;
    }
  }

  /**
   * @param elem the element to use for count his index in his parent
   *
   * @return number, index of element in his parent
   */
  private static indexOfElement(elem: Element): number {
    // count previous element of same nodeName
    var indexOfElement = 0;
    let child = elem;
    while ((child = child.previousElementSibling) != null) {
      if (child.nodeName === elem.nodeName) {
        indexOfElement++;
      }
    }
    return indexOfElement;
  }

  static logClick(...args) {
    if ((<any>console).click) {
      (<any>console).click(...args);
    } else {
      console.log(...args);
    }
  }
}
