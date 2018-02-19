import * as Preact from 'preact'
import { shallowMerge } from '../../lib/shallowMerge'
import {
  IDispose,
  IStoreInstance,
  MapActionsToProps,
  MapStateToProps
} from './../../types'

interface IConnect {
  store?: IStoreInstance
  mapActionsToProps?: MapActionsToProps
  mapStateToProps?: MapStateToProps
}

interface IState {
  store: IStoreInstance
  state: {}
}

const connect = ({
  store,
  mapStateToProps,
  mapActionsToProps
}: IConnect = {}) => {
  return WrappedComponent => {
    class Connect extends Preact.Component<{}, IState> {
      private store: IStoreInstance
      private connection: IDispose
      constructor(props, context) {
        super(props, context)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.store = store || context.store
        this.state = this.getMergedState(
          this.store.getState(mapStateToProps),
          this.store.getActions(mapActionsToProps)
        )
      }
      public componentDidMount() {
        this.connection = this.store.connect({
          leading: false,
          mapActionsToProps,
          mapStateToProps
        })(this.handleUpdate)
      }
      public componentWillUnmount() {
        this.connection.dispose()
      }
      public handleUpdate(state, actions) {
        this.setState(this.getMergedState(state, actions))
      }
      public getMergedState(state, actions) {
        if (this.store.__IS_COMBINED_STORE__) {
          return shallowMerge(actions, state)
        }
        return { ...actions, ...state }
      }
      public render() {
        return Preact.h(WrappedComponent, { ...this.state, ...this.props })
      }
    }
    Connect.displayName = `Connected(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`
    return Connect
  }
}

export { connect }
