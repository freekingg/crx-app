function setItem(key, value) {
  return new Promise((resolve, reject) => {
    const data = {}
    data[key] = value
    chrome.storage.local.set(data, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve()
      }
    })
  })
}

function getItem(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(result[key] || null)
      }
    })
  })
}

export { setItem, getItem };
