import React from 'react'
import Movie from './Movie'

const MovieList = ({ director, count, movies }) => (
  <div className='section'>
    <div className='header'>{director} ({count})</div>
    <div className='body'>{movies.map(movie => (
      <Movie key={movie.id} {...movie} />
    ))}</div>

    <style jsx>{`
      .section {
        background: #1154AA;
        color: #fff;
        margin-bottom: 10px;
        border-radius: 3px;
      }

      .header {
        background: #197FFF;
        color: white;
        padding: 10px;
        border-radius: 3px;
      }

      .body {
        /* padding: 10px; */
      }
    `}</style>
  </div>
)

export default MovieList
