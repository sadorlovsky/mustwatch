import React from 'react'
import { compose, lifecycle, branch, renderComponent } from 'recompose'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Headroom from 'react-headroom'
import Spinner from './Spinner'
import MovieList from './MovieList'
import Search from './Search'
import Bar from './Bar'
import { fetch } from '../store'

const App = () => {
  return (
    <div>
      <Headroom style={{ padding: '15px 15px 5px', background: '#282629' }}>
        <Search />
        <Bar />
      </Headroom>
      <div style={{ padding: '0 15px 15px' }}>
        <MovieList />
      </div>
    </div>
  )
}

const withSpinnerWhileLoading = branch(
  ({ loading }) => loading,
  renderComponent(Spinner)
)

const mapStateToProps = state => ({
  loading: state.loading
})

const mapDispatchToProps = dispatch => ({
  fetch: bindActionCreators(fetch, dispatch)
})

const enhanced = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount () {
      this.props.fetch()
    }
  }),
  withSpinnerWhileLoading
)

export default enhanced(App)
