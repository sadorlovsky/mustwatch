import { createStore, applyMiddleware } from 'redux'
import { createActions, handleActions } from 'redux-actions'
import promiseMiddleware from 'redux-promise'
import { createSelector } from 'reselect'
import { ipcRenderer, clipboard } from 'electron'
import pEvent from 'p-event'
import { compose, orderBy, map, groupBy, filter, size, identity } from 'lodash/fp'

const defaultState = {
  loading: true,
  movies: [],
  group: true,
  groupBy: 'director',
  filter: '',
  selected: null,
  footer: false,
  footerText: ''
}

export const filteredSelector = createSelector(
  state => state.filter,
  state => state.movies,
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

export const {
  fetch, toggleGroup, setGroupBy, setFilter, selectMovie, copyToClipboard, clearFooter
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
  CLEAR_FOOTER: identity
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
  })
}, defaultState)

export const store = createStore(reducer, applyMiddleware(promiseMiddleware))
