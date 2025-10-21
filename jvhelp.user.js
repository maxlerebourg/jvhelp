// ==UserScript==
// @name         JvHelp
// @version      2024-01-08
// @match        https://jeuxvideo.com/*
// @match        https://*.jeuxvideo.com/*
// @match        https://jvarchive.com/*
// @match        https://*.jvarchive.com/*
// @match        https://jvarchive.st/*
// @match        https://*.jvarchive.st/*
// @match        https://jeuxvideo.to/*
// @match        https://*.jeuxvideo.to/*
// @match        https://boucling.com/*
// @match        https://*.boucling.com/*
// ==/UserScript==

const messageSelectors = 'div.card-message, div.bloc-message-forum, div[id^="post_"], div.mantine-Paper-root'
const cssGhost = `
.jvhelp-message-deleted {
  background: #442727 !important;
}
.theme-light .jvhelp-message-deleted {
  background: #ffd6e0 !important;
}
.jvhelp-message-deleted .signature-msg {
  display: none;
}

.bloc-pre-right {
  flex-wrap: wrap;
  row-gap: 0.625rem;
  column-gap: 0.3125rem;
  display: flex;
}

spoiler .contenu-spoil {
  text-align: left;
  background: #ffecec;
  border: 0.0625rem solid #fdd;
  padding: 0.625rem;
  display: none;
}
spoiler button {
  border: none;
  line-height: 1.5rem;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  margin-bottom: 0.3125rem;
}
spoiler .txt-spoil {
  width: 4.6875rem;
  font-size: 0.9285em;
  text-align: center;
  color: #fff;
  text-transform: uppercase;
  background: #d90000;
  font-weight: 700;
  display: block;
  font-family: Tahoma,"Trebuchet MS",sans-serif;
}
spoiler .aff-spoil,
spoiler .masq-spoil {
  color: #c40;
  font-size: 0.9285em;
  font-weight: 700;
  display: block;
  margin-left: 1rem;
}
spoiler .masq-spoil {
  display: none;
}
spoiler[data-visible] > .contenu-spoil {
  display: block;
  overflow: hidden;
}
spoiler[data-visible] > button .aff-spoil {
  display: none;
}
spoiler[data-visible] .masq-spoil {
  display: block;
}
spoiler[inline][data-visible] > .contenu-spoil {
  display: inline;
}
spoiler[inline] > .contenu-spoil {
  padding: 0.1875rem;
  border: 0;
  background: #ffecec;
}
spoiler[inline] .aff-spoil,
spoiler[inline] .masq-spoil {
  display: none !important;
}
`

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
        const videoId = link.replace(/https:\/\/www.instagram.com\/(reel|.+\/p|p)\/([^\/?&]+)(.*)?/, '$2')
        if (!videoId) return
        console.log(videoId)
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
          .replace(/https:\/\/webmshare.com\/([^\/?&]+)(.*)?/, 'https://webmshare.com/play/$2')
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
  const messages = document.querySelectorAll(messageSelectors)
  for (let i = 0; i < messages.length; i += 1) {
    Object.entries(selectors).map(([k, v]) => processIframe(messages[i].querySelectorAll(v), k))
  }
}


// NoReload
const tagNewPage = 'jvhelp-new-page'
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
  const newMessages = html.querySelectorAll(messageSelectors)
  if (newMessages.length === 0) return
  if (newMessages.length !== 20) isLastPage = true
  const messages = document.querySelectorAll(messageSelectors)
  const lastIndex = messages.length - 1
  for (let i = newMessages.length - 1; i >= 0; i -= 1) {
    messages[lastIndex].insertAdjacentElement('afterend', newMessages[i])
  }
  messages[lastIndex].insertAdjacentHTML('afterend', `<p class="${tagNewPage}" style="padding: 1rem; font-size: 1.3rem; font-weight: bold">Page ${page}</p>`)
  isLoading = false
}

function onNoReload() {
  const messages = document.querySelectorAll(messageSelectors)
  console.log(messages[0]?.id)
  if (!messages.length || isLastPage) return
  if (currentUrl !== document.location.href) init()
  observer.disconnect()
  observer.observe(messages[messages.length - 1])
}


// JVGhost
const tagLinkGhost = 'jvhelp-ghost'
let loadedPage = 0
let currentPage
let topicId
let startMessageId
let lastMessageId
function onJvGhost() {
  if (!document.location.href.includes('jeuxvideo.com/forums/42-51-')) return
  if (!document.getElementById(tagLinkGhost)) {
    document.head.insertAdjacentHTML('afterbegin', `<style id="${tagLinkGhost}">${cssGhost}</style>`)
  }
  if (!topicId) {
    const regexPageUrlResult = window.location.href.match(/forums\/42-51-([0-9]+)-([0-9]+)/)
    topicId = Number(regexPageUrlResult[1])
    currentPage = Number(regexPageUrlResult[2]) + 1
    onGhost()
  }
  const pageLength = document.getElementsByClassName(tagNewPage).length
  if (loadedPage !== pageLength) {
    loadedPage = pageLength
    currentPage += 1
    onGhost()
  }
}
async function onGhost() {
  const conteneurMessages = document.querySelector('#forum-main-col')
  if (!conteneurMessages) return

  const messagesNodes = document.querySelectorAll('div.bloc-message-forum')
  const messagesMapById = new Map()
  for (let i = 0; i < messagesNodes.length; i += 1) {
    messagesMapById.set(Number(messagesNodes[i].dataset.id), messagesNodes[i])
  }

  const pageSuivanteRequestResult = await (await fetch(document.location.href.replace(/\/forums\/42-51-([0-9]+)-([0-9]+)/, `/forums/42-51-$1-${currentPage}`))).text()
  const regexFirstPostResult = pageSuivanteRequestResult.match(/<span id="post_(\d*)" class="bloc-message-forum-anchor">/)
  if (regexFirstPostResult) messagesMapById.set(Number(regexFirstPostResult[1]), null)

  const messagesIds = Array.from(messagesMapById.keys())

  const queryUrl = new URL(`https://jvarchive.com/api/topics/${topicId}/messages`)
  let append = startMessageId ? false : true
  startMessageId = lastMessageId ?? messagesIds[0]
  lastMessageId = messagesIds[messagesIds.length - 1]
  queryUrl.searchParams.set('fromMessageId', startMessageId)
  queryUrl.searchParams.set('toMessageId', lastMessageId)
  messagesIds.map((id) => {
    if (id === startMessageId) append = true
    if (append) queryUrl.searchParams.append('excludeIds', id)
  })

  const { messages: deletedMessages } = await (await fetch(queryUrl.href)).json()
  if (!deletedMessages || !deletedMessages.length) return

  // Insertion des messages supprimés dans la page
  let i = 0
  let deletedMessagesIndex = 0
  while (i < messagesIds.length - 1) {
    if (deletedMessages.length === deletedMessagesIndex) break
    const deletedMessage = deletedMessages[deletedMessagesIndex]
    if (
      deletedMessage.id > messagesIds[i] &&
      deletedMessage.id < messagesIds[i + 1]
    ) {
      const deletedMessageNode = messagesNodes[0].cloneNode([true])
      deletedMessageNode.classList.add('jvhelp-message-deleted')
      deletedMessageNode.getElementsByClassName('user-avatar-msg')[0].src = deletedMessage.auteur.avatar
      deletedMessageNode.getElementsByClassName('bloc-date-msg')[0].innerHTML = new Date(deletedMessage.date_post).toLocaleString('fr-FR')
      deletedMessageNode.getElementsByClassName('bloc-pseudo-msg')[0].innerHTML = deletedMessage.auteur.pseudo
      deletedMessageNode.getElementsByClassName('txt-msg')[0].innerHTML = deletedMessage.texte
      messagesMapById.get(messagesIds[i])?.after(deletedMessageNode)
      messagesMapById.set(deletedMessage.id, deletedMessageNode)
      messagesIds.splice(i + 1, 0, deletedMessage.id)
      deletedMessagesIndex += 1
    }
    i += 1
  }
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

// MRedirect
async function onMRedirect() {
  if (document.location.href.includes('m.jeuxvideo.com')) {
    window.location.href = window.location.href.replace('m.jeuxvideo.com', 'www.jeuxvideo.com')
  }
}


//SetUp
function onChange() {
  onImageOpener()
  onNoReload()
  onMRedirect()
  on410Redirect()
  onLinkOpener()
  onJvGhost()
}

new MutationObserver(onChange).observe(
  document.body,
  { subtree: true, characterData: true, childList: true }
)
