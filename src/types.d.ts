import { MapStateToProps } from './types'
export type Dispatch = (actionName: string, ...args: Array<any>) => void
export type State = object
export type GetState = (MapStateToProps?) => object
export type SetState = (State) => void
export type Consumer = (State, ParsedActions) => any
export type Connection = (state: State, actions: ParsedActions) => void
export type Dispose = { dispose: () => void }
export type Action = (
  state: State,
  dispatch: Dispatch
) => (...args: Array<any>) => State

export type Actions = {
  [propName: string]: Action
}
export type ParsedAction = (...args: Array<any>) => void
export type ParsedActions = {
  [propName: string]: ParsedAction
}
export type InitialState = State

export type MapStateToProps = (state: State) => State | undefined
export type MapActionsToProps = (
  actions: ParsedActions
) => ParsedActions | undefined

export type Store = (mapState: MapStateToProps, mapActions: MapActionsToProps) => any
