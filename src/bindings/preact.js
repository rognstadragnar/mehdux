import { h, Component } from 'preact'

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
        this.connection = null
        this.handleUpdate = this.handleUpdate.bind(this)
        this.store = useContext ? context.store : store
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
        return h(WrappedComponent, 
          Object.assign({}, this.state, this.props))
      }
    }
  }
}
