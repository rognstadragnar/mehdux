import { createElement, Component, Children } from 'react'
import { shallowMerge } from '../lib/shallowMerge.ts'
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
        this.handleUpdate = this.handleUpdate.bind(this)
        this.store = useContext ? context.store : store
        this.state = this.getMergedState(this.store.getState(mapStateToProps), this.store.getActions(mapActionsToProps))
      }
      componentDidMount() {
        this.connection = this.store.connect({ mapStateToProps, mapActionsToProps, leading: false })(this.handleUpdate)
      }
      componentWillUnmount() {
        this.connection.dispose()
      }
      handleUpdate(state, actions) {
        this.setState(this.getMergedState(state, actions))
      }
      getMergedState (state, actions) {
        if (this.store.__IS_COMBINED_STORE__) {
          return shallowMerge(actions, state)
        }
        return Object.assign({}, actions, state)
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
