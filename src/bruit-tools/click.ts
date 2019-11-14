import { BrtClickLogArg } from '@bruit/types';

const SKIP_TAG = ['BR', 'WBR', 'STYLE', 'SCRIPT', 'HEAD', 'HTML', 'META'];
const SKIP_CHILDREN = ['SVG'];

export class ClickTool {
  /**
   * @param path array of element (from click event)
   *
   * @return string, xpath of clicked element
   */
  static init() {
    window.addEventListener('click', event => {
      this.logClick(<BrtClickLogArg>{
        xpath: this.getXPath(event['path']),
        partialDom: ClickTool.domToString(event.srcElement || event.target)
      });
    });
  }

  private static domToString(
    element: Element | EventTarget,
    maxLevel: number = 3
  ): string {

    const elements = [];
    let currentElement = this.getChildElement(element as Element);

    if (currentElement) {
      while (elements.length <= maxLevel) {
        if (!SKIP_TAG.includes(currentElement.tagName.toUpperCase())) {
          elements.push(currentElement);
        }
        currentElement = this.getChildElement(currentElement);
        if (!currentElement) {
          break;
        }
      }
    }

    return elements
      .map(elem => ClickTool.elementToString(elem))
      .map((elem: string, idx: number) => `${'&nbsp;'.repeat(2 * idx)}${elem}`)
      .join('<br>');

  }

  private static elementToString(
    element: Element
  ): string {

    if (element.tagName) {
      switch (element.tagName.toUpperCase()) {
        case 'SVG':
        case 'IMG':
        case 'CANVAS':
        case 'EMBED':
          return ClickTool.elementToTagString(element);
        case 'P':
        case 'CENTER':
        case 'EM':
        case 'STRONG':
        case 'SUB':
        case 'SUP':
        case 'B':
        case 'SMALL':
        case 'ABBR':
          return this.getTextContent(element);
        default:
          return `${ClickTool.elementToTagString(element)} ${ClickTool.getTextContent(element)}`;
      }
    }
    return '<unknown>'
  }

  private static getTextContent(element: Element) {
    if (element.innerHTML) {
      const indexOfFirstTag = element.innerHTML.indexOf('<');
      let txt;
      if (indexOfFirstTag > 0) {
        txt = element.innerHTML.slice(0, element.innerHTML.indexOf('<'));
      } else if (indexOfFirstTag === 0) {
        txt = '';
      } else {
        txt = element.innerHTML;
      }
      return txt.replace(/\s+/g, ' ');
    } else {
      return '';
    }
  }

  private static elementToTagString(
    element: Element
  ): string {
    let string = '';
    if (element.tagName) string += element.tagName.toLowerCase();
    if (element.id) string += ` id="${element.id}"`;
    if (element.className && typeof element.className === 'string' && element.className.length) string += ` class="${element.className.split(' ')[0]}..."`;
    if (element.getAttribute('type')) string += ` type="${element.getAttribute('type')}"`;
    if (element.getAttribute('name')) string += ` name="${element.getAttribute('name')}"`;
    if (element.getAttribute('href') && element.getAttribute('href') !== '#') string += ` href="${element.getAttribute('href')}"`;
    if (element.getAttribute('value')) string += ` value="${element.getAttribute('value')}"`;
    return `&lt;${string}&gt;`;
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

  /**
   * returns the first child of an element, or null
   * 
   * @param element the element to inspect
   * 
   * @return the first child of the element, or null
   */
  private static getChildElement(element: Element): Element {

    var currentElement = element;

    if (currentElement.hasChildNodes) {
      let firstChild: Element = null;
      for (let i = 0; i < currentElement.children.length; i++) {
        const child = currentElement.children.item(i);
        if (!SKIP_TAG.includes(child.tagName.toUpperCase()) && !SKIP_CHILDREN.includes(currentElement.tagName.toUpperCase())) {
          firstChild = child;
          break;
        }
      }
      currentElement = firstChild;
    } else {
      currentElement = null;
    }

    return currentElement;
  }

  static logClick(...args) {
    if ((<any>console).click) {
      (<any>console).click(...args);
    } else {
      console.log(...args);
    }
  }
}
