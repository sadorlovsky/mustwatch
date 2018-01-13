'use strict'
const xlsx = require('node-xlsx')
const { compose, map, zipObj, pick, curryRight, trim } = require('lodash/fp')
const { renameProps } = require('@sadorlovsky/rename-props')
const { convertBufferEncoding, getId } = require('./utils')

module.exports = buffer => {
  const [{ data }] = xlsx.parse(convertBufferEncoding(buffer, 'win1251', 'utf8'))

  const [keys, ...movies] = data

  const transform = compose(
    map(x => Object.assign({}, x, {
      id: getId(x.titleEN || x.titleRU, x.year, x.director),
      actors: x.actors.split(',').map(trim),
      genres: x.genres.split(',').map(trim),
      countries: x.countries.split(',').map(trim)
    })),
    map(pick([
      'titleRU', 'titleEN', 'year', 'countries', 'director',
      'actors', 'time', 'genres', 'rating'
    ])),
    map(curryRight(renameProps)({
      'русскоязычное название': 'titleRU',
      'оригинальное название': 'titleEN',
      'год': 'year',
      'страны': 'countries',
      'режисcёр': 'director',
      'актёры': 'actors',
      'время': 'time',
      'жанры': 'genres',
      'рейтинг КиноПоиска': 'rating'
    })),
    map(zipObj(keys))
  )

  return transform(movies)
}
