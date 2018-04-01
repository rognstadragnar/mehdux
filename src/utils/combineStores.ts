import { assembleStore } from '../lib/assembleStore'
import { isDifferent } from '../lib/diff'
import { createNestedActions } from '../lib/helpers'
import { flattenArray } from '../lib/shallowMerge'
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
  Middlewares,
  ParsedAction
} from '../types'

const createCombinedStore = assembleStore(createNestedActions, true)

export type combinedMiddlewares = Middlewares[] | true

function combineStores(stores = {}, newMiddlewares: combinedMiddlewares = []) {
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
    // warn if in development
  })
  return new createCombinedStore(stateObj, actionObj, flattenArray(middlewares))
}

export { combineStores }
