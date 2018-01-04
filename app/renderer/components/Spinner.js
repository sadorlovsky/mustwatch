import React from 'react'
import { ipcRenderer } from 'electron'
import { PulseLoader } from 'halogenium'
import { compose, withState, lifecycle } from 'recompose'

const Spinner = ({ poster }) => (
  <div className='container'>
    <div className='overlay' />
    <PulseLoader color='#F553BF' size='16px' margin='4px' />

    <style jsx>{`
      .container {
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #282629;
        background-image: url(https://image.tmdb.org/t/p/w500/${poster});
        background-size: cover;
        background-position: center;
      }

      .overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        background: rgba(0, 0, 0, 0.5);
        z-index: 3;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    `}</style>
  </div>
)

const enhanced = compose(
  withState('poster', 'setPoster', null),
  lifecycle({
    componentDidMount () {
      ipcRenderer.on('poster', (e, { poster }) => {
        this.props.setPoster(poster)
      })
    }
  })
)

export default enhanced(Spinner)
