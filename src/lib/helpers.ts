import { ParsedAction } from './../types'
import { Dispatch, SetState, GetState, Actions, ParsedActions, Action, State } from '../types'

const mapObj = (r: object, fn: (v: Action) => ParsedAction): ParsedActions => {
  const o: ParsedActions = {}
  for (let v in r) o[v] = fn(r[v])
  return o
}
const createActions = (
  actions: Actions,
  getState: GetState,
  dispatch: Dispatch,
  setState: SetState
): ParsedActions => {
  const returnFn = (fn: Action) => (...args: Array<any>): void => {
    const currentState = getState()
    const newState = fn(currentState, dispatch)(...args)
    setState(newState, { name: fn.name, args })
  }
  return mapObj(actions, returnFn)
}

export { mapObj, createActions }
