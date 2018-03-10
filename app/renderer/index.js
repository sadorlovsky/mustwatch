import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { webFrame } from 'electron'
import { store } from './redux'
import App from './components/App'

webFrame.setZoomFactor(1)
webFrame.setVisualZoomLevelLimits(1, 1)
webFrame.setLayoutZoomLevelLimits(0, 0)

render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'))
