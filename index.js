const fs = require('fs')
const getStdin = require('get-stdin')
const chalk = require('chalk')
const iconv = require('iconv-lite')
const xlsx = require('node-xlsx')
const {
  compose, map, zipObj, pick, groupBy,
  orderBy, max, repeat, join, divide,
  multiply, toNumber, filter, gt
} = require('lodash/fp')

const main = async () => {
  const stdInBuffer = await getStdin.buffer()
  const fileBuffer = process.argv[2] && fs.readFileSync(process.argv[2])

  const buffer = fileBuffer || stdInBuffer

  const text = iconv.decode(buffer, 'win1251')
  const utf8Buffer = iconv.encode(text, 'utf8')
  const [{ data }] = xlsx.parse(utf8Buffer)

  const [keys, ...movies] = data

  const mapValuesWithKey = map.convert({ 'cap': false })

  const transform = compose(
    filter(x => gt(x.count, 1)),
    orderBy('count', 'desc'),
    mapValuesWithKey((value, key) => ({
      director: key,
      count: value.length,
      movies: orderBy('год', 'desc', value)
    })),
    groupBy('режисcёр'),
    map(pick([
      'русскоязычное название',
      'оригинальное название',
      'год',
      'страны',
      'режисcёр',
      'актёры',
      'время',
      'жанры',
      'рейтинг КиноПоиска'
    ])),
    map(zipObj(keys))
  )

  const list = transform(movies)

  const getMaxSymbols = compose(
    x => divide(x, 1.3),
    max,
    map(x => x.length),
    map(x => chalk`{bold ${x.director}} {dim (${x.count})}`)
  )

  const maxLongString = getMaxSymbols(list)

  const getRating = compose(
    x => x.toFixed(3),
    multiply(0.001),
    toNumber
  )

  const print = ({ director, count, movies }) => {
    const title = chalk`{bold ${director}} {dim (${count})}`
    const delimeter = repeat(maxLongString, '─')
    const body = compose(
      join('\n\n'),
      map(x => chalk`✔ ${x['русскоязычное название']} {cyan ${x['год']}}
  {gray ${x['оригинальное название']}} {italic ${x['страны']}}
  ${x['актёры']}
  ${x['жанры']} {blue ${x['время']} мин} {green.bold ${getRating(x['рейтинг КиноПоиска'])}}`)
    )(movies)
    console.log(title)
    console.log(body)
    console.log(delimeter)
  }

  list.forEach(print)
}

main()
