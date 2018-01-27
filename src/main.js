import { isDifferent } from './lib/diff'
import { createActions } from './lib/helpers'

const stateManager = (initialState = {}, updateFn, _actions = {}) => {
  let state = initialState
  let subscribers = []
  const emit = () => subscribers.forEach(s => s(state, actions))

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

  const unsubscribe = subscriber => {
    subscribers = subscribers.filter(s => s !== subscriber)
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
    update
  }
}

function connect(mapStateToProps, mapActionsToProps) {
  let prevRes = null

  return consumer => {
    return (state, actions) => {
      const currentRes = mapStateToProps ? mapStateToProps(state) : state
      const currentActions = mapActionsToProps
        ? mapActionsToProps(actions)
        : actions
      if (isDifferent(prevRes, currentRes)) {
        prevRes = currentRes
        consumer({ ...currentRes, ...currentActions })
      }
    }
  }
}

export { stateManager, connect }
