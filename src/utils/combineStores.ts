import { assembleStore } from '../lib/assembleStore'
import { isDifferent } from '../lib/diff'
import { createNestedActions } from '../lib/helpers'
import {
  Action,
  Connection,
  Consumer,
  IActions,
  IDispose,
  IParsedActions,
  IState,
  MapActionsToProps,
  MapStateToProps,
  ParsedAction
} from '../types'

const createCombinedStore = assembleStore(createNestedActions, true)

function combineStores(stores, middlewares) {
  const storeNames = Object.keys(stores)
  const stateObj = {}
  const actionObj = {}
  const copyMiddlewares = middlewares === true
  if (copyMiddlewares) {
    middlewares = []
  }
  storeNames.forEach(storeName => {
    if (stores[storeName]) {
      middlewares = [
        ...middlewares,
        ...stores[storeName].__MIDDLEWARES__
      ].filter(Boolean)
      stateObj[storeName] = stores[storeName].getState()
      actionObj[storeName] = stores[storeName].__INITIAL_ACTIONS__
    }
    // warn if in development
  })
  return new createCombinedStore(stateObj, actionObj, middlewares)
}

export { combineStores }
