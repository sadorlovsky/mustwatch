const got = require('got')
const pMap = require('p-map')
const delay = require('delay')

const search = async ({ query, year }) => {
  const { body } = await got(`${process.env.THEMOVIEDB_API_URL}/search/movie`, {
    json: true,
    query: {
      api_key: process.env.THEMOVIEDB_API_KEY,
      language: 'ru',
      query: query,
      year: year
    }
  })

  return body.results[0]
}

const fetchAdditionalData = async (movies, cb) => {
  await pMap(movies, async movie => {
    let result = await search({ query: movie.titleEN || movie.titleRU, year: movie.year })
    //
    // if (!result) {
    //   result = await search({ query: movie.titleEN || movie.titleRU, year: movie.year + 1 })
    // }
    //
    // if (!result) {
    //   result = await search({ query: movie.titleEN || movie.titleRU, year: movie.year - 1 })
    // }

    if (result) {
      movie = Object.assign({}, movie, {
        poster: result.poster_path,
        themoviedbId: result.id
      })
    }

    cb(movie)

    await delay(11000)
  }, { concurrency: 40 })
}

const backgroundFetchPosters = async (movies, cb) => {
  await pMap(movies, async movie => {
    let result = await search({
      query: movie.titleEN || movie.titleRU,
      year: movie.year + 1
    })

    if (!result) {
      result = await search({
        query: movie.titleEN || movie.titleRU,
        year: movie.year - 1
      })
    }

    if (result) {
      cb(movie.id, {
        poster: result.poster_path,
        themoviedbId: result.id
      })
    }

    await delay(11000)
  }, { concurrency: 20 })
}

module.exports = {
  fetchAdditionalData,
  backgroundFetchPosters
}
