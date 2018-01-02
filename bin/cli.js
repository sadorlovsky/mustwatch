#!/usr/bin/env node
'use strict'
const fs = require('fs')
const getStdin = require('get-stdin')
const chalk = require('chalk')
const { compose, map, max, repeat, join, divide } = require('lodash/fp')
const { stripIndent } = require('common-tags')
const mustwatch = require('../lib')
const { getRating } = require('../lib/utils')

const getMaxSymbols = compose(
  x => divide(x, 1.3),
  max,
  map(x => x.length),
  map(x => chalk`{bold ${x.director}} {dim (${x.count})}`)
)

const view = (strings, ...values) => stripIndent`${chalk(strings, ...values)}`

const main = async () => {
  const stdInBuffer = await getStdin.buffer()
  const fileBuffer = process.argv[2] && fs.readFileSync(process.argv[2])

  const buffer = fileBuffer || stdInBuffer

  const data = mustwatch(buffer)

  const maxLongString = getMaxSymbols(data)

  const print = ({ director, count, movies }) => {
    const title = chalk`{bold ${director}} {dim (${count})}`
    const delimeter = repeat(maxLongString, '─')
    const body = compose(
      join('\n\n'),
      map(x => view`
        ✔ ${x.titleRU} {cyan ${x.year}}
        {gray ${x.titleEN}} {italic ${x.countries}}
        ${x.actors}
        ${x.genres} {blue ${x.time} мин} {green.bold ${getRating(x.rating)}}
      `)
    )(movies)
    console.log(title)
    console.log(body)
    console.log(delimeter)
  }

  data.forEach(print)
}

main()
