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

const isJva = document.location.href.includes('jvarchive')
const messageClass = isJva ? 'card-message' : 'bloc-message-forum'


// LinkOpener
const tagLinkOpener = 'jvhelp-link-opener'
const selectors = {
  youtube: 'a[href^="https://youtube.com"], a[href^="https://www.youtube.com"], a[href^="https://m.youtube.com"], a[href^="https://youtu.be"]',
  twitter: 'a[href^="https://twitter.com/"], a[href^="https://x.com/"]',
  tiktok: 'a[href^="https://www.tiktok.com/"], a[href^="https://vm.tiktok.com/"]',
  instagram: 'a[href^="https://www.instagram.com/"]',
  default: 'a[href^="https://streamable.com/"], a[href^="https://webmshare.com/"], a[href^="https://vocaroo.com/"], a[href^="https://voca.ro/"]',
}

function processIframe(linksElement, platform) {
  linksElement.forEach((l) => {
    if (l.closest('.signature-msg')) return
    if (l.classList.contains(tagLinkOpener)) return
    l.classList.add(tagLinkOpener)
    let url
    switch (platform) {
      case 'twitter': {
        const link = l.getAttribute('href').split('/')
        const status = link.findIndex(i => i === 'status')
        if (status === -1) return
        const tweetId = link[status + 1]?.split('?')[0]
        if (!tweetId) return
        url = `https://platform.twitter.com/embed/Tweet.html?dnt=false&amp;embedId=${tweetId}&amp;features=eyJ0ZndfdGltZWxpbmVfbGlzdCI6eyJidWNrZXQiOltdLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X2ZvbGxvd2VyX2NvdW50X3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9iYWNrZW5kIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19yZWZzcmNfc2Vzc2lvbiI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfZm9zbnJfc29mdF9pbnRlcnZlbnRpb25zX2VuYWJsZWQiOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X21peGVkX21lZGlhXzE1ODk3Ijp7ImJ1Y2tldCI6InRyZWF0bWVudCIsInZlcnNpb24iOm51bGx9LCJ0ZndfZXhwZXJpbWVudHNfY29va2llX2V4cGlyYXRpb24iOnsiYnVja2V0IjoxMjA5NjAwLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3Nob3dfYmlyZHdhdGNoX3Bpdm90c19lbmFibGVkIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19kdXBsaWNhdGVfc2NyaWJlc190b19zZXR0aW5ncyI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdXNlX3Byb2ZpbGVfaW1hZ2Vfc2hhcGVfZW5hYmxlZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdmlkZW9faGxzX2R5bmFtaWNfbWFuaWZlc3RzXzE1MDgyIjp7ImJ1Y2tldCI6InRydWVfYml0cmF0ZSIsInZlcnNpb24iOm51bGx9LCJ0ZndfbGVnYWN5X3RpbWVsaW5lX3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9mcm9udGVuZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9fQ%3D%3D&amp;frame=false&amp;hideCard=false&amp;hideThread=false&amp;id=${tweetId}&amp;lang=fr&amp;origin=https%3A%2F%2Fpublish.twitter.com%2F%23&amp;theme=dark&amp;widgetsVersion=aaf4084522e3a%3A1674595607486&amp;width=550px`
        break
      }
      case 'tiktok': {
        // https://github.com/dustinrouillard/tiktok-embeds
        const link = l.getAttribute('href')
        if (link.includes('vm.tiktok.com/')) {
          url = link.replace(/https:\/\/vm.tiktok.com\/([^\/?&]+)(.*)?/, 'https://vm.dstn.to/$1')
        } else if (link.includes('video')) {
          url = link.replace(/https:\/\/www.tiktok.com\/(.+)\/video\/([^\/?&]+)(.*)?/, 'https://vm.dstn.to/$1/video/$2')
        }
        break
      }
      case 'instagram': {
        const link = l.getAttribute('href')
        if (!link.includes('/p/') && !link.includes('reel')) return
        const videoId = link.replace(/https:\/\/www.instagram.com\/(reel|.+\/p)\/([^\/?&]+)(.*)?/, '$2')
        if (!videoId) return
        url = `https://www.instagram.com/p/${videoId}/embed/`
        break
      }
      case 'youtube': {
        const youtubeUrl = l.getAttribute('href')
        const timestamp = youtubeUrl.match(/t=([^&]+)/)?.[1]
        let videoId
        if (youtubeUrl.indexOf('youtu.be') !== -1) {
            videoId = youtubeUrl.replace(/https:\/\/youtu.be\/([^\/?&]+)(.*)?/, '$1')
        } else if (youtubeUrl.indexOf('youtube.com/watch') !== -1) {
            videoId = youtubeUrl.match(/v=([^&]+)/)?.[1]
        } else if (youtubeUrl.indexOf('youtube.com/shorts') !== -1) {
            console.log(youtubeUrl)
            videoId = youtubeUrl.replace(/https:\/\/(www\.|m\.)?youtube.com\/shorts\/([^\/?&]+)(.*)?/, '$2')
        }
        if (!videoId) return
        url = `https://www.youtube.com/embed/${videoId}?start=${timestamp?.replace('s', '') ?? '0'}`
        break
      }
      default: {
        url = l.getAttribute('href')
          .replace(/https:\/\/streamable.com\/([^\/?&]+)(.*)?/, 'https://streamable.com/e/$1')
          .replace(/https:\/\/voca(.ro|roo.com)\/([^\/?&]+)(.*)?/, 'https://vocaroo.com/embed/$2')
          .replace(/https:\/\/webmshare.com\/([^\/?&]+)(.*)?/, 'https://webmshare.com/play/$1')
        break
      }
    }
    l.insertAdjacentHTML('afterend', `
      <iframe
        class="iframe-jvhelp"
        width="100%"
        height="${url.includes('vocaroo') ? 70 : 400}px"
        allowfullscreen="true"
        allowtransparency="true"
        scrolling="yes"
        src="${url}"
      ></iframe>
    `)
  })
}
function onLinkOpener() {
  if (!document.getElementById(tagLinkOpener)) {
    document.head.insertAdjacentHTML('afterbegin', `<style id="${tagLinkOpener}">.iframe-jvhelp {border: none; max-width: 550px; margin: 0 auto .9375rem; }</style>`)
  }
  const messages = document.getElementsByClassName(messageClass)
  for (let i = 0; i < messages.length; i += 1) {
    Object.entries(selectors).map(([k, v]) => processIframe(messages[i].querySelectorAll(v), k))
  }
}


// NoReload
const observer = new IntersectionObserver(onNextPage)
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
const tagImageOpener = 'jvhelp-image-opener'
const tagImageOpenerDialog = 'jvhelp-image-opener-dialog'
const classImageOpenerProcessed = 'jvhelp-image-opener-processed'
async function onImgClick(event) {
  event.stopPropagation()
  event.preventDefault()
  let dialog = document.getElementById(tagImageOpenerDialog)
  if (!dialog) {
    const element = document.createElement('dialog')
    element.setAttribute('id', tagImageOpenerDialog)
    element.addEventListener('click', () => element.close(), true)
    document.body.insertAdjacentElement('afterbegin', element)
    dialog = element
  }
  const element = document.createElement('img')
  element.setAttribute('id', classImageOpenerProcessed)
  element.setAttribute('src', event.target.alt.replace(/www.noelshack.com\/([0-9]{4})-([0-9]{2})-([0-9]{1,2})-/, 'image.noelshack.com/fichiers/$1/$2/$3/'))
  console.log(dialog)
  dialog.replaceChildren(element)
  dialog.showModal()
}

function onImageOpener() {
  if (!document.getElementById(tagImageOpener)) {
    document.head.insertAdjacentHTML('afterbegin', `<style id="${tagImageOpener}">
      #${tagImageOpenerDialog} { pointer-events: none; opacity: 0; overflow: hidden; cursor: pointer; padding: 0; border: none !important; display: flex; justify-content: center; align-items: center; }
      #${tagImageOpenerDialog}[open] { pointer-events: auto; opacity: 1; visibility: visible; }
      #${classImageOpenerProcessed} { max-height: 80vh; max-width: 80vw; object-fit: contain; }
    </style>`)
  }
  const images = document.getElementsByTagName('img')
  for (let i = 0; i < images.length; i += 1) {
    if (images[i].id === classImageOpenerProcessed) continue
    if (images[i].classList.contains(classImageOpenerProcessed)) continue
    if (!images[i].src.includes('noelshack.com')) continue
    images[i].classList.add(classImageOpenerProcessed)
    images[i].addEventListener('click', onImgClick, true)
    images[i].style.cursor = 'pointer'
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
  onLinkOpener()
}

document.body.addEventListener('DOMNodeInserted', onChange, false)
document.body.addEventListener('DOMNodeRemoved', onChange, false)
document.addEventListener('load', onChange, false)
