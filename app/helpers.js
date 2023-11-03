const { ipcRenderer, clipboard } = require('electron')
const config = require('../config')

module.exports = {
  getRefreshTime: (date) => {
    const d = new Date(date)
    let hours = d.getHours()
    let minutes = d.getMinutes()
    if (hours < 10) hours = '0' + hours
    if (minutes < 10) minutes = '0' + minutes

    return hours + ':' + minutes
  },
  copyToClipboard: (text) => {
    clipboard.writeText(text)
    return text
  },
  toMB: (val) => {
    return (val / 1000000).toFixed(3)
  },
  toProgress: (val) => {
    return (val * 100).toFixed(2)
  },
  toFileProgress: (filesize, downloaded) => {
    return (100 / filesize * downloaded).toFixed(2)
  },
  cutName: (name) => {
    if (name.length > 30) {
      return name.substring(0, 30) + '...'
    } else {
      return name
    }
  },
  spawnNotification: (message) => {
    new Notification('Global Conflicts', { // eslint-disable-line
      body: message
    })
  },
  appLoaded: () => {
    ipcRenderer.send('app-loaded')
  },
  getStatisticsData: () => {
    ipcRenderer.send('to-web', {
      type: 'get-url',
      callback: 'statistics-callback',
      url: config.APIBaseURL + config.APIServerLogURL,
      callBackTarget: 'to-app'
    })
  },
  getServerData: () => {
    ipcRenderer.send('to-web', {
      type: 'get-url',
      callback: 'server-callback',
      url: config.APIBaseURL + config.APIServerURL,
      callBackTarget: 'to-app'
    })
  }
}
