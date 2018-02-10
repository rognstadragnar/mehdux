import { Store }  from './main'
import { isDifferent } from '../lib/diff'

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
} from '../types.d'


const store = new Store()

function combine(stores) {
  const storeNames = Object.keys(stores)
  const stateObj = {} 
  const actionObj = {} 
  storeNames.forEach(storeName => {
    if (stores[storeName] instanceof Store) {
      stateObj[storeName] = stores[storeName].getState()
      actionObj[storeName] = stores[storeName].__INITIAL_ACTIONS__
    }
    // warn if in development
  })
  return new createCombinedStore(stateObj, { ...actionObj})
}

function createCombinedStore(initialState, initialActions) {
  let connections: Array<Connection> = []
  let state = initialState
  let actions: ParsedActions = createNestedActions(
    initialActions,
    getState,
    dispatch,
    setState
  )

  function emit (state, actions): void { 
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
    if (typeof actions[name] === 'function') actions[name](...args)
  }

  function dispose (connection: Connection): void {
    connections = connections.filter(c => c !== connection)
  }

  function getState (mapStateToProps?: MapStateToProps) {
    return mapStateToProps ? mapStateToProps(state) : state
  }
  
  function getActions (mapActionsToProps?: MapActionsToProps) {
    return mapActionsToProps ? mapActionsToProps(actions) : actions
  }

  this.actions = actions
  this.getState = getState
  this.setState = setState
  this.connect = (
    mapStateToProps: MapStateToProps = null, 
    mapActionsToProps: MapActionsToProps = null
  ) => {
    let prevState = mapStateToProps ? mapStateToProps(state) : state
    return (consumer: Consumer): Dispose => {
      const connection = (state: State, actions: ParsedActions): void => {
        const currentState = getState(mapStateToProps)
        
        if (isDifferent(prevState, currentState)) {
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

const mapObj = (stateKey, root, transformFn) => {  
  const o = {}
  for (let key in root) o[key] = transformFn(stateKey, root[key])
  return o
}

const createNestedActions = (actions, getState, dispatch, setState) => {
  const transformFn = (stateKey, action) => { 
    return (...args) => {
      const currentState = getState()
      setState({
        ...currentState,
        [stateKey]: {
          ...action(currentState[stateKey], getState, getState)(...args)
        }
      })
    }
  }

  const rtnObj = {}
  for (let key in actions) {
    rtnObj[key] = mapObj(key, actions[key], transformFn)
  }
  return rtnObj
}

export { combine }