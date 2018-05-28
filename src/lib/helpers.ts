import {
  Action,
  GetActions,
  GetState,
  IActions,
  IParsedActions,
  IState,
  ParsedAction,
  SetState
} from '../types'

const createActions = (
  actions: IActions,
  getState: GetState,
  getActions: GetActions,
  setState: SetState
): IParsedActions => {
  const returnFn = (fn: Action, key: string) => (...args: any[]): void => {
    const currentState = getState()
    const newState = fn(currentState, getActions())(...args)
    setState(newState, { name: key, args })
  }

  return Object.keys(actions).reduce((pv, cv) => {
    pv[cv] = returnFn(actions[cv], cv)
    return pv
  }, {})
}

const createNestedActions = (
  actions: IActions,
  getState: GetState,
  getActions: GetActions,
  setState: SetState
): IParsedActions => {
  const transformFn = (stateKey, actionName, action: Action) => {
    return (...args) => {
      setState(
        {
          [stateKey]: {
            ...action(getState()[stateKey], getActions())(...args)
          }
        },
        { name: `${stateKey}.${actionName}`, args }
      )
    }
  }

  return Object.keys(actions).reduce((pv, cv) => {
    pv[cv] = Object.keys(actions[cv]).reduce((pInnerV, cInnerV) => {
      pInnerV[cInnerV] = transformFn(cv, cInnerV, actions[cv][cInnerV])
      return pInnerV
    }, {})

    return pv
  }, {})
}

export { createActions, createNestedActions }
