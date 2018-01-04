import React from 'react'
import { branch } from 'recompose'
import ColorHash from 'color-hash'

const colorHash = new ColorHash()

const NullPoster = ({ title }) => (
  <div className='poster'>
    {title[0]}
    <style jsx>{`
      .poster {
        width: 92px;
        height: 138px;
        margin-right: 10px;
        background-color: ${colorHash.hex(title)}
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 48px;
      }
    `}</style>
  </div>
)

const Poster = ({ url }) => (
  <div className='poster'>
    <style jsx>{`
      .poster {
        width: 92px;
        height: 138px;
        margin-right: 10px;
        background-image: url(https://image.tmdb.org/t/p/w92/${url});
      }
    `}</style>
  </div>
)

const enhanced = branch(
  ({ url }) => !url,
  () => NullPoster
)

export default enhanced(Poster)
