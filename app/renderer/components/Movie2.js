import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import he from 'he'
import classNames from 'classnames'
import { Motion, spring } from 'react-motion'
import Highlighter from 'react-highlight-words'
import Poster from './Poster'
import { getRating } from '../../main/utils'
import { selectMovie } from '../redux/actions'

const Movie = ({ movie, selected, selectMovie, filter }) => (
  <div className={classNames('movie', { active: selected === movie.id })} onClick={() => selectMovie(movie.id)}>
    <Poster title={movie.titleRU} url={movie.poster} />
    <div>
      <div>
        <span className='title'>
          <Highlighter
            highlightStyle={{ background: '#F553BF', color: '#FFFCFF' }}
            searchWords={filter.split(' ')}
            autoEscape
            textToHighlight={he.decode(String(movie.titleRU))}
          />
        </span>
        <span className='year'>{he.decode(String(movie.year))}</span>
      </div>
      <div className='title-en'>
        <Highlighter
          highlightStyle={{ background: '#F553BF', color: '#FFFCFF' }}
          searchWords={filter.split(' ')}
          autoEscape
          textToHighlight={movie.titleEN || ''}
        />
      </div>
      <div>
        <Highlighter
          highlightStyle={{ background: '#F553BF', color: '#FFFCFF' }}
          searchWords={filter.split(' ')}
          autoEscape
          textToHighlight={movie.director || ''}
        />
      </div>
      <div>
        {movie.actors.map(actor => <span key={`${movie.id}-${actor}`}>{actor}, </span>)}
      </div>
      <div className='countries'>
        {movie.countries.map(country => <span key={`${movie.id}-${country}`}>{country}, </span>)}
      </div>
      <div>
        {movie.genres.map(genre => <span key={`${movie.id}-${genre}`}>{genre}, </span>)}
      </div>
      <div>{movie.time} мин</div>
      <div className='rating'>{getRating(movie.rating)}</div>
    </div>
    {selected === movie.id && (
      <Motion
        defaultStyle={{ right: -100 }}
        style={{ right: spring(0) }}>
        {style => (
          <div className='links' style={{ right: `${style.right}px` }}>
            <div className='link'>
              <img className='kinopoisk' onClick={() => {
                // shell.openExternal(`https://www.kinopoisk.ru/index.php?kp_query=${titleRU}`)
              }} src='img/kinopoisk.svg' />
            </div>
            <div className='link'>
              <img className='clipboard' onClick={() => {
                // copyToClipboard(`${titleRU} ${year}`)
                // setTimeout(clearFooter, 3000)
              }} src='img/clipboard.svg' />
            </div>
          </div>
        )}
      </Motion>
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
        /* background: #BF65F0; */
        background: rgba(#fff, 0.2);
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

const mapStateToProps = (state, { id }) => ({
  selected: state.selected,
  movie: state.movieById[id],
  filter: state.filter
})

const mapDispatchToProps = dispatch => ({
  selectMovie: bindActionCreators(selectMovie, dispatch)
})

const enhanced = connect(mapStateToProps, mapDispatchToProps)

export default enhanced(Movie)
