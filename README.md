# GenaraToc

GenaraToc generates a table of contents (TOC) from headings in an HTML document. This is useful for documentation websites or SSR pages because it makes them easier to navigate. 

This library was inspired by [Tocify](https://github.com/gfranko/jquery.tocify.js), but GenaraToc uses native DOM methods and no other dependencies.

## Installation

Install it with npm.
```
npm install --save genaratoc
```

OR Install it with yarn.

```bash
yarn add genaratoc
```

## Usage

Define a `div` element with id attribute
```html
<div id="toc"></div>
```

Use GenaraToc with typescript
```typescript
import toc from 'GenaraToc'
// Typescript
// Optional: Select h2 ~ h5 heading level, it is also a defualt setting if you leave it undefined
const heading: string[] = ['h2', 'h3', 'h4', 'h5']

// Optional: TOC element is append to #toc element, it is also a defualt setting if you leave it undefined
const selector: string = '#toc'

toc.generate({ heading, selector })
```

Use GenaraToc with javascript
```javascript
// JavaScript
import toc from 'GenaraToc'
const heading = ['h2', 'h3', 'h4', 'h5']
const selector = '#toc'
toc.generate({ heading, selector })
```

## Include CSS

```css
@import 'GenaraToc/src/style/main.css';
```