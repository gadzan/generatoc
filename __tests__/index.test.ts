import generatoc from '../src/index';

import createElement from './utils/createTestEnv'


function checkElements (ul: number, li: number, a: number) {
  const toc = document.querySelector('#toc')
  const uls = toc!.querySelectorAll('ul')
  const lis = toc!.querySelectorAll('li')
  const as = toc!.querySelectorAll('a')
  if (ul > 0) {
    as[6].click()
  }
  expect(uls.length).toEqual(ul)
  expect(lis.length).toEqual(li)
  expect(as.length).toEqual(a)
}

describe('GeneraToc Init function', () => {
  it('Test empty HTML case', () => {
    createElement(false, false, false)
    generatoc.init({ content: '.post-content' })
    document.body.innerHTML = ''

    createElement(false, false, true)
    generatoc.init({ content: '.post-content' })

    document.body.innerHTML = ''
    createElement(false, true, true)
    generatoc.init({ content: '.post-content' })
    checkElements(0, 0, 0)
  })

  it('Test normal HTML case', () => {
    document.body.innerHTML = ''
    createElement(true, true, true)
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
    generatoc.init({ content: '.post-content' })
    checkElements(16, 13, 13)
  })

  it('GeneraToc Refesh function', () => {
    generatoc.refresh()
    const toc = document.querySelector('#toc')
    expect(toc).not.toBeNull()
    if (toc) {
      const uls = toc.querySelectorAll('ul')
      expect(uls.length).toBeGreaterThan(0)
    }
    checkElements(16, 13, 13)
  })

  it('GeneraToc Destory function', () => {
    generatoc.destroy()
    let toc = document.querySelector('#toc')
    expect(toc).not.toBeNull()
    if (toc) {
      expect(toc.innerHTML).toEqual('')
    }
    toc?.remove()
    toc = document.querySelector('#toc')
    generatoc.destroy()
    expect(toc).toBeNull()
  })
})