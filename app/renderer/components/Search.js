import React from 'react'
import { withState } from 'recompose'

const Search = ({ query, setQuery, onSearch }) => (
  <div>
    <input
      type='text'
      placeholder='Поиск'
      value={query}
      onChange={e => {
        setQuery(e.target.value)
        onSearch(e.target.value)
      }}
      onKeyDown={e => {
        if (e.keyCode === 13) {
          onSearch(query)
        }
      }} />
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

const enhanced = withState('query', 'setQuery', '')

export default enhanced(Search)
