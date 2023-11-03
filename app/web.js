const jsonist = require('jsonist')
const { ipcRenderer } = require('electron')
const fs = require('fs')
const request = require('request')
const progress = require('request-progress')
const { app } = require('electron').remote
const ps = require('ps-node')
const exec = require('child_process').exec
const config = require('../config')
const pathf = require('path')

let agent = `Global Conflicts Launcher/${app.getVersion()} (${os.type()} ${os.release()}; ${os.platform()}; ${os.arch()}) - `

if (typeof process.env.PORTABLE_EXECUTABLE_DIR !== 'undefined') {
  agent = agent.concat('Portable')
} else if (typeof process.windowsStore !== 'undefined') {
  agent = agent.concat('Windows UWP')
} else {
  agent = agent.concat('Desktop')
}

ipcRenderer.on('to-web', (event, args) => {
  switch (args.type) {
    case 'get-url' :
      getUrl(args)
      break
    case 'start-file-download' :
      downloadFILE(args.file)
      break
    case 'ping-server-via-rdp' :
      pingServer(args.server)
      break
  }
})

const getBot = (args) => {
  jsonist.get(args.url, {
    headers: {
      'user-agent': agent,
      port: parseInt(config.BotPort)
    }
  }, (err, data, resp) => {
    getUrlCallback(args, err, data, resp)
  })
}

const getUrl = (args) => {
  jsonist.get(args.url, {
    headers: {
      'user-agent': agent
    }
  }, (err, data, resp) => {
    getUrlCallback(args, err, data, resp)
  })
}

const getUrlCallback = (args, err, data, resp) => {
  ipcRenderer.send(args.callBackTarget, {
    type: args.callback,
    args,
    err,
    data,
    resp
  })
}

const downloadFILE = (file) => {
  const options = {
    url: config.STATICFILESERVE + file,
    headers: {
      'user-agent': agent
    }
  }
  progress(request(options), {}).on('progress', (state) => {
    ipcRenderer.send('to-app', {
      type: 'update-dl-progress-file',
      state
    })
  }).on('error', (err) => {
    console.log(err)
  }).on('end', () => {
    ipcRenderer.send('to-app', {
      type: 'update-dl-progress-file-done',
      filePath: app.getPath('downloads') + '\\' + file
    })
  }).pipe(fs.createWriteStream(app.getPath('downloads') + '\\' + file))
}

const pingServer = (server) => {
  exec('mstsc /v ' + server.IpAddress, () => {})

  ps.lookup({
    command: 'mstsc'
  }, (err, resultList) => {
    if (err) throw err
    resultList.forEach((process) => {
      if (process) {
        ps.kill(process.pid, (err) => {
          if (err) {
            throw err
          } else {
            console.log('Process %s has been killed!', process.pid)
          }
        })
      }
    })
  })
}

const getArmaAppData = () => {
  return pathf.join(app.getPath('appData'), '..', 'Local', 'Arma 3', '\\')
}
