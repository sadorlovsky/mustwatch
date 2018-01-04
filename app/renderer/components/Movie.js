import React from 'react'
import he from 'he'
import { shell, clipboard } from 'electron'
import Poster from './Poster'
import { getRating } from '../../main/utils'

const Movie = ({ titleRU, titleEN, countries, year, time, actors, genres, rating, poster, showLinks, onClick }) => (
  <div className='movie' onClick={onClick}>
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
    {showLinks && (
      <div className='links'>
        <div>
          <img className='kinopoisk' onClick={() => {
            shell.openExternal(`https://www.kinopoisk.ru/index.php?kp_query=${titleRU}`)
          }} src='img/kinopoisk.svg' />
        </div>
        <div>
          <img className='clipboard' onClick={() => {
            clipboard.writeText(`${titleRU} ${year}`)
          }} src='img/clipboard.svg' />
        </div>
      </div>
    )}

    <style jsx>{`
      .movie {
        padding: 10px;
        cursor: pointer;
        display: flex;
        position: relative;
      }

      .movie:hover {
        background: #BF65F0;
        border-radius: 3px;
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

      .links {
        position: absolute;
        right: 0;
        top: 0;
        width: 100px;
        height: 100%;
        background: rgba(#282629, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        border-radius: 3px 0 0 3px;
      }

      .kinopoisk, .clipboard {
        width: 25px;
        height: 25px;
        transition: all 0.1s ease;
      }

      .kinopoisk:hover, .clipboard:hover {
        width: 30px;
        height: 30px;
      }
    `}</style>
  </div>
)

export default Movie
