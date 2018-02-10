import { isDifferent } from './lib/diff'
import { createActions } from './lib/helpers'

import {
  State,
  Action,
  Actions,
  Connection,
  Consumer,
  Dispose,
  ParsedAction,
  ParsedActions,
  InitialState,
  MapStateToProps,
  MapActionsToProps
} from './types.d'

const createState = (
  initialState: State = {},
  initialActions: Actions = {}
) => {
  let state = initialState
  let connections: Array<Function> = []

  const emit = () => connections.forEach(c => c(state, actions))

  const getState = mapStateToProps =>
    mapStateToProps ? mapStateToProps(state) : state

  const getActions = mapDispatchToProps =>
    mapDispatchToProps ? mapDispatchToProps(actions) : actions

  const setState = (newState: State): void => {
    if (newState !== undefined && isDifferent(state, newState)) {
      state = newState
      emit()
    }
  }

  const actions: ParsedActions = createActions(
    initialActions,
    getState,
    dispatch,
    setState
  )

  function dispatch(actionType: string, ...args: Array<any>): void {
    if (actions[actionType]) actions[actionType](...args)
  }

  const dispose = (connection: Connection): void => {
    connections = connections.filter(c => c !== connection)
  }

  return {
    getState,
    getActions,
    actions,
    connect: (
      mapStateToProps?: MapStateToProps,
      mapActionsToProps?: MapActionsToProps
    ) => {
      let prevRes = mapStateToProps ? mapStateToProps(state) : state
      return (consumer: Consumer): Dispose => {
        const connection = (state: State, actions: ParsedActions): void => {
          const currentRes = getState(mapStateToProps)
          if (isDifferent(prevRes, currentRes)) {
            prevRes = currentRes
            consumer(
              Object.assign({}, currentRes, getActions(mapActionsToProps))
            )
          }
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

const stateManager = createState
export { createState, stateManager }
