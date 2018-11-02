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

  private static getXPath(path: Array<Element>): string {
    if (path.length) {
      path.pop(); //remove "window"
      path.pop(); // remove "document"
      path.pop(); //remove "html"

      return (
        '//' +
        path
          .map(elem => {
            let nodePath = elem.nodeName;
            if (elem.id) {
              nodePath += `[@id="${elem.id}"]`;
            } else {
              // if (elem.parentElement && elem.parentElement..ch)
              var i = 0;
              let child = elem;
              while ((child = child.previousElementSibling) != null) {
                if (child.nodeName === elem.nodeName) {
                  i++;
                }
              }
              if (i > 0) {
                nodePath += `[${i}]`;
              }
            }
            return nodePath;
          })
          .reverse()
          .join('/')
      );
    } else {
      return '//';
    }
  }

  // getXPathForElement(element) {
  //   const idx = (sib, name) =>
  //     sib ? idx(sib.previousElementSibling, name || sib.localName) + (sib.localName == name) : 1;

  //   const segs = elm =>
  //     !elm || elm.nodeType !== 1
  //       ? ['']
  //       : elm.id && document.querySelector(`#${elm.id}`) === elm
  //         ? [`id("${elm.id}")`]
  //         : [...segs(elm.parentNode), `${elm.localName.toLowerCase()}[${idx(elm)}]`];
  //   return segs(element).join('/');
  // }

  static logClick(...args) {
    if ((<any>console).click) {
      (<any>console).click(...args);
    } else {
      console.log(...args);
    }
  }
}
