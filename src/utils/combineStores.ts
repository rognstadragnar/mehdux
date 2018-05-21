import { assembleStore } from '../lib/assembleStore'
import { createNestedActions } from '../lib/helpers'
import { flattenArray } from '../lib/shallowMerge'
import {
  Action,
  combinedMiddlewares,
  Connection,
  Consumer,
  IActions,
  IDispose,
  IParsedActions,
  IState,
  IStoresObject,
  MapActionsToProps,
  MapStateToProps,
  Middlewares,
  ParsedAction
} from '../types'

const createCombinedStore = assembleStore(createNestedActions, true)

function combineStores(
  stores: IStoresObject,
  newMiddlewares: combinedMiddlewares = []
) {
  const storeNames = Object.keys(stores)
  const stateObj = {}
  const actionObj = {}
  const middlewares = []
  if (Array.isArray(newMiddlewares)) {
    middlewares.push(newMiddlewares)
  }
  storeNames.forEach(storeName => {
    if (stores[storeName]) {
      if (newMiddlewares === true) {
        middlewares.push(...stores[storeName].__MIDDLEWARES__)
      }
      stateObj[storeName] = stores[storeName].getState()
      actionObj[storeName] = stores[storeName].__INITIAL_ACTIONS__
    }
  })
  return new createCombinedStore(stateObj, actionObj, flattenArray(middlewares))
}

export { combineStores }
