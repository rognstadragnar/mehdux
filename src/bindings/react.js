import { createElement, Component, Children } from 'react'

const contextType = { store: () => {} }

class Provider extends Component {
  getChildContext() {
    return { store: this.props.store }
  }
  render() {
    return Children.only(this.props.children)
  }
}

Provider.childContextTypes = contextType

const connect = ({ store, mapStateToProps, mapActionsToProps } = {}) => {
  const useContext = !store || typeof store !== 'object'
  return function(WrappedComponent) {
    class Wrapper extends Component {
      constructor(props, context) {
        super(props, context)
        this.store = useContext ? context.store : store
        this.connection = null
        this.handleUpdate = this.handleUpdate.bind(this)
        this.state = Object.assign(
          {}, 
          this.store.getState(mapStateToProps), this.store.getActions(mapActionsToProps))
      }
      componentDidMount() {
        this.connection = this.store.connect(mapStateToProps, mapActionsToProps)(this.handleUpdate)
      }
      handleUpdate(state, actions) {
        this.setState(Object.assign({}, state, actions))
      }
      componentWillUnmount() {
        this.connection && this.connection.dispose()
      }
      render() {
        return createElement(WrappedComponent, 
          Object.assign({}, this.state, this.props))
      }
    }
    Wrapper.contextTypes = {
      store: () => {}
    }
    return Wrapper
  }
}

connect.contextTypes = contextType

export { Provider, connect }
