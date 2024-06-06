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


// LinkOpener
const youtubeLinksSelector = 'a[href^="https://www.youtube.com/watch"], a[href^="https://m.youtube.com/watch"], a[href^="https://youtu.be"], a[href^="https://www.youtube.com/shorts"]'
const twitterLinksSelector = 'a[href^="https://twitter.com/"], a[href^="https://x.com/"]'
const tiktokLinksSelectors = 'a[href^="https://www.tiktok.com/"]'
const defaultLinksSelector = 'a[href^="https://streamable.com/"], a[href^="https://webmshare.com/"], a[href^="https://vocaroo.com/"], a[hrefâ="https://voca.ro/"]'

function getTwitterUrl(tweetId) {
  return `https://platform.twitter.com/embed/Tweet.html?dnt=false&amp;embedId=${tweetId}&amp;features=eyJ0ZndfdGltZWxpbmVfbGlzdCI6eyJidWNrZXQiOltdLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X2ZvbGxvd2VyX2NvdW50X3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9iYWNrZW5kIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19yZWZzcmNfc2Vzc2lvbiI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfZm9zbnJfc29mdF9pbnRlcnZlbnRpb25zX2VuYWJsZWQiOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X21peGVkX21lZGlhXzE1ODk3Ijp7ImJ1Y2tldCI6InRyZWF0bWVudCIsInZlcnNpb24iOm51bGx9LCJ0ZndfZXhwZXJpbWVudHNfY29va2llX2V4cGlyYXRpb24iOnsiYnVja2V0IjoxMjA5NjAwLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3Nob3dfYmlyZHdhdGNoX3Bpdm90c19lbmFibGVkIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19kdXBsaWNhdGVfc2NyaWJlc190b19zZXR0aW5ncyI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdXNlX3Byb2ZpbGVfaW1hZ2Vfc2hhcGVfZW5hYmxlZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdmlkZW9faGxzX2R5bmFtaWNfbWFuaWZlc3RzXzE1MDgyIjp7ImJ1Y2tldCI6InRydWVfYml0cmF0ZSIsInZlcnNpb24iOm51bGx9LCJ0ZndfbGVnYWN5X3RpbWVsaW5lX3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9mcm9udGVuZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9fQ%3D%3D&amp;frame=false&amp;hideCard=false&amp;hideThread=false&amp;id=${tweetId}&amp;lang=fr&amp;origin=https%3A%2F%2Fpublish.twitter.com%2F%23&amp;theme=dark&amp;widgetsVersion=aaf4084522e3a%3A1674595607486&amp;width=550px`
}
function getTiktokUrl(tiktokId) {
  return `https://www.tiktok.com/embed/v2/${tiktokId}?lang=fr`
}
function getYoutubeUrl(videoId, timestamp) {
  return `https://www.youtube.com/embed/${videoId}?start=${timestamp?.replace('s', '') ?? '0'}`
}

function processIframe(linksElement, platform) {
  linksElement.forEach((l) => {
    if (l.classList.contains('jvhelp')) return
    l.classList.add("jvhelp")
    let url;
    switch (platform) {
      case 'twitter':
        const tweetIdArr = l.getAttribute("href").split('/')
        const tweetIdStatus = tweetIdArr.findIndex(i => i === 'status')
        if (tweetIdStatus === -1) return
        const tweetId = tweetIdArr[tweetIdStatus + 1].split('?')[0]
        url = getTwitterUrl(tweetId)
        break
      case 'tiktok':
        const tiktokUrl = l.getAttribute("href").split("/")
        const video = tiktokUrl.findIndex(i => i === "video")
        if (video === -1) return
        const id = tiktokUrl[video + 1].split('?')[0]
        url = getTiktokUrl(id)
        break
      case 'youtube':
        const youtubeUrl = l.getAttribute("href")
        const timestamp = youtubeUrl.match(/t=([^&]+)/)?.[1]
        let videoId
        timestamp
        if (youtubeUrl.indexOf('youtube.com/watch') !== -1) {
            videoId = youtubeUrl.match(/v=([^&]+)/)?.[1]
        } else if (youtubeUrl.indexOf('youtu.be/') !== -1) {
            videoId = youtubeUrl.split('youtu.be/')?.[1].split('?')[0]
        } else if (youtubeUrl.indexOf('youtube.com/shorts/') !== -1) {
            videoId = youtubeUrl.split('youtube.com/shorts/')[1]
        }
        url = getYoutubeUrl(videoId, timestamp)
        console.log(videoId, timestamp, url)
        break
      default:
        url = l.getAttribute("href")
          .replace("streamable.com/", "streamable.com/e/")
          .replace("vocaroo.com/", "vocaroo.com/embed/")
          .replace("voca.ro/", "vocaroo.com/embed/")
        break
    }
    l.insertAdjacentHTML("afterend", `
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
  if (!document.getElementById('jvhelp')) {
    document.head.innerHTML = document.head.innerHTML + `
      <style id="jvhelp">
        .iframe-jvhelp {
          border: none;
          width: 100%;
          max-width: 550px;
          margin: 0 auto .9375rem;
        }
      </style>
    `
  }
  const messages = document.getElementsByClassName(messageClass)
  for (let i = 0; i < messages.length; i += 1) {
    processIframe(messages[i].querySelectorAll(twitterLinksSelector), 'twitter')
    processIframe(messages[i].querySelectorAll(tiktokLinksSelectors), 'tiktok')
    processIframe(messages[i].querySelectorAll(youtubeLinksSelector), 'youtube')
    processIframe(messages[i].querySelectorAll(defaultLinksSelector))
  }
}


// NoReload
const isJva = document.location.href.includes('jvarchive')
const messageClass = isJva ? 'card-message' : 'bloc-message-forum'
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
function onImgClick(event) {
  event.stopPropagation()
  event.preventDefault()
  const element = document.createElement('img')
  element.setAttribute('style', 'cursor: pointer; position: fixed; z-index: 1999999988; top: 0; left: 0; object-fit: contain; padding: 3rem; width: 100%; height: 100%; background-color: rgba(0,0,0,.7);')
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
  onLinkOpener()
}

document.body.addEventListener('DOMNodeInserted', onChange, false)
document.body.addEventListener('DOMNodeRemoved', onChange, false)
document.addEventListener('load', onChange, false)
