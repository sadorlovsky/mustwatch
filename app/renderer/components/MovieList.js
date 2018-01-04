import React from 'react'
import Movie from './Movie'

const MovieList = ({ director, count, movies }) => (
  <div className='section'>
    <div className='header'>{director} <span className='count'>{count}</span></div>
    <div className='body'>{movies.map(movie => (
      <Movie key={movie.id} {...movie} />
    ))}</div>

    <style jsx>{`
      .section {
        background: #CC78FA;
        color: #FFFCFF;
        margin-bottom: 15px;
        border-radius: 3px;
      }

      .header {
        background: #F553BF;
        color: #FFFCFF;
        padding: 10px;
        border-radius: 3px;
        font-weight: bold;
      }

      .count {
        background: #D342A4;
        color: #FFFCFF;
        font-weight: normal;
        padding: 3px 7px;
        border-radius: 50%;
        margin-left: 3px;
        font-size: 14px;
      }

      .body {
        /* padding: 10px; */
      }
    `}</style>
  </div>
)

export default MovieList
