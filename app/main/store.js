const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const { isEmpty } = require('lodash')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ movies: [] })
  .write()

const getMovies = (query = {}) => {
  if (isEmpty(query)) return db.get('movies').value()
  return db.get('movies').find(query).value()
}
const addMovie = movie => db.get('movies').push(movie).write()
const updateMovie = (id, data) => db.get('movies').find({ id }).assign(data).write()
const deleteMovie = id => db.get('movies').remove({ id }).write()

module.exports = {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie
}
