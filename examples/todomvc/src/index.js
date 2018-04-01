import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mehdux/react'
import { store } from './store/'
import App from './containers/App'
import 'todomvc-app-css/index.css'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
