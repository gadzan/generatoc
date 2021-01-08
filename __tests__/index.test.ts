import generatoc from '../src/index';

import createElement from './utils/createTestEnv'

import userEvent from '@testing-library/user-event'

import { throttle } from '../src/ultils/index';

function checkElements (ul: number, li: number, a: number) {
  const toc = document.querySelector('#toc')
  const uls = toc!.querySelectorAll('ul')
  const lis = toc!.querySelectorAll('li')
  const as = toc!.querySelectorAll('a')
  expect(uls.length).toEqual(ul)
  expect(lis.length).toEqual(li)
  expect(as.length).toEqual(a)
}

async function sleep(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => { resolve() }, time)
  })
}

beforeAll(() => {
  Element.prototype.getBoundingClientRect = jest.fn(() => {
    return { width: 100, height: 10, top: 1000, left: 0, bottom: 0, right: 0, x:0, y:0, toJSON: () => {} }
  });
  // @ts-ignore
  Element.prototype.getClientRects = jest.fn(() => [1,2,3])
  Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
      getPropertyValue: () => {
        return 'block';
      }
    })
  });
  window.scrollTo = jest.fn()
  window.requestAnimationFrame = (callback) => {
    callback(1)
    return 1
  }
});

describe('GeneraToc Init function', () => {

  it('Test Utils', async () => {
    const test = jest.fn()
    const callback = throttle(test, 100)
    callback()
    callback()
    callback()
    await sleep(200)
    callback()
    expect(test).toHaveBeenCalledTimes(2)
  })

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
    generatoc.init({ content: '.post-content', fold: true })
    checkElements(16, 13, 13)
    const lis = document.querySelectorAll('li')
    const uls = document.querySelectorAll('ul')
    const li = lis[3]
    const ul = uls[3]
    userEvent.click(ul)
    userEvent.click(li)
    expect(lis.length).toEqual(13);
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