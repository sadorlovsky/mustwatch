import React from 'react'
import smart from 'smart-plurals'
import { ipcRenderer } from 'electron'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { compose, withHandlers } from 'recompose'
import {
  toggleGroup, setGroupBy, countSelector, setOrder, setSortBy, toggleRandom
} from '../store'
// import Checkbox from './Checkbox'

const plural = smart.Plurals.getRule('ru')

const Bar = ({
  count, group, toggleGroup, groupBy, setGroupBy, logout, order, setOrder,
  sortBy, setSortBy, toggleRandom
}) => (
  <div className='bar'>
    <div>
      {count > 0 ? `${count} ${plural(count, ['фильм', 'фильма', 'фильмов'])}` : 'Не найдено'}
    </div>
    <div>
      {/* <Checkbox checked={group} onChange={toggleGroup} /> */}
      <input className='checkbox' type='checkbox' checked={group} onChange={toggleGroup} />
      <span className='label' onClick={toggleGroup}>группировать по</span>
      <select className='select' value={groupBy} disabled={!group} onChange={setGroupBy}>
        <option value='director'>режиссерам</option>
        <option value='actor'>актерам</option>
        <option value='genre'>жанрам</option>
        <option value='country'>странам</option>
      </select>
    </div>
    <div>
      сортировать по
      <select className='select' value={sortBy} onChange={setSortBy}>
        <option value='queue'>очереди</option>
        <option value='title'>названию</option>
        <option value='rating'>рейтингу</option>
        <option value='time'>времени</option>
        <option value='year'>году</option>
      </select>
      <button onClick={() => setOrder(order * -1)}>
        {order === 1 ? '▲' : '▼'}
      </button>
    </div>
    <div className='random' onClick={toggleRandom}>
      <img src='img/dice.svg' style={{ width: '25px', height: '25px' }} />
    </div>
    <div className='logout' onClick={logout}>выйти</div>

    <style jsx>{`
      .bar {
        display: flex;
        margin: 10px 0;
        justify-content: space-between;
        user-select: none;
        cursor: default;
      }

      .logout {
        cursor: pointer;
        /* padding: 3px 5px; */
        /* box-sizing: border-box; */
        border-radius: 3px;
      }

      .logout:hover {
        background: rgba(#BF65F0, 0.5);
        color: #fff;
      }

      .select {
        margin-left: 5px;
      }

      .label, .checkbox {
        cursor: pointer;
      }

      .random {
        cursor: pointer;
      }

      .random > img {
        transition: all 0.1s ease-in;
      }

      .random:hover > img {
        transform: rotate(-10deg) scale(1.1);
      }
    `}</style>
  </div>
)

const mapStateToProps = state => ({
  count: countSelector(state),
  group: state.group,
  groupBy: state.groupBy,
  sortBy: state.sortBy,
  order: state.order
})
const mapDispatchToProps = dispatch => ({
  toggleGroup: bindActionCreators(toggleGroup, dispatch),
  setGroupBy: bindActionCreators(setGroupBy, dispatch),
  setOrder: bindActionCreators(setOrder, dispatch),
  setSortBy: bindActionCreators(setSortBy, dispatch),
  toggleRandom: bindActionCreators(toggleRandom, dispatch)
})
const enhanced = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    logout: () => () => {
      ipcRenderer.send('logout')
    }
  })
)

export default enhanced(Bar)
