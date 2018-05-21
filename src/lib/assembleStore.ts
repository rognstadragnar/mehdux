import { deepEnoughEquals } from '@rognstadragnar/deep-enough-equals'
import { IStoreInstance } from './../types'
import { isObj } from './shallowMerge'

import {
  Action,
  Connection,
  Consumer,
  Dispatch,
  GetActions,
  GetState,
  IActions,
  IConnectOptions,
  IDispose,
  IExtraSetStateArgs,
  IMiddlewareArg,
  IParsedActions,
  IState,
  IStoreFactory,
  MapActionsToProps,
  MapStateToProps,
  Middlewares,
  ParsedAction,
  SetState
} from '../types'

type CreateActionsFn = (
  actions: IActions,
  getState: GetState,
  getActions: GetActions,
  setState: SetState
) => IParsedActions

const assembleStore = (
  createActionsFn: CreateActionsFn,
  isCombinedStore: boolean = false
): IStoreFactory => {
  return class Store implements IStoreInstance {
    public __IS_COMBINED_STORE__: boolean
    public __INITIAL_ACTIONS__: IActions
    public __MIDDLEWARES__: Middlewares
    private connections: Connection[] = []
    private state: IState
    private actions: IParsedActions
    private middlewares: Middlewares
    constructor(
      initialState: IState = {},
      initialActions: IActions = {},
      middlewares: Middlewares = []
    ) {
      this.state = initialState
      this.actions = createActionsFn(
        initialActions,
        this.getState,
        this.getActions,
        this.setState
      )
      this.__IS_COMBINED_STORE__ = isCombinedStore
      this.__INITIAL_ACTIONS__ = initialActions
      this.__MIDDLEWARES__ = middlewares
    }

    public getActions = (
      mapActionsToProps?: MapActionsToProps
    ): IParsedActions => {
      if (mapActionsToProps === null) {
        return {}
      }
      return mapActionsToProps ? mapActionsToProps(this.actions) : this.actions
    }

    public getState = (mapStateToProps?: MapStateToProps) => {
      if (mapStateToProps === null) {
        return {}
      }
      return mapStateToProps ? mapStateToProps(this.state) : this.state
    }

    public setState = (
      newState: IState,
      extras: IExtraSetStateArgs = {}
    ): void => {
      if (newState !== undefined && !deepEnoughEquals(this.state, newState)) {
        if (this.middlewares && this.middlewares.length > 0) {
          newState = this.middlewares.reduce((pv, cv) => {
            return cv(pv, {
              args: extras.args,
              name: extras.name,
              prevState: this.getState()
            })
          }, newState)
        }
        if (Array.isArray(this.state)) {
          this.state = [...newState]
        } else if (typeof this.state === 'object') {
          this.state = {
            ...this.state,
            ...newState
          }
        } else {
          this.state = newState
        }

        this.emit()
      }
    }

    public connect = (opts: IConnectOptions = {}) => {
      const {
        mapStateToProps,
        mapActionsToProps,
        force = false,
        leading = false
      } = opts
      let prevState = this.getState(mapStateToProps)
      return (consumer: Consumer): IDispose => {
        const connection = (): void => {
          const currentState = this.getState(mapStateToProps)
          if (force || !deepEnoughEquals(prevState, currentState)) {
            prevState = currentState
            consumer(currentState, this.getActions(mapActionsToProps))
          }
        }
        if (leading) {
          consumer(prevState, this.getActions(mapActionsToProps))
        }

        this.connections.push(connection)
        return {
          dispose: () => {
            this.dispose(connection)
          }
        }
      }
    }

    private emit() {
      this.connections.forEach(con => con())
    }

    private dispose(connection: Connection): void {
      this.connections = this.connections.filter(c => c !== connection)
    }
  }
}

export { assembleStore }
