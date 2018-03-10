import { createStore, applyMiddleware } from 'redux'
import promiseMiddleware from 'redux-promise'
import createDebounce from 'redux-debounced'
import { reducer } from './reducer'

export const store = createStore(
  reducer,
  applyMiddleware(promiseMiddleware, createDebounce())
)
