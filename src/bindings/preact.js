import { h, Component } from 'preact'
import { shallowMerge } from '../lib/shallowMerge.ts'

export function Provider(props) {
  this.getChildContext = () => ({ store: props.store })
}

Provider.prototype.render = props => props.children[0]

export const connect = ({ store, mapStateToProps, mapActionsToProps } = {}) => {
  const useContext = !store || typeof store !== 'object'
  return function(WrappedComponent) {
    return class extends Component {
      constructor(props, context) {
        super(props, context)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.store = useContext ? context.store : store
        this.state = this.getMergedState(
          this.store.getState(mapStateToProps),
          this.store.getActions(mapActionsToProps)
        )
      }
      componentDidMount() {
        this.connection = this.store.connect({
          mapStateToProps,
          mapActionsToProps,
          leading: false
        })(this.handleUpdate)
      }
      componentWillUnmount() {
        this.connection.dispose()
      }
      handleUpdate(state, actions) {
        this.setState(this.getMergedState(state, actions))
      }
      getMergedState(state, actions) {
        if (this.store.__IS_COMBINED_STORE__) {
          return shallowMerge(actions, state)
        }
        return Object.assign({}, actions, state)
      }
      render() {
        return h(WrappedComponent, Object.assign({}, this.state, this.props))
      }
    }
  }
}
