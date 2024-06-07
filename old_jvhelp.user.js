// ==UserScript==
// @name         JvHelp
// @version      2024-01-08
// @description  try to take over the world!
// @author       You
// @match        https://jeuxvideo.com/*
// @match        https://*.jeuxvideo.com/*
// @match        https://jvarchive.com/*
// @match        https://*.jvarchive.com/*
// ==/UserScript==


// NoReload
const isJva = document.location.href.includes('jvarchive')
const observer = new IntersectionObserver(onNextPage)
const messageClass = isJva ? 'card-message' : 'bloc-message-forum'
let currentUrl
let startPage
let page
let isLastPage = false
let isLoading = false

function init() {
  currentUrl = document.location.href
  startPage = Number(document.location.href.match(/forums\/[0-9]+-[0-9]+-[0-9]+-([0-9]+)/)?.[1] ?? 0)
  page = startPage
  isLoading = false
  isLastPage = false
}

async function onNextPage(entries) {
  if (page > startPage + 8 || isLastPage || isLoading || !entries.some(({ isIntersecting }) => isIntersecting)) return
  page += 1
  isLoading = true

  const html = new DOMParser().parseFromString(await (await fetch(document.location.href.replace(
    /forums\/([0-9]+)-([0-9]+)-([0-9]+)-([0-9]+)/,
    `forums/$1-$2-$3-${page}`
  ), { redirect: 'manual' })).text(), 'text/html')
  const newMessages = html.getElementsByClassName(messageClass)
  if (newMessages.length === 0) return
  if (newMessages.length !== 20) isLastPage = true
  const messages = document.getElementsByClassName(messageClass)
  const lastIndex = messages.length - 1
  for (let i = newMessages.length - 1; i >= 0; i -= 1) {
    messages[lastIndex].insertAdjacentElement('afterend', newMessages[i])
  }

  const title = document.createElement('p')
  title.innerText = `Page ${page}`
  title.style = 'padding: 1rem; font-size: 1.3rem; font-weight: bold'
  messages[lastIndex].insertAdjacentElement('afterend', title)

  isLoading = false
}

function onNoReload() {
  const messages = document.getElementsByClassName(messageClass)
  if (!messages.length || isLastPage) return
  if (currentUrl !== document.location.href) init()
  observer.disconnect()
  observer.observe(messages[messages.length - 1])
}


// ImageOpener
function onImgClick(event) {
  event.stopPropagation()
  event.preventDefault()
  const element = document.createElement('img')
  element.setAttribute('style', 'cursor: pointer; position: fixed; z-index: 9999; top: 0; left: 0; object-fit: contain; padding: 3rem; width: 100%; height: 100%; background-color: rgba(0,0,0,.7);')
  element.setAttribute('src', event.target.alt.replace(/www.noelshack.com\/([0-9]{4})-([0-9]{2})-([0-9]{1,2})-/, 'image.noelshack.com/fichiers/$1/$2/$3/'))
  element.addEventListener('click', () => document.body.removeChild(element))
  document.body.appendChild(element)
}

function onImageOpener() {
  const images = document.getElementsByTagName('img')
  for (let i = 0; i < images.length; i += 1) {
    if (images[i].src.includes('noelshack.com')) {
      images[i].removeEventListener('click', onImgClick, false)
      images[i].addEventListener('click', onImgClick, false)
      images[i].style.cursor = 'pointer'
    }
  }
}


// JVARedirect
async function on410Redirect() {
  const is410 = document.getElementsByClassName('img-erreur')[0]
  if (is410 && document.location.href.includes('jeuxvideo.com')) {
    await new Promise((res) => setTimeout(res, 2000))
    window.location.href = window.location.href.replace('jeuxvideo.com', 'jvarchive.com')
  }
}


//SetUp
function onChange() {
  onImageOpener()
  onNoReload()
  on410Redirect()
}

document.body.addEventListener('DOMNodeInserted', onChange, false)
document.body.addEventListener('DOMNodeRemoved', onChange, false)
document.addEventListener('load', onChange, false)
