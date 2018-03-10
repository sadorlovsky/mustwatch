import React from 'react'
import { ipcRenderer } from 'electron'
import { compose, lifecycle, branch, renderComponent } from 'recompose'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Headroom from 'react-headroom'
import Spinner from './Spinner'
// import MovieList from './MovieList'
import MovieList from './MovieList2'
import Search from './Search'
import Bar from './Bar'
import Footer from './Footer'
import { fetch, updateMovie, setFooterText, clearFooter } from '../redux/actions'

const App = ({ footer, footerText }) => {
  return (
    <div>
      <Headroom>
        <div className='lol'>
          <Search />
          <Bar />
        </div>
      </Headroom>
      <div style={{ padding: '0 15px 15px' }}>
        <MovieList />
      </div>
      {footer && <Footer text={footerText} />}

      <style jsx>{`
        .lol {
          padding: 15px 15px 5px;
          background: rgba(#000, 0.9);
        }
      `}</style>
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
  clearFooter: bindActionCreators(clearFooter, dispatch),
  updateMovie: bindActionCreators(updateMovie, dispatch),
  setFooterText: bindActionCreators(setFooterText, dispatch)
})

const enhanced = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount () {
      this.props.fetch()
      ipcRenderer.on('updateMovie', (e, id, data) => {
        this.props.updateMovie(id, data)
      })
      ipcRenderer.on('startFetchingPosters', () => {
        this.props.setFooterText('Получение постеров...')
      })
      ipcRenderer.on('finishFetchingPosters', () => {
        this.props.clearFooter()
      })
    }
  }),
  withSpinnerWhileLoading
)

export default enhanced(App)
