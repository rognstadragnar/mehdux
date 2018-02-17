import { MapStateToProps } from './types'
export type Dispatch = (actionName: string, ...args: Array<any>) => void
export type State = object
export type GetState = (MapStateToProps?) => object
export type SetState = (state: State, extraArgs?: ExtraSetStateArgs) => void

export type ExtraSetStateArgs = {
  args?: any[],
  name?: string,
}

export interface ConnectOptions {
  mapStateToProps?: MapStateToProps,
  mapActionsToProps?: MapActionsToProps,
  force?: boolean
  leading?: boolean
}

export type Consumer = (State, ParsedActions) => any
export type Connection = (state: State, actions: ParsedActions) => void
export type Dispose = { dispose: () => void }
export type Action = (state: State, actions: ParsedActions) => (...args: Array<any>) => State

export type Actions = {
  [propName: string]: Action
}
export type ParsedAction = (...args: Array<any>) => void
export type ParsedActions = {
  [propName: string]: ParsedAction
}
export type InitialState = State

export type MapStateToProps = (state: State) => State | undefined
export type MapActionsToProps = (actions: ParsedActions) => ParsedActions | undefined
export type GetActions = (MapActionsToProps?) => ParsedActions

export type Store = (mapState: MapStateToProps, mapActions: MapActionsToProps) => any

export interface StoreInstance {
  connect: Connect
  getState: (m: MapStateToProps) => State
  getActions: (a: MapActionsToProps) => ParsedActions
}

type Connect = (
  s?: MapStateToProps,
  a?: MapActionsToProps,
  force?: boolean
) => (Function) => { dispose: () => void }

export interface MiddlewareArg {
  name?: string
  args?: Array<any>
  prevState: State,
  actions?: ParsedActions
}

export type Middleware = (newState: State, arg: MiddlewareArg) => State
export type Middlewares = Array<Middleware>
