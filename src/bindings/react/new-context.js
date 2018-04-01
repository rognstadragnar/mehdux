// @jsx createElement
import * as React from 'react'
import { shallowMerge } from '../../lib/shallowMerge'

import { contextType } from './helpers'

const { createContext, Component, createElement } = React

class Connect extends Component {
  constructor(props, context) {
    super(props, context)
    const { store, options = {} } = props
    this.state = this.getMergedState(
      store.getState(options.mapStateToProps),
      store.getActions(options.mapActionsToProps)
    )

    this.handleUpdate = this.handleUpdate.bind(this)
    this.connection = null // will have unsubscribe method after supscription
    this.displayName = `Connected(${this.props.component.displayName ||
      'Component'})`
  }
  componentDidMount() {
    const { store, options = {} } = this.props
    const { mapActionsToProps = null, mapStateToProps = null } = options
    this.connection = store.connect({
      leading: false,
      mapActionsToProps,
      mapStateToProps
    })(this.handleUpdate)
  }
  componentWillUnmount() {
    this.connection.dispose()
  }
  handleUpdate(state, actions) {
    this.setState(this.getMergedState(state, actions))
  }
  getMergedState(state, actions) {
    if (this.props.store.__IS_COMBINED_STORE__) {
      return shallowMerge(actions, state)
    }
    return Object.assign({}, actions, state)
  }
  render() {
    return createElement(
      this.props.component,
      Object.assign({}, this.state, this.props)
    )
  }
}

export function experimental(store) {
  const { Consumer, Provider } = createContext(store)
  const connect = options => component => {
    return props =>
      createElement(Consumer, {}, store => {
        return createElement(Connect, { options, component, store })
      })
  }

  return {
    Provider: ({ children }) =>
      createElement(Provider, { value: store }, children),
    connect
  }
}
