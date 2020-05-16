import generatoc from '../src/index';

import createElement from './utils/createTestEnv'

function checkElements () {
  const toc = document.querySelector('#toc')
  const uls = toc!.querySelectorAll('ul')
  const lis = toc!.querySelectorAll('li')
  const as = toc!.querySelectorAll('a')
  expect(uls.length).toEqual(16)
  expect(lis.length).toEqual(13)
  as[6].click()
  expect(
    uls[8].style.display
    + uls[9].style.display 
    + uls[10].style.display
  ).toEqual('blockblocknone')
  as[2].click()
  expect(
    uls[8].style.display
    + uls[9].style.display
  ).toEqual('nonenone')
  as[3].click()
  expect(uls[4].style.display).toEqual('block')
  as[10].click()
  expect(
    uls[14].style.display
    + uls[15].style.display
  ).toEqual('blockblock')
}

test('GeneraToc Init function', () => {
  createElement()
  window.HTMLElement.prototype.scrollIntoView = jest.fn()
  generatoc.init({content: '.post-content'})
  checkElements()
})

test('GeneraToc Destory function', () => {
  generatoc.destroy()
  const toc = document.querySelector('#toc')
  expect(toc).not.toBeNull()
  if (toc) {
    expect(toc.innerHTML).toEqual('')
  }
})

test('GeneraToc Refesh function', () => {
  generatoc.refresh()
  const toc = document.querySelector('#toc')
  expect(toc).not.toBeNull()
  if (toc) {
    const uls = toc.querySelectorAll('ul')
    expect(uls.length).toBeGreaterThan(0)
  }
  checkElements()
})
