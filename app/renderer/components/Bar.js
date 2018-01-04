import React from 'react'
import smart from 'smart-plurals'
import { ipcRenderer } from 'electron'
import { withState } from 'recompose'

const plural = smart.Plurals.getRule('ru')

const Bar = ({ count, checked, toggleChecked }) => (
  <div className='bar'>
    <div>{count} {plural(count, ['фильм', 'фильма', 'фильмов'])}</div>
    <div className='logout' onClick={() => {
      ipcRenderer.send('logout')
    }}>выйти</div>
    <div>
      <input type='checkbox' checked={checked} onChange={() => toggleChecked(!checked)} />
      <span onClick={() => toggleChecked(!checked)}>группировать по</span>
      <select className='select' defaultValue='director' disabled={!checked}>
        <option name='director'>режиссерам</option>
      </select>
    </div>

    <style jsx>{`
      .bar {
        display: flex;
        margin: 10px 0;
        justify-content: space-between;
      }

      .logout {
        cursor: pointer;
      }

      .select {
        margin-left: 5px;
      }
    `}</style>
  </div>
)

const enhanced = withState('checked', 'toggleChecked', true)

export default enhanced(Bar)
