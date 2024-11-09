console.log('background is running')

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('request', request)

  if (request.action === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }

  if (request.action === 'GETACCOUNT') {
    fetch('http://47.96.231.20/bool-admin/weixin/publicaccount/list_account')
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data)
      })
      .catch((error) => console.error('Error:', error))

    return true
  }

  if (request.action === 'GETAICOMMAND') {
    fetch('http://47.96.231.20/bool-admin/weixin/wxtemplate/list_template?type=1')
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data)
      })
      .catch((error) => console.error('Error:', error))
    return true
  }

  if (request.action === 'GENARTICLE') {
    fetch('http://47.96.231.20/bool-admin/weixin/publicarticles/gen_article', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
})
