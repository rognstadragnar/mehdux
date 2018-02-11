import { ParsedAction } from './../types.ts'
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
  setState: SetState,
  enhance: (...args) => void
): ParsedActions => {
  const returnFn = (fn: Action) => (...args: Array<any>): void => {
    const currentState = getState()
    const newState = fn(currentState, dispatch)(...args)
    setState(newState)
    enhance({ name: fn.name, args, currentState, newState, lol: newState })
  }
  return mapObj(actions, returnFn)
}

export { mapObj, createActions }
