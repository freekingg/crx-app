console.log('background is running')

let baseUrl = 'https://admin.buerluoji.cn'
let token = ''

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('request', request)

  if (request.action === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }

  if (request.action === 'GETACCOUNT') {
    fetch(`${baseUrl}/bool-admin/wechat/publicaccount/list_account`, {
      method: 'GET',
      headers: {
        token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data)
      })
      .catch((error) => console.error('Error:', error))

    return true
  }

  // 获取指令模板
  if (request.action === 'GETAICOMMAND') {
    fetch(`${baseUrl}/bool-admin/wechat/wxtemplate/list_template?type=1`, {
      method: 'GET',
      headers: {
        token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data)
      })
      .catch((error) => console.error('Error:', error))
    return true
  }

  // 获取样式模板
  if (request.action === 'GETSTYLECOMMAND') {
    fetch(`${baseUrl}/bool-admin/wechat/wxtemplate/list_template?type=2`, {
      method: 'GET',
      headers: {
        token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data)
      })
      .catch((error) => console.error('Error:', error))
    return true
  }

  if (request.action === 'GENARTICLE') {
    fetch(`${baseUrl}/bool-admin/wechat/publicarticles/gen_article`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token,
      },
      body: JSON.stringify(request.data),
    })
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data)
      })
      .catch((error) => console.error('Error:', error))
    return true
  }

  if (request.action === 'SETBASEURL') {
    baseUrl = request.data
    return true
  }

  if (request.action === 'SETTOKEN') {
    token = request.data
    return true
  }
})
