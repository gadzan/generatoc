
export default function createElement () {
  const postContent: HTMLElement = document.createElement('div')
  postContent.setAttribute('class', 'post-content')

  const headings = ['h1', 'h2', 'h3', 'h2', 'h3', 'h4', 'h5', 'h6', 'h2', 'h4', 'h6', 'h3', 'h4', 'h2', 'h5', 'h5']

  headings.forEach((h) => {
    const hele: HTMLElement = document.createElement(h)
    hele.innerHTML = h
    postContent.appendChild(hele)
  })

  const toc: HTMLElement = document.createElement('div')
  toc.setAttribute('id', 'toc')
  toc.innerHTML = 'test'
  document.body.appendChild(postContent)
  document.body.appendChild(toc)
}
