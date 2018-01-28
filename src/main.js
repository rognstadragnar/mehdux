import { isDifferent } from './lib/diff'
import { createActions } from './lib/helpers'
import { connect } from './bindings/react'

const stateManager = (initialState = {}, _actions = {}) => {
  let state = initialState
  let connections = []

  const emit = () => connections.forEach(c => c(state, actions))

  const getState = mapStateToProps =>
    mapStateToProps ? mapStateToProps(state) : state

  const getActions = mapDispatchToProps =>
    mapDispatchToProps ? mapDispatchToProps(actions) : actions

  const setState = newState => {
    if (newState !== undefined && isDifferent(state, newState)) {
      state = newState
      emit()
    }
  }

  const actions = createActions(_actions, getState, dispatch, setState)

  function dispatch(actionType, ...args) {
    setState(actions[actionType](...args))
  }

  const dispose = connection => {
    connections = connections.filter(c => c !== connection)
  }

  return {
    getState,
    getActions,
    actions,
    connect: (mapStateToProps, mapActionsToProps) => {
      let prevRes = mapStateToProps ? mapStateToProps(state) : state
      return consumer => {
        const connection = (state, actions) => {
          const currentRes = getState(mapStateToProps)
          if (isDifferent(prevRes, currentRes)) {
            prevRes = currentRes
            consumer({ ...currentRes, ...getActions(mapActionsToProps) })
          }
        }
        connections.push(connection)
        return {
          dispose: () => dispose(connection)
        }
      }
    }
  }
}

export { stateManager, connect }
