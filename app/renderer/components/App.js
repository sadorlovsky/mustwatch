import React from 'react'
import { ipcRenderer } from 'electron'
import { compose, lifecycle, branch, renderComponent } from 'recompose'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Headroom from 'react-headroom'
import Spinner from './Spinner'
import MovieList from './MovieList'
import Search from './Search'
import Bar from './Bar'
import Footer from './Footer'
import { fetch, updateMovie } from '../store'

const App = ({ footer, footerText }) => {
  return (
    <div>
      <Headroom style={{ padding: '15px 15px 5px', background: '#282629' }}>
        <Search />
        <Bar />
      </Headroom>
      <div style={{ padding: '0 15px 15px' }}>
        <MovieList />
      </div>
      {footer && <Footer text={footerText} />}
    </div>
  )
}

const withSpinnerWhileLoading = branch(
  ({ loading }) => loading,
  renderComponent(Spinner)
)

const mapStateToProps = state => ({
  loading: state.loading,
  footer: state.footer,
  footerText: state.footerText
})

const mapDispatchToProps = dispatch => ({
  fetch: bindActionCreators(fetch, dispatch),
  updateMovie: bindActionCreators(updateMovie, dispatch)
})

const enhanced = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount () {
      this.props.fetch()
      ipcRenderer.on('updateMovie', (e, id, data) => {
        this.props.updateMovie(id, data)
      })
    }
  }),
  withSpinnerWhileLoading
)

export default enhanced(App)
