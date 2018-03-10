import { handleActions } from 'redux-actions'
import {
  fetch, toggleGroup, setGroupBy, setFilter, selectMovie, copyToClipboard,
  clearFooter, updateMovie, setFooterText, setOrder, setSortBy, toggleRandom
} from './actions'

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

export const reducer = handleActions({
  [fetch]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      movieIds: action.payload.result,
      movieById: action.payload.entities.movies,
      // movies: [...state.movies, ...action.payload],
      loading: false
    }
  },
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
