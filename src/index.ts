
interface List {
  level: number | null;
  ele: Element | null;
  children: List[];
}

interface Params {
  content: string;
  heading?: string[];
  selector?: string;
}

interface Generatoc {
  init?: Function
}

let tocSelector: string = '#toc'
const headingList: List[] = []

const generatoc: Generatoc = {}

function last (arr: any[]) {
  return arr[arr.length - 1]
}

function praseH (h: string): number {
  return +h.substr(1)
}

function lastBranches (k: List[]): List[] {
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

function lastLeaf (k: List[]): List[] {
  let lastLeafNode: List[] = k
  while (lastLeafNode.length !== 0) {
    lastLeafNode = last(lastLeafNode).children
  }
  return lastLeafNode
}

function nestNode (times: number, node: Element, level: number): List {
  const template: List = {
    level: null,
    ele: null,
    children: []
  }
  if (times <= 0) {
    template.level = level
    template.ele = node
  } else {
    template.level = level - times
    template.children = [nestNode(--times, node, level)]
  }
  return template
}

function getLastHeadingParentOf (level: number, headings: List[]): List {
  let tmp = last(headings)
  let parent = {
    level: null,
    ele: null,
    children: headings
  }
  while (!tmp.ele || tmp.level !== level) {
    parent = tmp
    tmp = last(tmp.children)
    if(typeof tmp === 'undefined') {
      break;
    }
  }
  return parent
}

function createUl (): HTMLElement {
  return document.createElement('ul')
}

function createLi (content: string | null): Element {
  const li: Element = document.createElement('li')
  li.setAttribute('style', 'cursor: pointer;')
  const a: Element = document.createElement('a')
  a.innerHTML = content || ''
  li.appendChild(a)
  return li
}

function hideAllTocSubHeading (element: Element) {
  Array.prototype.forEach.call(element.children, (item: Element) => {
    const eles = item.querySelectorAll('ul')
    if (eles) {
      Array.prototype.forEach.call(eles, (ele: HTMLElement) => {
        if (ele) {
          ele.style.display = 'none'
        }
      })
    }
  })
}

function setScrollEvent (element: Element, node: Element) {
  element.addEventListener('click', function (_e: Event) {
    node.scrollIntoView({ behavior: 'smooth' })
  })
}

function traceParentAndShow (ele: HTMLElement) {
  if (ele.id !== tocSelector.substr(1)) {
    Array.prototype.forEach.call(ele.children, (item: HTMLElement) => {
      item.style.display = 'block'
    })
    traceParentAndShow(ele.parentElement!)
  }
}

function getRealUl(element: HTMLElement | Element): HTMLCollection | undefined {
  if(!element || !element.children[0]) {
    return undefined
  }
  if(element.children[0].tagName.toLowerCase() === 'ul') {
    Array.prototype.forEach.call(element.children, (ul: HTMLElement) => {
      ul.style.display = 'block'
    })
    return getRealUl(element.children[0])
  }
  return element.children
}

function setShowEvent (element: HTMLElement) {
  element.addEventListener('click', function (e: Event) {
    e.stopPropagation()
    hideAllTocSubHeading(document.querySelector(tocSelector)!)
    const uls = getRealUl(element.children[1])
    if(uls) {
      Array.prototype.forEach.call(uls, (ul: HTMLElement) => {
        ul.style.display = 'block'
      })
    }
    traceParentAndShow(element)
  })
}

function constructElements (item: List) {
  const ul = createUl()
  if (item.ele) {
    const li = createLi(item.ele.textContent)
    setScrollEvent(li, item.ele)
    setShowEvent(ul)
    ul.append(li)
  }
  if (item.children.length > 0) {
    item.children.forEach((subHead: List) => {
      ul.append(constructElements(subHead))
    })
  }
  return ul
}

function processNode (node: Element, preNode: Element | null, heading: List[]) {
  const curHeadLevel: number = praseH(node.localName)
  const preHeadLevel: number = preNode ? praseH(preNode.localName) : 0
  const item: List = {
    level: curHeadLevel,
    ele: null,
    children: []
  }
  // If heading level same as previous, append it to previous parent node.
  // 如果层级相同, 找到前一 tag 的父节点 append 这节点
  if (curHeadLevel === preHeadLevel) {
    item.ele = node
    item.level = curHeadLevel
    lastBranches(heading).push(item)
  } else if (curHeadLevel > preHeadLevel) {
    // If current heading level is lower than previous heading level,
    // find the parent of the last leaf of heading node and append it.
    const distance: number = curHeadLevel - preHeadLevel
    lastLeaf(heading).push(
      nestNode(distance - 1, node, curHeadLevel)
    )
  } else {
    item.ele = node
    // Find parent node of the last same level and append it
    // 找到最后一个同一层级的父节点 append 上当前节点
    getLastHeadingParentOf(curHeadLevel, heading).children.push(item)
  }
}

function renderToc () {
  const tocElement: Element | null = document.querySelector(tocSelector)
  if (tocElement === null) {
    // eslint-disable-next-line no-console
    console.error('Toc element not found!')
  }
  Array.prototype.forEach.call(headingList[0].children, (item: List) => {
    tocElement!.appendChild(constructElements(item))
  })
  hideAllTocSubHeading(tocElement!)
}

generatoc.init = function ({content , heading = ['h2', 'h3', 'h4', 'h5'], selector = '#toc' }: Params) {
  tocSelector = selector
  const tocHeader = heading.join(',')
  const headingNode: NodeListOf<Element> = document.querySelector(content)!.querySelectorAll(tocHeader)
  let previousNode: Element | null
  headingNode.forEach((hNode: Element, index: number) => {
    previousNode = index === 0 ? null : headingNode[index - 1]
    processNode(hNode, previousNode, headingList)
  })
  renderToc()
}

export default generatoc
