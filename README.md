# GeneraToc

GeneraToc generates a table of contents (TOC) from headings in an HTML document. This is useful for documentation websites or SSR pages because it makes them easier to navigate. 

This library was inspired by [Tocify](https://github.com/gfranko/jquery.tocify.js) and [Tocbot](https://github.com/tscanlin/tocbot), but GeneraToc **uses native DOM** methods with **no other dependencies** and unlike Tocbot, GeneraToc does **NOT rely on id attribute** to navigate to the heading.

## Installation

Install it with npm.
```
npm install --save generatoc
```

OR Install it with yarn.

```bash
yarn add generatoc
```

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

Use GeneraToc with typescript:
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

Use GeneraToc with javascript:
```javascript
// JavaScript
import generatoc from 'generatoc'
const content = '.post-content'
const heading = ['h2', 'h3', 'h4', 'h5']
const selector = '#toc'
generatoc.init({ content, heading, selector })
```

## LICENSE
MIT
