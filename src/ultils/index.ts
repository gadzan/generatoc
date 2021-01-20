interface List {
  index: number;
  level: number | null;
  ele: Element | null;
  children: List[];
}

export function last (arr: any[]) {
  return arr[arr.length - 1]
}

export function praseH (h: string): number {
  return +h.substr(1)
}

export function elementOffset(ele: Element) {
  let result = {
    top: 0,
    left: 0
  }
  if (!ele.getClientRects().length) {
    return result
  }
  if (window.getComputedStyle(ele)['display'] === 'none') {
    return result
  }
  result = ele.getBoundingClientRect()
  let document = ele.ownerDocument!.documentElement
  return {
    top: result.top + window.pageYOffset - document.clientTop,
    left: result.left + window.pageXOffset - document.clientLeft
  }
}

export function getScrollTop() {
  return window.pageYOffset 
      || document.documentElement.scrollTop  
      || document.body.scrollTop  
      || 0;
}

export function lastBranches (k: List[]): List[] {
  if (k.length === 0) {
    return k
  }
  let lastNode: List = last(k)
  let lastArray = k
  while (lastNode.children.length !== 0) {
    lastArray = lastNode.children
    lastNode = last(lastNode.children)
  }
  return lastArray
}

export function lastLeaf (k: List[]): List[] {
  let lastLeafNode: List[] = k
  while (lastLeafNode.length !== 0) {
    lastLeafNode = last(lastLeafNode).children
  }
  return lastLeafNode
}

export function nestNode (times: number, node: Element, level: number, index: number): List {
  const template: List = {
    index,
    level: null,
    ele: null,
    children: []
  }
  if (times <= 0) {
    template.level = level
    template.ele = node
  } else {
    template.level = level - times
    template.children = [nestNode(--times, node, level, index)]
  }
  return template
}

export function getLastHeadingParentOf (level: number, headings: List[], index: number): List {
  let tmp = last(headings)
  let parent = {
    index,
    level: null,
    ele: null,
    children: headings
  }
  while (tmp.level !== level) {
    parent = tmp
    tmp = last(tmp.children)
    if (typeof tmp === 'undefined') {
      break
    }
  }
  return parent
}

export function createUl (): HTMLElement {
  return document.createElement('ul')
}

export function createLi (content: string | null, index: number): Element {
  const li: Element = document.createElement('li')
  li.setAttribute('style', 'cursor: pointer;')
  const a: Element = document.createElement('a')
  a.setAttribute('data-toc-index', index.toString())
  a.innerHTML = content || ''
  li.appendChild(a)
  return li
}

export function hideAllTocSubHeading (element: Element) {
  Array.prototype.forEach.call(element.children, (item: HTMLElement) => {
    item.querySelector('li')!.classList.remove('active')
    const eles = item.querySelectorAll('ul')
    if (eles) {
      Array.prototype.forEach.call(eles, (ele: HTMLElement) => {
        if (ele) {
          ele.querySelector('li')!.classList.remove('active')
          ele.style.transform = 'scaleY(0)'
          ele.style.maxHeight = '0px'
        }
      })
    }
  })
}

export function throttle (fn: Function, interval: number = 500) {
  let timer: any = null;
  let firstTime: boolean = true;
  return function (this: any, ...args: any) {
      if (firstTime) {
        fn.apply(this, args);
        return firstTime = false;
      }
      if (timer) {
        return;
      }
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        fn.apply(this, args);
      }, interval);
  };
}

export function scrollEaseOut (start: number, destination: number = 0, rate: number = 2): void {
  if (start === destination || rate < 1 ) {
    return;
  }
  let currentPosition = start
  function jump (): void {
    currentPosition = currentPosition + (destination - currentPosition) / rate;
    if (Math.abs(destination - currentPosition) < 1) {
      window.scrollTo(0, destination);
      return;
    }
    window.scrollTo(0, currentPosition);
    requestAnimationFrame(jump);
  };
  jump();
}
