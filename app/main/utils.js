const { compose, multiply, toNumber, groupBy, map, orderBy } = require('lodash/fp')
const SHA = require('jssha')
const iconv = require('iconv-lite')

const getRating = compose(
  x => x.toFixed(3),
  multiply(0.001),
  toNumber
)

const convertBufferEncoding = (buffer, from, to) => {
  return iconv.encode(iconv.decode(buffer, from), to)
}

const getId = (...props) => {
  const sha = new SHA('SHA-1', 'TEXT')
  const text = props.reduce((res, prop) => `${res}:${prop}`, '')
  sha.update(text)
  return sha.getHash('HEX')
}

const groupDataBy = (data, field) => {
  return compose(
    orderBy('count', 'desc'),
    map.convert({ cap: false })((value, key) => ({
      id: key,
      [field]: key,
      count: value.length,
      movies: orderBy('year', 'desc', value)
    })),
    groupBy(field)
  )(data)
}

module.exports = {
  getRating,
  convertBufferEncoding,
  getId,
  groupDataBy
}
