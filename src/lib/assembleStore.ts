import { ConnectOptions } from './../types';
import { Middlewares } from '../types'
import { isDifferent } from './diff'

import {
  State,
  GetState, 
  Dispatch,
  SetState,
  Action,
  Actions,
  GetActions,
  Connection,
  Consumer,
  Dispose,
  ParsedAction,
  ParsedActions,
  MapStateToProps,
  MapActionsToProps,
  ExtraSetStateArgs
} from '../types'

type CreateActionsFn = (
  actions: Actions,
  getState: GetState,
  getActions: GetActions,
  setState: SetState
) => ParsedActions

const assembleStore = (createActionsFn: CreateActionsFn, isCombinedStore: Boolean = false) => {
  return function createStore(initialState: State = {}, initialActions: Actions = {}, middlewares: Middlewares = []) {
    let connections: Array<Connection> = []
    let state: State = initialState
    const actions: ParsedActions = createActionsFn({...initialActions}, getState, getActions, setState)

    function emit(): void {
      connections.forEach(con => con(state, actions))
    }

    function setState(newState: State, extras: ExtraSetStateArgs = {} ): void {
      if (newState !== undefined && isDifferent(state, newState)) {
        state = middlewares.reduce((pv, cv) => {          
          return cv(pv, { prevState: getState(), name: extras.name, args: extras.args /* dispatch could also be used here, but not a good idea beofre some refactor */ })
        }, newState)
        emit()
      }
    }

    function dispatch(name: string, ...args: Array<any>): void {
      if (typeof actions[name] === 'function') {
        actions[name](...args)
      }
    }

    function dispose(connection: Connection): void {
      connections = connections.filter(c => c !== connection)
    }
  
    function getState(mapStateToProps?: MapStateToProps) {  
      if (mapStateToProps === null) return {} 
      return mapStateToProps ? mapStateToProps(state) : state
    }
  
    function getActions(mapActionsToProps?: MapActionsToProps): ParsedActions {
      if (mapActionsToProps === null) return {} 
      return mapActionsToProps ? mapActionsToProps(actions) : actions
    }
    
    this.__IS_COMBINED_STORE__ = isCombinedStore
    this.__INITIAL_ACTIONS__ = initialActions
    this.actions = actions
    this.getState = getState
    this.setState = setState
    this.getActions = getActions
    this.connect = (opts: ConnectOptions = {}) => {
      const {
        mapStateToProps,
        mapActionsToProps,
        force = false,
        leading = false
      } = opts
      let prevState = getState(mapStateToProps)
      return (consumer: Consumer): Dispose => {
        const connection = (state: State, actions: ParsedActions): void => {
          const currentState = getState(mapStateToProps)
          if (force || isDifferent(prevState, currentState)) {
            prevState = currentState
            consumer(currentState, getActions(mapActionsToProps))
          }
        }
        if (leading) consumer(prevState, getActions(mapActionsToProps))

        connections.push(connection)
        return {
          dispose: () => {
            dispose(connection)
          }
        }
      }
    }
  }
}

export { assembleStore }