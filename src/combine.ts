import { State, Actions, InitialState } from './types.d'

const createPartial = (initialState: State, actions: Actions) => {
  return { initialState, actions }
}

type MultipleState = {
  [propName: string]: {
    initialState: InitialState,
    actions: Actions
  }
}

const combineStates = (states: MultipleState) => {
  const stateObjs = Object.keys(states).map(key => {
    const name = key
    const { initialState, actions } = states[key]
    return { name, initialState, actions }
  })
  let state = {}
  stateObjs.forEach(({ name, initialState}) => state[name] = { ...initialState})
}

export {combineStates}