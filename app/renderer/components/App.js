import React from 'react'
// import Dropzone from 'react-dropzone'
import {
  compose, withState, lifecycle, branch, renderComponent, withHandlers
} from 'recompose'
import { some } from 'lodash'
import { ipcRenderer } from 'electron'
import Spinner from './Spinner'
import MovieList from './MovieList'
import Search from './Search'
import Bar from './Bar'

const App = ({ toggleDropzoneActive, data, onDrop, onSearch }) => (
  // <Dropzone
  //   disableClick
  //   onDragEnter={() => toggleDropzoneActive(true)}
  //   onDragLeave={() => toggleDropzoneActive(false)}
  //   onDrop={onDrop}
  // >
  <div>
    <Search onSearch={onSearch} />
    <Bar count={data.reduce((res, x) => res + x.movies.length, 0)} />
    {data.map((props) => (
      <MovieList
        key={props.id}
        {...props} />
    ))}

    <style jsx global>{`
      body {
        font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto, Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue', sans-serif;
        font-feature-settings: 'calt','tnum','ss01','case';
        -webkit-font-smoothing: antialiased;
        background: #282629;
        color: #FFFCFF;
        padding: 15px;
        margin: 0;
      }
    `}</style>
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
  withHandlers({
    onDrop: ({ toggleDropzoneActive }) => async ([file]) => {
      toggleDropzoneActive(false)
    },
    onSearch: ({ allData, setData }) => query => {
      const filtered = allData.filter(x => {
        return x.director.toLowerCase().includes(query.toLowerCase()) ||
        some(x.movies, m => m.titleRU && m.titleRU.toLowerCase().includes(query.toLowerCase())) ||
        some(x.movies, m => m.titleEN && m.titleEN.toLowerCase().includes(query.toLowerCase()))
      })
      setData(filtered)
    }
  }),
  lifecycle({
    async componentDidMount () {
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
