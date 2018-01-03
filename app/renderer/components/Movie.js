import React from 'react'
import he from 'he'
import { getRating } from '../../../lib/utils'

const Movie = ({ titleRU, titleEN, countries, year, time, actors, genres, rating, poster }) => (
  <div className='movie'>
    <div className='poster' />
    <div>
      <div>
        <span className='title'>{he.decode(String(titleRU))}</span>
        <span className='year'>{he.decode(String(year))}</span>
      </div>
      <div className='title-en'>{titleEN}</div>
      <div>{actors}</div>
      <div className='countries'>{countries}</div>
      <div>{genres}</div>
      <div>{time} мин</div>
      <div className='rating'>{getRating(rating)}</div>
    </div>

    <style jsx>{`
      .movie {
        padding: 10px;
        cursor: pointer;
        display: flex;
      }

      .movie:hover {
        background: #043068;
        border-radius: 3px;
      }

      .movie:not(:last-child) {
        /* margin-bottom: 10px; */
      }

      .poster {
        width: 92px;
        height: 138px;
        background-color: yellow;
        background-image: url(https://image.tmdb.org/t/p/w92/${poster});
        background-size: contain;
        margin-right: 10px;
      }

      .title {
        font-weight: bold;
      }

      .title-en {
        color: #ccc;
      }

      .year {
        margin-left: 5px;
        color: #ccc;
      }

      .countries {
        font-size: 12px;
      }

      .rating {
        font-weight: bold;
      }
    `}</style>
  </div>
)

export default Movie
