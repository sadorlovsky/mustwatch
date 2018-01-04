import React from 'react'
// import Dropzone from 'react-dropzone'
import {
  compose, withState, lifecycle, branch, renderComponent, withHandlers
} from 'recompose'
import Headroom from 'react-headroom'
import { some, debounce } from 'lodash'
import { ipcRenderer } from 'electron'
import Spinner from './Spinner'
import MovieList from './MovieList'
import Search from './Search'
import Bar from './Bar'

const App = ({ toggleDropzoneActive, data, onDrop, onSearch, activeMovieId, setActiveMovieId }) => (
  // <Dropzone
  //   disableClick
  //   onDragEnter={() => toggleDropzoneActive(true)}
  //   onDragLeave={() => toggleDropzoneActive(false)}
  //   onDrop={onDrop}
  // >
  <div>
    <Headroom style={{ padding: '15px', background: '#282629' }}>
      <Search onSearch={onSearch} />
      <Bar count={data.reduce((res, x) => res + x.movies.length, 0)} />
    </Headroom>
    <div style={{ padding: '0 15px 15px' }}>{data.map((props) => (
      <MovieList
        key={props.id}
        activeMovieId={activeMovieId}
        onClick={id => {
          if (activeMovieId === id) {
            setActiveMovieId(null)
          } else {
            setActiveMovieId(id)
          }
        }}
        {...props} />
    ))}</div>
  </div>
  // </Dropzone>
)

const withSpinnerWhileLoading = branch(
  ({ loading }) => loading,
  renderComponent(Spinner)
)

const enhanced = compose(
  withState('dropzoneActive', 'toggleDropzoneActive', false),
  withState('data', 'setData', []),
  withState('allData', 'setAllData', []),
  withState('loading', 'toggleLoading', true),
  withState('activeMovieId', 'setActiveMovieId', null),
  withHandlers({
    onDrop: ({ toggleDropzoneActive }) => async ([file]) => {
      toggleDropzoneActive(false)
    },
    onSearch: ({ allData, setData }) => debounce(query => {
      const filtered = allData.filter(x => {
        return x.director.toLowerCase().includes(query.toLowerCase()) ||
        some(x.movies, m => m.titleRU && m.titleRU.toLowerCase().includes(query.toLowerCase())) ||
        some(x.movies, m => m.titleEN && m.titleEN.toLowerCase().includes(query.toLowerCase()))
      })
      setData(filtered)
    }, 250)
  }),
  lifecycle({
    componentDidMount () {
      ipcRenderer.send('fetch')
      ipcRenderer.on('response', (e, data) => {
        this.props.setAllData(data)
        this.props.setData(data)
        this.props.toggleLoading(false)
      })
    }
  }),
  withSpinnerWhileLoading
)

export default enhanced(App)
