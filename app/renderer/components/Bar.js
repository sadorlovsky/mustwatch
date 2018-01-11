import React from 'react'
import smart from 'smart-plurals'
import { ipcRenderer } from 'electron'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { compose, withHandlers } from 'recompose'
import { toggleGroup, setGroupBy, countSelector } from '../store'

const plural = smart.Plurals.getRule('ru')

const Bar = ({ count, group, toggleGroup, groupBy, setGroupBy, logout }) => (
  <div className='bar'>
    <div>
      {count > 0 ? `${count} ${plural(count, ['фильм', 'фильма', 'фильмов'])}` : 'Не найдено'}
    </div>
    <div>
      <input className='checkbox' type='checkbox' checked={group} onChange={toggleGroup} />
      <span className='label' onClick={toggleGroup}>группировать по</span>
      <select className='select' value={groupBy} disabled={!group} onChange={setGroupBy}>
        <option value='director'>режиссерам</option>
        <option value='actor'>актерам</option>
      </select>
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
      }

      .select {
        margin-left: 5px;
      }

      .label, .checkbox {
        cursor: pointer;
      }
    `}</style>
  </div>
)

const mapStateToProps = state => ({
  count: countSelector(state),
  group: state.group,
  groupBy: state.groupBy
})
const mapDispatchToProps = dispatch => ({
  toggleGroup: bindActionCreators(toggleGroup, dispatch),
  setGroupBy: bindActionCreators(setGroupBy, dispatch)
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
