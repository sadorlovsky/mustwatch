import React from 'react'
import { connect } from 'react-redux'
import Movie from './Movie2'
import { randomSelector2, grouppedSelector2 } from '../redux/selectors'

const MovieList = ({ ids }) => (
  <div>
    {ids.map(id => (
      <div className='section' key={id}>
        <Movie id={id} />
      </div>
    ))}

    <style jsx>{`
      .section {
        /* background: #CC78FA; */
        background: rgba(#000, 0.8);
        color: #FFFCFF;
        margin-bottom: 15px;
        border-radius: 3px;
      }
    `}</style>
  </div>
)

const mapStateToProps = state => ({
  ids: state.random ? randomSelector2(state) : grouppedSelector2(state)
})

const enhanced = connect(mapStateToProps)

export default enhanced(MovieList)
