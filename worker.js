function makeIcons8URL(id, size, format) {
  // FIXED: return `https://img.icons8.com/?size=${size}&id=${id}&format=${format}`
  return `https://api-icons.icons8.com/siteApi/icons/icon?id=${id}&language=en-US&svg=true`
}

async function getSVGEncoded(url) {
  const response = await fetch(url)
  const { success, icon } = await response.json()
  if (!success) return 'error'
  return icon.svg
}

async function getSVG(url) {
  return atob(await getSVGEncoded(url))
}

async function getSVGBase64(url) {
  return 'data:image/svg+xml;base64,' + await getSVGEncoded(url)
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    title: 'Copy SVG Base64',
    contexts: ['image'],
    id: 'copy_icons8_base64'
  })

  chrome.contextMenus.create({
    title: 'Copy SVG',
    contexts: ['image'],
    id: 'copy_icons8_svg'
  })

  chrome.contextMenus.create({
    title: 'Download SVG',
    contexts: ['image'],
    id: 'download_icons8_svg'
  })

})

chrome.contextMenus.onClicked.addListener(genericOnClick)

async function genericOnClick(info) {
  const id = (new URL(info.srcUrl)).searchParams.get('id')
  const icon = makeIcons8URL(id, 512, 'svg')

  switch (info.menuItemId) {
  case 'copy_icons8_svg':
    sendToClipboardController(await getSVG(icon))
    break

  case 'copy_icons8_base64':
    sendToClipboardController(await getSVGBase64(icon))
    break

  case 'download_icons8_svg': {
    sendToSVGDownloader(await getSVG(icon), id)
    break
  }

  default:
    console.log('not implemented')
  }
}

async function sendToClipboardController(text) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  await chrome.tabs.sendMessage(tabs[0].id, { message: 'copyText', textToCopy: text })
}

async function sendToSVGDownloader(svg, filename) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  await chrome.tabs.sendMessage(tabs[0].id, { message: 'download-svg', svg, filename: `${filename}.svg` })
}
