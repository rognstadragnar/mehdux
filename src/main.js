import { isDifferent } from './lib/diff'
import { createActions } from './lib/helpers'

const stateManager = (initialState = {}, _actions = {}) => {
  let state = initialState
  let subscribers = []
  let connections = []

  const emit = () => {
    connections.forEach(c => c(state, actions))
    subscribers.forEach(s => s({ ...state, ...actions }))
  }

  const getState = () => ({ ...state })
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
  const unsubscribe = subscriber => {
    subscribers = subscribers.filter(s => s !== subscriber)
  }

  return {
    subscribe: subscriber => {
      subscribers.push(subscriber)
      return {
        unsubscribe: () => unsubscribe(subscriber)
      }
    },
    getState,
    actions,
    connect: (mapStateToProps, mapActionsToProps) => {
      let prevRes = mapStateToProps ? mapStateToProps(state) : state
      return consumer => {
        const connection = (state, actions) => {
          const currentRes = mapStateToProps ? mapStateToProps(state) : state
          const currentActions = mapActionsToProps
            ? mapActionsToProps(actions)
            : actions
          if (isDifferent(prevRes, currentRes)) {
            console.log('isDifferent', prevRes, currentRes)
            prevRes = currentRes
            consumer({ ...currentRes, ...currentActions })
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

export { stateManager }
