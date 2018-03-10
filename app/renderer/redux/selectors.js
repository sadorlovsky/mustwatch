import { createSelector } from 'reselect'
import {
  compose, orderBy, map, groupBy, filter, size, shuffle, reduce
} from 'lodash/fp'

export const sortedSelector = createSelector(
  state => state.sortBy,
  state => state.order,
  state => state.movies,
  (by, order, movies) => {
    if (by === 'queue') {
      return order === 1 ? movies : movies.slice().reverse()
    }

    if (by === 'title') {
      return orderBy('titleRU', order === 1 ? 'asc' : 'desc', movies)
    }

    return orderBy(by, order === 1 ? 'asc' : 'desc', movies)
  }
)

export const sortedSelector2 = createSelector(
  state => state.sortBy,
  state => state.order,
  state => state.movieIds,
  state => state.movieById,
  (by, order, ids, movieById) => {
    if (by === 'queue') {
      return order === 1 ? ids : ids.slice().reverse()
    }

    if (by === 'title') {
      return compose(
        map(({ id }) => id),
        orderBy('title', order === 1 ? 'asc' : 'desc'),
        map(id => ({ id, title: movieById[id].titleRU }))
      )(ids)
    }

    return compose(
      map(({ id }) => id),
      orderBy(by, order === 1 ? 'asc' : 'desc'),
      map(id => ({ id, [by]: movieById[id][by] }))
    )(ids)
  }
)

export const filteredSelector = createSelector(
  state => state.filter,
  sortedSelector,
  (query, movies) => filter(x => {
    return (x.titleRU && x.titleRU.toLowerCase().includes(query.toLowerCase())) ||
      (x.titleEN && x.titleEN.toLowerCase().includes(query.toLowerCase())) ||
      (x.director && x.director.toLowerCase().includes(query.toLowerCase()))
  }, movies)
)

export const filteredSelector2 = createSelector(
  state => state.filter,
  sortedSelector2,
  state => state.movieById,
  (query, ids, movieById) => {
    return compose(
      map(({ id }) => id),
      filter(movie => movie.titleRU.includes(query.toLowerCase()) ||
        movie.titleEN.includes(query.toLowerCase()) ||
        movie.director.includes(query.toLowerCase())
      ),
      map(id => ({
        id,
        titleRU: movieById[id].titleRU ? movieById[id].titleRU.toLowerCase() : '',
        titleEN: movieById[id].titleEN ? movieById[id].titleEN.toLowerCase() : '',
        director: movieById[id].director ? movieById[id].director.toLowerCase() : ''
      }))
    )(ids)
  }
)

export const countSelector = createSelector(
  filteredSelector,
  movies => size(movies)
)

export const countSelector2 = createSelector(
  filteredSelector2,
  movies => size(movies)
)

export const grouppedSelector = createSelector(
  state => state.group,
  state => state.groupBy,
  filteredSelector,
  (shouldGroup, field, movies) => {
    if (!shouldGroup) return movies
    if (field === 'director') {
      return compose(
        orderBy('count', 'desc'),
        map.convert({ cap: false })((value, key) => ({
          keyField: key,
          count: value.length,
          movies: orderBy('year', 'desc', value)
        })),
        groupBy('director')
      )(movies)
    }
    if (field === 'actor') {
      return compose(
        orderBy('count', 'desc'),
        map.convert({ cap: false })((value, key) => ({
          keyField: key,
          count: value.length,
          movies: orderBy('year', 'desc', value)
        })),
        groupBy('actor'),
        reduce((res, movie) => {
          const movies = movie.actors.map(actor => {
            return Object.assign({}, movie, { actor })
          })

          return res.concat(movies)
        }, [])
      )(movies)
    }
    if (field === 'genre') {
      return compose(
        orderBy('count', 'desc'),
        map.convert({ cap: false })((value, key) => ({
          keyField: key,
          count: value.length,
          movies: orderBy('year', 'desc', value)
        })),
        groupBy('genre'),
        reduce((res, movie) => {
          const movies = movie.genres.map(genre => {
            return Object.assign({}, movie, { genre })
          })

          return res.concat(movies)
        }, [])
      )(movies)
    }
    if (field === 'country') {
      return compose(
        orderBy('count', 'desc'),
        map.convert({ cap: false })((value, key) => ({
          keyField: key,
          count: value.length,
          movies: orderBy('year', 'desc', value)
        })),
        groupBy('country'),
        reduce((res, movie) => {
          const movies = movie.countries.map(country => {
            return Object.assign({}, movie, { country })
          })

          return res.concat(movies)
        }, [])
      )(movies)
    }
    return movies
  }
)

export const grouppedSelector2 = createSelector(
  state => state.group,
  state => state.groupBy,
  filteredSelector2,
  state => state.movieById,
  (shouldGroup, field, ids, movieById) => {
    if (!shouldGroup) return ids
    return ids
  }
)

export const randomSelector = createSelector(
  state => state.movies,
  movies => shuffle(movies).slice(0, 1)
)

export const randomSelector2 = createSelector(
  state => state.movieIds,
  movies => shuffle(movies).slice(0, 1)
)
