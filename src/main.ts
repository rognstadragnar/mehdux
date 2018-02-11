import { isDifferent } from './lib/diff.ts'
import { createActions } from './lib/helpers.ts'

import {
  State,
  Action,
  Actions,
  Connection,
  Consumer,
  Dispose,
  ParsedAction,
  ParsedActions,
  MapStateToProps,
  MapActionsToProps,
  StoreInstance
} from './types.ts'

function Store(initialState: State = {}, initialActions: Actions = {}) {
  let connections: Array<Connection> = []
  let state: State = initialState
  let actions: ParsedActions = createActions(initialActions, getState, dispatch, setState)

  function emit(): void {
    connections.forEach(con => con(state, actions))
  }
  function setState(newState: State): void {
    if (newState !== undefined && isDifferent(state, newState)) {
      state = newState
      emit()
    }
  }

  function dispatch(name: string, ...args: Array<any>): void {
    if (typeof actions[name] === 'function') actions[name](...args)
  }

  function dispose(connection: Connection): void {
    connections = connections.filter(c => c !== connection)
  }

  function getState(mapStateToProps?: MapStateToProps) {
    return mapStateToProps ? mapStateToProps(state) : state
  }

  function getActions(mapActionsToProps?: MapActionsToProps) {
    return mapActionsToProps ? mapActionsToProps(actions) : actions
  }
  this.__INITIAL_ACTIONS__ = initialActions
  this.actions = actions
  this.getState = getState
  this.setState = setState
  this.getActions = getActions
  this.connect = (
    mapStateToProps: MapStateToProps = null,
    mapActionsToProps: MapActionsToProps = null,
    force: boolean = false
  ) => {
    let prevState = getState(mapStateToProps)
    return (consumer: Consumer): Dispose => {
      const connection = (state: State, actions: ParsedActions): void => {
        const currentState = getState(mapStateToProps)
        if (force || isDifferent(prevState, currentState)) {
          prevState = currentState
          consumer(currentState, getActions(mapActionsToProps))
        }
      }
      consumer(prevState, getActions(mapActionsToProps))

      connections.push(connection)
      return {
        dispose: () => {
          dispose(connection)
        }
      }
    }
  }
}

export { Store }
