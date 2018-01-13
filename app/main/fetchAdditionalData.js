const got = require('got')
const pMap = require('p-map-series')
const delay = require('delay')
const jwt = require('jsonwebtoken')
// const { compose, groupBy, map, orderBy } = require('lodash/fp')
const { getMovies, updateMovie } = require('./store')
// const { getId } = require('./utils')

// const mapValuesWithKey = map.convert({ cap: false })

const search = async ({ query, year }) => {
  const token = jwt.sign({ foo: 'bar' }, process.env.SECRET)

  try {
    const resp = await got(process.env.API_URL, {
      json: true,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      query: {
        language: 'ru',
        query: query
      }
    })

    const result = resp.body.results[0]
    const limit = resp.headers['x-ratelimit-limit']
    const remaining = resp.headers['x-ratelimit-remaining']
    const reset = resp.headers['x-ratelimit-reset']

    return { result, limit, remaining, reset }
  } catch (err) {
    console.log('ERR', err)
  }
}

const fetchAdditionalData = async event => {
  const movies = getMovies().filter(x => !x.themoviedbId)

  pMap(movies, async movie => {
    const { result, remaining, reset } = await search({
      query: movie.titleEN
    })

    if (result) {
      updateMovie(movie.id, {
        poster: result.poster_path,
        themoviedbId: result.id
      })

      event.send('updateMovie', movie.id, {
        poster: result.poster_path
      })
    }

    if (Number(remaining) === 0) {
      let now = new Date()
      let resetDate = new Date(Number(reset) * 1000)
      console.log('date', resetDate - now)
      await delay(resetDate - now)
    }
  })
}

module.exports = {
  fetchAdditionalData,
  search
}
