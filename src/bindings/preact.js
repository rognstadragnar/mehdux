import { h, Component } from 'preact'

export const connect = (store, mapStateToProps, mapDispatchToProps) => {
  return function(WrappedComponent)  {
    return class extends Component {
      constructor() {
        super()
        this.connection = null
        this.handleUpdate = this.handleUpdate.bind(this)
        this.state =
          Object.assign(
            {},
            store.getState(mapStateToProps),
            store.getActions(mapDispatchToProps)
          )
      }


      componentDidMount() {
        this.connection = store.connect(mapStateToProps, mapDispatchToProps)(
          this.handleUpdate
        )
      }
      handleUpdate(state) {
        this.setState(Object.assign({}, state))
      }

      componentWillUnmount() {
        this.connection && this.connection.dispose()
      }
      render() {
        return h(WrappedComponent, this.state)
      }
    }
  }
}
