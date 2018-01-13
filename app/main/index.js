require('dotenv').config()
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const got = require('got')
const cookie = require('cookie')
const { differenceBy } = require('lodash')
const LRU = require('lru-cache')
const { addMovie, getMovies, deleteMovie } = require('./store')
const transform = require('./transform')
const fetchPosters = require('./fetchPosters')

let win
const cache = LRU({
  max: 100,
  maxAge: 1000 * 60
})

function createWindow () {
  win = new BrowserWindow({
    width: 600,
    height: 600,
    title: 'Буду смотреть',
    backgroundColor: '#282629',
    scrollBounce: true,
    webPreferences: {
      partition: 'persist:main'
    }
  })

  win.loadURL(process.env.KINOPOISK_URL)

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', () => {
  createWindow()

  win.webContents.session.cookies.get({
    url: process.env.KINOPOISK_URL,
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
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('fetch', async event => {
  if (cache.has('response')) {
    event.sender.send('response', cache.get('response'))
    return
  }

  win.webContents.session.cookies.get({}, async (err, cookies) => {
    if (err) throw new Error(err)
    const cookieData = cookies.reduce((res, x) => {
      return `${cookie.serialize(x.name, x.value)};${res}`
    }, '')

    const { body } = await got(`${process.env.KINOPOISK_URL}/mykp/movies/xls/type/3575/`, {
      encoding: null,
      headers: { cookie: cookieData }
    })

    const dataFromKinopoisk = transform(body).slice().reverse()
    const dataFromStore = getMovies()

    const needToDelete = differenceBy(dataFromStore, dataFromKinopoisk, x => x.id)
    const needToAdd = differenceBy(dataFromKinopoisk, dataFromStore, x => x.id)

    needToDelete.map(movie => deleteMovie(movie.id))
    needToAdd.map(addMovie)

    const data = dataFromStore
    cache.set('response', data)
    event.sender.send('response', data)

    win.webContents.send('startFetchingPosters')
    fetchPosters(win.webContents, () => {
      win.webContents.send('finishFetchingPosters')
    })
  })
})

ipcMain.on('logout', async () => {
  win.webContents.session.clearStorageData({}, () => {
    win.loadURL(process.env.KINOPOISK_URL)
  })
})

const loadApp = () => {
  win.loadURL(url.format({
    pathname: path.join(__dirname, '../renderer', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
}
