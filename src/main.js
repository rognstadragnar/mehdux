import { isDifferent } from './lib/diff'
import { createActions } from './lib/helpers'

const stateManager = (initialState = {}, updateFn, _actions = {}) => {
  let state = initialState
  let subscribers = []
  let connections = []

  const emit = () => {
    connections.forEach(c => c(state, actions))
    subscribers.forEach(s => s({ ...state, ...actions }))
  }

  const update = (msg, payload) => {
    const prevState = state
    const newState = updateFn(state, msg, payload)
    if (isDifferent(prevState, newState)) {
      state = newState
      emit()
      return { msg, payload }
    }
  }

  const actions = createActions(_actions, update)

  const unsubscribe = (listener, type) => {
    if (type === 'connection') {
      connections = connections.filter(c => c !== listener)
    } else {
      subscribers = subscribers.filter(s => s !== subscriber)
    }
  }

  return {
    subscribe: subscriber => {
      subscribers.push(subscriber)
      return {
        unsubscribe: () => unsubscribe(subscriber),
        actions
      }
    },
    getState: () => ({ ...state }),
    update,
    connect: (mapStateToProps, mapActionsToProps) => {
      let prevRes = null
      return consumer => {
        const connection = (state, actions) => {
          const currentRes = mapStateToProps ? mapStateToProps(state) : state
          const currentActions = mapActionsToProps
            ? mapActionsToProps(actions)
            : actions
          if (isDifferent(prevRes, currentRes)) {
            prevRes = currentRes
            consumer({ ...currentRes, ...currentActions })
          }
        }
        connections.push(connection)
        return {
          state,
          unsubscribe: () => unsubscribe(connection, 'connection')
        }
      }
    }
  }
}

export { stateManager }
