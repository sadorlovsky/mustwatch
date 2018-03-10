import { createActions } from 'redux-actions'
import { ipcRenderer, clipboard } from 'electron'
import pEvent from 'p-event'
import { identity } from 'lodash/fp'
import { schema, normalize } from 'normalizr'

export const {
  fetch, toggleGroup, setGroupBy, setFilter, selectMovie, copyToClipboard,
  clearFooter, updateMovie, setFooterText, setOrder, setSortBy, toggleRandom
} = createActions({
  FETCH: async () => {
    ipcRenderer.send('fetch')
    const [, data] = await pEvent(ipcRenderer, 'response', { multiArgs: true })

    const movie = new schema.Entity('movies')
    const normalized = normalize(data, [movie])

    return normalized
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
