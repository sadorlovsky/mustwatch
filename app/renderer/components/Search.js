import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setFilter } from '../store'

const Search = ({ query, setQuery }) => (
  <div>
    <input
      type='text'
      placeholder='Поиск'
      value={query}
      onChange={setQuery} />

    <style jsx>{`
      input {
        width: 100%;
        margin: 0;
        padding: 0;
        box-shadow: none;
        background: #F553BF;
        color: #FFFCFF;
        border: 2px solid transparent;
        box-sizing: border-box;
        font-size: 16px;
        height: 40px;
        padding: 10px;
        border-radius: 3px;
      }

      input:focus {
        border: none;
        outline: none;
        border: 2px solid #FFFCFF;
      }

      input::placeholder {
        color: #FFFCFF;
      }
    `}</style>
  </div>
)

const mapStateToProps = state => ({
  query: state.filter
})

const mapDispatchToProps = dispatch => ({
  setQuery: bindActionCreators(setFilter, dispatch)
})

const enhanced = connect(mapStateToProps, mapDispatchToProps)

export default enhanced(Search)
