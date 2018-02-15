import { Store } from './main'
import { isDifferent } from './lib/diff'
import { assembleStore } from './utils/assembleStore'
import { createNestedActions } from './lib/helpers'
import {
  State,
  Action,
  Actions,
  Connection,
  Consumer,
  Dispose,
  ParsedAction,
  ParsedActions,
  MapStateToProps,
  MapActionsToProps
} from './types'


const store = new Store({}, {})

function combineStores(stores, middlewares) {

  const storeNames = Object.keys(stores)
  const stateObj = {}
  const actionObj = {}
  storeNames.forEach(storeName => {
    if (stores[storeName]) {
      stateObj[storeName] = stores[storeName].getState()
      actionObj[storeName] = stores[storeName].__INITIAL_ACTIONS__
    }
    // warn if in development
  })  
  return new createCombinedStore(stateObj, actionObj, middlewares)
}

const createCombinedStore = assembleStore(createNestedActions)
/* 
function createCombinedStore(initialState, initialActions) {
  
  let connections: Array<Connection> = []
  let state = initialState
  let actions: ParsedActions = createNestedActions(
    initialActions,
    getState,
    dispatch,
    setState
  )

  function emit(state, actions): void {
    connections.forEach(con => {
      con(state, actions)
    })
  }
  function setState(newState: State): void {
    if (newState !== undefined && isDifferent(state, newState)) {
      state = newState
      emit(getState(), actions)
    }
  }

  function dispatch(name: string, ...args: Array<any>): void {
    if (name.indexOf('/')) {
      const split = name.split('.')
      if (typeof actions[split[0]][split[1]] === 'function') {
        actions[split[0]][split[1]](...args)
      }
    }
    if (typeof actions[name] === 'function') actions[name](...args)
  }

  function dispose(connection: Connection): void {
    connections = connections.filter(c => c !== connection)
  }

  function getState(mapStateToProps?: MapStateToProps) {
    return mapStateToProps ? mapStateToProps(state) : state
  }

  function getActions(mapActionsToProps?: MapActionsToProps) {
    return mapActionsToProps ? mapActionsToProps(actions) : actions
  }

  this.actions = actions
  this.getState = getState
  this.getActions = getActions
  this.setState = setState
  this.connect = (
    mapStateToProps: MapStateToProps = null,
    mapActionsToProps: MapActionsToProps = null,
    force: boolean = false
  ) => {
    let prevState = mapStateToProps ? mapStateToProps(state) : state
    return (consumer: Consumer): Dispose => {
      const connection = (state: State, actions: ParsedActions): void => {
        const currentState = getState(mapStateToProps)

        if (force || isDifferent(prevState, currentState)) {
          prevState = currentState
          consumer(currentState, getActions(mapActionsToProps))
        }
      }
      connections.push(connection)
      return {
        dispose: () => { dispose(connection) }
      }
    }
  }
}

 */

/* 


*/

export { combineStores }