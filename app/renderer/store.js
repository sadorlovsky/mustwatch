import { createStore, applyMiddleware } from 'redux'
import { createActions, handleActions } from 'redux-actions'
import promiseMiddleware from 'redux-promise'
import { createSelector } from 'reselect'
import { ipcRenderer, clipboard } from 'electron'
import pEvent from 'p-event'
import {
  compose, orderBy, map, groupBy, filter, size, identity, shuffle
} from 'lodash/fp'

const defaultState = {
  loading: true,
  movies: [],
  group: false,
  groupBy: 'director',
  filter: '',
  selected: null,
  footer: false,
  footerText: '',
  sortBy: 'queue',
  order: -1,
  random: false
}

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

export const filteredSelector = createSelector(
  state => state.filter,
  sortedSelector,
  (query, movies) => filter(x => {
    return (x.titleRU && x.titleRU.toLowerCase().includes(query.toLowerCase())) ||
      (x.titleEN && x.titleEN.toLowerCase().includes(query.toLowerCase())) ||
      (x.director && x.director.toLowerCase().includes(query.toLowerCase()))
  }, movies)
)

export const countSelector = createSelector(
  filteredSelector,
  movies => size(movies)
)

export const grouppedSelector = createSelector(
  state => state.group,
  state => state.groupBy,
  filteredSelector,
  (shouldGroup, field, movies) => {
    if (!shouldGroup) return movies
    return compose(
      orderBy('count', 'desc'),
      map.convert({ cap: false })((value, key) => ({
        [field]: key,
        count: value.length,
        movies: orderBy('year', 'desc', value)
      })),
      groupBy(field)
    )(movies)
  }
)

export const randomSelector = createSelector(
  state => state.movies,
  movies => shuffle(movies).slice(0, 1)
)

export const {
  fetch, toggleGroup, setGroupBy, setFilter, selectMovie, copyToClipboard,
  clearFooter, updateMovie, setFooterText, setOrder, setSortBy, toggleRandom
} = createActions({
  FETCH: async () => {
    ipcRenderer.send('fetch')
    const [, data] = await pEvent(ipcRenderer, 'response', { multiArgs: true })
    return data
  },
  TOGGLE_GROUP: identity,
  SET_GROUP_BY: e => e.target.value,
  SET_FILTER: e => e.target.value,
  SELECT_MOVIE: identity,
  COPY_TO_CLIPBOARD: text => {
    clipboard.writeText(text)
    return 'Название скопировано в буфер обмена'
  },
  CLEAR_FOOTER: identity,
  UPDATE_MOVIE: (id, data) => ({ id, data }),
  SET_FOOTER_TEXT: identity,
  SET_ORDER: identity,
  SET_SORT_BY: e => e.target.value,
  TOGGLE_RANDOM: identity
})

const reducer = handleActions({
  [fetch]: (state, action) => ({
    ...state,
    movies: [...state.movies, ...action.payload],
    loading: false
  }),
  [toggleGroup]: (state, action) => ({
    ...state,
    group: !state.group
  }),
  [setGroupBy]: (state, action) => ({
    ...state,
    groupBy: action.payload
  }),
  [setFilter]: (state, action) => ({
    ...state,
    filter: action.payload
  }),
  [selectMovie]: (state, action) => ({
    ...state,
    selected: state.selected === action.payload ? null : action.payload
  }),
  [copyToClipboard]: (state, action) => ({
    ...state,
    footer: true,
    footerText: action.payload
  }),
  [clearFooter]: state => ({
    ...state,
    footer: false,
    footerText: ''
  }),
  [updateMovie]: (state, action) => ({
    ...state,
    movies: state.movies.map(m => {
      if (m.id === action.payload.id) {
        return { ...m, ...action.payload.data }
      }
      return m
    })
  }),
  [setFooterText]: (state, action) => ({
    ...state,
    footer: true,
    footerText: action.payload
  }),
  [setOrder]: (state, action) => ({
    ...state,
    order: action.payload
  }),
  [setSortBy]: (state, action) => ({
    ...state,
    sortBy: action.payload
  }),
  [toggleRandom]: state => ({
    ...state,
    random: !state.random
  })
}, defaultState)

export const store = createStore(reducer, applyMiddleware(promiseMiddleware))
