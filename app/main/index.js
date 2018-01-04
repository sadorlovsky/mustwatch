require('dotenv').config()
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const got = require('got')
const cookie = require('cookie')
const { compose, groupBy, map, orderBy } = require('lodash/fp')
const { differenceBy } = require('lodash')
const { addMovie, getMovies, deleteMovie } = require('./store')
const { getId } = require('./utils')
const transform = require('./transform')
const { fetchAdditionalData } = require('./fetchAdditionalData')

let win
let cache
const mapValuesWithKey = map.convert({ cap: false })

try {
  require('electron-reloader')(module)
} catch (err) {}

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
  win.webContents.enableDeviceEmulation({
    screenPosition: 'mobile'
  })

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
  if (cache) {
    event.sender.send('response', cache)
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

    const dataFromKinopoisk = transform(body)
    const dataFromStore = getMovies()

    const needToDelete = differenceBy(dataFromStore, dataFromKinopoisk, x => x.id)
    const needToAdd = differenceBy(dataFromKinopoisk, dataFromStore, x => x.id)

    needToDelete.map(movie => deleteMovie(movie.id))

    await fetchAdditionalData(needToAdd, addMovie)

    const data = compose(
      orderBy('count', 'desc'),
      mapValuesWithKey((value, key) => ({
        id: getId(key),
        director: key,
        count: value.length,
        movies: orderBy('year', 'desc', value)
      })),
      groupBy('director')
    )(getMovies())

    cache = data
    event.sender.send('response', data)
  })
})

ipcMain.on('logout', async () => {
  win.webContents.session.clearStorageData({}, () => {
    win.loadURL(process.env.KINOPOISK_URL)
    win.webContents.enableDeviceEmulation({
      screenPosition: 'mobile'
    })
  })
})

const loadApp = () => {
  win.loadURL(url.format({
    pathname: path.join(__dirname, '../renderer', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
}
