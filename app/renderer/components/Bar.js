import React from 'react'
import smart from 'smart-plurals'

const plural = smart.Plurals.getRule('ru')

const Bar = ({ count }) => (
  <div className='bar'>
    <div>{count} {plural(count, ['фильм', 'фильма', 'фильмов'])}</div>
    <div>группировать по
      <select className='select'>
        <option selected>режиссерам</option>
      </select>
    </div>

    <style jsx>{`
      .bar {
        display: flex;
        margin: 10px 0;
        justify-content: space-between;
      }

      .select {
        margin-left: 5px;
      }
    `}</style>
  </div>
)

export default Bar
