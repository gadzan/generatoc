# GeneraToc

[![Travis (.org)](https://img.shields.io/travis/gadzan/generatoc?style=for-the-badge)](https://www.travis-ci.org/gadzan/generatoc)
[![npm 20downloads](https://img.shields.io/npm/dt/generatoc?label=npm%20downloads&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/generatoc)
[![npm bundle size](https://img.shields.io/bundlephobia/min/generatoc?style=for-the-badge)](https://www.npmjs.com/package/generatoc)
[![Coveralls github](https://img.shields.io/coveralls/github/gadzan/generatoc?style=for-the-badge)](https://coveralls.io/github/gadzan/generatoc?branch=master)
[![License](https://img.shields.io/npm/l/generatoc?style=for-the-badge)](https://github.com/gadzan/generatoc/blob/master/LICENSE)
[![Version](https://img.shields.io/npm/v/generatoc?logo=npm&label=version&style=for-the-badge)](https://www.npmjs.com/package/generatoc)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/gadzan/generatoc?logo=github&style=for-the-badge)](github.com/gadzan/generatoc/)

GeneraToc generates a table of contents (TOC) from headings in an HTML document. This is useful for documentation websites or SSR pages because it makes them easier to navigate. 

This library was inspired by [Tocify](https://github.com/gfranko/jquery.tocify.js) and [Tocbot](https://github.com/tscanlin/tocbot), but GeneraToc **uses native DOM** methods with **no other dependencies** and unlike Tocbot, GeneraToc does **NOT rely on id attribute** to navigate to the heading.

## DEMO

[https://gadzan.github.io/generatoc/demo/](https://gadzan.github.io/generatoc/demo/)

## Installation

Install it with npm.

```bash
# With npm
npm install --save generatoc
# or yarn
yarn add generatoc
# or pnpm
pnpm add generatoc
```

OR include in browser environment
include the script at the bottom of the page before the closing body tag.

```html
<script src="https://cdn.jsdelivr.net/npm/generatoc/build/generatoc.min.js"></script>
```

Include CSS

in html file

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/generatoc/build/generatoc.min.css">
```

OR

If you installed it with npm you might try importing the styles from 'node_modules'

```css
@import 'generatoc/src/style/main.css';
```

## Usage

Define a `div` element with id attribute

```html
<div id="toc"></div>
```

### Use GeneraToc with typescript:

```typescript
import generatoc from 'generatoc'
// Typescript
// (Required) Article content selector, default as '.post-content'
const content: string = '.post-content'

// (Optional) Select h2 ~ h5 heading level, it is also a defualt setting if you leave it undefined
const heading: string[] = ['h2', 'h3', 'h4', 'h5']

// (Optional) TOC element is append to #toc element, it is also a defualt setting if you leave it undefined
const selector: string = '#toc'

generatoc.init({ content, heading, selector })
```

### Use GeneraToc with javascript

```javascript
// JavaScript
import generatoc from 'generatoc'
const content = '.post-content'
const heading = ['h2', 'h3', 'h4', 'h5']
const selector = '#toc'
generatoc.init({ content, heading, selector })
```

### Use in browser environment

```javascript
const content = '.post-content'
const heading = ['h2', 'h3', 'h4', 'h5']
const selector = '#toc'
generatoc.init({ content, heading, selector })
```

### You need to know when importing css file

**If the `selector` is not `#toc` you have to modify css file manully**, just replace all `#toc` string with your selector name in css file which can be found at `./node_modules/generatoc/src/style/main.css`

## Development

```bash
yarn install
npm run dev
```

## Other init options

```plain
{
  // scrollHistory: Accepts a boolean; default to false
  // Adds a hash to the page url, to maintain history, when scrolling to a TOC item
  scrollHistory: false,

  // scrollOffset: Accepts a number; default to 0
  // Scroll to the target with a vertical offset(pixel). If you have a fixed header in your page, this is what you need to set.
  scrollOffset: 0,

  // duration: Accepts a number; default to 7
  // The duration of scroll animation, a larger number means slower scroll. please input with a number larger than 1.
  duration: 7,

  // fold: Accepts a boolean; default to false
  // Default show as folded TOC or not
  fold: false,
}
```

## TODO

- [x] Destory method
- [x] Reload method
- [x] Development env
- [x] Test cases
- [x] Show and close animation
- [ ] More configurations

## Using with SSR

If you are using GeneraToc with SSR framwork, like Nuxt.js, please add `transpile` param to `nuxt.config.js`

```javascript
build: {
  transpile: ['generatoc']
}
```

## LICENSE

MIT
