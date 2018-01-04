import React from 'react'
import he from 'he'
import Poster from './Poster'
import { getRating } from '../../main/utils'

const Movie = ({ titleRU, titleEN, countries, year, time, actors, genres, rating, poster }) => (
  <div className='movie'>
    <Poster title={titleRU} url={poster} />
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
        background: #BF65F0;
        border-radius: 3px;
      }

      .movie:not(:last-child) {
        /* margin-bottom: 10px; */
      }

      .title {
        font-weight: bold;
      }

      .title-en {
        color: #E0DCE0;
      }

      .year {
        margin-left: 5px;
        color: #E0DCE0;
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
