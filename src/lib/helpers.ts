import { ParsedAction } from './../types'
import { SetState, GetState, Actions, GetActions, ParsedActions, Action, State } from '../types'

const createActions = (
  actions: Actions,
  getState: GetState,
  getActions: GetActions,
  setState: SetState
): ParsedActions => {
  const returnFn = (fn: Action, key: string) => (...args: Array<any>): void => {
    const currentState = getState()
    const newState = fn(currentState, getActions())(...args)
    setState(newState, { name: key, args })
  }
  // return mapObj(actions, returnFn)

  return Object.keys(actions).reduce((pv, cv) => {
    return {
      ...pv,
      [cv]: returnFn(actions[cv], cv)
    }
  }, {})
}

const createNestedActions = (
  actions: Actions,
  getState: GetState,
  getActions: GetActions,
  setState: SetState
): ParsedActions => {
  const transformFn = (stateKey, actionName, action: Action) => {
    return (...args) => {
      setState({
        [stateKey]: {
          ...action(getState()[stateKey], getActions())(...args)
        }
      }, { name: `${stateKey}.${actionName}`, args })
    }
  }

  return Object.keys(actions).reduce((pv, cv) => {
    return {
      ...pv,
      [cv]: Object.keys(actions[cv]).reduce((pInnerV, cInnerV) => {        
        return {
          ...pInnerV,
          [cInnerV]: transformFn(cv, cInnerV,actions[cv][cInnerV])
        }
      }, {})
    }
  }, {})

}

export { createActions, createNestedActions }
