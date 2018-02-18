import * as React from 'react'
import { shallowMerge } from '../../lib/shallowMerge'
import {
  IDispose,
  IStoreInstance,
  MapActionsToProps,
  MapStateToProps
} from './../../types'
import { contextType } from './helpers'

interface IConnect {
  store?: IStoreInstance
  mapStateToProps?: MapStateToProps
  mapActionsToProps?: MapActionsToProps
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
    class Connect extends React.Component<{}, IState> {
      public displayName = `Connected(${WrappedComponent.displayName ||
        WrappedComponent.name ||
        'Component'})`
      public store: IStoreInstance
      public state: IState
      public connection: IDispose
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
        return Object.assign({}, actions, state)
      }
      public render() {
        return React.createElement(
          WrappedComponent,
          Object.assign({}, this.state, this.props)
        )
      }
    }
    // @ts-ignore
    Connect.contextTypes = contextType
    return Connect
  }
}

export { connect }
