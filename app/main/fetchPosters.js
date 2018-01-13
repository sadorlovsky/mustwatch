const PQueue = require('p-queue')
const delay = require('delay')
const got = require('got')
const pMap = require('p-map-series')
const jwt = require('jsonwebtoken')
const { getMovies, updateMovie } = require('./store')

const queue = new PQueue({ concurrency: 20 })
const failed = []

const search = async (type, params) => {
  const token = jwt.sign({ foo: 'bar' }, process.env.SECRET)

  try {
    const resp = await got(`${process.env.API_URL}/${type}`, {
      json: true,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      query: Object.assign({}, { language: 'ru' }, params)
    })

    const result = resp.body.results[0]
    const limit = resp.headers['x-ratelimit-limit']
    const remaining = resp.headers['x-ratelimit-remaining']
    const reset = resp.headers['x-ratelimit-reset']

    return { ok: true, result, limit, remaining, reset }
  } catch (err) {
    const error = err.message
    const retry = err.headers['retry-after']
    return { ok: false, error, retry }
  }
}

const job = async (movie, params, event) => {
  let type = 'movie'

  if (String(movie.year).includes('&ndash;')) {
    type = 'tv'
  }

  const { ok, result, retry } = await search(type, params)

  if (ok) {
    if (result && result.poster_path) {
      updateMovie(movie.id, { poster: result.poster_path })
      event.send('updateMovie', movie.id, { poster: result.poster_path })
    } else {
      const isFailed = failed.filter(x => x.id === movie.id)[0]
      failed.push({ id: movie.id })
      if (isFailed) { return }
      queue.add(() => job(movie, {
        query: movie.titleEN || movie.titleRU
      }, event))
    }
  } else {
    queue.pause()
    await delay(Number(retry) + 1)
    queue.start()
    queue.add(() => job(movie, {
      query: movie.titleEN || movie.titleRU,
      year: movie.year
    }, event))
  }
}

module.exports = async (event, cb) => {
  const data = getMovies().filter(x => !x.poster)

  queue.onEmpty().then(cb)

  pMap(data, async movie => {
    queue.add(() => job(movie, {
      query: movie.titleEN || movie.titleRU,
      year: movie.year
    }, event))
  })
}
