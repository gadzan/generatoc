export default function createElement (putContent: boolean, setToc: boolean, setPost: boolean) {
  const postContent: HTMLElement = document.createElement('div')
  postContent.setAttribute('class', 'post-content')

  let count = 0;
  if (putContent) {
    const headings = ['h1', 'h2', 'h3', 'h2', 'h3', 'h4', 'h5', 'h6', 'h2', 'h4', 'h6', 'h3', 'h4', 'h2', 'h5', 'h5']
    headings.forEach((h) => {
      const hEle: HTMLElement = document.createElement(h)
      hEle.innerHTML = h
      postContent.appendChild(hEle)
    })
  }

  const toc: HTMLElement = document.createElement('div')
  toc.setAttribute('id', 'toc')
  toc.innerHTML = 'test'

  if (setPost) {
    document.body.appendChild(postContent)
  }

  if (setToc) {
    document.body.appendChild(toc)
  }
}
