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
        background: #1154AA;
        color: #fff;
        border: none;
        box-sizing: border-box;
        /* margin-bottom: 10px; */
        font-size: 16px;
        height: 40px;
        padding: 10px;
        border-radius: 3px;
      }

      input::placeholder {
        color: #fff;
      }
    `}</style>
  </div>
)

const enhanced = withState('query', 'setQuery', '')

export default enhanced(Search)
