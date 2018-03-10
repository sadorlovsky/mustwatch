import React from 'react'
import { connect } from 'react-redux'
import Movie from './Movie'
import { randomSelector, grouppedSelector } from '../redux/selectors'

const PlainList = ({ data }) => (
  <div>
    {data.map(movie => (
      <div className='section' key={movie.id}>
        <Movie {...movie} />
      </div>
    ))}

    <style jsx>{`
      .section {
        background: #CC78FA;
        color: #FFFCFF;
        margin-bottom: 15px;
        border-radius: 3px;
      }
    `}</style>
  </div>
)

const ByDirectorList = ({ data = [] }) => (
  <div>{data.map(({ keyField, movies = [], count }) => (
    <div className='section' key={keyField}>
      <div className='header'>{keyField} <span className='count'>{count}</span></div>
      <div className='body'>{movies.map(movie => (
        <Movie key={movie.id} {...movie} />
      ))}</div>
    </div>
  ))}

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
      border-radius: 4px;
      margin-left: 3px;
      font-size: 14px;
    }
  `}</style>
  </div>
)

const MovieList = ({ group, groupBy, data }) => {
  if (!group) {
    return <PlainList data={data} />
  } else {
    return <ByDirectorList data={data} />
  }
}

const mapStateToProps = state => ({
  data: state.random ? randomSelector(state) : grouppedSelector(state),
  group: state.group,
  groupBy: state.groupBy
})

const enhanced = connect(mapStateToProps)

export default enhanced(MovieList)
