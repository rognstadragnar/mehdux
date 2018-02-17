import { isDifferent } from './diff'
import { isObj } from './shallowMerge'

import {
  Action,
  Connection,
  Consumer,
  Dispatch,
  GetActions,
  GetState,
  IActions,
  IConnectOptions,
  IDispose,
  IExtraSetStateArgs,
  IParsedActions,
  IState,
  MapActionsToProps,
  MapStateToProps,
  Middlewares,
  ParsedAction,
  SetState
} from '../types'

type CreateActionsFn = (
  actions: IActions,
  getState: GetState,
  getActions: GetActions,
  setState: SetState
) => IParsedActions

const assembleStore = (
  createActionsFn: CreateActionsFn,
  isCombinedStore: boolean = false
) => {
  return function createStore(
    initialState: IState = {},
    initialActions: IActions = {},
    middlewares: Middlewares = []
  ) {
    let connections: Connection[] = []
    let state: IState = initialState
    const actions: IParsedActions = createActionsFn(
      initialActions,
      getState,
      getActions,
      setState
    )

    function emit(): void {
      connections.forEach(con => con())
    }

    function setState(newState: IState, extras: IExtraSetStateArgs = {}): void {
      if (newState !== undefined && isDifferent(state, newState)) {
        state = {
          ...state,
          ...middlewares.reduce((pv, cv) => {
            return cv(pv, {
              args: extras.args,
              name: extras.name,
              prevState: getState()
              /* dispatch could also be used here, but not a good idea beofre some refactor */
            })
          }, newState)
        }
        emit()
      }
    }

    function dispose(connection: Connection): void {
      connections = connections.filter(c => c !== connection)
    }

    function getState(mapStateToProps?: MapStateToProps) {
      if (mapStateToProps === null) {
        return {}
      }
      return mapStateToProps ? mapStateToProps(state) : state
    }

    function getActions(mapActionsToProps?: MapActionsToProps): IParsedActions {
      if (mapActionsToProps === null) {
        return {}
      }
      return mapActionsToProps ? mapActionsToProps(actions) : actions
    }

    this.__IS_COMBINED_STORE__ = isCombinedStore
    this.__INITIAL_ACTIONS__ = initialActions
    this.__MIDDLEWARES__ = middlewares
    this.actions = actions
    this.getState = getState
    this.setState = setState
    this.getActions = getActions
    this.connect = (opts: IConnectOptions = {}) => {
      const {
        mapStateToProps,
        mapActionsToProps,
        force = false,
        leading = false
      } = opts
      let prevState = getState(mapStateToProps)
      return (consumer: Consumer): IDispose => {
        const connection = (): void => {
          const currentState = getState(mapStateToProps)
          if (force || isDifferent(prevState, currentState)) {
            prevState = currentState
            consumer(currentState, getActions(mapActionsToProps))
          }
        }
        if (leading) {
          consumer(prevState, getActions(mapActionsToProps))
        }

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
