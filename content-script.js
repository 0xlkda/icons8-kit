chrome.runtime.onMessage.addListener(function(request) {
  if (request.message === 'copyText') {
    copyToTheClipboard(request.textToCopy).then(() => {
      showBadge('Copied!')
    })
  }
  else if (request.message === 'download-svg') {
    download(request.svg, request.filename).then(() => {
      showBadge('Download started!')
    })
  }
})

async function download(svg, filename) {
  const blob = new Blob([svg], { type: 'image/svg' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'download'
  a.click()
}

async function copyToTheClipboard(textToCopy) {
  const el = document.createElement('textarea')
  el.value = textToCopy
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.top = '-9999px'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

function showBadge(message) {
  const badge = document.createElement('span')
  badge.id = 'alex-notification'
  badge.textContent = message

  document.body.appendChild(badge)

  setTimeout(() => {
    badge.classList.add('hiding')
    setTimeout(() => document.body.removeChild(badge), 1500)
  }, 2000)
}
