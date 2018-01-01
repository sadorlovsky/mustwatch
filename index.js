'use strict'
const xlsx = require('node-xlsx')
const iconv = require('iconv-lite')
const {
  compose, map, zipObj, pick, groupBy, orderBy, filter, gt, curryRight
} = require('lodash/fp')
const renameProps = require('@sadorlovsky/rename-props').default

const convertBufferEncoding = (buffer, from, to) => iconv.encode(iconv.decode(buffer, from), to)

module.exports = (buffer, gtCount = 1) => {
  const [{ data }] = xlsx.parse(convertBufferEncoding(buffer, 'win1251', 'utf8'))

  const [keys, ...movies] = data

  const mapValuesWithKey = map.convert({ cap: false })

  const transform = compose(
    filter(x => gt(x.count, gtCount)),
    orderBy('count', 'desc'),
    mapValuesWithKey((value, key) => ({
      director: key,
      count: value.length,
      movies: orderBy('year', 'desc', value)
    })),
    groupBy('director'),
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
