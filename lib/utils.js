const { compose, multiply, toNumber } = require('lodash/fp')
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

exports.getRating = getRating
exports.convertBufferEncoding = convertBufferEncoding
exports.getId = getId
