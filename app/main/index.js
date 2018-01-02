const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const got = require('got')
const cookie = require('cookie')
const mustwatch = require('../../lib')

let win
let cache

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 600,
    height: 600,
    title: 'Буду смотреть',
    backgroundColor: '#000',
    scrollBounce: true,
    webPreferences: {
      partition: 'persist:main'
    }
  })

  win.loadURL('https://www.kinopoisk.ru')
  win.webContents.enableDeviceEmulation({
    screenPosition: 'mobile'
  })

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

app.on('ready', () => {
  createWindow()

  win.webContents.session.cookies.get({
    url: 'https://www.kinopoisk.ru',
    session: true
  }, (err, cookies) => {
    if (err) throw new Error(err)
    cookies.forEach(c => {
      if (c.name === 'uid' && c.session) {
        loadApp()
      }
    })
  })

  win.webContents.session.cookies.on('changed', (e, c) => {
    if (c.name === 'uid' && c.session) {
      loadApp()
    }
  })
})

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('fetch', async event => {
  if (cache) {
    event.sender.send('response', cache)
  }

  win.webContents.session.cookies.get({}, async (err, cookies) => {
    if (err) throw new Error(err)
    const lel = cookies.reduce((res, x) => {
      return `${cookie.serialize(x.name, x.value)};${res}`
    }, '')

    const { body } = await got('https://www.kinopoisk.ru/mykp/movies/xls/type/3575/', {
      encoding: null,
      headers: {
        cookie: lel
      }
    })

    const data = mustwatch(body, 0)

    cache = data
    event.sender.send('response', data)
  })
})

const loadApp = () => {
  win.loadURL(url.format({
    pathname: path.join(__dirname, '../renderer', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
}
