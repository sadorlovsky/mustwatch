import fs from 'fs'
import React from 'react'
import { render } from 'react-dom'
import Dropzone from 'react-dropzone'
import { compose, withState, lifecycle } from 'recompose'
import mustwatch from '../..'

const App = ({ dropzoneActive, toggleDropzoneActive, data, setData }) => (
  <Dropzone
    disableClick
    onDragEnter={() => toggleDropzoneActive(true)}
    onDragLeave={() => toggleDropzoneActive(false)}
    onDrop={([file]) => {
      toggleDropzoneActive(false)
      const buffer = fs.readFileSync(file.path)
      const data = mustwatch(buffer, 0)
      setData(data)
    }}
    style={{ position: 'relative' }}
  >
    {dropzoneActive && <div className='overlay'>Сюды</div>}
    <div className='app'>
      {data ? (
        <div>{data.map((item, i) => (
          <div key={i}>{item.director}
            <div style={{ marginLeft: '100px' }}>{item.movies.map((movie, i) => (
              <div>{movie['русскоязычное название']} {movie['год']}</div>
            ))}</div>
          </div>
        ))}</div>
      ) : <div className='dropzone'>Загрузи сюды!</div>}
    </div>

    <style jsx>{`
      .app {
        width: 100%;
        height: 100vh;
        background: #000;
        color: #fff;
        box-sizing: border-box;
        padding: 25px;
        font-size: 28px;
      }

      .dropzone {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 5px dashed #fff;
        border-radius: 5px;
      }

      .overlay {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: blue;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
      }
    `}</style>

    <style jsx global>{`
      body, html {
        margin: 0;
        padding: 0;
      }
    `}</style>
  </Dropzone>
)

const Enhanced = compose(
  withState('dropzoneActive', 'toggleDropzoneActive', false),
  withState('data', 'setData', null),
  lifecycle({
    async componentWillMount () {}
  })
)(App)

render(<Enhanced />, document.getElementById('root'))
