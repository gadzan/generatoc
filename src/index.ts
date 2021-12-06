import {
  praseH,
  elementOffset,
  getScrollTop,
  lastBranches,
  lastLeaf,
  nestNode,
  getLastHeadingParentOf,
  createUl,
  createLi,
  hideAllTocSubHeading,
  throttle,
  scrollEaseOut,
} from './ultils'

interface List {
  index: number;
  level: number | null;
  ele: Element | null;
  children: List[];
}

interface Params {
  content: string;
  heading?: string[];
  selector?: string;
  scrollHistory?: boolean;
  scrollOffset?: number;
  // 60 = 1s
  duration?: number;
  fold?: boolean;
}

interface Generatoc {
  init: ({ content, heading, selector }: Params) => void;
  destroy: () => void;
  refresh: () => void;
}

let tocContent: string = ''
let tocHeader: string = ''
let tocSelector: string = '#toc'
let tocScrollOffset: number = 0
let tocDuration: number = 7
let tocFolded: boolean = false

let headingList: List[] = []
let headingNode: NodeListOf<Element>
let extendPageOffset: number = 100
let scrollHistoryConfig: boolean = false

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ Handle events ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

function handlePageChange () {
  const winScrollTop: number = getScrollTop()
  const docHeight: number = document.body.offsetHeight
  const winHeight: number = window.innerHeight
  const scrollHeight: number = document.body.scrollHeight
  let elem: HTMLElement | null
  // let lastElem, lastElemOffset, currentElem

  // If scrolled to the bottom of the page
  if ((winScrollTop >= scrollHeight - winHeight - extendPageOffset) || (winHeight + winScrollTop > docHeight - extendPageOffset)) {
    // TODO
  }

  window.requestAnimationFrame(function() {
    let closestAnchorDistance: number | null = null

    // Stores the index of the closest anchor
    let closestAnchorIdx: number = 0

    let anchorText: string | null = null

    headingNode.forEach((hNode: Element, index: number) => {
      const distance = Math.abs(elementOffset(hNode.nextElementSibling ? hNode.nextElementSibling : hNode).top - winScrollTop - tocScrollOffset)
      if (closestAnchorDistance == null || distance < closestAnchorDistance) {
        closestAnchorDistance = distance;
        closestAnchorIdx = index;
      } else {
        return false;
      }
    })
    if (!headingNode[closestAnchorIdx]) return;
    anchorText = (<HTMLElement>headingNode[closestAnchorIdx]).innerText
    const tocA = document.querySelector('a[data-toc-index="' + closestAnchorIdx + '"]')
    if (!tocA) {
      return
    }
    elem = <HTMLElement>tocA.closest('ul')
    if (elem) {
      triggerShow(elem)
    } else {
      return
    }
    activateElement(elem)
    if(scrollHistoryConfig && window.location.hash !== "#" + anchorText) {
      window.location.replace("#" + anchorText);
    }
  })
}

function scrollTo (index: String) {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const destination = elementOffset(headingNode[+index!]).top - tocScrollOffset
  scrollEaseOut(scrollTop, destination, tocDuration)
}


function traceParentAndShow (ele: HTMLElement) {
  if (ele.id !== tocSelector.substr(1)) {
    Array.prototype.forEach.call(ele.children, (item: HTMLElement) => {
      if (item.tagName === 'UL') {
        item.style.transform = 'scaleY(1)'
        item.style.maxHeight = '200px'
      }
    })
    traceParentAndShow(ele.parentElement!)
  }
}

function showRealUlChildren (element: HTMLElement | Element): HTMLCollection | undefined {
  if (!element || !element.children || element.children.length === 0) {
    return undefined
  }
  if (element.tagName=== 'UL') {
    Array.prototype.forEach.call(element.children, (child: HTMLElement) => {
      if (child.tagName === 'UL') {
        child.style.transform = 'scaleY(1)'
        child.style.maxHeight = '200px'
      }
    })
    return showRealUlChildren(element.children[0])
  }
}

function showUlChildren (ele: HTMLElement) {
  triggerShow(ele)
}

// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ Handle events ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ Handle elements ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

function activateElement(element: HTMLElement) {
  if(!Array.prototype.includes.call(element.classList, 'active')) {
    element.querySelector('li')!.classList.add('active')
  };
}

function triggerShow (element: HTMLElement) {
  if(!element) return
  const closestUl = element.tagName === 'UL' ? element : element.closest('ul')
  if (!closestUl) return
  hideAllTocSubHeading(document.querySelector(tocSelector)!)
  showRealUlChildren(closestUl.children[1])
  traceParentAndShow(element)
  activateElement(element);
}

function constructElements (item: List) {
  const ul = createUl()
  if (item.ele) {
    const li = createLi(item.ele.textContent, item.index)
    ul.append(li)
  }
  if (item.children.length > 0) {
    item.children.forEach((subHead: List) => {
      ul.append(constructElements(subHead))
    })
  }
  return ul
}

function processNode (node: Element, preNode: Element | null, heading: List[], index: number) {
  const curHeadLevel: number = praseH(node.localName)
  const preHeadLevel: number = preNode ? praseH(preNode.localName) : 0

  const item: List = {
    index,
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
      nestNode(distance - 1, node, curHeadLevel, index)
    )
  } else {
    item.ele = node
    // Find parent node of the last same level and append it
    // 找到最后一个同一层级的父节点 append 上当前节点
    getLastHeadingParentOf(curHeadLevel, heading, index).children.push(item)
  }
}

function handleClick(e: Event) {
  const ele = <HTMLElement>e.target
  if (ele.tagName !== 'A') return
  const index  = ele.getAttribute('data-toc-index') || ''
  scrollTo(index)
  const ul = ele.closest('ul');
  if(ul) showUlChildren(ul)
}

function renderToc () {
  const tocElement: Element | null = document.querySelector(tocSelector)
  if (tocElement === null) {
    return
  }
  if (!headingList[0]) {
    return
  }
  headingList[0].index = -1
  Array.prototype.forEach.call(headingList[0].children, (item: List) => {
    tocElement.appendChild(constructElements(item))
  })
  tocElement.addEventListener('click', handleClick)
  if(headingNode.length > 0) {
    window.addEventListener("scroll" , throttle(handlePageChange), false);
  }
}
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ Handle elements ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

const generatoc: Generatoc = {
  init ({
    content,
    heading = ['h2', 'h3', 'h4', 'h5'],
    selector = '#toc',
    scrollHistory = false,
    scrollOffset = 0,
    duration = 7,
    fold = false
  }: Params) {
    tocSelector = selector
    tocHeader = heading.join(',')
    tocContent = content
    scrollHistoryConfig = scrollHistory
    tocScrollOffset = scrollOffset
    tocDuration = duration
    tocFolded = fold
    const postCotent = document.querySelector(tocContent)
    if(!postCotent) {
      return
    }
    headingNode = postCotent.querySelectorAll(tocHeader)
    let previousNode: Element | null
    headingNode.forEach((hNode: Element, index: number) => {
      previousNode = index === 0 ? null : headingNode[index - 1]
      processNode(hNode, previousNode, headingList, index)
    })
    renderToc()
    if(fold) handlePageChange()
  },
  destroy () {
    const tocElement = document.querySelector(tocSelector)
    if (!tocElement) {
      return
    }
    tocElement.removeEventListener('click', handleClick)
    headingList = []
    tocElement.innerHTML = ''
    window.removeEventListener("scroll" , handlePageChange);
  },
  refresh () {
    generatoc.destroy()
    generatoc.init({
      content: tocContent,
      heading: tocHeader.split(','),
      selector: tocSelector,
      scrollOffset: tocScrollOffset,
      duration: tocDuration,
      fold: tocFolded,
    })
  }
}

export default generatoc
