import React from 'react'
import he from 'he'
import { bindActionCreators } from 'redux'
import { shell } from 'electron'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Poster from './Poster'
import { getRating } from '../../main/utils'
import { selectMovie, copyToClipboard, clearFooter } from '../store'

const Movie = ({
  id, titleRU, titleEN, countries, year, time, actors, genres, rating, poster,
  selected, selectMovie, copyToClipboard, clearFooter
}) => (
  <div className={classNames('movie', { active: selected === id })} onClick={() => selectMovie(id)}>
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
    {selected === id && (
      <div className='links'>
        <div className='link'>
          <img className='kinopoisk' onClick={() => {
            shell.openExternal(`https://www.kinopoisk.ru/index.php?kp_query=${titleRU}`)
          }} src='img/kinopoisk.svg' />
        </div>
        <div className='link'>
          <img className='clipboard' onClick={() => {
            copyToClipboard(`${titleRU} ${year}`)
            setTimeout(clearFooter, 3000)
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
        border-radius: 3px;
      }

      .active, .movie:hover {
        background: #BF65F0;
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
        border-radius: 3px 0 0 3px;
      }

      .link {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .link:hover {
        background: rgba(#BF65F0, 0.5);
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

const mapStateToProps = state => ({
  selected: state.selected
})

const mapDispatchToProps = dispatch => ({
  selectMovie: bindActionCreators(selectMovie, dispatch),
  copyToClipboard: bindActionCreators(copyToClipboard, dispatch),
  clearFooter: bindActionCreators(clearFooter, dispatch)
})

const enhanced = connect(mapStateToProps, mapDispatchToProps)

export default enhanced(Movie)
