// import { MapStateToProps } from './types'
export type Dispatch = (actionName: string, ...args: any[]) => void
export type IState = any
export type GetState = (MapStateToProps?) => object
export type SetState = (state: IState, extraArgs?: IExtraSetStateArgs) => void

export interface IExtraSetStateArgs {
  args?: any[]
  name?: string
}

export interface IConnectOptions {
  mapStateToProps?: MapStateToProps
  mapActionsToProps?: MapActionsToProps
  force?: boolean
  leading?: boolean
}

export type Consumer = (State, ParsedActions) => any
export type Connection = () => void
export interface IDispose {
  dispose: () => void
}
export type Action = (
  state: IState,
  actions: IParsedActions
) => (...args: any[]) => IState

export interface IActions {
  [propName: string]: Action
}
export type ParsedAction = (...args: any[]) => void
export interface IParsedActions {
  [propName: string]: ParsedAction
}
export type InitialState = IState

export type MapStateToProps = (state: IState) => IState | undefined
export type MapActionsToProps = (
  actions: IParsedActions
) => IParsedActions | undefined
export type GetActions = (MapActionsToProps?) => IParsedActions

export type IStore = (
  mapState: MapStateToProps,
  mapActions: MapActionsToProps
) => any

export interface IStoreInstance {
  __IS_COMBINED_STORE__: boolean
  connect: Connect
  getState: (m: MapStateToProps) => IState
  getActions: (a: MapActionsToProps) => IParsedActions
}

export type Connect = (
  opts: IConnectOptions
) => (Function) => { dispose: () => void }

export interface IMiddlewareArg {
  name?: string
  args?: any[]
  prevState: IState
  actions?: IParsedActions
}

export type Middleware = (newState: IState, arg: IMiddlewareArg) => IState
export type Middlewares = Middleware[]
